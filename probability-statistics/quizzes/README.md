# Chance, Data, and Decisions: weekly quizzes

This bundle contains ten 20-minute quizzes, each worth 10 points.

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
