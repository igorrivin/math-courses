/** @param {number} value @param {string} name */
function integer(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a nonnegative safe integer`);
}

/** Exact binomial coefficient. @param {number} n @param {number} k */
export function combinations(n, k) {
  integer(n, "n"); integer(k, "k");
  if (k > n) return BigInt(0);
  const depth = Math.min(k, n - k);
  let result = BigInt(1);
  for (let i = 1; i <= depth; i++) result = result * BigInt(n - depth + i) / BigInt(i);
  return result;
}

/** Ordered selections without replacement. @param {number} n @param {number} k */
export function permutations(n, k) {
  integer(n, "n"); integer(k, "k");
  if (k > n) return BigInt(0);
  let result = BigInt(1);
  for (let i = 0; i < k; i++) result *= BigInt(n - i);
  return result;
}

/**
 * Counts: A only, B only, C only, AB only, AC only, BC only, ABC, none.
 * @param {number[]} regions
 */
export function inclusionExclusion(regions) {
  if (regions.length !== 8) throw new RangeError("Provide eight disjoint regions");
  regions.forEach((n) => integer(n, "region count"));
  const [a, b, c, ab, ac, bc, abc, none] = regions;
  const total = regions.reduce((sum, n) => sum + n, 0);
  const singles = [a + ab + ac + abc, b + ab + bc + abc, c + ac + bc + abc];
  const pairs = [ab + abc, ac + abc, bc + abc];
  return {
    total, singles, pairs, triple: abc, none,
    union: singles.reduce((sum, n) => sum + n, 0) - pairs.reduce((sum, n) => sum + n, 0) + abc,
    exactlyOne: a + b + c, exactlyTwo: ab + ac + bc,
  };
}

/** @param {number} people @param {number} days */
function birthdayInputs(people, days) {
  integer(people, "people"); integer(days, "days");
  if (days < 1) throw new RangeError("The calendar must contain at least one day");
}

/** Exact product evaluated stably. @param {number} people @param {number} days */
export function birthdayProbability(people, days = 365) {
  birthdayInputs(people, days);
  if (people < 2) return 0;
  if (people > days) return 1;
  let logDistinct = 0;
  for (let j = 1; j < people; j++) logDistinct += Math.log1p(-j / days);
  return -Math.expm1(logDistinct);
}

/** A designated person gets a match. @param {number} people @param {number} days */
export function designatedBirthdayProbability(people, days = 365) {
  birthdayInputs(people, days);
  if (people < 2) return 0;
  return -Math.expm1((people - 1) * Math.log1p(-1 / days));
}

/** First group size strictly above 1/2. @param {number} days */
export function birthdayThreshold(days) {
  birthdayInputs(0, days);
  for (let n = 2; n <= days + 1; n++) if (birthdayProbability(n, days) > 0.5) return n;
  return days + 1;
}

/** @param {number} people @param {number} days @param {number} trials @param {() => number} random */
export function simulateBirthdays(people, days, trials, random = Math.random) {
  birthdayInputs(people, days); integer(trials, "trials");
  if (people < 2) return 0;
  if (people > days) return trials;
  let hits = 0;
  for (let trial = 0; trial < trials; trial++) {
    const seen = new Set();
    for (let person = 0; person < people; person++) {
      const day = Math.floor(random() * days);
      if (seen.has(day)) { hits++; break; }
      seen.add(day);
    }
  }
  return hits;
}
