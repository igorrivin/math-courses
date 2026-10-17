# Number theory midterm review

A cumulative review bank through the main route of finite-fields Lecture 2.
There are 16 core problems (160 practice points) and two optional enrichment
problems (20 additional points). Allow roughly 5–7 hours over several
sittings; this is not a timed mock midterm. Students write on separate paper.

- [Student handout](number_theory_midterm_review_student.pdf): five pages, without solutions.
- [Instructor edition](number_theory_midterm_review_instructor.pdf): seven pages, with worked solutions and subpart scores.
- `problem_set.tex`: shared editable source; `student.tex` and `instructor.tex` select the edition.

| Problems | Review topics |
| --- | --- |
| 1–2 | Euclid, Bézout, linear congruences, prime exponents, infinitely many primes in a residue class |
| 3–4 | Finite continued fractions, digit matrices, quadratic surds, Galois's criterion |
| 5–7 | CRT, zero divisors, Fermat, Wilson, orders, Euler, Lagrange |
| 8–9 | Multiplicative functions, divisor sums, Möbius inversion, exact-period necklaces |
| 10–12 | Factorial and binomial valuations, Chebyshev's scale, rational p-adic distance and convergence |
| 13–16 | Units, characteristic, finite domains, bases, exchange, prime-power sizes, an explicit 25-element field |
| Optional | Inclusion–exclusion as inversion; interpolation and a four-point finite Fourier transform |

The scope follows the earlier course assignments and the finite-fields
lecture cutoff. The final two problems retain the optional status of Problem
Set 4's enrichment. Core finite-field questions use the material on the main
routes of Lectures 1–2; general finite-field existence/uniqueness, cyclicity
of finite-field multiplication, GL/SL counts, Frobenius, and Fibonacci
periods are not required. The quadratic-extension example uses a new
prime and nonsquare, rather than repeating the lecture's arithmetic.

Each core problem has 10 points. Subparts are scored in the source and both
editions; accept alternative proofs and give credit for correct methods
after an earlier arithmetic error. Timing is an estimate.

Build from this directory, running each command twice:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_midterm_review_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_midterm_review_instructor instructor.tex
```

Run `python3 scripts/sync-assessments.py` from the repository root after
rebuilding. It copies the student PDF into public website assets and the
instructor edition into private assets. Synchronizing local files does not
publish the website.
