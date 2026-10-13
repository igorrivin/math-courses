# Valuations, primes, and p-adic distance

Seven core problems (100 points) and one optional geometry challenge
(10 extra points). Suggested working time: 3–4 hours. Students write
solutions on separate paper.

Designed to follow the lecture on Chebyshev's order-of-growth estimate for
pi(x), including factorial and binomial valuations (course packet Chapters
7–8). The introduction to p-adic analysis takes place entirely on the
rational numbers; no metric-space background or construction of Q_p is
required. Definitions of a metric, convergence, and the Cauchy condition
are supplied in the relevant problems. The prime-product upper bound from
lecture is granted in Problem 3.

| Problem | Content | Points |
| --- | --- | ---: |
| 1 | Legendre's formula, numerical valuations, prime-power factorials | 12 |
| 2 | Central binomial valuations and divisibility by an lcm | 16 |
| 3 | The binomial squeeze and both Chebyshev growth bounds | 16 |
| 4 | Rational valuations and the inequality for sums | 14 |
| 5 | The p-adic absolute value, ultrametric inequality, and metric axioms | 14 |
| 6 | Congruences as closeness and concrete distance computations | 12 |
| 7 | Factorials, geometric sums, a Cauchy sequence, and unique limits | 16 |
| Challenge | Isosceles triangles, ball centers, and nested balls | 10 extra |

The student PDF contains only the assignment; the instructor PDF includes
worked solutions and grading guidance. Both use the shared handout style
in `../inversion-style.tex`.

- `number_theory_valuations_and_p_adics_student.pdf`: three-page student handout.
- `number_theory_valuations_and_p_adics_instructor.pdf`: five-page worked solutions.
- `problem_set.tex`: editable questions, points, and solutions.
- `student.tex` / `instructor.tex`: edition selectors.

To rebuild from this directory, run each command twice:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_valuations_and_p_adics_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_valuations_and_p_adics_instructor instructor.tex
```

After rebuilding, run `python3 scripts/sync-assessments.py` from the repository
root to refresh the local assessment catalog and PDF copies. Only the student
PDF belongs in the website's public assets; the instructor edition and shared
source contain solutions.
