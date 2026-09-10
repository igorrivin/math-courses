import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";

let html;

before(async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("https://numbertheoryintro.dimensionreducers.ai/", {
      headers: {
        accept: "text/html",
        host: "numbertheoryintro.dimensionreducers.ai",
        "x-forwarded-proto": "https",
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  html = await response.text();
});

test("renders the existing course, not the starter preview", () => {
  assert.match(html, /<title>Patterns, Proofs, and Primes<\/title>/);
  for (const id of ["course", "labs", "practice"]) {
    assert.ok(html.includes('id="' + id + '"'));
  }
  assert.equal((html.match(/class="chapter-card /g) ?? []).length, 8);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/);
});

test("keeps all seven live explorations and their initial output", () => {
  assert.equal((html.match(/<article class="lab-card\b/g) ?? []).length, 7);
  for (const id of ["euclid", "fractions", "venus", "modular", "necklaces", "pascal", "primes"]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing lab: " + id);
  }
  assert.match(html, /The alternating trap/);
  assert.match(html, /continued fraction/);
  assert.match(html, /Pell/);
});

test("explains the fixed point, prefix conjugation, and both periodicity criteria", () => {
  assert.match(html, /Linear fractional transformations/);
  assert.match(html, /ad − bc ≠ 0/);
  assert.match(html, /ct² \+ \(d − a\)t − b = 0/);
  assert.match(html, /MNM<sup>−1<\/sup>/);
  assert.match(html, /Lagrange’s theorem/);
  assert.match(html, /Galois’s sharper criterion/);
  assert.match(html, /x &gt; 1 and −1 &lt; x′ &lt; 0/);
  assert.match(html, /bounded integer states and unique reduced predecessors/);
  assert.match(html, /seven new exercises and solutions/);
  assert.match(html, /href="\/course-packet\.pdf#nameddest=section\.3\.7"/);
});

test("preserves the public-facing book link and sharing metadata", () => {
  assert.match(html, /href="\/course-packet\.pdf"/);
  assert.match(html, /Download the expanded course packet/);
  assert.doesNotMatch(html, /68-page/);
  assert.match(html, /https:\/\/numbertheoryintro\.dimensionreducers\.ai\/og\.png/);
  assert.match(html, /summary_large_image/);
});

test("ships a real PDF identical to the built asset", async () => {
  const source = await readFile(new URL("../public/course-packet.pdf", import.meta.url));
  const built = await readFile(new URL("../dist/client/course-packet.pdf", import.meta.url));
  assert.equal(source.subarray(0, 5).toString(), "%PDF-");
  assert.ok(source.length > 500_000);
  assert.deepEqual(built, source);
});

test("keeps the existing Site binding without adding storage", async () => {
  const hosting = JSON.parse(await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"));
  assert.equal(hosting.project_id, "appgprj_6a7cbb0e569081919995f0ffb82fc9ba");
  assert.equal(hosting.d1, null);
  assert.equal(hosting.r2, null);
});
