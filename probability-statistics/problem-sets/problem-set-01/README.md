# Problem Set 1: The Geometry of Events

This is the first problem set for *Chance, Data, and Decisions*. It covers
elementary set notation, membership, complements, De Morgan's laws, Venn
diagrams, and inclusion--exclusion for two and three sets. No probability is
assumed.

- `student.tex` builds the student handout.
- `instructor.tex` builds the worked-solutions edition.
- `problem_set.tex` contains the common design, exercises, diagrams, and solutions.

Compile from this directory with:

```sh
latexmk -pdf -jobname=probability_problem_set_01_student student.tex
latexmk -pdf -jobname=probability_problem_set_01_solutions instructor.tex
```

The assignment is worth 80 points, with a 10-point optional challenge.
