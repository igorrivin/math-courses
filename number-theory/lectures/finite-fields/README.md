# Four 50-minute lectures: finite fields and Fibonacci

Prepared for Igor Rivin's introductory number theory course, following
the matrix approach to Fibonacci periodicity.

- [Lecture 1: Changing the arithmetic](lecture-1-rings-fields-and-vectors.pdf)
  — rings, units, fields, characteristic, the prime field, and the first
  part of the vector-space reminder; 23 main slides and 2 optional slides.
- [Lecture 2: Counting and building finite fields](lecture-2-counting-and-building-fields.pdf)
  — independence, bases, a full exchange proof that dimension is well
  defined, prime-power cardinality, and arithmetic in the 49-element
  field; 23 main slides and 7 optional slides.
- [Lecture 3: Cyclic groups and counting matrices](lecture-3-cyclic-groups-and-matrices.pdf)
  — a full elementary proof of cyclicity of finite-field multiplication,
  primitive elements, and counts of GL and SL; 23 main slides and
  8 optional slides.
- [Lecture 4: Explaining Fibonacci periods](lecture-4-fibonacci-periods.pdf)
  — the matrix order, diagonalization, Frobenius, simultaneous root
  orders, and exact periods modulo 11 and 7; 18 main slides and
  4 optional slides.
- [Presenter notes](presenter-notes.pdf) — slide-by-slide explanations,
  suggested times, exercise answers, prerequisites, and pacing guidance.
- [Editable LaTeX source bundle](latex-source.zip), also unpacked in
  [source/](source/).

Each main lecture totals 50 minutes, including calculation pauses and
discussion. Optional slides follow the exit question and have a
“Further questions” footer. Questions and answers are on separate pages.

The PDFs use the same 16:9 layout, large type, and colors as the earlier
continued-fraction lectures. For Zoom, share the slide PDF window and
keep the notes separate. The PDFs work offline.

Lecture 2 gives the dimension proof on main slides 7–12: one exchange,
a worked example, repeated exchanges, the independent-versus-spanning
length inequality, and comparison of two bases. The proof works over
any field. An optional slide gives the Gaussian-elimination alternative.
The extension-arithmetic exercise and the preview of the Fibonacci roots
are optional to preserve the 50-minute main route.

Lecture 3 assumes earlier exposure to Lagrange's theorem and proves the
polynomial root bound and coprime-order product lemma used for cyclicity.
Its optional section proves cyclicity of the units of Z/p^nZ for odd p,
and contrasts it with finite-field multiplication. The unit groups
modulo 2 and 4 are cyclic; the exception starts modulo 8.

Lecture 4 recalls Fermat's theorem and the prime binomial identity,
then proves the Frobenius and eigenvector facts used for Fibonacci.
Its optional slides cover the exceptional primes 2 and 5 and exact-period
tests. The earlier Fibonacci PDF filename remains a copy of Lecture 4
to preserve the previously shared link.

To rebuild everything, run `python3 build.py` from `source/`.
