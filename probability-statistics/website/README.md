# Chance, Data, and Decisions — interactive course

This site is the interactive companion to the probability and statistics course packet.

It includes ten browser-based labs, the expanded printable PDF edition,
a student assessment library, four Python notebooks, and a SageMath
exchangeability notebook. The site uses the OpenAI Sites starter runtime.

The ten-chapter PDF now includes an optional exchangeability capstone:
de Finetti's Bernoulli representation, a shared hidden coin, Pólya's urn,
random limiting frequencies, finite counterexamples, and nine exercises.
The optional proof connects finite sampling to the birthday-collision
bound. A short Chapter 3 preview prepares the distinction from independence.
The core Python labs are joined by an exchangeability lab and Sage notebook.

The early-course labs cover permutations and combinations, Pascal's triangle,
cardinality and probabilistic inclusion-exclusion, and the birthday paradox.
The birthday model assumes independent, uniformly distributed birthdays;
its simulation is compared with the exact product formula.

The foundations reading section links directly into Chapters 1, 2, and 4
of the PDF. It covers elementary counting and the binomial theorem,
probability spaces built from events and weights, full birthday and
derangement arguments, and random variables with concrete threshold events.
The `#expectation` reading link leads to finite weighted averages, linearity,
indicators, variance, independent sums, and 18 discrete exercises with worked
answers. The `#distributions` link continues with uniform, Bernoulli, binomial,
and hypergeometric examples; geometric and Poisson laws follow. The
`#coupon-collector` reading link leads to geometric stages, harmonic numbers,
the expected collection time and its variance, completion deadlines, and a discrete
Poissonization bonus. Four new exercises have worked solutions. Continuous
models and their exercises are marked as later reading in the book.

Appendix A is a calculus refresher with worked examples and 18 exercises
with answers. It covers limits, derivatives, likelihood optimization,
definite and improper integrals, substitution, integration by parts,
series, and Taylor error bounds. Its applications justify the birthday
approximation and the derangement limit and rounding formula. The homepage
links to it at `#calculus`; the editable source is
`../book/chapters/calculus_refresher.tex`. Keep `public/course-packet.pdf`
identical to `../book/chance_data_decisions.pdf` after rebuilding.

`public/problem-set-02.pdf` and `public/problem-set-03.pdf` are student
handouts. Instructor editions are stored in `private/` and served through
the authenticated instructor library.

## Local development

Run `npm run dev` and open the printed local URL. Run `npm run build` for a deployment build.

## Problem sets, quizzes, and instructor editions

`/assessments` lists the student PDFs; `/instructors` requires the shared
instructor password. Configure `INSTRUCTOR_PASSWORD` as a Sites secret (or in
an ignored local `.env` file). An empty value keeps access closed. Instructor
PDFs live in `private/` and are served only after a server-side session check.
See [setup and maintenance](../../docs/instructor-access.md).
