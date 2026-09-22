# Problem Set 3: Totients, divisor sums, and exact periods

An assignment on the new arithmetic-function material, with a review of
extended Euclid, Euler's theorem, and CRT. Preparation: course packet
Sections 5.3–5.9 and modular arithmetic from Chapter 4.

- 8 problems, 100 points, plus a 10-point optional challenge.
- Suggested time: 3–4 hours; solutions should be written on separate paper.
- Topics: prime-power formulas, units, multiplicative convolution, the totient
  divisor sum, inversion of tabulated data, `mu * mu`, binary necklaces, and
  squarefree counts. The challenge introduces the two-coordinate totient.
- No posets, complex numbers, or field extensions are required.

`problem_set.tex` contains the questions, point allocations, and worked
solutions. The wrappers select the edition; both use `../inversion-style.tex`.

From this directory, build with:

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=number_theory_problem_set_03_student student.tex
latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=number_theory_problem_set_03_instructor instructor.tex
```

The website publishes `number_theory_problem_set_03_student.pdf` in the
assessment library. `number_theory_problem_set_03_instructor.pdf` is copied
only into the website's private directory and served through instructor
authentication. After rebuilding, run `python3 scripts/sync-assessments.py`
from the repository root.
