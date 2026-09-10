# Problem Set 1: Euclid and the Architecture of the Integers

This folder contains the first problem set for *Patterns, Proofs, and Primes*.
It covers divisibility, gcds, the Euclidean algorithm, Bezout identities,
prime factorization, the fundamental theorem of arithmetic, and the infinitude
of primes.

- `student.tex` builds the student handout.
- `instructor.tex` builds the worked instructor edition.
- `problem_set.tex` contains the common design, problems, and solutions.

Compile from this directory with:

```sh
latexmk -pdf -jobname=number_theory_problem_set_01_student student.tex
latexmk -pdf -jobname=number_theory_problem_set_01_solutions instructor.tex
```

Problem 3 is modular: if Bezout's identity has not yet been discussed, it can
be presented as a guided extension or omitted without affecting Problems 4-10.
