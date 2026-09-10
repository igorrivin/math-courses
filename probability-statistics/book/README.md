# Chance, Data, and Decisions

This folder contains an adaptable one-semester introduction to probability and statistics.

## Contents

- `main.tex`: master LaTeX source.
- `chapters/`: course design, ten teaching chapters, selected solutions, and reference sheets.
- `notebooks/`: four optional Jupyter labs using standard Python scientific libraries.
- `chance_data_decisions.pdf`: compiled course packet.

## Compile

Run `latexmk -pdf main.tex` in this folder. The source uses standard TeX Live packages including TikZ, tcolorbox, amsmath, hyperref, and booktabs.

## Counting and probability-space revision

Chapters 1–2 now develop the multiplication principle, permutations,
combinations, repeated objects, Pascal's identity, and the binomial theorem.
They include proofs of finite-set and probabilistic inclusion–exclusion,
weighted finite spaces, and the exact birthday calculation with explicit
independence and uniformity assumptions. New exercises, selected answers,
and the reference sheets accompany the expanded exposition.

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
the capstone. The existing 14-week core and four notebooks are retained.
