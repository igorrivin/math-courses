# Multiplicative functions: problem set

Eight core problems (100 points) and one optional challenge (10 points).
Suggested working time: 2–3 hours, excluding the challenge. Solutions are
written on separate paper.

This is a focused assignment on multiplicative functions, following the
course packet's section “Multiplicative functions: work one prime at a time.”
It assumes unique factorization, gcds, finite sums, and inclusion–exclusion.
The definitions of multiplicativity, convolution, the Möbius function, and
the sign function lambda are included. Full Möbius inversion is not assumed;
convolution associativity and commutativity are granted where needed.

| Problem | Content | Points |
| --- | --- | ---: |
| 1 | Prime-power data; freedom at unspecified powers; complete multiplicativity | 10 |
| 2 | Pointwise products, quotients, sums, and normalized sums | 10 |
| 3 | Divisor-count and divisor-sum formulas; odd divisor counts | 14 |
| 4 | Totients by inclusion–exclusion; multiplicativity and parity | 14 |
| 5 | Divisor decomposition; multiplicativity of Dirichlet convolution | 14 |
| 6 | Möbius cancellation and two convolution identities | 14 |
| 7 | A completely multiplicative sign function whose divisor sum detects squares | 12 |
| 8 | A gcd sum as the convolution of identity and totient | 12 |
| Challenge | Characterization of even perfect numbers, with hints | 10 extra |

Problems progress from calculations and counterexamples to short proofs and
applications. The core has no CRT, Euler-theorem, necklace, or analytic
number-theory prerequisites. The optional challenge uses only the divisor-sum
formula and elementary divisibility.

- `number_theory_multiplicative_functions_student.pdf`: three-page student assignment.
- `number_theory_multiplicative_functions_instructor.pdf`: seven-page worked solutions with grading guidance.
- `problem_set.tex`: shared editable questions, solutions, and point allocations.
- `student.tex` / `instructor.tex`: edition selectors.
- `../inversion-style.tex`: shared handout style.

Selected numerical answers: Problem 1(a): `1, -5, 8, 20, 0`;
`tau(540) = 24`, `sigma(540) = 1680`, `phi(540) = 144`;
Problem 7(c): `0, 1`; `G(60) = 360`;
the first three perfect-number examples requested are `6, 28, 496`.

Award credit for equivalent proofs and correct methods after an earlier
arithmetic error. Students may use results from earlier problems even if
they have not proved those results. Definitions include the value at 1;
coprimality must be checked when using ordinary multiplicativity.

To rebuild from this directory with a standard TeX installation, run each
command twice:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_multiplicative_functions_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=number_theory_multiplicative_functions_instructor instructor.tex
```

After rebuilding, run `python3 scripts/sync-assessments.py` from the repository
root to update the local assessment catalog and PDF copies. Only the student
PDF belongs in the website's public assets; the instructor PDF and shared
source contain solutions.
