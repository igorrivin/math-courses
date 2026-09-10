# Initial import — September 10, 2026

The repository consolidates the prepared materials from the existing local
Codex project. The original directories were copied, not moved or deleted.

## Source mapping

| Original folder | Repository folder |
| --- | --- |
| number_theory_course | number-theory/book |
| number_theory_web | number-theory/website |
| number_theory_problem_sets/problem_set_01 | number-theory/problem-sets/problem-set-01 |
| number_theory_web/output/pdf/week_02 | number-theory/problem-sets/week-02 |
| number_theory_quizzes | number-theory/quizzes |
| number_theory_web/output/continued_fraction_lectures | number-theory/lectures/continued-fractions |
| probability_statistics_course | probability-statistics/book |
| probability_statistics_web | probability-statistics/website |
| probability_statistics_problem_sets/problem_set_01 | probability-statistics/problem-sets/problem-set-01 |
| probability_statistics_problem_sets/problem_set_02 | probability-statistics/problem-sets/problem-set-02 |
| probability_statistics_quizzes | probability-statistics/quizzes |

## History and portability

All 13 commits on the number theory website's main branch and all 3 commits
on the probability website's main branch were imported beneath their new
folder prefixes. Their messages, authors, and dates are retained; changing
the prefixes changes commit hashes. The two histories were then merged.
The original repositories and their histories were not rewritten.

The books and other teaching materials are included as their prepared
September 10 snapshots. Course content, website code, PDF assets, and both
Sites configuration files are unchanged by the import. Documentation links
were adjusted for the new folder layout.

The lecture source ZIP is also unpacked into its own source folder so that
future changes can be reviewed directly in Git. The ZIP itself remains as
the original downloadable source bundle.

The first probability problem set's student LaTeX source is present, but
its compiled student PDF was absent from the source folder at import.
Its README gives the command to regenerate it. The prepared instructor
PDF is included.

## Intentionally not imported

- npm dependencies, generated website builds, runtime state, and caches;
- TeX auxiliary files and redundant `main.pdf` build copies;
- temporary rendering previews and deployment archives;
- older source-bundle ZIPs and `.revision-backups` archives;
- untracked ` 2`-suffixed starter/skeleton website files, which are not
  part of either course's active website.

Those original local files remain untouched. No credentials, Git
configuration, deployment tokens, or local environment files were copied.
The `.openai/hosting.json` files contain only existing project IDs and
logical binding declarations.
