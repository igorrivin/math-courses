# Probability Problem Set 3

Counting, collisions, and derangements: nine core problems (100 points),
plus a 10-point optional Secret Santa challenge. Allow approximately three
and a half hours, excluding the challenge.

The assignment consolidates the last two weeks: discrete probability spaces
(including a countably infinite one), permutations and combinations, the
birthday paradox, and the hat-check (derangement) problem. It deliberately
goes one step past Problem Set 2 and the birthdays-and-derangements quiz
rather than repeating them. A calculator or short program is allowed for
Problems 3, 6, and 7.

| Problem | Content | Points |
| --- | --- | ---: |
| 1 | Geometric space on $\{1,2,\ldots\}$; no uniform measure on a countable set | 10 |
| 2 | Maximum of two dice; $1+3+\cdots+(2n-1)=n^2$; unequal masses | 10 |
| 3 | Poker hands: full house, one pair, the two-pair overcount | 12 |
| 4 | Random arrangements of MISSISSIPPI; gap method; two ways to count | 12 |
| 5 | Hypergeometric committees; Vandermonde's identity | 10 |
| 6 | Birthday bounds: $1-x\le e^{-x}$ and the union bound, $d=10^4$ PINs | 12 |
| 7 | Collision patterns for four people; exactly one shared pair | 12 |
| 8 | $D_n=(n-1)(D_{n-1}+D_{n-2})$; $D_n$ is the nearest integer to $n!/e$ | 10 |
| 9 | Exactly $k$ correct hats; limit $e^{-1}/k!$; average number is 1 | 12 |
| Challenge | Secret Santa: uniform derangements by redrawing; reciprocation | 10 extra |

Answers worth knowing at a glance: 1(b) $1/3$, $1/7$, $2^{-n}$; 2(c) $7/12$;
3 $6/4165$, $352/833$, $198/4165$; 4 $34{,}650$ words, $7/33$, $13/55$;
5 $60/143$, $87/91$; 6(d) threshold $n=119$ (exact collision probability
$0.4999$ at $n=118$, $0.5058$ at $n=119$); 7(a) $11880, 7920, 396, 528, 12$;
7(c) $0.4927$, $0.3634$, $0.1439$; 8(b) $D_2,\ldots,D_6=1,2,9,44,265$;
9(b) $44,45,20,10,0,1$; challenge $6859/27000$, $9/265$, $1/(n-1)$, $9/53$.
All numerical answers were checked by exact computation or brute-force
enumeration.

- `probability_problem_set_03_student.pdf`: student handout (four pages, one topic per page).
- `probability_problem_set_03_instructor.pdf`: worked solutions and point values.
- `problem_set.tex`: shared editable source.
- `student.tex` / `instructor.tex`: edition selectors.

Build from this directory with a standard TeX installation:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_03_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_03_instructor instructor.tex
```

Only the student PDF is intended for distribution. The instructor edition
and the shared source (which includes solutions) are separate teaching
materials and must not be placed under the website's `public/` folder.
