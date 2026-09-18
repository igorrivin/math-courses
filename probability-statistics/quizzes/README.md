# Chance, Data, and Decisions: weekly quizzes

The standalone [conditional probability class quiz](conditional-probability/README.md)
covers a full 50-minute class (50 points), including a finite probability-space
warm-up and a guided Bayes' Rule solution to Monty Hall. Its folder contains
student and instructor PDFs and editable LaTeX sources.

The standalone [birthdays and derangements class quiz](birthday-derangements/README.md)
is a second 50-minute, 50-point quiz: the calculus behind the birthday and
hat-check problems (series for $e^x$, linearizing $\ln(1-x)$, alternating-series
error), the two problems themselves, and a Bayes' Rule problem.

The weekly bundle contains ten 20-minute quizzes, each worth 10 points.

- `student.tex` builds the student edition, with writing space.
- `instructor.tex` builds the fully worked instructor key.
- `quizbook.tex` contains the shared design and all quiz content.

Compile either edition with:

```sh
latexmk -pdf student.tex
latexmk -pdf instructor.tex
```

The sequence follows the course arc from sets through Bayesian inference. The
questions, point values, and student writing-space heights can all be edited in
`quizbook.tex`.
