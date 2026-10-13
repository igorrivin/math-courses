# Number theory: week 3

Eight core problems (100 points) and one optional challenge (10 points).
Suggested working time: 2-3 hours, excluding the challenge.

- `number_theory_week_03_student.pdf`: assignment, no solutions.
- `number_theory_week_03_instructor.pdf`: the same assignment with worked solutions and suggested subpart scores.
- `problem_set.tex`: shared, editable problem and solution source.
- `student.tex` and `instructor.tex`: edition selectors.

Coverage: congruences and modular inverses (Problems 1-3, ending with Wilson's
theorem by inverse pairing), Fermat's little theorem (Problems 4-5, including
the pseudoprime 341), and continued fractions of quadratic surds (Problems 6-8
and the challenge). The modular problems do not assume the Chinese remainder
theorem, Euler's theorem, or orders of elements. The continued-fraction
problems assume the second continued-fraction lecture: the integer-state
recurrence for `(P_n, Q_n)`, Galois's pure-periodicity criterion, and the
period-reversal corollary, all restated on the first page. The worked examples
avoid the surds already used in lecture and the book (sqrt 2, sqrt 3, sqrt 6,
the golden ratio); the challenge proves that the period of sqrt D is a
palindrome followed by `2 a_0`.

To rebuild from this directory with a standard TeX installation:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_week_03_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_week_03_instructor instructor.tex
```

The student and instructor PDFs are local course materials; the solutions are
not placed in the website's public assets.
