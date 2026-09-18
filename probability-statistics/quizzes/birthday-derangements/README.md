# Birthdays, derangements, and a little calculus: class quiz

A standalone 50-minute quiz worth 50 points, covering the week on the
birthday paradox and the hat-check (derangement) problem, the calculus those
two arguments rely on, and conditional probability / Bayes' Rule.

- `birthday_derangements_quiz_student.pdf`: four-page printable quiz, one problem per page, with writing space.
- `birthday_derangements_quiz_instructor.pdf`: worked key with partial-credit guidance.
- `quiz.tex`: shared editable questions, solutions, point values, and writing-space heights.
- `student.tex` / `instructor.tex`: edition selectors.

| Problem | Content | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Series for $e^x$ and $1/e$; linearization of $\ln(1-x)$; $(1-1/n)^n\to1/e$ | 10 | 8 |
| 2 | Birthday product via the multiplication rule; $\exp(-n(n-1)/2d)$; threshold for $d=100$; a conditional probability for three people | 14 | 13 |
| 3 | Derangements: $n=3$ by listing, inclusion--exclusion, $p_4$, alternating-series error bound, a conditional probability | 16 | 14 |
| 4 | Bayes' Rule: was the hat-check clerk careless? | 10 | 10 |
| Slack | | | 5 |
| **Total** | | **50** | **50** |

No calculator is needed: $\ln2\approx0.693$ and the sum $1+\cdots+(n-1)$ are
supplied, and the alternating-series remainder estimate is stated in
Problem 3(d). Answers worth knowing at a glance: 2(c) $n=13$ (the exact product
agrees: match probability $0.4968$ at $n=12$, $0.5572$ at $n=13$);
2(d) $1/(3d-2)$; 3(c) $3/8$; 3(d) $n=6$; 3(e) $1/2$; 4(b) $1/13$; 4(c) $1/7$;
4(d) $1/(1+2\,n!)$.

Build from this directory; run each command twice to resolve the page counts:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=birthday_derangements_quiz_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=birthday_derangements_quiz_instructor instructor.tex
```

Only the student PDF is intended for distribution to the class. The instructor
edition and shared source include the answers.
