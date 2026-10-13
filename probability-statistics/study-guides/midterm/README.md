# Probability midterm study guide

An eight-page student guide to everything through continuous distributions,
aligned with Chapters 1–5 of *Chance, Data, and Decisions*. It includes
counting and event algebra, probability spaces, birthdays and derangements,
conditioning and Bayes' rule, independence, random variables and CDFs,
expectation and variance, indicators and bounds, discrete distributions,
coupon collection, densities, and uniform, exponential, and normal laws.
It also briefly recalls the book's optional Poissonization argument and
beta density shape without requiring later inference machinery.

- `probability_midterm_study_guide.pdf`: ready-to-distribute guide, including
  ten mixed practice questions and their answers on the final page.
- `study_guide.tex`: editable source.

The guide includes a skills checklist, a review sequence, distribution
reference tables, common mistakes, and the signed tail-integral identity.
It does not invent an exam date, length, calculator policy, or allowed
formula sheet. Later joint-distribution, limit-theorem, and inference units
are outside its scope. The unequal-coupon challenge and infinite-mean
prize in [Problem Set 4](../../problem-sets/problem-set-04/) are marked as
guided enrichment.

Build from this directory, running the command twice for PDF bookmarks:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_midterm_study_guide study_guide.tex
```

The practice answers are deliberately included for self-study; this guide
is student-facing. It is maintained here independently of the scored
assessment catalog. Its creation does not publish the live course website.
