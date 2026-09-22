# Chance, Data, and Decisions — interactive course

This site is the interactive companion to the probability and statistics course packet.

It includes nine browser-based labs, the expanded printable PDF edition, a student problem set, and four downloadable Jupyter notebooks. The site uses the OpenAI Sites starter runtime.

The ten-chapter PDF now includes an optional exchangeability capstone:
de Finetti's Bernoulli representation, a shared hidden coin, Pólya's urn,
random limiting frequencies, finite counterexamples, and nine exercises.
The optional proof connects finite sampling to the birthday-collision
bound. A short Chapter 3 preview prepares the distinction from independence.
The existing nine labs and four notebooks are unchanged by this addition.

The early-course labs cover permutations and combinations, Pascal's triangle,
cardinality and probabilistic inclusion-exclusion, and the birthday paradox.
The birthday model assumes independent, uniformly distributed birthdays;
its simulation is compared with the exact product formula.

`public/problem-set-02.pdf` and `public/problem-set-03.pdf` are the student
handouts. Instructor solutions are kept with the separate course materials,
outside the public site.

## Local development

Run `npm run dev` and open the printed local URL. Run `npm run build` for a deployment build.

## Problem sets, quizzes, and instructor editions

`/assessments` lists the student PDFs; `/instructors` requires the shared
instructor password. Configure `INSTRUCTOR_PASSWORD` as a Sites secret (or in
an ignored local `.env` file). An empty value keeps access closed. Instructor
PDFs live in `private/` and are served only after a server-side session check.
See [setup and maintenance](../../docs/instructor-access.md).
