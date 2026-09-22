import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { before, test } from "node:test";

let html;

test("ships the complete Sage notebook collection and runnable new scripts", async () => {
  for (const stem of ["01_euclid_and_continued_fractions", "02_modular_necklaces_and_groups", "03_pascal_and_prime_counting", "04_mobius_lagrange_galois", "05_pell_and_archimedes", "06_mobius_inversion_and_fourier"]) {
    const name = `${stem}.ipynb`;
    assert.ok(html.includes(`href="/${name}"`), `Missing download: ${name}`);
    const source = await readFile(new URL(`../public/${name}`, import.meta.url));
    const built = await readFile(new URL(`../dist/client/${name}`, import.meta.url));
    assert.deepEqual(built, source);
    const notebook = JSON.parse(source);
    assert.equal(notebook.metadata.kernelspec.name, "sagemath");
    assert.ok(notebook.cells.some(cell => cell.cell_type === "code"));
    if (stem.startsWith("02_") || stem.startsWith("04_") || stem.startsWith("05_") || stem.startsWith("06_")) {
      assert.ok(html.includes(`href="/${stem}.sage"`));
      assert.deepEqual(await readFile(new URL(`../dist/client/${stem}.sage`, import.meta.url)), await readFile(new URL(`../public/${stem}.sage`, import.meta.url)));
    }
  }
  const files = await readdir(new URL("../public/", import.meta.url));
  assert.ok(!files.some(name => /instructor|solutions|\.tex$|\.zip$/i.test(name)));
});

test("explains the exact Pell certificate, parity, and the cattle divisibility condition", () => {
  for (const text of ["The palindromic part", "complete quotient", "Odd period", "649", "180", "206,545", "2,329", "First admissible power", "SageMath kernel"]) {
    assert.ok(html.includes(text), `Missing new course content: ${text}`);
  }
  assert.match(html, /Q<sub>k\+1<\/sub>/);
  assert.match(html, /9,314 divides Z/);
  assert.match(html, /href="\/course-packet\.pdf#nameddest=section\.3\.10"/);
  assert.match(html, /href="\/course-packet\.pdf#nameddest=section\.3\.11"/);
  assert.match(html, /10\.1080\/00029890\.1998\.12004887/);
});

test("renders a valid inverse certificate and links current and later modular lessons", () => {
  assert.ok(html.includes("5 × (5) + 12 × (-2) = 1"));
  assert.ok(html.includes("5 × 5 ≡ 1 (mod 12)"));
  for (const destination of ["section.4.5", "section.4.7", "appendix.D"]) {
    assert.ok(html.includes(`href="/course-packet.pdf#nameddest=${destination}"`));
  }
  assert.match(html, /Lagrange’s interpolation formula/);
  assert.match(html, /The power map is the identity there/);
  assert.match(html, /Frobenius can move the new elements/);
});

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

test("keeps the original explorations and adds exact Pell and cattle labs", () => {
  assert.equal((html.match(/<article class="lab-card\b/g) ?? []).length, 9);
  for (const id of ["euclid", "fractions", "venus", "modular", "necklaces", "pascal", "primes", "pell", "cattle"]) {
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
  assert.match(html, /worked examples, exercises, and solutions/);
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
