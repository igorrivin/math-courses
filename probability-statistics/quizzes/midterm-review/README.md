# Probability midterm review quiz

A 50-minute, 50-point cumulative practice quiz through continuous
distributions, following Chapters 1–5 and the existing midterm study guide.
The duration and scoring follow the course's existing 50-minute class
quizzes. There is no separate midterm paper in this repository to match
question for question.

- [Student quiz](probability_midterm_review_quiz_student.pdf): five printable pages with writing space.
- [Instructor key](probability_midterm_review_quiz_instructor.pdf): five pages of worked answers and subpart grading guidance.
- `quiz.tex`: shared editable questions, answers, points, and writing-space heights.
- `student.tex` and `instructor.tex`: edition selectors.

| Problem | Topics | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Derangements by inclusion–exclusion; indicators; dependent cross terms in variance | 10 | 9 |
| 2 | Total probability, Bayes, conditional independence versus unconditional dependence | 10 | 8 |
| 3 | Binomial counts, geometric waits, coupon-collector stages | 10 | 9 |
| 4 | Poisson counts and unit conversion; exponential and uniform memorylessness; normal standardization | 10 | 9 |
| 5 | Density normalization, complete CDF, moments, variance, Chebyshev | 10 | 10 |
| Check work | | | 5 |
| **Total** | | **50** | **50** |

All problems are required; there is no challenge or optional choice. Exact
expressions are accepted, and no calculator or normal table is needed.
Standard distribution and moment formulas may be quoted. Geometric variables
count trials through the first success, and exponential parameters are rates.
The quiz does not prescribe the actual midterm's notes or formula-sheet
policy. Suggested times are estimates, not classroom-tested times.

This timed sample does not replace the broader [study guide](../../study-guides/midterm/).
Birthday probabilities, Markov's inequality, tail sums, and other topics in
that guide remain review material even though this quiz does not ask a
separate question on each. No joint-distribution tables, limit theorems,
estimation, or Bayesian parameter inference are assumed. Problem 1 uses the
indicator second-moment calculation from the expectation material, and
Problem 2 uses Bayes' rule for events.

Selected answers: `P(X=0)=3/8`, `E[X]=Var(X)=1` in Problem 1;
`P(D_1)=1/6`, `P(A | D_1)=1/2`, `P(D_2 | D_1)=3/16` in Problem 2;
mean collection time `11/2` in Problem 3; `1-2/e`, `exp(-3)`,
`Phi(3/2)-Phi(-1)`, and `1/2` in Problem 4;
density constant `1/2`, mean `4/3`, variance `2/9`, and Chebyshev bound
`1/2` in Problem 5. Do not distribute this README as a student handout.

Build from this directory, running each command twice:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_midterm_review_quiz_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_midterm_review_quiz_instructor instructor.tex
```

After rebuilding, run `python3 scripts/sync-assessments.py` from the repository
root. Only the student PDF goes into public website assets; the key remains
in private assets. This does not publish the website.
