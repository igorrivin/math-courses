import assert from "node:assert/strict";
import { test } from "node:test";
import { createInstructorAccess } from "../worker/instructor-access.mjs";

const origin = "https://course.example";
const env = { INSTRUCTOR_PASSWORD: "test-only-instructor-password-32chars" };
const pdf = Buffer.from("%PDF-1.7\nInstructor test fixture");
const files = { "example.pdf": pdf.toString("base64") };
const next = async () => new Response("Private course material");
const request = (path, options = {}) => new Request(origin + path, options);
const loginRequest = (password = env.INSTRUCTOR_PASSWORD, headers = {}) => request("/instructors/login", {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded", ...headers },
  body: new URLSearchParams({ password }),
});

async function signIn(gate) {
  const response = await gate(loginRequest(), env, next);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("Location"), "/instructors");
  const cookie = response.headers.get("Set-Cookie");
  for (const attribute of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/", "Max-Age=28800"]) assert.ok(cookie.includes(attribute));
  assert.ok(!cookie.includes(env.INSTRUCTOR_PASSWORD));
  return cookie.split(";")[0];
}

test("anonymous HTML, RSC, encoded paths, and direct PDF requests are blocked before rendering", async () => {
  const gate = createInstructorAccess(files);
  for (const path of ["/instructors", "/instructors/", "/instructors?_rsc=preview", "/instructors/files/example.pdf", "/instructors%2Ffiles%2Fexample.pdf"]) {
    const response = await gate(request(path, { headers: { RSC: "1" } }), env, () => assert.fail("Must not render"));
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("Location"), "/instructor-access");
    assert.match(response.headers.get("Cache-Control"), /no-store/);
  }
});

test("valid sign-in opens the page and serves the exact PDF; HEAD returns headers only", async () => {
  const gate = createInstructorAccess(files);
  const Cookie = await signIn(gate);
  const page = await gate(request("/instructors", { headers: { Cookie } }), env, next);
  assert.equal(await page.text(), "Private course material");
  assert.match(page.headers.get("Vary"), /Cookie/);
  assert.match(page.headers.get("Cache-Control"), /no-store/);
  assert.match(page.headers.get("X-Robots-Tag"), /noindex/);
  for (const method of ["GET", "HEAD"]) {
    const response = await gate(request("/instructors/files/example.pdf", { method, headers: { Cookie } }), env, next);
    assert.equal(response.headers.get("Content-Type"), "application/pdf");
    assert.match(response.headers.get("Content-Disposition"), /example-instructor\.pdf/);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), method === "HEAD" ? Buffer.alloc(0) : pdf);
  }
});

test("forged, expired, cross-origin, and rotated-password sessions cannot open files", async () => {
  let time = Date.now();
  const gate = createInstructorAccess(files, { now: () => time });
  const Cookie = await signIn(gate);
  for (const invalid of ["__Host-course-instructor=true", Cookie.slice(0, -2) + "xx", Cookie.replace(/v1\.\d+/, "v1.9999999999")]) {
    assert.equal((await gate(request("/instructors", { headers: { Cookie: invalid } }), env, next)).status, 303);
  }
  assert.equal((await gate(new Request("https://another.example/instructors", { headers: { Cookie } }), env, next)).status, 303);
  assert.equal((await gate(request("/instructors", { headers: { Cookie } }), { INSTRUCTOR_PASSWORD: "a-different-long-test-only-password" }, next)).status, 303);
  time += 8 * 60 * 60 * 1000 + 1;
  assert.equal((await gate(request("/instructors/files/example.pdf", { headers: { Cookie } }), env, next)).status, 303);
});

test("missing configuration fails closed and incorrect passwords issue no session", async () => {
  const gate = createInstructorAccess(files);
  for (const config of [{}, { INSTRUCTOR_PASSWORD: "short" }]) {
    for (const req of [loginRequest(), request("/instructors")]) {
      const response = await gate(req, config, next);
      assert.equal(response.headers.get("Location"), "/instructor-access?error=unavailable");
      assert.equal(response.headers.get("Set-Cookie"), null);
    }
  }
  const response = await gate(loginRequest("incorrect"), env, next);
  assert.equal(response.headers.get("Location"), "/instructor-access?error=password");
  assert.equal(response.headers.get("Set-Cookie"), null);
});

test("login/logout reject cross-site requests, unsupported methods, and insecure origins", async () => {
  const gate = createInstructorAccess(files);
  for (const path of ["/instructors/login", "/instructors/logout"]) {
    assert.equal((await gate(request(path), env, next)).status, 405);
    assert.equal((await gate(request(path, { method: "POST", headers: { Origin: "https://untrusted.example" } }), env, next)).status, 403);
    assert.equal((await gate(request(path, { method: "POST" }), env, next)).status, 403);
  }
  assert.equal((await gate(new Request("http://course.example/instructors"), env, next)).status, 403);
});

test("oversized forms are rejected, and repeated failed sign-ins are throttled", async () => {
  let time = Date.now();
  const gate = createInstructorAccess(files, { now: () => time });
  const response = await gate(loginRequest("x".repeat(3000)), env, next);
  assert.equal(response.headers.get("Set-Cookie"), null);
  for (let i = 1; i < 5; i++) await gate(loginRequest("incorrect"), env, next);
  const limited = await gate(loginRequest(), env, next);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("Retry-After")) > 0);
  time += 15 * 60 * 1000 + 1;
  await signIn(gate);
});

test("sign-out clears the session, unknown files return 404, and public pages stay public", async () => {
  const gate = createInstructorAccess(files);
  const Cookie = await signIn(gate);
  for (const path of ["/instructors/files/missing.pdf", "/instructors/files/__proto__", "/instructors/files/nested%2Fexample.pdf"]) {
    assert.equal((await gate(request(path, { headers: { Cookie } }), env, next)).status, 404);
  }
  const signedOut = await gate(request("/instructors/logout", { method: "POST", headers: { Origin: origin, Cookie } }), env, next);
  assert.match(signedOut.headers.get("Set-Cookie"), /Max-Age=0/);
  assert.equal(signedOut.headers.get("Location"), "/instructor-access");
  const publicResponse = await gate(request("/assessments"), {}, async () => new Response("Student editions"));
  assert.equal(await publicResponse.text(), "Student editions");
  assert.equal(publicResponse.headers.get("Set-Cookie"), null);
});
