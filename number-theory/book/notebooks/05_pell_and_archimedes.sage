# %% [markdown]
# # Lab 5: Pell equations, palindromes, and the Cattle of the Sun
#
# Use the **SageMath kernel**, starting at the top. This lab accompanies
# Chapter 3, §§3.10–3.11. It is self-contained; Lab 4 supplies the
# Lagrange–Galois background. We compute the complete herd with exact
# arithmetic, but display only its size and its first and last digits.
# Run the matching script with `sage 05_pell_and_archimedes.sage`.
#
# ## 1. Detect the period without assuming its shape
#
# The complete quotient is $x_n=(P_n+\sqrt D)/Q_n$. The initial state
# is $(0,1)$; the period begins at $n=1$. A repeated pair determines
# the first return. No floating-point square roots enter the recurrence.

# %%
def sqrt_period(D):
    D = ZZ(D)
    if D <= 0 or D.is_square():
        raise ValueError("D must be a positive nonsquare integer.")
    a0 = D.isqrt()
    P, Q, a = ZZ(0), ZZ(1), a0
    seen, states = {}, []
    while (P, Q) not in seen:
        seen[P, Q] = len(states)
        states.append((P, Q, a))
        nextP = a*Q-P
        assert (D-nextP^2) % Q == 0
        P, Q = nextP, (D-nextP^2)//Q
        a = (a0+P)//Q
    assert seen[P, Q] == 1
    return a0, states[1:]

def pell_rows(D, count):
    D = ZZ(D)
    a0 = D.isqrt()
    P, Q, a = ZZ(0), ZZ(1), a0
    pp, p, qq, q = ZZ(0), ZZ(1), ZZ(1), ZZ(0)
    rows = []
    for k in range(count):
        pp, p = p, a*p+pp
        qq, q = q, a*q+qq
        P = a*Q-P
        Q = (D-P^2)//Q
        rows.append((k, a, p, q, Q, p^2-D*q^2))
        a = (a0+P)//Q
    return rows

for D in [2, 6, 13, 23, 61]:
    a0, states = sqrt_period(D)
    period = [a for P, Q, a in states]
    assert period[-1] == 2*a0
    assert period[:-1] == period[-2::-1]
    assert tuple(period) == continued_fraction(QuadraticField(D, 'r').gen()).period()
    print("D =", D, "a0 =", a0, "period =", period, "length =", len(period))

# %% [markdown]
# **Prove the palindrome.** Apply period reversal to the reduced surd
# $\sqrt D+a_0$. Its conjugate is $a_0-\sqrt D$. Explain why the
# period of $\sqrt D$ ends in $2a_0$, and why the digits **before**
# that final term read the same in either direction. The whole period
# of $\sqrt D$ need not be a palindrome: try $D=13$.
#
# ## 2. The identity that closes the proof
#
# The $k$th convergent satisfies
# $$p_k^2-Dq_k^2=(-1)^{k+1}Q_{k+1}.$$
# Thus a good approximation alone is not our certificate: the complete
# quotient tells us its exact norm. Display all ten convergents of two
# periods for $D=13$.

# %%
rows = pell_rows(13, 10)
for k, a, p, q, Qnext, norm in rows:
    assert norm == (-1)^(k+1)*Qnext
print(table(rows, header_row=["k", "a_k", "p_k", "q_k", "Q_(k+1)", "norm"]))
assert rows[4][2:4] == (18, 5) and rows[4][-1] == -1
assert rows[9][2:4] == (649, 180) and rows[9][-1] == 1

# %% [markdown]
# **Derive it.** Substitute $x_{k+1}=(P_{k+1}+\sqrt D)/Q_{k+1}$
# into $\sqrt D=(p_kx_{k+1}+p_{k-1})/(q_kx_{k+1}+q_{k-1})$.
# Compare rational and irrational coefficients, then use the convergent
# determinant. Explain why $Q_{k+1}=1$ precisely when $L\mid k+1$.
#
# **Mind the index.** For even $L$ the first positive solution is
# $p_{L-1}/q_{L-1}$; for odd $L$ it is $p_{2L-1}/q_{2L-1}$.
# Stop just **before** the appropriate occurrence of $2a_0$.

# %%
def fundamental_pell(D):
    a0, period = sqrt_period(D)
    L = len(period)
    row = pell_rows(D, L if L % 2 == 0 else 2*L)[-1]
    assert row[-1] == 1
    return row[2], row[3], L

for D in [2, 3, 6, 13, 23, 61]:
    u, v, L = fundamental_pell(D)
    print("D =", D, "L =", L, "least +1 solution =", (u, v),
          "negative Pell solvable:", bool(L % 2))
assert fundamental_pell(61)[:2] == (1766319049, 226153980)

# Check more than the endpoint: every norm and every ±1 index.
for D in range(2, 301):
    if ZZ(D).is_square():
        continue
    L = len(sqrt_period(D)[1])
    for k, a, p, q, Qnext, norm in pell_rows(D, 4*L):
        assert norm == (-1)^(k+1)*Qnext
        assert (abs(norm) == 1) == ((k+1) % L == 0)
print("All complete-quotient identities checked through D = 300.")

# %% [markdown]
# ## 3. Generate every positive solution
#
# Multiplication in $\mathbb Z[\sqrt D]$ gives
# $(u+v\sqrt D)(x+y\sqrt D)=(ux+Dvy)+(uy+vx)\sqrt D$.
# Sage's quadratic field performs this calculation exactly.

# %%
D = ZZ(3)
K = QuadraticField(D, 'r')
r = K.gen()
u, v, L = fundamental_pell(D)
epsilon = u+v*r
powers = [(j, ZZ((epsilon^j)[0]), ZZ((epsilon^j)[1])) for j in range(1, 7)]
assert all(x^2-D*y^2 == 1 for j, x, y in powers)
print(table(powers, header_row=["power", "x", "y"]))

# %% [markdown]
# **Prove completeness.** Given a positive norm-one unit $\eta$, choose
# $j$ with $\varepsilon^j\le\eta<\varepsilon^{j+1}$. Show that
# $\eta\varepsilon^{-j}$ still has integer coefficients, norm one,
# and lies in $[1,\varepsilon)$. Why does minimality force it to be 1?
#
# ## 4. Archimedes: recover the herd proportions
#
# Order the unknowns as $(W,B,Y,S,w,b,y,s)$: four colors of bulls,
# followed by four colors of cows. Each row below is one of the seven
# homogeneous linear conditions. Compute its rational nullspace,
# clear denominators, and make the vector primitive.

# %%
A = matrix(QQ, [
    [1, -5/6, -1, 0, 0, 0, 0, 0],
    [0, 1, -1, -9/20, 0, 0, 0, 0],
    [-13/42, 0, -1, 1, 0, 0, 0, 0],
    [0, -7/12, 0, 0, 1, -7/12, 0, 0],
    [0, 0, 0, -9/20, 0, 1, 0, -9/20],
    [-13/42, 0, 0, 0, -13/42, 0, 1, 0],
    [0, 0, -11/30, 0, 0, 0, -11/30, 1],
])
kernel = A.right_kernel()
assert kernel.dimension() == 1
raw = kernel.basis()[0]
counts = vector(ZZ, raw*lcm([c.denominator() for c in raw]))
counts /= gcd(counts)
counts = vector(ZZ, counts if counts[0] > 0 else -counts)
assert list(counts) == [10366482, 7460514, 4149387, 7358060,
                        7206360, 4893246, 5439213, 3515820]
assert A*counts == zero_vector(QQ, 7)
assert gcd(counts) == 1 and sum(counts) == 50389082
print(table(list(zip(["White", "Black", "Yellow", "Dappled"], counts[:4], counts[4:])),
            header_row=["Color", "Bulls / t", "Cows / t"]))

# %% [markdown]
# **Explain integrality.** Why does gcd 1 ensure that a rational multiple
# of this vector is integral only when the multiplier $t$ is an integer?
# Hint: use a Bézout combination of all eight entries.
#
# The white and black bulls must form a square; the yellow and dappled
# bulls must form a triangle. Unique factorization first gives
# $t=4456749r^2$. Completing the square for the triangle gives
# $X^2-410286423278424r^2=1$, $X=2h+1$.

# %%
squarefree = ZZ(4456749)
assert squarefree.is_squarefree()
assert counts[0]+counts[1] == 4*squarefree
bigD = 8*(counts[2]+counts[3])*squarefree
D, modulus = ZZ(4729494), ZZ(9314)
assert bigD == 410286423278424 == D*modulus^2
print("Squarefree factor:", factor(squarefree))
print("Reduced equation: X^2 -", D, "Z^2 = 1, with", modulus, "dividing Z.")

# %% [markdown]
# **Prove equivalence.** Verify both directions of the reduction, including
# why $X$ is odd. After setting $Z=9314r$, keep the condition $9314\mid Z$.
# Omitting it solves a different problem.
#
# ## 5. Find the first admissible power using small residues
#
# Let $\varepsilon=u+v\sqrt{4729494}$ be the least positive unit.
# The theorem about powers reduces minimality to the first exponent $j$
# for which the second coefficient of $\varepsilon^j$ vanishes modulo 9314.

# %%
u, v, L = fundamental_pell(D)
assert L == 92
assert u == 109931986732829734979866232821433543901088049
assert v == 50549485234315033074477819735540408986340
print("Period length:", L)
print("Fundamental unit coefficients:", (u, v))

Rmod = Integers(modulus)
a, b = Rmod(1), Rmod(0)
seen = {(a, b)}
admissible = None
for j in range(1, int(modulus^2)+1):
    a, b = Rmod(u)*a+Rmod(D*v)*b, Rmod(v)*a+Rmod(u)*b
    if b == 0:
        admissible = j
        break
    if (a, b) in seen:
        raise AssertionError("The residue orbit closed without a positive return.")
    seen.add((a, b))
assert admissible == 2329
assert (ZZ(a), ZZ(b)) == (9313, 0)
print("First admissible exponent:", admissible, "residue pair:", (a, b))

# %% [markdown]
# **Why is this a certificate?** Each smaller exponent was checked, and
# all positive Pell solutions are powers of $\varepsilon$. Explain why
# their positive second coefficients increase strictly with the exponent.
# That is the connection between the finite search and the smallest herd.
#
# ## 6. Construct the enormous answer and verify the original problem
#
# This cell uses arbitrary-precision integers. It does not print the full
# herd: its purpose is to check all seven proportions and both shape
# conditions independently of the displayed approximation.

# %%
K = QuadraticField(D, 'r')
epsilon = u+v*K.gen()
unit = epsilon^admissible
X, Z = ZZ(unit[0]), ZZ(unit[1])
assert X^2-D*Z^2 == 1 and Z % modulus == 0 and X % 2 == 1
r = Z//modulus
scale = squarefree*r^2
herd = counts*scale
h = (X-1)//2
assert A*herd == zero_vector(QQ, 7)
assert (herd[0]+herd[1]).is_square()
assert herd[2]+herd[3] == h*(h+1)//2
T = sum(herd)
digits = T.ndigits()
assert digits == 206545
assert 10^206544 <= T < 10^206545
leading = T//10^(digits-20)
trailing = T % 10^20
assert leading == 77602714064868182695
assert trailing == 23406626719455081800
print("Total cattle: exactly", digits, "decimal digits")
print("First 20 digits:", leading)
print("Last 20 digits:", str(trailing).zfill(20))
print("All seven proportions, the square, and the triangle verified.")

# %% [markdown]
# ## Further investigations
#
# 1. For $D=6$ and $D=23$, explain from the period why negative Pell
#    is impossible. Find their first three positive solutions.
# 2. Why is the first positive solution for $D=61$ so much larger than
#    for $D=60$? Compare periods and convergents before drawing conclusions.
# 3. Track the cattle recurrence modulo 2 and modulo 4657 separately.
#    Reassemble the divisibility condition with the Chinese remainder theorem.
# 4. Derive Vardi's compact expression
#    $T=\frac{25194541}{184119152}(\varepsilon^{4658}+\varepsilon^{-4658}-2)$
#    from the coefficient $Z$. Explain why a compact expression can describe
#    an integer with hundreds of thousands of digits.
#
# Reference: Ilan Vardi, [“Archimedes' Cattle Problem”](https://doi.org/10.1080/00029890.1998.12004887),
# *American Mathematical Monthly* **105** (1998), 305–319;
# [accessible preprint](https://www.maths.tcd.ie/~lebed/Cattle%20problem%20Ilan%20Vardi.pdf).
