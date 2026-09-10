import assert from "node:assert/strict";
import test from "node:test";
import { birthdayProbability, birthdayThreshold, combinations, designatedBirthdayProbability, inclusionExclusion, permutations, simulateBirthdays } from "../app/foundations-math.mjs";

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);

test("counting uses exact integers and handles empty selections", () => {
  assert.equal(combinations(8, 3), 56n);
  assert.equal(permutations(8, 3), 336n);
  assert.equal(combinations(60, 30), 118264581564861424n);
  assert.equal(combinations(0, 0), 1n);
  assert.equal(permutations(0, 0), 1n);
  assert.equal(combinations(8, 9), 0n);
  assert.equal(permutations(8, 9), 0n);
  for (let n = 1; n <= 20; n++) {
    let rowSum = 0n;
    for (let k = 0; k <= n; k++) {
      const value = combinations(n, k);
      assert.equal(value, combinations(n, n - k));
      assert.equal(value * permutations(k, k), permutations(n, k));
      if (k > 0 && k < n) assert.equal(value, combinations(n - 1, k - 1) + combinations(n - 1, k));
      rowSum += value;
    }
    assert.equal(rowSum, 2n ** BigInt(n));
  }
});

test("inclusion–exclusion counts every membership region exactly once", () => {
  for (let region = 0; region < 8; region++) {
    const regions = Array.from({ length: 8 }, (_, i) => Number(i === region));
    const data = inclusionExclusion(regions);
    assert.equal(data.total, 1);
    assert.equal(data.union, region === 7 ? 0 : 1);
    assert.equal(data.exactlyOne, region < 3 ? 1 : 0);
    assert.equal(data.exactlyTwo, region >= 3 && region <= 5 ? 1 : 0);
    assert.equal(data.triple, region === 6 ? 1 : 0);
    assert.equal(data.none, region === 7 ? 1 : 0);
  }
  const data = inclusionExclusion([20, 12, 10, 8, 6, 4, 5, 35]);
  assert.deepEqual(data.singles, [39, 29, 25]);
  assert.deepEqual(data.pairs, [13, 11, 9]);
  assert.equal(data.union, 65);
  assert.equal(data.total, 100);
  assert.equal(data.exactlyOne, 42);
  assert.equal(data.exactlyTwo, 18);
  assert.equal(inclusionExclusion(Array(8).fill(0)).total, 0);
  const assignment = inclusionExclusion([4, 4, 4, 3, 2, 1, 1, 1]);
  assert.deepEqual(assignment.singles, [10, 9, 8]);
  assert.deepEqual(assignment.pairs, [4, 3, 2]);
  close(assignment.union / assignment.total, 19 / 20);
});

test("birthday formulas agree with exhaustive enumeration of small sample spaces", () => {
  for (let days = 1; days <= 5; days++) {
    for (let people = 1; people <= 5; people++) {
      const total = days ** people;
      let collisions = 0, designated = 0;
      for (let index = 0; index < total; index++) {
        let code = index;
        const birthdays = Array.from({ length: people }, () => {
          const day = code % days;
          code = Math.floor(code / days);
          return day;
        });
        collisions += Number(new Set(birthdays).size < people);
        designated += Number(birthdays.slice(1).includes(birthdays[0]));
      }
      close(birthdayProbability(people, days), collisions / total);
      close(designatedBirthdayProbability(people, days), designated / total);
    }
  }
});

test("birthday examples, thresholds, bounds, and boundary cases are correct", () => {
  close(birthdayProbability(22), 0.4756953076625502);
  close(birthdayProbability(23), 0.5072972343239854);
  close(designatedBirthdayProbability(23), 0.058571325264343166);
  close(birthdayProbability(3, 10), 7 / 25);
  close(birthdayProbability(4, 5), 101 / 125);
  assert.equal(birthdayThreshold(365), 23);
  assert.equal(birthdayThreshold(30), 7);
  assert.equal(birthdayThreshold(10), 5);
  assert.equal(birthdayThreshold(1), 2);
  assert.equal(birthdayProbability(0), 0);
  assert.equal(birthdayProbability(1), 0);
  assert.equal(birthdayProbability(366), 1);
  for (const days of [10, 30, 365]) {
    let previous = 0;
    for (let people = 1; people <= 100; people++) {
      const probability = birthdayProbability(people, days);
      assert.ok(probability >= previous);
      assert.ok(probability <= Math.min(1, people * (people - 1) / (2 * days)) + 1e-12);
      assert.ok(designatedBirthdayProbability(people, days) <= probability + 1e-12);
      previous = probability;
    }
  }
});

test("simulations count collisions and respect deterministic edge cases", () => {
  assert.equal(simulateBirthdays(1, 365, 1000), 0);
  assert.equal(simulateBirthdays(11, 10, 1000), 1000);
  assert.equal(simulateBirthdays(23, 365, 0), 0);
  assert.equal(simulateBirthdays(3, 10, 100, () => 0), 100);
  let draw = 0;
  assert.equal(simulateBirthdays(3, 10, 100, () => (draw++ % 3) / 10), 0);
});

test("invalid model parameters fail explicitly", () => {
  for (const invalid of [-1, 1.5, NaN, Infinity]) {
    assert.throws(() => combinations(invalid, 1), RangeError);
    assert.throws(() => permutations(3, invalid), RangeError);
    assert.throws(() => birthdayProbability(invalid), RangeError);
  }
  assert.throws(() => birthdayProbability(3, 0), RangeError);
  assert.throws(() => designatedBirthdayProbability(3, 0), RangeError);
  assert.throws(() => inclusionExclusion([1, 2]), RangeError);
  assert.throws(() => inclusionExclusion([1, 2, 3, 4, 5, 6, 7, -1]), RangeError);
  assert.throws(() => simulateBirthdays(3, 10, -1), RangeError);
});
