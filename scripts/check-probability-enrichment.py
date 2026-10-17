#!/usr/bin/env python3
"""Exact independent small-case checks for the probability book's new material.

Run from any directory with Python 3; no third-party packages are required.
Enumerations and first-step recurrences are compared with the book's formulas.
"""

from fractions import Fraction as Q
from functools import lru_cache
from itertools import combinations, permutations, product
from math import comb, factorial


def harmonic(n):
    return sum((Q(1, j) for j in range(1, n + 1)), Q(0))


def matchings(ends):
    if not ends:
        yield ()
        return
    first = ends[0]
    for k in range(1, len(ends)):
        for rest in matchings(ends[1:k] + ends[k + 1:]):
            yield ((first, ends[k]),) + rest


def loop_count(n, pairing):
    parent = list(range(2 * n))

    def root(a):
        while parent[a] != a:
            a = parent[a]
        return a

    for a, b in tuple((2 * j, 2 * j + 1) for j in range(n)) + pairing:
        parent[root(a)] = root(b)
    return len({root(a) for a in range(2 * n)})


def check_linearity():
    for n in range(8):
        orders = list(permutations(range(n)))
        records = sum(sum(a == max(order[:j + 1])
                          for j, a in enumerate(order)) for order in orders)
        inversions = sum(sum(order[i] > order[j]
                             for i, j in combinations(range(n), 2))
                         for order in orders)
        assert Q(records, len(orders)) == harmonic(n)
        assert Q(inversions, len(orders)) == Q(n * (n - 1), 4)
    for n in range(7):
        all_matchings = list(matchings(tuple(range(2 * n))))
        loops = sum(loop_count(n, pairing) for pairing in all_matchings)
        assert Q(loops, len(all_matchings)) == harmonic(2 * n) - harmonic(n) / 2
        if n:
            singletons = sum(sum((2 * j, 2 * j + 1) in pairing
                                  for j in range(n)) for pairing in all_matchings)
            assert Q(singletons, len(all_matchings)) == Q(n, 2 * n - 1)
    for n in range(1, 9):
        for p in (Q(0), Q(1, 3), Q(1, 2), Q(1)):
            mean = Q(0)
            for bits in product((0, 1), repeat=n):
                heads = sum(bits)
                runs = sum(b == 1 and (j == 0 or bits[j - 1] == 0)
                           for j, b in enumerate(bits))
                mean += runs * p ** heads * (1 - p) ** (n - heads)
            assert mean == p + (n - 1) * p * (1 - p)
    cuts = [sum(colors[i] != colors[j] for i, j in ((0, 1), (1, 2), (0, 2)))
            for colors in product((0, 1), repeat=3)]
    assert cuts.count(0) == 2 and cuts.count(2) == 6
    assert harmonic(8) == Q(761, 280)
    assert harmonic(8) - harmonic(4) == Q(533, 840)


def subset_terms(probabilities):
    for mask in range(1, 1 << len(probabilities)):
        mass = sum((p for i, p in enumerate(probabilities) if mask >> i & 1), Q(0))
        yield (-1) ** (mask.bit_count() + 1), mass


def recursive_moments(probabilities):
    """First-step equations on missing sets, independent of inclusion-exclusion."""
    if not probabilities or any(p <= 0 for p in probabilities) or sum(probabilities) != 1:
        raise ValueError("The finite-moment formulas require positive type probabilities.")

    @lru_cache(None)
    def visit(mask):
        if mask == 0:
            return Q(0), Q(0)
        missing = [i for i in range(len(probabilities)) if mask >> i & 1]
        mass = sum(probabilities[i] for i in missing)
        smaller = [(probabilities[i], visit(mask ^ (1 << i))) for i in missing]
        mean = (1 + sum(p * moments[0] for p, moments in smaller)) / mass
        second = (2 * mean - 1 + sum(p * moments[1] for p, moments in smaller)) / mass
        return mean, second

    return visit((1 << len(probabilities)) - 1)


def completion_cdf(probabilities, draws):
    states = {0: Q(1)}
    for _ in range(draws):
        following = {}
        for mask, weight in states.items():
            for i, p in enumerate(probabilities):
                target = mask | (1 << i)
                following[target] = following.get(target, Q(0)) + weight * p
        states = following
    return states.get((1 << len(probabilities)) - 1, Q(0))


def check_coupons():
    for weights in ((1,), (1, 1), (1, 9), (1, 2, 3), (2, 1, 1),
                    (1, 1, 1, 1), (1, 2, 3, 4, 5)):
        ps = tuple(Q(w, sum(weights)) for w in weights)
        mean, second = recursive_moments(ps)
        assert mean == sum(sign / mass for sign, mass in subset_terms(ps))
        assert second == sum(sign * (2 - mass) / mass ** 2
                             for sign, mass in subset_terms(ps))
        for draws in range(11):
            by_subsets = 1 - sum(sign * (1 - mass) ** draws
                                 for sign, mass in subset_terms(ps))
            assert completion_cdf(ps, draws) == by_subsets
        assert mean >= len(ps) * harmonic(len(ps))
        if len(set(ps)) == 1:
            n = len(ps)
            assert second - mean ** 2 == n ** 2 * sum(Q(1, j * j)
                         for j in range(1, n + 1)) - n * harmonic(n)
    mean, second = recursive_moments((Q(1, 2), Q(1, 4), Q(1, 4)))
    assert (mean, second, second - mean ** 2) == (Q(19, 3), Q(473, 9), Q(112, 9))
    assert second + mean - mean ** 2 == Q(169, 9)  # Unit-clock variance.
    assert recursive_moments((Q(1, 2), Q(1, 3), Q(1, 6)))[0] == Q(73, 10)
    assert all(completion_cdf((Q(1), Q(0)), m) == 0 for m in range(11))


def check_distribution_origins():
    p = Q(1, 3)
    for r in range(1, 4):
        for k in range(r, r + 5):
            sequences = [bits for bits in product((0, 1), repeat=k)
                         if bits[-1] == 1 and sum(bits) == r]
            exact = sum(p ** sum(bits) * (1 - p) ** (k - sum(bits))
                        for bits in sequences)
            assert exact == comb(k - 1, r - 1) * p ** r * (1 - p) ** (k - r)
    for r in range(1, 7):
        for rate in (Q(1), Q(3, 2), Q(3)):
            def moment(k):
                return rate ** r * factorial(r - 1 + k) / (
                    factorial(r - 1) * rate ** (r + k))
            assert moment(0) == 1 and moment(1) == r / rate
            assert moment(2) - moment(1) ** 2 == r / rate ** 2
    for m in range(1, 9):
        for k in range(1, m + 1):
            coefficient = Q(factorial(m), factorial(k - 1) * factorial(m - k))
            def moment(j):
                return coefficient * sum((-1) ** a * Q(comb(m - k, a), k + a + j)
                                         for a in range(m - k + 1))
            assert moment(0) == 1 and moment(1) == Q(k, m + 1)
            assert moment(2) - moment(1) ** 2 == Q(k * (m + 1 - k), (m + 1) ** 2 * (m + 2))
            for x in (Q(0), Q(1, 4), Q(1, 2), Q(3, 4), Q(1)):
                integral = coefficient * sum((-1) ** a * Q(comb(m - k, a), k + a)
                                            * x ** (k + a) for a in range(m - k + 1))
                binomial_tail = sum(comb(m, j) * x ** j * (1 - x) ** (m - j)
                                    for j in range(k, m + 1))
                assert integral == binomial_tail


def check_poissonization():
    ps = (Q(1, 2), Q(1, 4), Q(1, 4))
    t = Q(12)
    # Both joint masses share exp(-t); compare their rational coefficients.
    for counts in product(range(5), repeat=3):
        s = sum(counts)
        multinomial = Q(factorial(s), 1)
        independent = Q(1)
        for p, c in zip(ps, counts):
            multinomial *= p ** c / factorial(c)
            independent *= (t * p) ** c / factorial(c)
        assert t ** s / factorial(s) * multinomial == independent

    def exp_negative_bounds(x):
        # The remaining alternating tail decreases after term 40.
        term = total = Q(1)
        for j in range(1, 41):
            term *= -x / j
            total += term
        return total + term * (-x) / 41, total

    half_lo, half_hi = exp_negative_bounds(Q(1, 2))
    one_lo, one_hi = exp_negative_bounds(Q(1))
    two_lo, two_hi = exp_negative_bounds(Q(2))
    four_lo, four_hi = exp_negative_bounds(Q(4))
    lower_lo, lower_hi = Q(7, 2) * one_lo - 2 * half_hi, Q(7, 2) * one_hi - 2 * half_lo
    upper_lo, upper_hi = 1 - 2 * two_hi + 6 * four_lo, 1 - 2 * two_lo + 6 * four_hi
    assert 0 < lower_lo < lower_hi < Q(1, 2) < upper_lo < upper_hi < 1


if __name__ == "__main__":
    check_linearity()
    check_coupons()
    check_distribution_origins()
    check_poissonization()
    print("Exact checks passed: permutations through n=7; spaghetti matchings through n=6;")
    print("head runs and cuts; coupon recurrences and finite-draw laws; distribution origins;")
    print("Poisson splitting and rigorously bounded de-Poissonization examples.")
