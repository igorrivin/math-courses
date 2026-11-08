# Estimation and limit theorems: class quiz

A standalone 50-minute quiz worth 50 points, covering estimation from data,
the Chebyshev weak law of large numbers, the usual i.i.d. central limit
theorem, and a non-Cauchy distribution whose sample averages have no finite
constant limit.

- `limit_theorems_quiz_student.pdf`: printable student quiz with writing space.
- `limit_theorems_quiz_instructor.pdf`: worked solutions and partial-credit guidance.
- `quiz.tex`: shared editable questions, answers, point values, and writing space.
- `student.tex` / `instructor.tex`: edition selectors.
- `Makefile`: compiles each edition twice to resolve page references.

| Problem | Content | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Sample mean, squared deviations, unbiased and uncorrected variance estimates | 10 | 8 |
| 2 | Moments of the sample mean, Chebyshev proof of the weak LLN, sufficient sample size | 14 | 12 |
| 3 | CLT statement, normal approximation for exponential sample averages, comparison with Chebyshev | 12 | 11 |
| 4 | Pareto normalization, tail, infinite mean, guided proof of divergence in probability | 14 | 14 |
| Check answers | | | 5 |
| **Total** | | **50** | **50** |

The timing is an estimate for students who have practiced these topics.
Each problem starts on a fresh page. No calculator or normal table is needed:
the necessary normal probabilities are supplied, and exact fractions are
accepted. The handout leaves the notes/books policy to the instructor.

## Mathematical choices

The sample variance convention is explicit: the unbiased estimate uses
`n - 1`, while the uncorrected mean squared deviation uses `n`. Students
need not prove unbiasedness. The answers are mean `7`, squared-deviation
sum `22`, unbiased variance `22/5`, and mean squared deviation `11/3`.

Problem 2 asks for the finite-variance Chebyshev proof of convergence in
probability, not the strong law. Its sufficient sample size is `320`;
this is the minimum for the stated Chebyshev bound, not a claim about the
smallest sample size for a particular distribution.

Problem 3 gives the exponential moments so students can focus on the CLT.
Its standard error is `0.2`, endpoints are `-2` and `2`, and normal
approximation is `0.9544`. The Chebyshev lower bound is `0.75`. The key
distinguishes a finite-sample guarantee from an asymptotic approximation.
The value `0.9544` uses the supplied rounded normal CDF values; `0.9545`
from more precise values also earns full credit.

Problem 4 uses the Pareto density `f(x) = 1/(2 x^(3/2))` for `x >= 1`
(shape `1/2`). Its tail is `1/sqrt(t)`, and its mean is infinite. The
guided maximum argument gives, for fixed `A > 0` and `nA >= 1`,

```text
P(sample mean <= A)
  <= P(maximum <= nA)
  = (1 - 1/sqrt(nA))^n
  <= exp(-sqrt(n/A)) -> 0.
```

Thus the usual sample average tends to positive infinity in probability,
rather than approaching a finite constant. This demonstrates failure of
the usual finite-mean LLN conclusion, beyond merely finding a missing
Chebyshev hypothesis. Infinite variance by itself would not suffice: an
i.i.d. distribution with finite absolute first moment still obeys an LLN.

## Build and distribution

Run `make` in this directory. `make clean` removes only the named build
auxiliaries and leaves both PDFs intact. The source follows the existing
standalone quiz format and the course's Chapters 7 and 8.

Only the student PDF is intended for class distribution. The instructor
PDF and shared LaTeX source contain answers. These are local draft
materials; creating them does not publish them to the course site or Canvas.

## Validation (2026-11-06)

Both editions compiled twice with pdfLaTeX to four pages each. The final
compiler logs contain no warnings or overfull/underfull boxes. Every page
was rendered and visually inspected, including the final revised pages.
Extracted student text contains no solution or grading markers; the key
contains all 13 subpart solutions and credit notes. Subpart allocations
sum to 50 points, and the suggested work and review times sum to 50 minutes.
The arithmetic was independently checked, and the Pareto proof was checked
through its event inclusion, independence step, and limiting bound.
