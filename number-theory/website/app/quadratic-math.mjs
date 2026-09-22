/** Integer square root; every subsequent operation also uses BigInt. */
export function integerSqrt(value) {
  const n = BigInt(value);
  if (n < 0n) throw new RangeError("A square root needs a nonnegative integer.");
  if (n < 2n) return n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

export function sqrtPeriod(value) {
  const D = BigInt(value), a0 = integerSqrt(D);
  if (D < 2n || a0 * a0 === D) throw new RangeError("Choose a positive nonsquare D.");
  let P = 0n, Q = 1n, a = a0;
  const seen = new Map(), states = [];
  while (!seen.has(`${P},${Q}`)) {
    seen.set(`${P},${Q}`, states.length);
    states.push({ P, Q, a });
    P = a * Q - P;
    Q = (D - P * P) / Q;
    a = (a0 + P) / Q;
  }
  const start = seen.get(`${P},${Q}`);
  return { D, a0, prefix: states.slice(0, start), period: states.slice(start) };
}

export function pellConvergents(value, count) {
  const { D, a0 } = sqrtPeriod(value);
  let P = 0n, Q = 1n, a = a0, pp = 0n, p = 1n, qq = 1n, q = 0n;
  const rows = [];
  for (let k = 0; k < count; k++) {
    [pp, p] = [p, a * p + pp];
    [qq, q] = [q, a * q + qq];
    P = a * Q - P;
    Q = (D - P * P) / Q;
    rows.push({ k, a, p, q, Pnext: P, Qnext: Q, norm: p * p - D * q * q });
    a = (a0 + P) / Q;
  }
  return rows;
}

export function fundamentalPell(value) {
  const { period } = sqrtPeriod(value);
  const L = period.length;
  return pellConvergents(value, L % 2 ? 2 * L : L).at(-1);
}

export const cattle = {
  D: 4729494n,
  u: 109931986732829734979866232821433543901088049n,
  v: 50549485234315033074477819735540408986340n,
  modulus: 9314n,
};

/** Stop at the first positive exponent whose second coefficient is divisible. */
export function cattleResidues() {
  const { D, u, v, modulus: m } = cattle;
  let a = 1n, b = 0n;
  const rows = [{ j: 0, a, b }], seen = new Set([`${a},${b}`]);
  for (let j = 1; ; j++) {
    [a, b] = [(u * a + D * v * b) % m, (v * a + u * b) % m];
    rows.push({ j, a, b });
    if (b === 0n) return rows;
    const key = `${a},${b}`;
    if (seen.has(key)) throw new Error("The residue orbit repeated before finding a return.");
    seen.add(key);
  }
}
