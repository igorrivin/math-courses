# Patterns, Proofs, and Primes: weekly quizzes

This bundle contains ten 20-minute quizzes, each worth 10 points.

- `student.tex` builds the student edition, with writing space.
- `instructor.tex` builds the fully worked instructor key.
- `quizbook.tex` contains the shared design and all quiz content.

Compile either edition with:

```sh
latexmk -pdf student.tex
latexmk -pdf instructor.tex
```

The quizzes follow the course sequence, but every quiz is self-contained enough to
move by a week. Edit point values, writing-space heights, or questions directly in
`quizbook.tex`.
