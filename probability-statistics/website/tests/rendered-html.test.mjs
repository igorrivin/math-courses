import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { before, test } from "node:test";

let html;
before(async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  html = await response.text();
});

test("server-renders the actual course and all nine labs", () => {
  assert.match(html, /<title>Chance, Data, and Decisions<\/title>/);
  assert.equal((html.match(/<article class="lab-card"/g) ?? []).length, 9);
  for (const text of ["Does the order matter?", "Count each outcome once.", "How many people make a match?", "9 live experiments"]) {
    assert.ok(html.includes(text), `Missing course content: ${text}`);
  }
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("new labs have addressable sections, labeled controls, and initial model results", () => {
  for (const id of ["counting", "inclusion-exclusion", "birthdays"]) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`href="#${id}"`));
  }
  for (const text of ["Available objects n", "Selected objects k", "Set cardinalities", "Event probabilities", "All three", "None", "Days in the model calendar", "First group above 50%", "Simulate 1,000 groups"]) {
    assert.ok(html.includes(text), `Missing accessible control label: ${text}`);
  }
  assert.match(html, /<strong>56<\/strong>/);
  assert.match(html, /<strong>336<\/strong>/);
  assert.match(html, /<strong>512<\/strong>/);
  assert.match(html, /50\.73%/);
  assert.match(html, /5\.86%/);
  assert.match(html, /role="meter"/);
  assert.match(html, /aria-label="Probability of at least one shared birthday"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Predict the result, then run the experiment\./);
});

test("student-facing downloads are PDFs and do not expose the instructor key", async () => {
  const publicDir = new URL("../public/", import.meta.url);
  for (const name of ["course-packet.pdf", "problem-set-02.pdf"]) {
    assert.ok(html.includes(`href="/${name}"`));
    const bytes = await readFile(new URL(name, publicDir));
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    assert.ok(bytes.length > 20_000);
  }
  const files = await readdir(publicDir);
  assert.ok(!files.some(name => /instructor|solutions|\.tex$|\.zip$/i.test(name)), "Private assignment materials must not be public assets");
});
