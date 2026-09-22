import assert from "node:assert/strict";
import { test } from "node:test";
import { cattle, cattleResidues, fundamentalPell, integerSqrt, pellConvergents, sqrtPeriod } from "../app/quadratic-math.mjs";

test("exact square roots and invalid Pell radicands", () => {
  const large = 123456789012345678901234567890n;
  assert.equal(integerSqrt(large * large - 1n), large - 1n);
  assert.equal(integerSqrt(large * large), large);
  for (const D of [-2, 0, 1, 4, 100]) assert.throws(() => sqrtPeriod(D), RangeError);
});

test("known periods and solutions, including an odd period and the cattle radicand", () => {
  assert.deepEqual(sqrtPeriod(13).period.map(row => row.a), [1n, 1n, 1n, 1n, 6n]);
  assert.deepEqual(sqrtPeriod(23).period.map(row => row.a), [1n, 3n, 1n, 8n]);
  for (const [D, x, y] of [[2, 3n, 2n], [3, 2n, 1n], [6, 5n, 2n], [13, 649n, 180n], [61, 1766319049n, 226153980n]]) {
    const row = fundamentalPell(D);
    assert.equal(row.p, x); assert.equal(row.q, y); assert.equal(row.norm, 1n);
  }
  const row = fundamentalPell(cattle.D);
  assert.equal(sqrtPeriod(cattle.D).period.length, 92);
  assert.equal(row.p, cattle.u); assert.equal(row.q, cattle.v);
});

test("complete-quotient identities and all Pell indices across four periods", () => {
  for (let D = 2n; D <= 1000n; D++) {
    if (integerSqrt(D) ** 2n === D) continue;
    const { a0, prefix, period } = sqrtPeriod(D);
    assert.equal(prefix.length, 1);
    assert.equal(period.at(-1).a, 2n * a0);
    const palindrome = period.slice(0, -1).map(row => row.a);
    assert.deepEqual(palindrome, palindrome.toReversed());
    for (const { k, p, q, Qnext, norm } of pellConvergents(D, 4 * period.length)) {
      assert.equal(norm, (k % 2 ? 1n : -1n) * Qnext);
      assert.equal(norm === 1n || norm === -1n, (k + 1) % period.length === 0);
      assert.equal(norm, p * p - D * q * q);
    }
  }
});

test("brute-force small solutions agree with the period endpoint", () => {
  for (let D = 2n; D < 50n; D++) {
    if (integerSqrt(D) ** 2n === D) continue;
    const first = fundamentalPell(D);
    for (let y = 1n; y <= 500n; y++) {
      const x = integerSqrt(D * y * y + 1n);
      if (x * x - D * y * y === 1n) {
        assert.equal(x, first.p); assert.equal(y, first.q);
        break;
      }
      assert.ok(y < first.q, `Missed the first positive solution for D=${D}`);
    }
  }
});

test("cattle search excludes every earlier exponent and preserves norm one modulo 9314", () => {
  const rows = cattleResidues();
  assert.equal(rows.length, 2330);
  assert.deepEqual(rows[1], { j: 1, a: 9063n, b: 7708n });
  assert.deepEqual(rows.at(-1), { j: 2329, a: 9313n, b: 0n });
  assert.ok(rows.slice(1, -1).every(row => row.b !== 0n));
  for (const { a, b } of rows) {
    const residue = (a * a - cattle.D * b * b - 1n) % cattle.modulus;
    assert.equal(residue, 0n);
  }
});
