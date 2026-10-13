# Discrete and continuous distributions: class quiz

A 50-minute, 50-point quiz on Bernoulli, binomial, geometric, Poisson,
exponential, and continuous uniform distributions. A guided coupon-collector
problem takes 20 points and about 18 minutes, making it possible to identify
which parts of the stage argument students understand.

- `distributions_coupon_collector_quiz_student.pdf`: four-page printable quiz with writing space.
- `distributions_coupon_collector_quiz_instructor.pdf`: four-page worked key with subpart grading guidance.
- `quiz.tex`: shared editable questions, solutions, point values, and writing-space heights.
- `student.tex` / `instructor.tex`: edition selectors.

| Problem | Content | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Bernoulli indicator, binomial count, geometric waiting time; probabilities and moments | 12 | 11 |
| 2 | Poisson counts and time units; exponential survival via zero arrivals; memorylessness | 10 | 9 |
| 3 | Continuous uniform density, interval and point probabilities, moments; failure of memorylessness | 8 | 8 |
| 4 | Four-type coupon collection, built from geometric stages | 20 | 18 |
| Check answers | | | 4 |
| **Total** | | **50** | **50** |

The quiz follows Chapter 5's distribution conventions and the coupon-collector
section. Geometric variables count trials through the first success;
exponential parameters are rates. The Poisson arrival assumptions are stated
in full, and the zero-arrival hint guides the connection to an exponential
wait. No knowledge of Poisson processes beyond the supplied model is needed.
Uniform means the continuous distribution on an interval.

No calculator is needed. Exact expressions involving binomial coefficients,
powers, and exponentials are accepted. Standard distribution formulas may
be quoted; the geometric mean formula is explicitly supplied for Problem 4.
No integral derivations are required. The handout leaves the notes/books
policy to the instructor. Suggested times are estimates, not classroom-tested
completion times. All four problems are required, with no extra challenge.

## Reading the coupon-collector responses

The example has four equally likely types, keeping arithmetic light while
retaining the full argument. Each pack contains one independent draw and may
duplicate an earlier type. The six subparts isolate different ideas:

| Part | What it checks | A revealing error |
| --- | --- | --- |
| (a) | Distinct types versus number of purchases | Treating five packs as five different types |
| (b) | Success means an unseen type; duplicates leave the stage unchanged | Using `k/4` instead of `(4-k)/4` |
| (c) | A fixed-stage wait is geometric; the first pack is certainly new | Counting failures, or using probability as mean waiting time |
| (d) | Total time is a sum of stages; expectation is linear | Multiplying means or saying independence is required for linearity |
| (e) | Two missing types require two successive stages with different rates | Giving 2 packs, the wait only for the next new type |
| (f) | The whole collection time is not one geometric variable | Treating all stages as a single first success with probability `1/4` |

Grade the stages separately and give method credit for consistent use of an
earlier answer. In particular, a wrong success probability need not erase
credit for correctly using the geometric mean and linearity. A final quoted
coupon-collector formula alone does not demonstrate the requested reasoning.
There is no need to prove independence of the stage lengths or compute the
variance of the total collection time.

Selected answers: Problem 1 has binomial probability `80/243`, binomial
mean `2` and variance `4/3`, and geometric tail `8/27`. The Poisson count
in 30 seconds has parameter `1`; its probability of at least two requests
is `1 - 2 exp(-1)`. The exponential rate is `2` per minute. For the uniform
wait, the conditional and unconditional tails in (c) are `1/4` and `1/2`.
Coupon-stage means are `1, 4/3, 2, 4`, giving total mean `25/3` packs and
expected additional wait `6` packs after exactly two types have appeared.

Build from this directory using a standard TeX installation. Run each command
twice to resolve the page counts:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=distributions_coupon_collector_quiz_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=distributions_coupon_collector_quiz_instructor instructor.tex
```

After rebuilding, run `python3 scripts/sync-assessments.py` from the repository
root. Only the student PDF is intended for class distribution. The instructor
edition and shared source contain answers.
