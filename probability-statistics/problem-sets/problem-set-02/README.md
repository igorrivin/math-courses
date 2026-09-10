# Probability Problem Set 2

Counting, events, and shared birthdays: eight core problems (100 points),
plus a 10-point optional inclusion-exclusion challenge. Allow approximately
three hours, excluding the challenge.

The assignment reviews the probability spaces from week two and covers
permutations, repeated letters, combinations, binomial identities, finite-set
and probabilistic inclusion-exclusion, and the birthday paradox. A calculator
or short program is allowed for the 22/23-person birthday calculations.

- `probability_problem_set_02_student.pdf`: student handout.
- `probability_problem_set_02_instructor.pdf`: worked solutions and point values.
- `problem_set.tex`: shared editable source.
- `student.tex` / `instructor.tex`: edition selectors.

Build from this directory with a standard TeX installation:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_02_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_02_instructor instructor.tex
```

Only the student PDF is intended for the public course website. The instructor
edition and the shared source (which includes solutions) are separate teaching
materials.
