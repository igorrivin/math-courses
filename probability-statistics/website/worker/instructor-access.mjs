import { Buffer } from "node:buffer";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE = "__Host-course-instructor";
const SESSION_SECONDS = 8 * 60 * 60;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function privateResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", [headers.get("Vary"), "Cookie"].filter(Boolean).join(", "));
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "same-origin");
  return new Response(response.body, { status: response.status, headers });
}

function redirect(path, cookie) {
  return privateResponse(new Response(null, {
    status: 303,
    headers: { Location: path, ...(cookie ? { "Set-Cookie": cookie } : {}) },
  }));
}

function cookieHeader(value, seconds = SESSION_SECONDS) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
}

function signature(payload, secret, origin) {
  return createHmac("sha256", secret)
    .update(`course-instructor\n${origin}\n${payload}`).digest("base64url");
}

function validSession(request, secret, now) {
  const token = request.headers.get("Cookie")?.split(";")
    .map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token || token.length > 200) return false;
  const match = /^(v1\.(\d{10})\.[a-f0-9]{32})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[2]) * 1000;
  if (expires <= now || expires > now + SESSION_SECONDS * 1000) return false;
  const expected = signature(match[1], secret, new URL(request.url).origin);
  return timingSafeEqual(Buffer.from(match[3]), Buffer.from(expected));
}

async function readSmallForm(request) {
  if (!request.headers.get("Content-Type")?.startsWith("application/x-www-form-urlencoded")) return null;
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return null; }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}

/** All instructor HTML, RSC requests, and files pass through this gate. */
export function createInstructorAccess(files, { now = Date.now } = {}) {
  // A bounded per-isolate throttle supplements the high-entropy shared password.
  // It is deliberately not presented as a distributed account lockout.
  const attempts = new Map();

  return async function instructorAccess(request, env, next) {
    const url = new URL(request.url);
    let path;
    try { path = decodeURIComponent(url.pathname).replaceAll("\\", "/"); }
    catch { return new Response("Invalid path", { status: 400 }); }
    const protectedPath = path === "/instructors" || path.startsWith("/instructors/");
    if (!protectedPath && path !== "/instructor-access") return next();

    if (path === "/instructor-access") return privateResponse(await next());
    if (url.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      return privateResponse(new Response("HTTPS is required.", { status: 403 }));
    }
    const secret = env.INSTRUCTOR_PASSWORD;
    const configured = typeof secret === "string" && secret.length >= 20;

    if (path === "/instructors/login" || path === "/instructors/logout") {
      if (request.method !== "POST") {
        return privateResponse(new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } }));
      }
      if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") {
        return privateResponse(new Response("Invalid request origin", { status: 403 }));
      }
      if (path === "/instructors/logout") return redirect("/instructor-access", cookieHeader("", 0));
      if (!configured) return redirect("/instructor-access?error=unavailable");

      const time = now();
      const address = request.headers.get("CF-Connecting-IP") ?? "local";
      for (const [key, value] of attempts) if (value.until <= time) attempts.delete(key);
      const attempt = attempts.get(address) ?? { count: 0, until: time + WINDOW_MS };
      if (attempt.count >= MAX_ATTEMPTS) {
        return privateResponse(new Response("Too many attempts. Please try again in 15 minutes.", {
          status: 429, headers: { "Retry-After": String(Math.ceil((attempt.until - time) / 1000)) },
        }));
      }
      if (attempts.size >= 1000 && !attempts.has(address)) attempts.delete(attempts.keys().next().value);
      attempt.count++;
      attempts.set(address, attempt);
      const form = await readSmallForm(request);
      const password = form?.get("password");
      if (!password || password.length > 256) return redirect("/instructor-access?error=password");
      const supplied = createHash("sha256").update(password).digest();
      const expected = createHash("sha256").update(secret).digest();
      if (!timingSafeEqual(supplied, expected)) return redirect("/instructor-access?error=password");
      attempts.delete(address);
      const payload = `v1.${Math.floor(time / 1000) + SESSION_SECONDS}.${randomBytes(16).toString("hex")}`;
      return redirect("/instructors", cookieHeader(`${payload}.${signature(payload, secret, url.origin)}`));
    }

    if (!configured || !validSession(request, secret, now())) {
      return redirect(configured ? "/instructor-access" : "/instructor-access?error=unavailable");
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      return privateResponse(new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } }));
    }
    if (path.startsWith("/instructors/files/")) {
      const filename = path.slice("/instructors/files/".length);
      if (!/^[a-z0-9-]+\.pdf$/.test(filename) || !Object.hasOwn(files, filename)) {
        return privateResponse(new Response("Not found", { status: 404 }));
      }
      const pdf = Buffer.from(files[filename], "base64");
      return privateResponse(new Response(request.method === "HEAD" ? null : pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": String(pdf.length),
          "Content-Disposition": `attachment; filename="${filename.replace(/\.pdf$/, "-instructor.pdf")}"`,
        },
      }));
    }
    return privateResponse(await next());
  };
}
