# %% [markdown]
# # Lab 6: Möbius inversion, posets, and Fourier interpolation
#
# Follow Sections 5.8–5.11. First count divisors, invert sums, and recover
# primitive necklaces. The bonus sections invert cumulative data on posets
# and show that interpolation at roots of unity is Fourier inversion.
# This Möbius function is different from the linear fractional maps in Lab 4.
#
# Every cell runs in order in SageMath or standard Python. Arithmetic is exact,
# including the four-point complex transform: pairs of rational numbers
# represent Gaussian rationals. No floating-point FFT library is used.

# %% [markdown]
# ## 1. Prime powers determine multiplicative functions
#
# A multiplicative function satisfies $f(1)=1$ and $f(mn)=f(m)f(n)$ for
# coprime inputs. Complete multiplicativity removes that last restriction.
# Compare counts from direct enumeration with the prime-power products.

# %%
from collections import Counter
from fractions import Fraction
from functools import lru_cache
from itertools import combinations, product
from math import gcd, prod


def divisors(n):
    n = int(n)
    if n < 1:
        raise ValueError("Use a positive integer.")
    return [d for d in range(1, n + 1) if n % d == 0]


def factor_powers(n):
    n = int(n)
    if n < 1:
        raise ValueError("Use a positive integer.")
    factors, p = [], 2
    while p * p <= n:
        k = 0
        while n % p == 0:
            n //= p
            k += 1
        if k:
            factors.append((p, k))
        p += 1
    if n > 1:
        factors.append((n, 1))
    return factors


def totient(n):
    return sum(gcd(r, n) == 1 for r in range(1, int(n) + 1))


def tau(n):
    return len(divisors(n))


def sigma(n):
    return sum(divisors(n))


def convolution(f, g, n):
    n = int(n)
    return sum(f(d) * g(n // d) for d in divisors(n))


one = lambda n: 1
identity = lambda n: n
epsilon = lambda n: int(n == 1)

for n in range(1, 101):
    factors = factor_powers(n)
    assert tau(n) == prod(k + 1 for p, k in factors)
    assert sigma(n) == prod(sum(p ** j for j in range(k + 1)) for p, k in factors)
    assert totient(n) == prod(p ** (k - 1) * (p - 1) for p, k in factors)
    assert convolution(totient, one, n) == n
assert (tau(360), sigma(360)) == (24, 1170)
print("Divisors of 12:", divisors(12))
print("Totients on those divisors:", [totient(d) for d in divisors(12)])
print("tau(360), sigma(360):", tau(360), sigma(360))

# %% [markdown]
# **Proof prompts.** Explain why coprime factorization makes divisor choices
# independent. Partition $1,\ldots,n$ by their gcd with $n$ to prove
# $\sum_{d\mid n}\varphi(d)=n$. Which class has size $\varphi(1)$?
# Why does $(f*g)(n)$ differ from $f(n)g(n)$?

# %% [markdown]
# ## 2. Cancel the divisor sum
#
# Pair squarefree divisors by adjoining or removing one fixed prime.
# This proves $\sum_{d\mid n}\mu(d)=\varepsilon(n)$ and makes $\mu$
# the convolution inverse of the constant-one function. Inversion applies
# to arbitrary arithmetic functions, including nonmultiplicative ones.

# %%
def mobius(n):
    factors = factor_powers(n)
    return 0 if any(k > 1 for p, k in factors) else (-1) ** len(factors)


for n in range(1, 101):
    assert convolution(mobius, one, n) == epsilon(n)
    assert convolution(mobius, identity, n) == totient(n)
    assert convolution(mobius, tau, n) == 1
    assert convolution(mobius, sigma, n) == n
    assert convolution(mobius, lambda d: d + 1, n) == totient(n) + epsilon(n)
    # Recover arbitrary signed data, independently of multiplicativity.
    arbitrary = lambda d: (d % 7) - 3
    cumulative = lambda d: sum(arbitrary(e) for e in divisors(d))
    assert convolution(mobius, cumulative, n) == arbitrary(n)

for f in [one, identity, totient, tau, sigma, mobius]:
    for m, n in product(range(1, 21), repeat=2):
        if gcd(m, n) == 1:
            assert f(m * n) == f(m) * f(n)
assert mobius(4) != mobius(2) ** 2
assert convolution(mobius, mobius, 4) == 1
assert totient(60) == 16
print("mu(1), ..., mu(12):", [mobius(n) for n in range(1, 13)])
print("Nonzero totient-inversion terms at 60:",
      [(d, mobius(d) * (60 // d)) for d in divisors(60) if mobius(d)])

# %% [markdown]
# **Proof prompts.** In the double-sum proof of inversion, explain why the
# coefficient of $f(e)$ vanishes unless $e=n$. Invert $F(n)=n+1$ and
# explain the exceptional value at 1. Why is the inverse of $\mu$ the
# constant-one function, rather than $\mu$ itself?

# %% [markdown]
# ## 3. Exact periods and all necklaces
#
# Let $P_a(n)$ count labeled words of least period $n$. Repeating a unique
# primitive block gives $a^n=\sum_{d\mid n}P_a(d)$. Invert this identity.
# Compare the result with direct enumeration, distinguishing primitive
# necklaces from all necklaces.

# %%
def rotate(word, k):
    k %= len(word)
    return word[k:] + word[:k]


def least_period(word):
    return next(d for d in range(1, len(word) + 1) if rotate(word, d) == word)


def primitive_words(n, colors):
    n, colors = int(n), int(colors)
    return sum(mobius(d) * colors ** (n // d) for d in divisors(n))


def necklace_count(n, colors):
    numerator = sum(totient(d) * colors ** (int(n) // d) for d in divisors(n))
    assert numerator % n == 0
    return numerator // n


for colors, maximum in [(2, 10), (3, 7)]:
    for n in range(1, maximum + 1):
        words = list(product(range(colors), repeat=n))
        periods = Counter(least_period(word) for word in words)
        orbit_representatives = {min(rotate(word, k) for k in range(n)) for word in words}
        assert periods[n] == primitive_words(n, colors)
        assert primitive_words(n, colors) % n == 0
        assert sum(primitive_words(d, colors) for d in divisors(n)) == colors ** n
        assert len(orbit_representatives) == necklace_count(n, colors)
        assert sum(primitive_words(d, colors) // d for d in divisors(n)) == necklace_count(n, colors)
assert primitive_words(12, 2) == 4020
assert necklace_count(12, 2) == 352
print("Binary length 12: primitive words, primitive necklaces, all necklaces:",
      primitive_words(12, 2), primitive_words(12, 2) // 12, necklace_count(12, 2))

# %% [markdown]
# **Proof prompts.** Why does each least period divide the length? Why does
# a primitive block give exactly one labeled repeated word? Recover the
# prime-power subtraction from the Möbius formula. Derive the totient formula
# for *all* necklaces by collecting coefficients in $\sum_{d\mid n}P_a(d)/d$.

# %% [markdown]
# ## 4. Bonus: one inverse for every finite poset
#
# Supply a finite list whose smaller elements precede larger ones, and a
# comparison function. The same recurrence computes every Möbius coefficient.
# Compare lower and upper cumulative sums carefully: intersections and
# equality patterns below use upper sums.

# %%
def poset_mobius(elements, leq):
    elements = tuple(elements)
    assert len(set(elements)) == len(elements)
    assert all(leq(x, x) for x in elements)
    assert all(i <= j for i, x in enumerate(elements) for j, y in enumerate(elements) if leq(x, y))

    @lru_cache(None)
    def mu(x, y):
        if x == y:
            return 1
        if not leq(x, y):
            return 0
        return -sum(mu(x, z) for z in elements if z != y and leq(x, z) and leq(z, y))
    return mu


def lower_sum(elements, leq, f):
    return {y: sum(f[x] for x in elements if leq(x, y)) for y in elements}


def upper_sum(elements, leq, f):
    return {x: sum(f[y] for y in elements if leq(x, y)) for x in elements}


def recover_lower(elements, leq, mu, g):
    return {y: sum(mu(x, y) * g[x] for x in elements if leq(x, y)) for y in elements}


def recover_upper(elements, leq, mu, g):
    return {x: sum(mu(x, y) * g[y] for y in elements if leq(x, y)) for x in elements}


def verify_poset_inverse(elements, leq, mu):
    f = {x: i * i - 3 for i, x in enumerate(elements)}
    assert recover_lower(elements, leq, mu, lower_sum(elements, leq, f)) == f
    assert recover_upper(elements, leq, mu, upper_sum(elements, leq, f)) == f
    # Both matrix products must be the identity, for every interval.
    for x, y in product(elements, repeat=2):
        if leq(x, y):
            interval = [z for z in elements if leq(x, z) and leq(z, y)]
            assert sum(mu(x, z) for z in interval) == int(x == y)
            assert sum(mu(z, y) for z in interval) == int(x == y)


chain = list(range(4))
chain_leq = lambda x, y: x <= y
chain_mu = poset_mobius(chain, chain_leq)
verify_poset_inverse(chain, chain_leq, chain_mu)
assert [chain_mu(0, y) for y in chain] == [1, -1, 0, 0]
assert list(recover_lower(chain, chain_leq, chain_mu, dict(zip(chain, [2, 7, 8, 20]))).values()) == [2, 5, 1, 12]

subsets = [frozenset(s) for k in range(3) for s in combinations([1, 2], k)]
subset_leq = lambda s, t: s <= t
subset_mu = poset_mobius(subsets, subset_leq)
verify_poset_inverse(subsets, subset_leq, subset_mu)
for s, t in product(subsets, repeat=2):
    if s <= t:
        assert subset_mu(s, t) == (-1) ** len(t - s)
assert list(recover_lower(subsets, subset_leq, subset_mu, dict(zip(subsets, [2, 5, 7, 16]))).values()) == [2, 3, 5, 6]

divisor_poset = divisors(12)
divides = lambda x, y: y % x == 0
divisor_mu = poset_mobius(divisor_poset, divides)
verify_poset_inverse(divisor_poset, divides, divisor_mu)
for r, s in product(divisor_poset, repeat=2):
    if divides(r, s):
        assert divisor_mu(r, s) == mobius(s // r)
print("Divisors of 12 and their coefficients:", [(d, divisor_mu(1, d)) for d in divisor_poset])

# %% [markdown]
# **Proof prompts.** Draw the three Hasse diagrams. Why do long intervals
# in a chain have coefficient zero? Why is the divisor interval $[r,s]$
# equivalent to the divisors of $s/r$? Use a product of exponent chains
# to explain both squarefree signs and zeros caused by prime squares.
# On the infinite chain of all integers, distinguish finite intervals from
# finite lower sets before writing cumulative sums.

# %% [markdown]
# ## 5. Bonus: partition coefficients need not be signs
#
# A coloring determines a partition into equal-color classes. If a partition
# only requires some positions to have the same color, the actual equality
# partition may be coarser. This is an upper cumulative sum in refinement order.
# Directly enumerate four-color assignments, then recover exact counts by
# inversion and compare. The coefficient from bottom to top is 2.

# %%
def partition(*blocks):
    return frozenset(frozenset(block) for block in blocks)


bottom = partition([0], [1], [2])
middle = [partition([0, 1], [2]), partition([0, 2], [1]), partition([1, 2], [0])]
top = partition([0, 1, 2])
partitions = [bottom] + middle + [top]
refines = lambda pi, sigma: all(any(block <= larger for larger in sigma) for block in pi)
partition_mu = poset_mobius(partitions, refines)
verify_poset_inverse(partitions, refines, partition_mu)
assert partition_mu(bottom, top) == 2


def equality_partition(word):
    return frozenset(frozenset(j for j, value in enumerate(word) if value == color) for color in set(word))


colors = 4
actual = Counter(equality_partition(word) for word in product(range(colors), repeat=3))
cumulative = {pi: colors ** len(pi) for pi in partitions}
assert upper_sum(partitions, refines, actual) == cumulative
assert recover_upper(partitions, refines, partition_mu, cumulative) == actual
assert actual[bottom] == colors ** 3 - 3 * colors ** 2 + 2 * colors == 24
print("Partition coefficients from bottom:", [partition_mu(bottom, pi) for pi in partitions])
print("Injective four-color assignments:", actual[bottom])

# %% [markdown]
# **Proof prompts.** Explain why the coefficient at the top is 2. Identify
# the exact and cumulative counts before applying inversion. Reinterpret
# ordinary inclusion–exclusion as an upper sum over membership sets.
# Why are those subset signs insufficient for an arbitrary poset?

# %% [markdown]
# ## 6. Bonus: interpolation at roots of unity is Fourier inversion
#
# For $f(X)=\sum_{k=0}^{n-1}c_kX^k$, choose a primitive root $\omega$.
# Use the convention $y_j=f(\omega^j)=\sum_k c_k\omega^{jk}$.
# The Lagrange selectors are
# $\ell_j(X)=n^{-1}\sum_k\omega^{-jk}X^k$, so coefficient recovery is
# $c_k=n^{-1}\sum_j y_j\omega^{-jk}$. Orthogonality of roots of unity
# supplies the Kronecker delta in both interpolation and Fourier inversion.
#
# Here pairs $(a,b)$ represent $a+bi$ with rational coordinates. Compare
# the inverse transform with Lagrange interpolation built independently
# from its product formula.

# %%
def gaussian(a=0, b=0):
    return (Fraction(a), Fraction(b))


def qadd(u, v):
    return (u[0] + v[0], u[1] + v[1])


def qneg(u):
    return (-u[0], -u[1])


def qmul(u, v):
    a, b = u
    c, d = v
    return (a * c - b * d, a * d + b * c)


def qinverse(u):
    a, b = u
    norm = a * a + b * b
    if norm == 0:
        raise ZeroDivisionError("Zero has no inverse.")
    return (a / norm, -b / norm)


def qsum(values):
    result = gaussian()
    for value in values:
        result = qadd(result, value)
    return result


roots = [gaussian(1), gaussian(0, 1), gaussian(-1), gaussian(0, -1)]


def dft4(values, inverse=False):
    assert len(values) == 4
    sign = -1 if inverse else 1
    scale = gaussian(Fraction(1, 4) if inverse else 1)
    return [qmul(scale, qsum(qmul(values[k], roots[(sign * j * k) % 4]) for k in range(4))) for j in range(4)]


def qpoly_multiply(f, g):
    result = [gaussian() for _ in range(len(f) + len(g) - 1)]
    for i, a in enumerate(f):
        for j, b in enumerate(g):
            result[i + j] = qadd(result[i + j], qmul(a, b))
    return result


def qpoly_evaluate(f, x):
    result = gaussian()
    for coefficient in reversed(f):
        result = qadd(qmul(result, x), coefficient)
    return result


def lagrange_basis(points, j):
    result, denominator = [gaussian(1)], gaussian(1)
    for r, x in enumerate(points):
        if r != j:
            result = qpoly_multiply(result, [qneg(x), gaussian(1)])
            denominator = qmul(denominator, qadd(points[j], qneg(x)))
    inverse = qinverse(denominator)
    return [qmul(coefficient, inverse) for coefficient in result]


coefficients = [gaussian(c) for c in [1, 2, 3, 4]]
samples = [qpoly_evaluate(coefficients, x) for x in roots]
assert samples == [gaussian(10), gaussian(-2, -2), gaussian(-2), gaussian(-2, 2)]
assert dft4(coefficients) == samples
assert dft4(samples, inverse=True) == coefficients
bases = [lagrange_basis(roots, j) for j in range(4)]
for j, basis in enumerate(bases):
    assert basis == [qmul(gaussian(Fraction(1, 4)), roots[(-j * k) % 4]) for k in range(4)]
    assert [qpoly_evaluate(basis, x) for x in roots] == [gaussian(int(j == r)) for r in range(4)]
interpolated = [qsum(qmul(samples[j], bases[j][k]) for j in range(4)) for k in range(4)]
assert interpolated == dft4(samples, inverse=True) == coefficients

other = [gaussian(c) for c in [2, -1, 0, 1]]
cyclic = [qsum(qmul(coefficients[k], other[(r - k) % 4]) for k in range(4)) for r in range(4)]
assert dft4(cyclic) == [qmul(a, b) for a, b in zip(dft4(coefficients), dft4(other))]
print("Exact four-point samples (real, imaginary):", samples)
print("Recovered coefficients:", [value[0] for value in interpolated])

# %% [markdown]
# ## 7. The same four-point transform in a prime field
#
# In $\mathbb F_5$, the root $\omega=2$ has order 4. Its inverse is 3,
# and the normalization uses $4^{-1}=4$. Check every coefficient vector,
# not just the book's example. A field extension is needed only if the
# desired roots are missing; $n$ must also be invertible in the field.

# %%
def prime_field_dft(values, p, omega, inverse=False):
    values, p, omega = list(values), int(p), int(omega)
    n = len(values)
    assert n >= 1 and n % p != 0
    assert pow(omega, n, p) == 1
    assert all(pow(omega, k, p) != 1 for k in range(1, n))
    root = pow(omega, int(-1), p) if inverse else omega
    scale = pow(n, int(-1), p) if inverse else 1
    return [(scale * sum(int(values[k]) * pow(root, j * k, p) for k in range(n))) % p for j in range(n)]


assert prime_field_dft([1, 2, 3, 4], 5, 2) == [0, 4, 3, 2]
assert prime_field_dft([0, 4, 3, 2], 5, 2, inverse=True) == [1, 2, 3, 4]
for values in product(range(5), repeat=4):
    assert prime_field_dft(prime_field_dft(values, 5, 2), 5, 2, inverse=True) == list(values)
print("All 625 four-point vectors over F_5 recover exactly.")

# %% [markdown]
# **Final synthesis.** Write the cancellation identity for each inverse:
# Möbius coefficients on an interval, Lagrange selectors at sample points,
# and characters at roots of unity. Explain why Fourier inversion is exactly
# the roots-of-unity case of interpolation, including its degree bound,
# signs, and normalization. Use polynomial CRT to explain why cyclic
# convolution becomes pointwise multiplication after the transform.
