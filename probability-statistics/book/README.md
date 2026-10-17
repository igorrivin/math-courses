# Chance, Data, and Decisions

This folder contains an adaptable one-semester introduction to probability and statistics.

## Contents

- `main.tex`: master LaTeX source.
- `chapters/`: course design, ten teaching chapters, selected solutions, and reference sheets.
- `notebooks/`: four Python labs and a SageMath exchangeability capstone.
- `chance_data_decisions.pdf`: compiled course packet.

## Compile

Run the following in this folder to rebuild both distributed copies:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
cp main.pdf chance_data_decisions.pdf
cp main.pdf ../website/public/course-packet.pdf
```

The source uses standard TeX Live packages including TikZ, tcolorbox,
amsmath, hyperref, and booktabs.
If `latexmk` is unavailable, run `pdflatex -interaction=nonstopmode
-halt-on-error main.tex` three times before copying the PDFs.

## Elementary foundations and calculus refresher

Chapter 1 develops addition and multiplication, permutations, combinations,
selections with repetition, repeated-letter arrangements, Pascal's identity,
the binomial theorem, and inclusion–exclusion. Chapter 2 builds probability
spaces from outcomes, events, and weights, then gives full counting proofs
for birthdays and derangements. It uses elementary event descriptions
without a formal sigma-algebra introduction.

Chapter 4 explains random variables as numerical records, explicitly turns
conditions such as `X >= a` into events, and develops PMFs, CDFs,
expectation, variance, and indicators through coins, dice, payoffs, hats,
and birthdays. Its main route uses finite sums throughout: grouping outcome
weights, linearity, expectations of functions, variance identities, independent
sums and averages, and bounds. It has 18 core discrete exercises, two later
continuous exercises, and five further linearity exercises, all with worked
solutions. Its indicator section now develops records, inversions, spaghetti
loops, and random cuts. The spaghetti model is uniform matching of all free
ends, with a diagram distinguishing chain joins from loop closures.
Countably infinite examples,
densities, and moment-generating functions are separated as later material.

Chapter 5 develops the next distribution examples from their experiments:
discrete uniform, Bernoulli, binomial, and hypergeometric, with derivations of
probabilities, means, and variances. Geometric and Poisson laws follow as
countably infinite models. The coupon collector connects their ideas:
independent geometric stages give the mean `n H_n` and variance, while
missing-type indicators, a tail bound, and inclusion-exclusion answer
deadline questions. Unequal coupon probabilities have exact tail, mean,
and second-moment formulas, a positive recursion over missing sets,
rare-type bounds, and worked examples. A zero-probability required type is
handled separately as impossible to collect.

Chapter 5's new distribution-provenance section derives negative-binomial
success waits, exponential waiting times and their geometric scaling limit,
integer-shape gamma arrival times, beta order statistics, and a normal
approximation with continuity correction. Model assumptions, supports,
rate conventions, and exact-versus-approximate answers are explicit.
These additional families are enrichment; existing section destinations and
Exercises 1–17 retain their numbering.

A dedicated Poissonization section proves independent type counts for
arbitrary positive probabilities, conditions back to a multinomial total,
and treats occupancy and load limits. Independent exponential clocks give
a second coupon-collector proof and show that uniform probabilities minimize
the mean collection time. The clock and draw counts have equal means but
different variances, with the exact correction derived. De-Poissonization
bounds carry explicit Poisson-tail errors, and an optional completion-window
limit includes its transfer back to fixed draws. Chapter 5 has 27 exercises
with worked solutions (14 original discrete, three original continuous,
and ten additional mechanism/Poissonization exercises).

New editable topic inputs are `chapters/linearity_examples.tex`,
`chapters/unequal_coupon_collection.tex`,
`chapters/distribution_provenance.tex`, and `chapters/poissonization.tex`.
They are included by Chapters 4–5; answers remain in `chapters/solutions.tex`.
Exact small-case verification is available from the repository root with
`python3 scripts/check-probability-enrichment.py` (standard library only).

Appendix A, `chapters/calculus_refresher.tex`, is a substantial review of
algebra and finite sums, limits, derivatives, likelihood optimization,
definite and improper integrals, substitution, integration by parts, series,
and Taylor remainders. Applications derive and bound the birthday
approximation, prove the derangement limit and nearest-integer formula,
and optionally normalize an integer-parameter beta density. It contains
18 practice problems with worked answers. The reference sheets and course
guide link the refresher to the main chapters.

The website at https://introproba.dimensionreducers.ai has companion counting,
inclusion–exclusion, and birthday labs. Problem Set 2 is maintained separately
in `../problem-sets/problem-set-02/`. Its instructor
edition and shared source contain answers and should not be public website
assets.

## Suggested variants

Chapter 10 is an optional exchangeability capstone following Bayesian inference.

- **Probability emphasis:** teach Chapters 1-7 deeply and use Chapters 8-9 as a brief finale.
- **Statistics emphasis:** compress counting and standard distributions, then expand sampling, estimation, testing, and Bayesian comparison.
- **No-calculus version:** treat densities and continuous expectation geometrically and computationally.
- **Student edition:** remove the solutions chapter from `main.tex` before compiling.

## Exchangeability capstone

Chapter 10, “Exchangeability: when symmetry produces a parameter,” develops
the Bernoulli form of de Finetti's theorem through a shared hidden coin,
Pólya's urn, random limiting frequencies, and finite exchangeable
counterexamples. It includes nine exercises with worked solutions and a
brief real-valued outlook.

The optional proof connects sampling with and without replacement to the
birthday-collision bound. It explicitly states its compactness input,
proves uniqueness of the mixing law, and supplies the Bernoulli strong
law needed for the almost-sure interpretation. Chapter 3 has a short
preview; Chapter 9, the course guide, and the reference sheets cross-link
the capstone. The existing 14-week core, four Python notebooks, and
SageMath capstone are retained.
