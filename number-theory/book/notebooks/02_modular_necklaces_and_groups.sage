# %% [markdown]
# # Lab 2: Extended gcd, Chinese remainders, and periodicity
#
# Follow Chapter 4 through inverses, CRT, Lagrange interpolation, and
# reversible Fibonacci pairs. Then revisit Fermat through necklaces and
# groups. The final two sections belong to the later extension-field
# appendix; stop before them until you have learned that arithmetic.
#
# All cells use exact arithmetic and run in order in either SageMath or
# standard Python. A calculation checks examples; the proof prompts ask why
# the method works for every allowed input.

# %% [markdown]
# ## 1. Extended gcd supplies the inverse
#
# Keep the integer identity $r=as+bt$ in every row. The last nonzero row
# certifies the gcd. For $au+nv=1$, read the coefficient of $a$ to get
# $a^{-1}$ modulo $n$.

# %%
from math import gcd, isqrt, lcm
from fractions import Fraction
from itertools import product


def extended_gcd(a, b):
    a, b = int(a), int(b)
    old_r, r, old_s, s, old_t, t = a, b, 1, 0, 0, 1
    rows = [(old_r, old_s, old_t), (r, s, t)]
    while r:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
        rows.append((r, s, t))
    assert all(remainder == a * u + b * v for remainder, u, v in rows)
    sign = -1 if old_r < 0 else 1
    return sign * old_r, sign * old_s, sign * old_t, rows


def inverse_mod(a, n):
    a, n = int(a), int(n)
    if n < 2:
        raise ValueError("The modulus must be at least 2.")
    d, u, v, _ = extended_gcd(a, n)
    if d != 1:
        raise ValueError("No inverse: the gcd is " + str(d))
    assert a * u + n * v == 1
    return u % n


d, s, t, rows = extended_gcd(43, 17)
print("Rows (r, s, t) with r = 43s + 17t:")
for row in rows:
    print(row)
print("Inverse of 17 modulo 43:", inverse_mod(17, 43))
assert d == 1 and (17 * inverse_mod(17, 43)) % 43 == 1
assert inverse_mod(29, 83) == 63

# %% [markdown]
# **Task.** Run the table for 83 and 29. Identify the inverse coefficient,
# reduce it, and check the multiplication. Explain why the same row update
# maintains the integer identity. What does the last row tell you if the gcd
# is larger than 1?

# %%
def solve_linear_congruence(a, b, n):
    a, b, n = int(a), int(b), int(n)
    if n < 2:
        raise ValueError("The modulus must be at least 2.")
    d, u, _, _ = extended_gcd(a, n)
    if b % d:
        return []
    x0 = (u * (b // d)) % n
    return sorted((x0 + k * (n // d)) % n for k in range(d))


def units_mod(n):
    return [a for a in range(n) if gcd(a, n) == 1]


assert solve_linear_congruence(14, 21, 35) == [4, 9, 14, 19, 24, 29, 34]
assert solve_linear_congruence(18, 24, 42) == [6, 13, 20, 27, 34, 41]
assert solve_linear_congruence(18, 25, 42) == []
assert solve_linear_congruence(0, 0, 5) == list(range(5))
for n in range(2, 13):
    units = units_mod(n)
    print(n, units)
    for a in units:
        assert (a * inverse_mod(a, n)) % n == 1
        assert sorted((a * b) % n for b in units) == units

# %% [markdown]
# **Proof prompt.** If $au+nv=d$ and $d$ divides $b$, why is $u(b/d)$ a
# solution? Why do all solutions differ by a multiple of $n/d$? Explain
# separately the case $d=n$. Use inverses to prove that multiplication by a
# unit permutes the units.

# %% [markdown]
# ## 2. CRT selectors reconstruct remainders
#
# For pairwise coprime $n_i$, put $N=\prod n_i$. Extended gcd inverts
# $N/n_i$ modulo $n_i$. The resulting selector is 1 at its own component
# and 0 at all the others.

# %%
def crt(residues, moduli):
    moduli = [int(n) for n in moduli]
    if not moduli or len(residues) != len(moduli):
        raise ValueError("Supply one remainder per modulus.")
    if any(n < 2 for n in moduli):
        raise ValueError("Moduli must be at least 2.")
    if any(gcd(m, n) != 1 for i, m in enumerate(moduli) for n in moduli[i + 1:]):
        raise ValueError("This construction requires pairwise coprime moduli.")
    N = 1
    for n in moduli:
        N *= n
    selectors = [(N // n) * inverse_mod(N // n, n) % N for n in moduli]
    x = sum(int(a) * e for a, e in zip(residues, selectors)) % N
    assert all(x % n == int(a) % n for a, n in zip(residues, moduli))
    return x, N, selectors


x, N, selectors = crt([2, 3, 2], [3, 5, 7])
print("Selectors:", selectors, "Solution:", x, "modulo", N)
assert (x, N, selectors) == (23, 105, [70, 21, 15])
assert sum(selectors) % N == 1
for i, e in enumerate(selectors):
    assert (e * e) % N == e
    for j, f in enumerate(selectors):
        if i != j:
            assert (e * f) % N == 0

# %% [markdown]
# **Task.** Reconstruct the example with moduli 7, 8, 9 in Chapter 4.
# Explain the selector identities without relying on this finite check.
# For noncoprime moduli, solve $x=2$ modulo 6 and $x=5$ modulo 9 by putting
# $x=2+6t$; explain why the uniqueness modulus is 18.

# %% [markdown]
# ## 3. The same selectors become Lagrange interpolation
#
# Work over the rationals or a prime field. Modulo $X-c_i$, the remainder
# of $f$ is its value $f(c_i)$. The selector
# $\ell_i(X)=\prod_{j\ne i}(X-c_j)/(c_i-c_j)$ therefore performs precisely
# the same task as a CRT selector. In a prime field, extended gcd computes
# each denominator inverse. Coefficient lists below start with the constant.

# %%
def is_prime(n):
    n = int(n)
    return n >= 2 and all(n % d for d in range(2, isqrt(n) + 1))


def polynomial_product(f, g):
    result = [0] * (len(f) + len(g) - 1)
    for i, a in enumerate(f):
        for j, b in enumerate(g):
            result[i + j] += a * b
    return result


def polynomial_value(coefficients, x):
    value = 0
    for coefficient in reversed(coefficients):
        value = value * x + coefficient
    return value


def lagrange_polynomial(points, values, p=None):
    if not points or len(points) != len(values):
        raise ValueError("Supply a value for every interpolation point.")
    if p is not None:
        p = int(p)
        if not is_prime(p):
            raise ValueError("The modular coefficient system must be a prime field.")
    convert = (lambda x: Fraction(str(x))) if p is None else (lambda x: int(x) % p)
    xs, ys = list(map(convert, points)), list(map(convert, values))
    if len(set(xs)) != len(xs):
        raise ValueError("Interpolation points must be distinct in the field.")
    result = [0] * len(xs)
    basis = []
    for i, c in enumerate(xs):
        numerator, denominator = [1], 1
        for j, other in enumerate(xs):
            if i != j:
                numerator = polynomial_product(numerator, [-other, 1])
                denominator *= c - other
        scale = Fraction(int(1)) / denominator if p is None else inverse_mod(denominator, p)
        selector = [coefficient * scale for coefficient in numerator]
        if p is not None:
            selector = [coefficient % p for coefficient in selector]
        basis.append(selector)
        result = [a + ys[i] * b for a, b in zip(result, selector)]
    if p is not None:
        result = [coefficient % p for coefficient in result]
    return result, basis


# Convert the integer data explicitly for compatibility with Sage's preparser.
xs = list(map(int, [-1, 0, 2]))
ys = list(map(int, [2, 1, 3]))
coefficients, _ = lagrange_polynomial(xs, ys)
assert [polynomial_value(coefficients, c) for c in xs] == ys
print("Rational coefficients:", coefficients)
coefficients, basis = lagrange_polynomial([0, 1, 3], [1, 4, 2], p=7)
print("Coefficients modulo 7:", coefficients, "Selectors:", basis)
assert coefficients == [1, 2, 1]
assert [polynomial_value(coefficients, c) % 7 for c in [0, 1, 3]] == [1, 4, 2]
for i, selector in enumerate(basis):
    assert [polynomial_value(selector, c) % 7 for c in [0, 1, 3]] == [int(i == j) for j in range(3)]

# %% [markdown]
# **Proof prompts.** Why is the degree less than the number of points?
# Why is the interpolant unique at that degree? Describe every polynomial
# with those values. Explain why no polynomial over $\mathbb Z/8\mathbb Z$
# can take values 0 at 0 and 1 at 2: distinct points alone are insufficient.

# %% [markdown]
# ## 4. Fibonacci periodicity needs only reversible pairs
#
# Use $F_0=0,F_1=1$. Track $(F_n,F_{n+1})$, not just $F_n$.
# The map $(a,b)\mapsto(b,a+b)$ has inverse $(u,v)\mapsto(v-u,u)$.
# A finite reversible orbit repeats from its start. Stop at the first return
# to $(0,1)$. The fixed state $(0,0)$ is never visited, giving
# $\pi(m)\le m^2-1$; this is an inequality, not a divisibility claim.

# %%
def fibonacci_pair_orbit(m):
    m = int(m)
    if m < 2:
        raise ValueError("The modulus must be at least 2.")
    a, b = 0, 1
    orbit = []
    for _ in range(m * m - 1):
        orbit.append((a, b))
        a, b = b, (a + b) % m
        if (a, b) == (0, 1):
            return orbit
    raise AssertionError("The reversible-pair bound was violated.")


for m in [2, 3, 5, 6, 7, 10, 11]:
    states = fibonacci_pair_orbit(m)
    print("Modulus", m, "period", len(states))
    assert len(set(states)) == len(states)
print("Pairs modulo 3:", fibonacci_pair_orbit(3))
assert fibonacci_pair_orbit(3)[4] == (0, 2)
assert len(fibonacci_pair_orbit(6)) == lcm(3, 8) == 24
assert len(fibonacci_pair_orbit(10)) == lcm(3, 20) == 60
assert len(fibonacci_pair_orbit(15)) == lcm(8, 20) == 40

# %% [markdown]
# **Proof prompts.** Why does reversibility rule out an initial segment
# before the cycle? Why is the first positive zero modulo 3 not a period?
# Use CRT to prove $\pi(mn)=\operatorname{lcm}(\pi(m),\pi(n))$ when
# $m,n$ are coprime. Contrast the map $(a,b)\mapsto(b,2a+b)$ modulo 2,
# starting at $(1,0)$: where does the inverse argument fail?

# %% [markdown]
# ## 5. Necklaces, equal blocks, and Fermat

# %%
def rotate(word, k=1):
    k %= len(word)
    return word[-k:] + word[:-k]


def orbit(word):
    return {rotate(word, k) for k in range(len(word))}


def orbit_inventory(length, colors=2):
    unseen = set(product(range(colors), repeat=length))
    sizes = []
    while unseen:
        current = orbit(next(iter(unseen)))
        sizes.append(len(current))
        unseen -= current
    return sorted(sizes)


for n in range(2, 9):
    sizes = orbit_inventory(n)
    print(n, sizes)
    if is_prime(n):
        assert set(sizes) == {1, n}
        assert sizes.count(1) == 2
        assert (2 ** n - 2) % n == 0

for p in [2, 3, 5, 7, 11, 13, 17, 19]:
    for a in range(p):
        assert pow(int(a), int(p), int(p)) == a
        for b in range(p):
            assert pow(int(a + b), int(p), int(p)) == (pow(int(a), int(p), int(p)) + pow(int(b), int(p), int(p))) % p

# %% [markdown]
# **Synthesis.** Compare necklace orbits, multiplication as a permutation,
# and Lagrange's theorem as proofs of Fermat. Name the set and the operation
# in each proof. In the prime field, Fermat immediately gives
# $(a+b)^p=a+b=a^p+b^p$: the power map is the identity there.
#
# A separate coefficient argument proves the formal polynomial identity
# $(X+Y)^p=X^p+Y^p$. It remains true after substitution in an extension,
# where $u^p$ need not equal $u$. By contrast, the nonzero polynomial
# $X^p-X$ vanishes at every element of the prime field. Explain why equality
# of polynomial functions on a finite field is weaker than equality of
# polynomials.

# %% [markdown]
# ## 6. Optional later work: compute in an extension first
#
# Read Appendix D after Chapters 4–7. The squares modulo 7 are 0, 1, 2, 4,
# so introduce $s^2=5$ and represent $a+bs$ by the pair `(a,b)`.
# Multiply by distributing and reducing $s^2$ to 5. A nonzero element has
# inverse $(a-bs)/(a^2-5b^2)$; extended gcd inverts that denominator.
# This field has 49 elements and is different from integers modulo 49.

# %%
def field_add(u, v):
    return ((u[0] + v[0]) % 7, (u[1] + v[1]) % 7)


def field_multiply(u, v):
    a, b = u
    c, d = v
    return ((a * c + 5 * b * d) % 7, (a * d + b * c) % 7)


def field_power(u, n):
    n = int(n)
    if n < 0:
        raise ValueError("Use the inverse before a negative power.")
    result = (1, 0)
    while n:
        if n % 2:
            result = field_multiply(result, u)
        u = field_multiply(u, u)
        n //= 2
    return result


def field_inverse(u):
    a, b = u
    scale = inverse_mod(a * a - 5 * b * b, 7)
    return ((a * scale) % 7, (-b * scale) % 7)


elements = list(product(range(7), repeat=2))
for u in elements:
    if u != (0, 0):
        assert field_multiply(u, field_inverse(u)) == (1, 0)
    assert field_power(u, 7) == (u[0], -u[1] % 7)
    assert field_power(u, 49) == u
    assert (field_power(u, 7) == u) == (u[1] == 0)
    for v in elements:
        assert field_power(field_add(u, v), 7) == field_add(field_power(u, 7), field_power(v, 7))
        assert field_power(field_multiply(u, v), 7) == field_multiply(field_power(u, 7), field_power(v, 7))
assert field_multiply((1, 2), (3, 1)) == (6, 0)
assert field_inverse((1, 2)) == (4, 6)
print("s raised to the seventh power:", field_power((0, 1), 7))
alpha = (4, 4)  # (1+s)/2 in this field
for n in [1, 2, 4, 8, 16]:
    print("alpha raised to", n, "=", field_power(alpha, n))
assert field_power(alpha, 8) == (6, 0)
assert field_power(alpha, 16) == (1, 0)

# %% [markdown]
# **Proof prompts.** Why can the inverse denominator vanish only at the
# zero element? Explain why Frobenius is conjugation here, and why its fixed
# elements are exactly the prime field. Why do the two powers of `alpha`
# above certify order 16? Connect this with the Fibonacci period modulo 7.

# %% [markdown]
# ## 7. Optional later work: from a multiple to the least period
#
# For primes other than 2 and 5, Appendix D proves that a valid multiple is
# $p-1$ when 5 is a square modulo $p$, and $2(p+1)$ otherwise.
# The roots lie in the prime field in the first case. In the second case,
# Frobenius exchanges them and their $(p+1)$st powers are $-1$.
#
# Fast doubling computes a pair at a chosen index. Remove a prime factor
# from the candidate whenever the smaller index still returns $(0,1)$.
# The pair at $p+1$ in the nonsplit case is $(0,-1)$, which is not a return.

# %%
def fibonacci_pair(n, m):
    n, m = int(n), int(m)
    if n < 0 or m < 2:
        raise ValueError("Require n >= 0 and m >= 2.")
    a, b = 0, 1
    for digit in bin(n)[2:]:
        even = (a * (2 * b - a)) % m
        odd = (a * a + b * b) % m
        a, b = (even, odd) if digit == "0" else (odd, (even + odd) % m)
    return a, b


def prime_divisors(n):
    result, q = [], 2
    while q * q <= n:
        if n % q == 0:
            result.append(q)
            while n % q == 0:
                n //= q
        q += 1
    if n > 1:
        result.append(n)
    return result


def fibonacci_prime_period(p):
    p = int(p)
    if not is_prime(p):
        raise ValueError("This period bound requires a prime modulus.")
    if p in (2, 5):
        period = 3 if p == 2 else 20
        return period, period
    # Euler's criterion: a nonzero square has exponent (p-1)/2 equal to 1.
    # Conversely the squares exhaust the roots of X^((p-1)/2)-1.
    split = pow(int(5), int((p - 1) // 2), p) == 1
    bound = p - 1 if split else 2 * (p + 1)
    assert fibonacci_pair(bound, p) == (0, 1)
    candidate = bound
    for q in prime_divisors(bound):
        while candidate % q == 0 and fibonacci_pair(candidate // q, p) == (0, 1):
            candidate //= q
    return bound, candidate


for m in range(2, 41):
    states = fibonacci_pair_orbit(m)
    for n in range(2 * len(states) + 1):
        assert fibonacci_pair(n, m) == states[n % len(states)]
for p in range(2, 200):
    if is_prime(p):
        bound, period = fibonacci_prime_period(p)
        assert period == len(fibonacci_pair_orbit(p))
        if p < 30:
            print("Prime", p, "candidate multiple", bound, "least period", period)
assert fibonacci_prime_period(29) == (28, 14)

# %% [markdown]
# **Final comparison.** Distinguish the proof that a period exists, a theorem
# supplying a multiple, and the computation of the least period. Explain
# why testing only the first zero is insufficient. Why must primes 2 and 5
# be handled separately? For modulus 29, check that removing a factor 2
# succeeds once, while further removal of 2 or 7 fails.
