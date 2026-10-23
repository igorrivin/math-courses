# Probability Midterm 1

50 minutes; six required problems; 100 points. The student paper has
writing space, and the instructor key contains worked solutions and
subpart grading guidance. Each edition is designed for four US Letter pages.

## Files

- `probability_midterm_01_student.pdf`: print and distribute to students.
- `probability_midterm_01_instructor.pdf`: instructor solutions and grading key.
- `exam.tex`: shared questions, solutions, points, and writing-space heights.
- `student.tex` and `instructor.tex`: select the edition.
- `Makefile`: build both PDFs and remove build intermediates.

**Instructor material:** this README, the shared source, and the instructor
PDF contain answers. Distribute only the student PDF to students. The full
ZIP bundle is intended for the instructor. No website publication or
assessment synchronization is part of this bundle.

## Coverage and pacing

| Problem | Topic | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Set operations; counterexample to a containment implication | 10 | 5 |
| 2 | Finite probability-space normalization and event probabilities | 10 | 5 |
| 3 | Three-set inclusion-exclusion and a complement | 15 | 6 |
| 4 | Sampling without replacement; binomial coefficients; complement | 20 | 8 |
| 5 | Normalize a polynomial density; mean, second moment, variance | 25 | 10 |
| 6 | Guided collection of four equally likely types; geometric means; linearity | 20 | 9 |
| Check work | | | 7 |
| **Total** | | **100** | **50** |

Times are estimates, not classroom-tested timings. Exact answers and
unevaluated binomial coefficients are accepted. No calculator is needed.
The paper supplies the geometric mean formula and its counting convention.
It does not prescribe a notes, textbook, or formula-sheet policy; set that
policy before administering the exam.

## Build

Requires a LaTeX installation with `pdflatex` and the standard packages
listed in `exam.tex` (for example, TeX Live or MacTeX).

From this directory:

```sh
make
```

Without `make`, run each command twice so page totals resolve:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_midterm_01_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_midterm_01_instructor instructor.tex
```

Run `make clean` to remove intermediates while keeping both PDFs.

## Instructor checks

1. Intersections/differences: `{2,4}`, `{6,8,10}`, `{5,7,9}`. A counterexample
   to the implication is `C={1,6}`.
2. `k=1/10`; event probabilities `2/5`, `3/10`, `3/5`.
3. 32 study at least one language; 8 study none.
4. `choose(5,2) choose(4,1) choose(3,1) / choose(12,4) = 8/33`;
   `1 - choose(9,4) / choose(12,4) = 41/55`.
5. `c=4`, `E[X]=4/5`, `E[X^2]=2/3`, `Var(X)=2/75`.
6. Success probabilities `1, 3/4, 1/2, 1/4`; stage means `1, 4/3, 2, 4`;
   total expected collection time `25/3` boxes.

Award method credit consistently after an earlier error. The detailed
allocation for every subpart is in the instructor PDF.
