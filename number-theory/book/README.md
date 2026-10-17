# Patterns, Proofs, and Primes

This folder contains an adaptable one-semester introductory number theory course.

## Files

- `main.tex`: master LaTeX source.
- `chapters/`: course design, nine teaching chapters, appendices on matrix
  algebra, Gosper's continued-fraction arithmetic, and Venus's astronomical
  cycles, finite fields and division rings, selected solutions, and reference sheets.
- `notebooks/`: six optional SageMath/Jupyter labs. The first includes the
  sieve, extended-Euclidean/convergent correspondence, alternating bounds,
  Khinchin--Levy experiments, Gosper's homographic matrix updates, and exact
  Pell/Archimedes calculations. Its Pell and cattle cells also run unchanged
  in standard Python, independently of the earlier Sage cells.
- `patterns_proofs_primes.pdf`: compiled student/instructor packet.

## Compile

Run from this folder:

```sh
latexmk -pdf main.tex
```

If `latexmk` is unavailable, run `pdflatex -interaction=nonstopmode
-halt-on-error main.tex` three times to resolve the contents and references.
Copy the finished `main.pdf` to `patterns_proofs_primes.pdf` and to
`../website/public/course-packet.pdf` together.

The source uses standard TeX Live packages: TikZ, tcolorbox, amsmath, hyperref, booktabs, and related dependencies.

## Suggested variants

- **10-week course:** omit the Pell extension, compress CRT, and assign Chebyshev's proof as a guided capstone.
- **High-school circle:** teach Chapters 1-5 and selected material from Chapter 7; make groups and Chebyshev optional.
- **Undergraduate seminar:** keep the full sequence and ask students to complete omitted estimates and Kummer's theorem details.
- **Student edition:** remove `\input{chapters/solutions}` from `main.tex` before compiling.

The notebooks use the SageMath kernel. The second and sixth run unchanged
in standard Python too; their marked `.sage` sources are converted and mirrored
to the website by `python3 scripts/sync-notebooks.py` from the repository root.
Some commands in the other notebooks require Sage.

## Early-course lecture alignment

- Chapter 2 uses prime-exponent parity in the fundamental theorem of arithmetic
  to prove that `sqrt(2)` is irrational. A boxed logic aside contrasts the
  classical excluded-middle proof that irrational powers can be rational with
  the explicit witness `a = sqrt(2)`, `b = log_(sqrt(2))(3)`, whose
  irrationality is certified by unique factorization. The chapter then
  develops and justifies the sieve of Eratosthenes.
- Chapter 3 identifies Euclidean remainders with the signed linear combinations
  encoded by convergents, derives the recurrence from unimodular matrix
  products, and uses the derivative of a Mobius tail map to prove the
  alternating monotone bounds. It also connects repeating base expansions with
  finite remainder states and states Legendre's approximation criterion.
  The linear fractional transformation toolkit now leads to complete
  elementary proofs of Lagrange's eventual-periodicity theorem and Galois's
  reduced-surd criterion for pure periodicity: fixed-point equations,
  prefix conjugation, integer-state bounds, and unique reduced predecessors.
  Worked examples include the periods of square roots, a prefix that can
  be absorbed into a pure period, and reversal of a period by conjugation.
  Exercises 20--26 and their selected solutions reinforce these arguments.
  The chapter then proves the square-root palindrome, the exact identity
  `p_(n-1)^2 - D*q_(n-1)^2 = (-1)^n*Q_n`, and the return condition
  `Q_n = 1` exactly at multiples of the least period length. These identify
  every positive and negative Pell solution, with explicit indexing and a
  proof that powers of the fundamental positive solution generate all others.
  Worked examples include `D = 13`; Exercises 27--31 add practice.
  An optional section develops Archimedes' Cattle of the Sun problem from
  its seven linear conditions through the square/triangle reduction to Pell,
  retaining the essential divisibility constraint. It cites Ilan Vardi's
  1998 exposition, explains the exponent 2329 and the 206,545-digit least
  total, and includes an exact computation in the first notebook plus
  Exercises 32--34 and solutions. The editable sections are
  `chapters/cf_pell.tex` and `chapters/archimedes_cattle.tex`.
  A calendar-design aside derives the Julian rule from a convergent and reconstructs the
  Gregorian $97/400$ rule after imposing a century-cycle constraint. A boxed
  Khinchin--Levy--Lochs aside explains the surprising ``base 11'' information
  rate of a typical continued fraction, followed by empirical data for $\pi$
  and a proof that the structured continued fraction of $e$ is exceptional.
- Appendix B first states the one- and two-input continued-fraction arithmetic
  problems, then develops Gosper's algorithms from their geometric invariant:
  map the interval (or rectangle) of possible unread tails and emit a digit
  only when the entire image lies in one floor cell. It closes with the modern
  interval-valued repair for boundary cases.
- Appendix C begins with two runners on circular tracks, defines every
  astronomical term in ordinary language, derives the Earth--Venus lapping
  time, connects the approximate $13:8:5$ pattern to Fibonacci convergents and
  the five-alignment star, and contrasts this with the exact $37,960$-day
  calendar arithmetic of the Dresden Codex Venus Table.

## Modular-arithmetic lecture alignment

- Chapter 4 centers extended gcd: a forward coefficient table certifies each
  inverse, solves linear congruences, and constructs CRT selectors. The same
  selector construction for polynomial moduli gives Lagrange interpolation,
  with examples over the rationals and a prime field. Reversible Fibonacci
  pairs prove periodicity without extension fields, and CRT combines periods
  for coprime moduli. Exercises 8–18 and solutions reinforce these steps.
- Chapter 5 extends Fermat's necklace proof to Euler: begin with length 9,
  subtract all shorter-period words at prime-power lengths, cancel a unit,
  and combine the congruences with CRT. Counting units gives the totient
  product formula without inclusion–exclusion. Exercises 8–14 have solutions.
  Chapter 6 revisits Euler through Lagrange and the unit-permutation proof.
- Sections 5.8–5.9 introduce multiplicative functions, divisor counts and
  sums, Dirichlet convolution, the gcd proof of the totient divisor-sum
  identity, and Möbius inversion. Applications recover the totient product
  and count primitive and all necklaces. Section 5.10 is a bonus treatment
  of finite posets, incidence algebras, inclusion–exclusion, partition
  coefficients, products of orders, and the local-finiteness condition.
- Bonus Section 5.11 connects Möbius inversion with interpolation and
  Fourier inversion. Lagrange selectors at roots of unity give the discrete
  inverse transform, with explicit signs and normalization; polynomial CRT
  explains cyclic convolution. Worked examples use complex fourth roots and
  the prime field with five elements. Exercises 15–31 have solutions.
- Notebook 6 follows these additions independently. It checks divisor sums,
  primitive periods against enumerated words, both poset inverses, partition
  counts, exact Gaussian-rational interpolation, and all 625 four-point
  transforms over the prime field with five elements.
- Chapter 5 also derives `(a+b)^p = a^p + b^p` in the prime field directly
  from Fermat. Chapter 7 distinguishes this equality of values
  from the formal polynomial identity, whose binomial proof allows
  substitution in extension fields.
- Appendix D develops the four finite-fields lectures in book form. It
  starts with rings, units, fields, prime characteristic, vector spaces,
  a full exchange proof of well-defined dimension, and prime-power
  cardinalities. Explicit quadratic-extension arithmetic follows.
  The multiplicative group is proved cyclic by combining prime-power
  orders, using the polynomial root bound.
- The same appendix proves existence and uniqueness up to isomorphism
  of every Galois field `GF(p^n)`. Root adjunction by polynomial Euclid
  supplies a splitting extension; the distinct roots of `X^(p^n)-X`
  form a field. A primitive element and its minimal polynomial give
  the uniqueness proof without assuming the general uniqueness theorem
  for splitting fields or the fundamental theorem of Galois theory.
  It distinguishes a unique isomorphism class from a unique isomorphism.
- Counts of GL and SL, Frobenius, all finite-field automorphisms, and
  existence and uniqueness of subfields lead to the existing Fibonacci
  period computations. The primes 2 and 5 are treated separately.
  A four-node diagram displays the subfields of the 64-element field.
- A final bonus section proves Wedderburn's little theorem: every finite
  division ring is a field. It develops conjugacy classes and the class
  equation, proves the needed cyclotomic integrality, divisibility, and
  size lemmas, then gives Witt's argument. Centralizers are treated as
  division rings, without assuming their commutativity. References include
  Witt's original paper, Weil's *Basic Number Theory*, Chapter I, §1, and
  Milne's field-theory notes. There are 18 exercises with selected solutions,
  retaining the original six extension/Fibonacci exercises as 1–6.
  This appendix remains an optional route following Chapters 4–7.
- Editable sources are `chapters/finite_fields.tex` (the main route and
  exercises), `chapters/finite_field_foundations.tex`,
  `chapters/finite_field_structure.tex`, and
  `chapters/finite_division_rings.tex`; the worked answers are in
  `chapters/solutions.tex`.
- Notebook 2 follows the same order: extended gcd, congruences, CRT,
  interpolation, reversible pairs, necklaces, and Euler, followed by clearly marked
  optional extension and exact-period sections. All computations use exact
  arithmetic and include mathematical checks.
