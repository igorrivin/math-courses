# Problem Set 4: Orders, interpolation, and Fourier inversion

Optional enrichment for course packet Sections 5.10–5.11, using polynomial
interpolation from Chapter 4. Sections on counting and Fourier interpolation
can also be assigned independently. No calculus or infinite Fourier series
is required.

- 6 problems, 80 points, plus a 10-point challenge.
- Suggested time: 3–4 hours; solutions should be written on separate paper.
- Counting: a six-element poset, exact membership in three sets, and inversion
  on the partition lattice of four objects.
- Interpolation: roots-of-unity Lagrange selectors, four-point transforms over
  the complex numbers and `F_13`, and cyclic convolution via polynomial CRT.
- Challenge: zero padding and an eight-point transform over `F_17` to recover
  an ordinary polynomial product.

`problem_set.tex` contains the questions, point allocations, and worked
solutions. The wrappers select the edition; both use `../inversion-style.tex`.

From this directory, build with:

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=number_theory_problem_set_04_student student.tex
latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=number_theory_problem_set_04_instructor instructor.tex
```

The website publishes `number_theory_problem_set_04_student.pdf` in the
assessment library, explicitly marked as optional enrichment.
`number_theory_problem_set_04_instructor.pdf` is copied only into the website's
private directory and served through instructor authentication. After
rebuilding, run `python3 scripts/sync-assessments.py` from the repository root.
