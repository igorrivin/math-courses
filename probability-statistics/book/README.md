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
sums and averages, and bounds. It has 18 discrete exercises and two later
continuous exercises, all with worked solutions. Countably infinite examples,
densities, and moment-generating functions are separated as later material.

Chapter 5 develops the next distribution examples from their experiments:
discrete uniform, Bernoulli, binomial, and hypergeometric, with derivations of
probabilities, means, and variances. Geometric and Poisson laws follow as
countably infinite models; continuous families are marked for later.
Its ten discrete and three continuous exercises have worked solutions.

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
