# Probability Problem Set 4

Discrete and continuous distributions, tail areas, and coupon collection:
eight core problems (100 points), plus a 10-point unequal-coupon challenge.
Allow about four hours, excluding the challenge. The student handout has
four pages; the instructor edition has six pages of questions and worked
solutions. The companion [midterm study guide](../../study-guides/midterm/)
reviews the cumulative material through continuous distributions.

| Problem | Content | Points |
| --- | --- | ---: |
| 1 | Bernoulli, binomial, hypergeometric, and geometric mechanisms | 12 |
| 2 | Poisson approximation, factorial moments, and geometric tails | 10 |
| 3 | Partial coupon collection, stage independence, and remaining waits | 14 |
| 4 | Missing-type variance, inclusion–exclusion, and completion deadlines | 14 |
| 5 | Density normalization, CDF, moments, median, and a transformation | 12 |
| 6 | Signed tail identity; an infinite-mean prize and a finite payout cap | 12 |
| 7 | Highest-bid pizza auction; gains, losses, and fair expected profit | 12 |
| 8 | Poisson arrivals, exponential versus uniform waits, and normal laws | 14 |
| Challenge | Unequal coupons by tail sums; the effect of a rare type | 10 extra |

The correct signed tail identity subtracts the negative-side area:
`E[X] = integral_0^infinity (1-F(x)) dx - integral_-infinity^0 F(x) dx`.
Adding these areas gives `E[|X|]`. Problem 7 computes both areas for the
highest of independent uniform bids, shifted by the seller's cost.
Problem 6 uses a prize with survival probability `1/x` for `x >= 1`:
its uncapped mean is infinite, but capping the payout at `B` gives mean
`1 + log(B)` and an atom of mass `1/B` at the cap.

Selected answers: first 90 of 100 types take about 225.8 purchases;
the last 10 take another 292.9 on average. Six types finish by 15 draws
with probability 0.6442, and the smallest 95% deadline is 27 draws
(0.9480 at 26; 0.9566 at 27). The exponential bound guarantees 95%
completion for 100 types at 761 draws. Three types with probabilities
1/2, 1/3, 1/6 have mean collection time 7.3 rather than the uniform 5.5.

Verification used exact enumeration of small occupancy experiments,
exact hypergeometric moments, state recursion for unequal coupon means,
polynomial integration for density and auction moments, and exact rational
completion probabilities. Core and subpart point totals were checked.

Files:

- `probability_problem_set_04_student.pdf`: distribution handout.
- `probability_problem_set_04_instructor.pdf`: worked solutions and subpart scores.
- `problem_set.tex`: shared source including solutions.
- `student.tex` / `instructor.tex`: edition selectors.

Build from this directory with a standard TeX installation. Run each
command twice to settle PDF bookmarks:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_04_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=probability_problem_set_04_instructor instructor.tex
```

Then run `python3 scripts/sync-assessments.py` from the repository root.
Only the student edition is a public website asset. The instructor PDF and
shared source contain solutions and must remain outside `website/public/`.
