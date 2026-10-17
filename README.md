# Mathematics course materials

Igor Rivin's introductory number theory and probability/statistics courses:
books, interactive websites, problem sets, quizzes, notebooks, and lectures.

This repository is private because it includes instructor solutions and
assessment materials. The two public course websites remain separate from
the repository. Do not make this repository public without reviewing its
instructor material and history.

## Find the materials

| Material | Number theory | Probability and statistics |
| --- | --- | --- |
| Book PDF | [Patterns, Proofs, and Primes](number-theory/book/patterns_proofs_primes.pdf) | [Chance, Data, and Decisions](probability-statistics/book/chance_data_decisions.pdf) |
| Editable book and notebooks | [Book sources](number-theory/book/) | [Book sources](probability-statistics/book/) |
| Problem sets and solutions | [Problem sets](number-theory/problem-sets/) | [Problem sets](probability-statistics/problem-sets/) |
| Weekly quizzes and keys | [Quizzes](number-theory/quizzes/) | [Quizzes](probability-statistics/quizzes/) |
| Midterm study guide | Not yet prepared | [Through continuous distributions](probability-statistics/study-guides/midterm/probability_midterm_study_guide.pdf) |
| Midterm review | [Problem bank through finite-fields Lecture 2](number-theory/problem-sets/midterm-review/number_theory_midterm_review_student.pdf) | [50-minute practice quiz](probability-statistics/quizzes/midterm-review/probability_midterm_review_quiz_student.pdf) |
| Website source | [Interactive companion](number-theory/website/) | [Interactive companion](probability-statistics/website/) |
| Lecture presentations | [Two continued-fraction lectures](number-theory/lectures/continued-fractions/) | Not yet prepared |

The continued-fraction lectures each have a 50-minute route, PDF slides,
presenter notes, and editable [LaTeX sources](number-theory/lectures/continued-fractions/source/).
The latest number theory book includes the elementary Lagrange/Galois proofs,
the finite-fields lectures, existence and uniqueness of Galois fields, and
a bonus proof that every finite division ring is a field. The probability
book includes equal- and unequal-probability coupon collection, spaghetti
loops and other linearity examples, distribution mechanisms, Poissonization,
and the de Finetti exchangeability chapter.

## Work from another computer

Sign in to GitHub with an account that can access this private repository,
then clone it:

```sh
gh repo clone igorrivin/math-courses
cd math-courses
```

Before a new work session, use `git pull --ff-only`. After editing, review
`git status` and `git diff`, commit the intended files, and use `git push`.
This private GitHub repository is the canonical working copy. On this
computer, work in `/Users/igorrivin/devel/math-courses`. On another computer,
work in your clone of this repository. Edits in the older Codex folders or
the initial `Documents/GitHub/math-courses` copy do not sync automatically.

## Build and preview

The ready-to-use PDFs are checked in, so reading and teaching from them do
not require a build. To change a book, use a standard TeX Live/MacTeX
installation with `latexmk`; each book, problem-set, quiz, and lecture
folder has its own build instructions.

Each website is an independent npm project and needs Node.js >=22.13.0.
For example:

```sh
cd number-theory/website
npm ci
npm run dev
```

Use `probability-statistics/website` for the other course. Run `npm test`
from either website folder to build it and run its existing tests.
No repository-root npm workspace or shared dependency installation is needed.

After editing and compiling a book, update its named PDF and the matching
website `public/course-packet.pdf` together. After updating assessments, run
`python3 scripts/sync-assessments.py` to refresh the student downloads,
private instructor PDFs, and assessment catalogs for both websites.
Use `--check` to verify their copies without writing files.

Each website has a `/assessments` page for student problem sets and quizzes,
plus a password-gated `/instructors` page. See
[instructor access](docs/instructor-access.md) for setup and maintenance.

## Existing websites

- Number theory: https://numbertheoryintro.dimensionreducers.ai
- Probability/statistics: https://introproba.dimensionreducers.ai

Both website folders retain their original `.openai/hosting.json` files.
Reuse those existing Sites; do not create replacement Sites. Preserve
their existing public access and custom domains.

Pushing to this GitHub repository does not publish either website. No
automatic deployment workflow is configured. When publishing is requested,
use the relevant `website/` folder as the project root and obtain fresh
deployment credentials through Sites. Never commit credentials or put
instructor problem-set or quiz solutions under a website's `public/` folder.

See [import notes](docs/import-notes.md) for provenance and exclusions.
