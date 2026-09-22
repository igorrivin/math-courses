function choose(n, s) {
  let result = 1;
  for (let j = 1; j <= Math.min(s, n - s); j++) result = result * (n - j + 1) / j;
  return result;
}

export const exchangeabilityModels = {
  fair: { title: "Independent fair tosses", limit: "Every run tends to ½", covariance: 0 },
  shared: { title: "One shared coin", limit: "Each run tends to ¼ or ¾", covariance: 1 / 16 },
  urn: { title: "Pólya’s urn", limit: "The limit is uniform on [0, 1]", covariance: 1 / 12 },
};

export function exchangeableLaw(model, n, s) {
  if (!(model in exchangeabilityModels) || !Number.isInteger(n) || n < 1 || n > 100 || !Number.isInteger(s) || s < 0 || s > n) {
    throw new RangeError("Choose a supported model, 1 ≤ n ≤ 100, and 0 ≤ s ≤ n.");
  }
  const counts = Array.from({ length: n + 1 }, (_, k) => {
    const binomial = choose(n, k);
    if (model === "fair") return binomial * 0.5 ** n;
    if (model === "urn") return 1 / (n + 1);
    return binomial * (0.25 ** k * 0.75 ** (n - k) + 0.75 ** k * 0.25 ** (n - k)) / 2;
  });
  const posteriorHigh = 1 / (1 + 3 ** (n - 2 * s));
  return {
    counts,
    wordProbability: counts[s] / choose(n, s),
    countProbability: counts[s],
    predictive: model === "fair" ? 0.5 : model === "urn" ? (s + 1) / (n + 2) : 0.25 + 0.5 * posteriorHigh,
    variance: model === "fair" ? 1 / (4 * n) : model === "urn" ? 1 / (6 * n) + 1 / 12 : 3 / (16 * n) + 1 / 16,
    multiplicity: choose(n, s),
  };
}
