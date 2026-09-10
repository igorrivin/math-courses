# Number theory: week 2

Eight core problems (100 points) and one optional challenge (10 points).
Suggested working time: 2-3 hours, excluding the challenge.

- `number_theory_week_02_student.pdf`: assignment with a sieve grid, no solutions.
- `number_theory_week_02_instructor.pdf`: the same assignment with worked solutions and suggested subpart scores.
- `problem_set.tex`: shared, editable problem and solution source.
- `student.tex` and `instructor.tex`: edition selectors.

The content follows the requested week-two coverage, independent of the older
14-week schedule in the course packet. It assumes elementary algebra, the
division algorithm, and familiarity with induction and short proofs. Continued
fractions are finite: no matrices, convergence theorem, or best-approximation
theorem is required. The assignment develops computation into proof and includes
counterexamples testing the hypotheses of divisibility statements.

To rebuild from this directory with a standard TeX installation:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_week_02_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_week_02_instructor instructor.tex
```

The student and instructor PDFs are local course materials; the solutions are
not placed in the website's public assets.
