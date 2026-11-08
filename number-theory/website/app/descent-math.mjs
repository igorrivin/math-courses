export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export function pythagoreanTriple(m, n) {
  if (!Number.isInteger(m) || !Number.isInteger(n) || n < 1 || m <= n || m > 100) throw new RangeError('Use integers 1 <= n < m <= 100.');
  const a = m * m - n * n, b = 2 * m * n, c = m * m + n * n;
  const divisor = gcd(a, b);
  return { a, b, c, divisor, primitive: divisor === 1, coprime: gcd(m, n) === 1, oppositeParity: (m - n) % 2 !== 0 };
}
export function eisensteinMultiply([a, b], [c, d]) { return [a * c - b * d, a * d + b * c - b * d]; }
export function eisensteinNorm([a, b]) { return a * a - a * b + b * b; }
export function eisensteinCube(x) { return eisensteinMultiply(eisensteinMultiply(x, x), x); }
