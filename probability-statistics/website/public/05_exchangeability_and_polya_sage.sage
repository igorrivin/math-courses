# %% [markdown]
# # Lab 5: Exchangeability, Pólya's urn, and random limits
#
# Use the **SageMath kernel**, not the Python kernel used by Labs 1–4.
# Run the cells in order. This lab accompanies the optional Chapter 10
# and connects its finite-sampling proof to the birthday bound.
# The matching script runs with `sage 05_exchangeability_and_polya_sage.sage`.
#
# Exact rational calculations come first; seeded simulations follow.
# Equality in a finite table illustrates a theorem but does not prove the
# corresponding statement for all lengths or for infinite sequences.

# %%
from itertools import product
import random

biases = [QQ(1)/4, QQ(3)/4]
weights = [QQ(1)/2, QQ(1)/2]

def mixture_word(word, biases=biases, weights=weights):
    s, n = sum(word), len(word)
    return sum(w*p^s*(1-p)^(n-s) for p, w in zip(biases, weights))

words = list(product([0, 1], repeat=4))
assert sum(mixture_word(word) for word in words) == 1
assert mixture_word([1, 1, 1, 0]) == mixture_word([1, 0, 1, 1])
print(table([(word, mixture_word(word)) for word in words],
            header_row=["Ordered word", "Shared-coin probability"]))

# %% [markdown]
# ## 1. One shared coin, or a fresh coin each time?
#
# Selecting a bias once and sharing it across a run creates dependence.
# Selecting an independent fresh bias before each toss gives fair i.i.d.
# bits in this example. Both models have the same one-toss marginal.

# %%
mean = sum(w*p for p, w in zip(biases, weights))
second = sum(w*p^2 for p, w in zip(biases, weights))
covariance = second-mean^2
assert mean == 1/2 and covariance == 1/16
assert mixture_word([1, 1]) == 5/16
fresh_HH = mean^2
assert fresh_HH == 1/4
print("Shared bias: P(HH) =", mixture_word([1, 1]), "Cov =", covariance)
print("Fresh bias:  P(HH) =", fresh_HH, "Cov = 0")

def posterior_and_prediction(s, n):
    likelihoods = [w*p^s*(1-p)^(n-s) for p, w in zip(biases, weights)]
    posterior = [w/sum(likelihoods) for w in likelihoods]
    predictive = sum(w*p for p, w in zip(biases, posterior))
    return posterior, predictive

assert posterior_and_prediction(2, 2) == ([1/10, 9/10], 7/10)
assert posterior_and_prediction(1, 2) == ([1/2, 1/2], 1/2)
print("After HH:", posterior_and_prediction(2, 2))
print("After HT (or TH):", posterior_and_prediction(1, 2))

# %% [markdown]
# **Prove.** Factor the fresh-bias word probability into one-toss
# marginals. Identify why this factorization fails for one shared bias.
# Derive the posterior odds $3^{2s-n}$ for the two-coin example.
#
# ## 2. Reinforcement and a beta mixture give the same word law
#
# An urn starts with $a$ red and $b$ blue balls. Replace each drawn ball
# and add one of the same color. The product along a word depends only
# on its number of reds, although the factors occur in different orders.

# %%
def urn_word(word, a=1, b=1):
    a, b, probability = ZZ(a), ZZ(b), QQ(1)
    for bit in word:
        probability *= QQ(a if bit else b)/(a+b)
        a, b = a+bit, b+1-bit
    return probability

P = PolynomialRing(QQ, 'p')
p = P.gen()

def beta_integral(a, b):
    # Positive integer parameters suffice for the physical urn.
    primitive = (p^(a-1)*(1-p)^(b-1)).integral()
    return primitive(1)-primitive(0)

def beta_word(s, n, a=1, b=1):
    return beta_integral(a+s, b+n-s)/beta_integral(a, b)

assert urn_word([1, 1, 1, 0]) == urn_word([1, 0, 1, 1]) == 1/20
for a, b in [(1, 1), (2, 3), (4, 2)]:
    for word in product([0, 1], repeat=6):
        assert urn_word(word, a, b) == beta_word(sum(word), len(word), a, b)
print("Every length-six word agrees with its beta-mixture integral.")

# %% [markdown]
# **Prove for arbitrary length.** Group the red and blue numerators in
# the urn product to obtain
# $a^{\overline{s}}b^{\overline{n-s}}/(a+b)^{\overline n}$.
# Evaluate the beta integral by integration by parts. Specify why the
# factors are rising factorials, unlike sampling without replacement.
#
# ## 3. A word probability is not a count probability
#
# Multiply by $\binom ns$ to get the law of the number of reds. With
# one red and one blue initially, the count is uniform on $0,\ldots,n$.
# Compare with the binomial law for independent fair tosses.

# %%
n = 12
fair = [binomial(n, s)/2^n for s in range(n+1)]
shared = [binomial(n, s)*mixture_word([1]*s+[0]*(n-s)) for s in range(n+1)]
urn = [binomial(n, s)*beta_word(s, n) for s in range(n+1)]
assert sum(fair) == sum(shared) == sum(urn) == 1
assert all(probability == 1/(n+1) for probability in urn)
comparison = graphics_array([
    bar_chart(fair, color='#5064a2', title='Independent fair tosses'),
    bar_chart(shared, color='#c47a37', title='One shared bias: 1/4 or 3/4'),
    bar_chart(urn, color='#278679', title='Pólya urn: uniform mixing'),
], nrows=1)
comparison

# %% [markdown]
# ## 4. Sampling noise shrinks; variation between runs persists
#
# For conditionally i.i.d. Bernoulli trials,
# $\operatorname{Cov}(X_i,X_j)=\operatorname{Var}(\Theta)$ and
# $\operatorname{Var}(S_n/n)=E[\Theta(1-\Theta)]/n+\operatorname{Var}(\Theta)$.
# Compute the variance from the complete count distribution as an
# independent check of that decomposition.

# %%
def variance_of_frequency(probabilities):
    n = len(probabilities)-1
    mean = sum(QQ(s)/n*w for s, w in enumerate(probabilities))
    return sum((QQ(s)/n-mean)^2*w for s, w in enumerate(probabilities))

assert variance_of_frequency(fair) == 1/(4*n)
assert variance_of_frequency(shared) == 3/(16*n)+1/16
assert variance_of_frequency(urn) == 1/(6*n)+1/12
print(table([(n, 1/(4*n), 3/(16*n)+1/16, 1/(6*n)+1/12)
             for n in [10, 100, 1000]],
            header_row=["n", "Fair variance", "Shared-coin variance", "Urn variance"]))

# %% [markdown]
# **Predict before simulating.** Across many independent runs, where
# should the final red frequencies lie in each model? How does this
# differ from following just one long run? The following experiment
# uses a fixed seed for reproducibility. Change `draws` to 5000 for
# the experiment proposed in the book.

# %%
rng = random.Random(int(20260910))
draws, runs = 2000, 100

def simulate_run(model, draws):
    reds = 0
    bias_quarters = rng.choice([1, 3]) if model == 'shared' else 2
    trace = []
    for j in range(draws):
        bit = (rng.randrange(j+2) < reds+1 if model == 'urn'
               else rng.randrange(4) < bias_quarters)
        reds += int(bit)
        trace.append(float(reds)/float(j+1))
    return trace

simulations = {model: [simulate_run(model, draws) for _ in range(runs)]
               for model in ['fair', 'shared', 'urn']}
assert all(0 <= path[-1] <= 1 for paths in simulations.values() for path in paths)
histograms = graphics_array([
    histogram([path[-1] for path in simulations[model]], bins=[j/20 for j in range(21)],
              title=title, color=color)
    for model, title, color in [('fair', 'Independent fair tosses', '#5064a2'),
                                ('shared', 'Shared coin', '#c47a37'),
                                ('urn', 'Pólya urn', '#278679')]
], nrows=1)
histograms

# %%
trajectories = sum(list_plot(list(enumerate(path, start=1)), plotjoined=True,
                             color=color, alpha=0.8)
                   for path, color in zip(simulations['urn'][:5],
                                          ['#278679', '#5064a2', '#c47a37', '#b45368', '#77649c']))
trajectories.axes_labels(['draw', 'red frequency'])
trajectories

# %% [markdown]
# ## 5. Finite exchangeability can have negative covariance
#
# An always-disagreeing pair is exchangeable but cannot be extended to
# an exchangeable triple. More generally, sampling without replacement
# from $M$ red and $N-M$ blue balls gives covariance
# $-p(1-p)/(N-1)$, where $p=M/N$.

# %%
N, M = 20, 8
p_red = QQ(M)/N
p_two_red = QQ(M*(M-1))/(N*(N-1))
assert p_two_red-p_red^2 == -p_red*(1-p_red)/(N-1) < 0
assert QQ(0)-QQ(1)/4 == -1/4  # the always-disagreeing pair
print("Without-replacement covariance:", p_two_red-p_red^2)

# %% [markdown]
# **Prove the obstruction.** An infinite Bernoulli mixture has
# nonnegative pairwise covariance. Give a second proof for the
# always-disagreeing pair: can all three pairs of three bits disagree?
#
# ## 6. The finite bridge and the birthday collision bound
#
# Conditional on its total, a finite exchangeable binary vector is a
# uniformly shuffled population. Compare its first $n$ draws with
# draws made with replacement. Total variation is half the sum of the
# absolute differences of the count probabilities: within each count
# both models assign equal probabilities to all ordered words, so this
# also equals total variation for the ordered color strings.

# %%
def sampling_comparison(N, M, n):
    if not (0 <= M <= N and 1 <= n <= N):
        raise ValueError("Require 0 <= M <= N and 1 <= n <= N.")
    p = QQ(M)/N
    without = [binomial(M, s)*binomial(N-M, n-s)/binomial(N, n) for s in range(n+1)]
    with_replacement = [binomial(n, s)*p^s*(1-p)^(n-s) for s in range(n+1)]
    tv = sum(abs(a-b) for a, b in zip(without, with_replacement))/2
    collision = 1-prod(QQ(N-j)/N for j in range(n))
    bound = min(QQ(1), QQ(binomial(n, 2))/N)
    assert sum(without) == sum(with_replacement) == 1
    assert tv <= collision <= bound
    return tv, collision, bound

for N, M, n in [(10, 4, 3), (100, 40, 5), (1000, 400, 5), (1000, 400, 100)]:
    tv, collision, bound = sampling_comparison(N, M, n)
    print("N, M, n =", (N, M, n), "TV ≈", RR(tv),
          "collision ≈", RR(collision), "union bound =", bound)
assert sampling_comparison(1000, 400, 5)[2] == 1/100

# %% [markdown]
# **Finish the proof outline.** Explain how the coupling bounds the
# error for **any event**, not just one word. For a fixed prefix length
# $n$, why does the bound tend to zero as the population length $N$
# increases? State the compactness input still needed to construct the
# mixing measure. A finite computation cannot supply that analytic step.
#
# ## Further investigations
#
# 1. Derive the Beta$(a+s,b+n-s)$ posterior and its predictive mean.
# 2. Prove that pairwise independence of an **infinite exchangeable**
#    Bernoulli sequence implies full independence.
# 3. Use Bernstein polynomials to connect the law of $S_n/n$ with
#    uniqueness of the mixing measure, following the book's proof.
#
# References: course Chapter 10; Werner Kirsch,
# [An elementary proof of de Finetti's Theorem](https://arxiv.org/abs/1809.00882);
# Diaconis and Freedman, [Finite Exchangeable Sequences](https://doi.org/10.1214/aop/1176994663).
