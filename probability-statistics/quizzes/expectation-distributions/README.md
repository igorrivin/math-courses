# Expectation, variance, and discrete distributions: class quiz

A standalone 50-minute quiz worth 50 points, aligned with the discrete
random-variable material in Chapter 4 and the Bernoulli, binomial, and
geometric sections of Chapter 5. Students work with a finite probability
space and a countably infinite geometric distribution. No calculus is needed.

- `expectation_distributions_quiz_student.pdf`: four-page printable student quiz with writing space.
- `expectation_distributions_quiz_instructor.pdf`: four-page worked key with partial-credit guidance.
- `quiz.tex`: shared editable questions, solutions, point values, and writing-space heights.
- `student.tex` / `instructor.tex`: edition selectors.

| Problem | Content | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Normalize outcome weights; group a PMF; expectation, second moment, variance; affine transformation | 14 | 13 |
| 2 | Bernoulli moments from definitions; dependent complementary indicators | 10 | 9 |
| 3 | Binomial assumptions, exact and complement probabilities, mean and variance | 12 | 11 |
| 4 | Geometric PMF and normalization, tails, moments, failures versus trials, memorylessness | 14 | 13 |
| Check answers | | | 4 |
| **Total** | | **50** | **50** |

The timing is an estimate for students who have practiced these topics.
Each problem starts on a fresh page. All four problems are required; there
is no extra challenge beyond the time budget.

No calculator is needed. Exact expressions with powers and binomial
coefficients are accepted, so arithmetic simplification is not the focus.
Students may quote the binomial and geometric moment formulas, but must
calculate Bernoulli moments from the two-point distribution. They should
know the geometric-series identity. The handout leaves the notes/books
policy to the instructor.

The geometric convention is explicit throughout: `T` counts trials through
the first success and has support `1, 2, ...`; `F = T - 1` counts failures.
The indicator problem distinguishes linearity of expectation from variance
addition without requiring covariance notation.

For grading, follow the subpart allocations and award method credit for
consistent use of an earlier result. Do not deduct repeatedly for the same
arithmetic error. Equivalent direct calculations earn full credit.

Build from this directory with a standard TeX installation. Run each command
twice to resolve the page counts:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=expectation_distributions_quiz_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=expectation_distributions_quiz_instructor instructor.tex
```

Only the student PDF is intended for class distribution. The instructor
edition and shared source contain answers.
