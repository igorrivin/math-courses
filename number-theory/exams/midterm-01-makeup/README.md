# Number Theory makeup midterm

50 minutes; six required problems; 100 points. Both editions have four US Letter
pages. Student papers include writing space; instructor keys include worked
solutions, subpart scores, and guidance for carrying forward earlier errors.

Based on the existing `../../problem-sets/midterm-review/problem_set.tex`,
as requested. It selects variants of review Problems 1, 3, 5, 7, 8, 9, 10,
12, and 16. No original number-theory midterm was present in this checkout,
so equivalence to its precise coverage or difficulty has not been checked.
The finite-field scope stays within the review bank (through Lecture 2).

## Files and handling

- `number_theory_midterm_01_makeup_student.pdf`: student paper to print.
- `number_theory_midterm_01_makeup_instructor.pdf`: private worked key.
- `exam.tex`: shared questions and answers; instructor material.
- `student.tex`, `instructor.tex`: edition selectors.
- `Makefile`: builds both PDFs (two passes per edition).

Distribute only the student PDF. These exams are deliberately absent from the
website assessment catalog; do not publish or synchronize an upcoming exam.
No notes, textbook, or formula-sheet policy is imposed; set that policy before
administration. No calculator is needed. Timings below are estimates, not
classroom-tested completion times.

## Coverage and pacing

| Problem | Topic | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Euclid, Bezout, linear congruence | 15 | 7 |
| 2 | Continued fractions, digit matrices, inverse | 15 | 7 |
| 3 | CRT, multiplicative order, powers | 15 | 7 |
| 4 | Arithmetic functions and Mobius inversion | 15 | 7 |
| 5 | Factorial valuation and rational 5-adic limit | 15 | 6 |
| 6 | Explicit quadratic field over F_7 | 25 | 10 |
| Check work | | | 6 |
| **Total** | | **100** | **50** |

## Build

Run `make` in this directory with the same LaTeX installation used for the
original probability midterm. Run `make clean` to remove intermediates while
keeping the named PDFs.

## Instructor answer checks

1. Gcd 3; `3=7*84-3*195`; congruence classes `14,79,144` modulo 195.
2. `[2;3,6,3]`; convergents `2/1,7/3,44/19,139/60`;
   matrix rows `(139,44),(60,19)`; inverse `95` modulo 139.
3. `x=32 mod 35`; order of 3 modulo 7 is 6; `3^100=4 mod 7`.
4. `180=2^2*3^2*5`; divisor count 18; totient 48; Mobius value 0;
   inversion gives `f(12)=4`.
5. `v_3(30!)=14`; norms/distances `1/125`, `1/5`; limit `-1/4`,
   with distance `5^(-(n+1))`.
6. Squares `0,1,2,4`; product 5; inverse `3+4s`; basis `1,s`;
   size 49, characteristic 7. Every nonzero formal pair has an inverse.

The numerical answers were independently checked with exact arithmetic and/or
exhaustive finite enumeration. Both editions were compiled without LaTeX
warnings or overfull boxes and all pages were rendered and visually inspected.
These checks do not establish classroom pacing or equivalence to an unseen exam.
