# %% [markdown]
# # Lab 4: Möbius maps, Lagrange, and Galois
#
# Use the **SageMath kernel** and run from the top. This lab accompanies
# Chapter 3, especially §§3.7–3.9. Each calculation uses exact integers,
# rational numbers, or quadratic fields. A finite experiment is evidence;
# the proof prompts ask for the argument that works for every input.
#
# The companion `.sage` file contains the same cells and can be run with
# `sage 04_mobius_lagrange_galois.sage`.

# %%
def digit_matrix(a):
    return matrix(ZZ, [[a, 1], [1, 0]])

def word_matrix(word):
    M = identity_matrix(ZZ, 2)
    for a in word:
        M *= digit_matrix(a)
    return M

def mobius(M, x):
    a, b, c, d = M.list()
    if c*x + d == 0:
        raise ValueError("The Möbius map has a pole at this input.")
    return (a*x + b)/(c*x + d)

R = PolynomialRing(QQ, 't')
t = R.gen()

def fixed_polynomial(M):
    a, b, c, d = M.list()
    return c*t^2 + (d-a)*t - b

word = [4, 2, 6, 7]  # 415/93
M = word_matrix(word)
assert M == matrix(ZZ, [[415, 58], [93, 13]])
assert M.det() == (-1)^len(word)
assert 13*415 - 58*93 == 1
print("Convergent columns:\n", M)
print("Integral inverse:\n", M.inverse())

# %% [markdown]
# ## 1. Composition and the alternating trap
#
# A matrix acts by $T_M(t)=(at+b)/(ct+d)$. Verify composition with the
# **rightmost factor acting first**. Its derivative is
# $\det(M)/(ct+d)^2$ wherever the denominator is nonzero.
#
# **Prove.** Derive the composition rule by multiplying two fractions.
# Use the determinant sign to recover the alternating inequalities for
# consecutive convergents. Explain why the pole must be excluded.

# %%
A, B = digit_matrix(3), digit_matrix(5)
z = QQ(7)/4
assert mobius(A*B, z) == mobius(A, mobius(B, z))
F = R.fraction_field()
a, b, c, d = M.list()
f = F(a*t+b)/F(c*t+d)
assert f.derivative() == F(M.det())/F((c*t+d)^2)
print("Derivative:", f.derivative())

# %% [markdown]
# ## 2. A periodic tail is a fixed point
#
# For $\sqrt3=[1;\overline{1,2}]$, the repeating tail is
# $x=(1+\sqrt3)/2$. Its period matrix is $N=D(1)D(2)$.
# The prefix $D(1)$ takes $x$ to $\sqrt3$, so conjugating $N$ by the
# prefix gives a matrix fixing $\sqrt3$.
#
# **Prove.** Show that a nonscalar rational matrix fixing an irrational
# number gives a genuine quadratic equation. What fails for the identity?

# %%
K = QuadraticField(3, 'r')
r = K.gen()
x = (1+r)/2
N = word_matrix([1, 2])
prefix = digit_matrix(1)
C = prefix*N*prefix.inverse()
assert mobius(N, x) == x
assert mobius(prefix, x) == r
assert mobius(C, r) == r
assert fixed_polynomial(N)(x) == 0
assert fixed_polynomial(C)(r) == 0
assert fixed_polynomial(identity_matrix(ZZ, 2)) == 0
print("Tail equation:", fixed_polynomial(N))
print("Conjugated matrix:\n", C)
print("Equation for sqrt(3):", fixed_polynomial(C))

# %% [markdown]
# ## 3. Lagrange's theorem: find the repeated state
#
# For $x_n=(P_n+\sqrt D)/Q_n$, record the complete quotient, not a
# rounded decimal. Starting with $\sqrt D$, the recurrence is
# $P_{n+1}=a_nQ_n-P_n$ and $Q_{n+1}=(D-P_{n+1}^2)/Q_n$.
# We stop at the **first repeated pair** $(P_n,Q_n)$; we do not assume
# a period length or a final digit in advance.

# %%
def sqrt_states(D):
    D = ZZ(D)
    if D <= 0 or D.is_square():
        raise ValueError("D must be a positive nonsquare integer.")
    a0 = D.isqrt()
    P, Q = ZZ(0), ZZ(1)
    seen, rows = {}, []
    while (P, Q) not in seen:
        seen[P, Q] = len(rows)
        a = (P+a0)//Q
        rows.append((P, Q, a))
        nextP = a*Q-P
        assert (D-nextP^2) % Q == 0
        P, Q = nextP, (D-nextP^2)//Q
    start = seen[P, Q]
    return rows[:start], rows[start:]

for D in [2, 3, 7, 13, 23, 41, 61]:
    prefix_rows, cycle = sqrt_states(D)
    root = QuadraticField(D, 'r').gen()
    cf = continued_fraction(root)
    assert tuple(row[2] for row in prefix_rows) == cf.preperiod()
    assert tuple(row[2] for row in cycle) == cf.period()
    print("D =", D, "prefix =", cf.preperiod(), "period =", cf.period())

prefix_rows, cycle = sqrt_states(13)
print(table([(n+1, P, Q, a) for n, (P, Q, a) in enumerate(cycle)],
            header_row=["n", "P_n", "Q_n", "a_n"]))

# %% [markdown]
# **Prove the missing step.** A computer finding a cycle for seven
# examples does not prove Lagrange's theorem. Explain why the book's
# reduced complete quotients satisfy $0<P_n<\sqrt D$ and
# $0<Q_n<2\sqrt D$, and why integer states in this bounded region are
# finite. What argument shows that a general quadratic irrational
# eventually reaches that region?
#
# ## 4. Galois's criterion: which tails repeat immediately?
#
# A quadratic irrational $x$ is **reduced** when $x>1$ and
# $-1<x'<0$. Galois's theorem says this is equivalent to pure
# periodicity. Use the nontrivial quadratic-field automorphism for $x'$;
# complex conjugation would leave these real numbers unchanged.

# %%
def conjugate_quadratic(x):
    K = x.parent()
    return K.hom([-K.gen()], K)(x)

def is_reduced(x):
    return AA(x) > 1 and -1 < AA(conjugate_quadratic(x)) < 0

K2 = QuadraticField(2, 'r')
r2 = K2.gen()
K13 = QuadraticField(13, 's')
s = K13.gen()
examples = [r2, 1+r2, (1+r2)/2, -r2, (3+s)/2, s+3]
for x in examples:
    cf = continued_fraction(x)
    pure = len(cf.preperiod()) == 0
    assert pure == is_reduced(x)
    print("x =", x, "x' =", conjugate_quadratic(x),
          "prefix =", cf.preperiod(), "period =", cf.period())

# %% [markdown]
# ## 5. Reversing a period
#
# If $x=[\overline{b_0,\ldots,b_{L-1}}]$, then
# $-1/x'=[\overline{b_{L-1},\ldots,b_0}]$.
# Transposing a product of the symmetric digit matrices reverses their
# order. Construct both fixed points to check this exactly.

# %%
def periodic_root(word):
    if not word or any(a < 1 for a in word):
        raise ValueError("A purely periodic word has positive digits.")
    A, B, C, E = word_matrix(word).list()
    delta = (E-A)^2 + 4*B*C
    K = QuadraticField(delta, 's')
    return (A-E+K.gen())/(2*C)

word = [1, 2, 3]
x = periodic_root(word)
y = -1/conjugate_quadratic(x)
assert word_matrix(word).transpose() == word_matrix(word[::-1])
assert mobius(word_matrix(word[::-1]), y) == y
assert continued_fraction(x).period() == tuple(word)
assert continued_fraction(y).period() == tuple(word[::-1])
print("Forward:", continued_fraction(x))
print("Reverse:", continued_fraction(y))

# %% [markdown]
# **Explain.** Why is $-1/x'$ again reduced? Use the transpose identity
# and uniqueness of the positive fixed point to prove period reversal.
# In the next lab, applying this to $\sqrt D+\lfloor\sqrt D\rfloor$
# will explain the palindromic part of a square-root period.
#
# ## 6. A small survey, and three proof tasks
#
# The following checks Galois's criterion across a family of surds.
# Extend the ranges only after explaining what the assertion says.

# %%
checked = 0
for D in [2, 3, 5, 7, 13]:
    K = QuadraticField(D, 'r')
    for P in range(-3, 5):
        for Q in range(1, 5):
            x = (P+K.gen())/Q
            assert is_reduced(x) == (continued_fraction(x).preperiod() == ())
            checked += 1
print("Exact Galois checks:", checked)

# %% [markdown]
# 1. Find two quadratic irrationals with the same periodic tail but
#    different prefixes. Display their conjugated period matrices.
# 2. Recover the unique reduced predecessor: given reduced $x$, show
#    that $a=\lfloor-1/x'\rfloor$ and $a+1/x$ form that predecessor.
#    Explain why uniqueness makes eventual repetition pure.
# 3. Prove that $\sqrt D$ itself is never reduced, whereas
#    $\sqrt D+\lfloor\sqrt D\rfloor$ always is. Carefully distinguish
#    the first digit of the shifted surd from that of $\sqrt D$.
#
# References: course Chapter 3; the [Sage continued-fraction reference](https://doc.sagemath.org/html/en/reference/diophantine_approximation/sage/rings/continued_fraction.html).
