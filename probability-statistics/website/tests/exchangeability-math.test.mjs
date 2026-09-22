import assert from "node:assert/strict";
import { test } from "node:test";
import { exchangeableLaw, exchangeabilityModels } from "../app/exchangeability-math.mjs";

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} differs from ${b}`);

test("count laws normalize and their moments agree with the conditional variance formula", () => {
  for (const model of Object.keys(exchangeabilityModels)) {
    for (let n = 2; n <= 30; n++) {
      const law = exchangeableLaw(model, n, Math.floor(n / 2));
      close(law.counts.reduce((a, b) => a + b, 0), 1);
      close(law.counts.reduce((a, p, k) => a + p * k / n, 0), 0.5);
      close(law.counts.reduce((a, p, k) => a + p * (k / n - 0.5) ** 2, 0), law.variance);
      if (model === "urn") law.counts.forEach(p => close(p, 1 / (n + 1)));
    }
  }
});

test("ordered urn paths, shared-coin words, and fresh fair tosses have different laws", () => {
  close(exchangeableLaw("urn", 4, 3).wordProbability, 1 / 20);
  close(exchangeableLaw("urn", 4, 3).countProbability, 1 / 5);
  close(exchangeableLaw("shared", 2, 2).wordProbability, 5 / 16);
  close(exchangeableLaw("fair", 2, 2).wordProbability, 1 / 4);
});

test("posterior predictions agree with ratios of successive word probabilities", () => {
  for (const model of Object.keys(exchangeabilityModels)) {
    for (let n = 2; n <= 20; n++) for (let s = 0; s <= n; s++) {
      const law = exchangeableLaw(model, n, s);
      close(law.predictive, exchangeableLaw(model, n + 1, s + 1).wordProbability / law.wordProbability);
    }
  }
  close(exchangeableLaw("shared", 2, 2).predictive, 0.7);
  close(exchangeableLaw("shared", 2, 1).predictive, 0.5);
  close(exchangeableLaw("urn", 4, 3).predictive, 2 / 3);
});

test("rejects inconsistent count inputs", () => {
  for (const args of [["missing", 5, 2], ["fair", 0, 0], ["urn", 5, 6], ["shared", 2.5, 1]]) {
    assert.throws(() => exchangeableLaw(...args), RangeError);
  }
});
