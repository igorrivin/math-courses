export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + 0.5) / 4294967296; };
}
export function sampleMeans(model, n, seed) {
  if (!['bernoulli', 'pareto', 'cauchy', 'hidden'].includes(model) || !Number.isInteger(n) || n < 1 || n > 10000) throw new RangeError('Unknown model or invalid sample size.');
  const rand = seededRandom(seed);
  const theta = model === 'hidden' ? (rand() < .5 ? .2 : .8) : .5;
  const points = []; let total = 0;
  for (let i = 1; i <= n; i++) {
    const u = rand();
    const x = model === 'pareto' ? Math.pow(1 - u, -2 / 3) : model === 'cauchy' ? Math.tan(Math.PI * (u - .5)) : Number(u < theta);
    total += x;
    if (i === 1 || i === n || i % Math.max(1, Math.floor(n / 160)) === 0) points.push({ n: i, mean: total / i });
  }
  return { points, mean: total / n, theta };
}
export function compareMeans(model, n, seed, repetitions = 80) {
  const target = model === 'pareto' ? 3 : model === 'cauchy' ? 0 : .5;
  const paths = [0, 1, 2].map(k => sampleMeans(model, n, seed + k * 977));
  const means = Array.from({ length: repetitions }, (_, k) => sampleMeans(model, n, seed + 104729 + k * 7919).mean);
  return { target, paths, means, outside: means.filter(x => Math.abs(x - target) > .1).length / repetitions };
}
export function bernoulliChebyshev(n, epsilon, p = .5) { return Math.min(1, p * (1 - p) / (n * epsilon * epsilon)); }
export function hiddenCoinVariance(n) { return .09 + .16 / n; }
export function sparseAverageVariance(m) {
  let scaled = 0;
  for (let k = 1; k <= m; k++) scaled += Math.pow(4, k - m) / k;
  return scaled;
}
