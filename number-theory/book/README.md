# Patterns, Proofs, and Primes

This folder contains an adaptable one-semester introductory number theory course.

## Files

- `main.tex`: master LaTeX source.
- `chapters/`: course design, nine teaching chapters, appendices on matrix
  algebra, Gosper's continued-fraction arithmetic, and Venus's astronomical
  cycles, selected solutions, and reference sheets.
- `notebooks/`: three optional SageMath/Jupyter labs. The first includes the
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

The source uses standard TeX Live packages: TikZ, tcolorbox, amsmath, hyperref, booktabs, and related dependencies.

## Suggested variants

- **10-week course:** omit the Pell extension, compress CRT, and assign Chebyshev's proof as a guided capstone.
- **High-school circle:** teach Chapters 1-5 and selected material from Chapter 7; make groups and Chebyshev optional.
- **Undergraduate seminar:** keep the full sequence and ask students to complete omitted estimates and Kummer's theorem details.
- **Student edition:** remove `\input{chapters/solutions}` from `main.tex` before compiling.

The notebooks are written for the SageMath kernel. Most basic cells also run in Python after small syntax changes, but exact continued-fraction and modular-group commands require Sage.

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
