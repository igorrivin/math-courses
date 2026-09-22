import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { before, test } from "node:test";

const origin = "https://course.example";
const env = {
  INSTRUCTOR_PASSWORD: "test-only-instructor-password-32chars",
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
let worker, catalog;
const fetchPage = (path, options = {}, bindings = env) => worker.fetch(new Request(origin + path, options), bindings, ctx);

before(async () => {
  worker = (await import("../dist/server/index.js")).default;
  catalog = JSON.parse(await readFile(new URL("../content/assessments.json", import.meta.url), "utf8"));
});

test("homepage links to a public assessment library with every student edition", async () => {
  const home = await fetchPage("/");
  assert.ok((await home.text()).includes('href="/assessments"'));
  const response = await fetchPage("/assessments");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Problem sets/);
  assert.match(html, /Student editions/);
  assert.equal((html.match(/class="assessment-card"/g) ?? []).length, catalog.length);
  for (const item of catalog) {
    assert.ok(html.includes(`href="/${item.studentFile}"`), `Missing ${item.id}`);
    const source = await readFile(new URL(`../public/${item.studentFile}`, import.meta.url));
    const built = await readFile(new URL(`../dist/client/${item.studentFile}`, import.meta.url));
    assert.equal(source.subarray(0, 5).toString(), "%PDF-");
    assert.deepEqual(built, source);
  }
  assert.ok(html.includes('href="/instructors"'));
  assert.ok(!html.includes("/instructors/files/"));
});

test("the compiled Worker guards instructor HTML, RSC, direct files, and HEAD requests", async () => {
  for (const path of ["/instructors", "/instructors?_rsc=1", `/instructors/files/${catalog[0].id}.pdf`]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetchPage(path, { method, headers: { RSC: "1" } });
      assert.equal(response.status, 303);
      assert.equal(response.headers.get("Location"), "/instructor-access");
      assert.match(response.headers.get("Cache-Control"), /no-store/);
    }
  }
  const disabled = await fetchPage("/instructors", {}, { ASSETS: env.ASSETS });
  assert.equal(disabled.headers.get("Location"), "/instructor-access?error=unavailable");
});

test("the sign-in form is accessible, handles errors, and is not cached or indexed", async () => {
  const response = await fetchPage("/instructor-access?error=password");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Cache-Control"), /no-store/);
  assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
  const html = await response.text();
  for (const text of ['action="/instructors/login"', 'type="password"', 'for="instructor-password"', 'role="alert"', "That password was not recognized"]) assert.ok(html.includes(text));
  assert.ok(!html.includes(env.INSTRUCTOR_PASSWORD));
  assert.ok(!html.includes("/instructors/files/"));
});

test("sign-in opens the instructor library, and every protected download matches its source", async () => {
  const login = await fetchPage("/instructors/login", {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: env.INSTRUCTOR_PASSWORD }),
  });
  assert.equal(login.status, 303);
  const Cookie = login.headers.get("Set-Cookie").split(";")[0];
  const page = await fetchPage("/instructors", { headers: { Cookie } });
  assert.equal(page.status, 200);
  assert.match(page.headers.get("Cache-Control"), /no-store/);
  const html = await page.text();
  assert.ok(html.includes('action="/instructors/logout"'));
  for (const item of catalog) {
    const path = `/instructors/files/${item.id}.pdf`;
    assert.ok(html.includes(`href="${path}"`));
    const response = await fetchPage(path, { headers: { Cookie } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.equal(response.headers.get("Content-Type"), "application/pdf");
    const privatePdf = await readFile(new URL(`../private/${item.id}.pdf`, import.meta.url));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), privatePdf);
    assert.notDeepEqual(privatePdf, await readFile(new URL(`../public/${item.studentFile}`, import.meta.url)));
  }
  const logout = await fetchPage("/instructors/logout", { method: "POST", headers: { Origin: origin, Cookie } });
  assert.match(logout.headers.get("Set-Cookie"), /Max-Age=0/);
  assert.equal((await fetchPage("/instructors")).status, 303);
});

async function allFiles(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) paths.push(...await allFiles(path));
    else paths.push(path);
  }
  return paths;
}

test("public assets and client bundles contain no instructor PDFs, raw or encoded", async () => {
  const privatePdfs = await Promise.all(catalog.map(item => readFile(new URL(`../private/${item.id}.pdf`, import.meta.url))));
  for (const directory of ["../public/", "../dist/client/"]) {
    for (const path of await allFiles(new URL(directory, import.meta.url))) {
      const data = await readFile(path);
      const text = data.toString("utf8");
      for (const pdf of privatePdfs) {
        assert.ok(!data.includes(pdf), `Private PDF exposed: ${path}`);
        assert.ok(!text.includes(pdf.toString("base64")), `Encoded private PDF exposed: ${path}`);
      }
      assert.ok(!text.includes(env.INSTRUCTOR_PASSWORD), `Password leaked: ${path}`);
    }
  }
});
