# Conditional probability and Bayes' Rule: class quiz

A standalone 50-minute quiz worth 50 points, aligned with the finite-space
material in Chapter 2, the introductory conditioning material in Chapter 3,
and the classroom discussion of Monty Hall. No measure theory, calculus,
simulation, or advanced independence examples are required.

- `conditional_probability_quiz_student.pdf`: three-page printable quiz with writing space.
- `conditional_probability_quiz_instructor.pdf`: three-page worked key with partial-credit guidance.
- `quiz.tex`: shared editable questions, solutions, point values, and writing-space heights.
- `student.tex` / `instructor.tex`: edition selectors.

| Problem | Content | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Recorded outcomes, unequal weights, unions and intersections | 8 | 7 |
| 2 | Conditional probabilities from a two-way table; independence | 10 | 10 |
| 3 | Joint outcomes, total probability, and Bayes' Rule for two boxes | 12 | 11 |
| 4 | Guided Monty Hall calculation and interpretation | 20 | 18 |
| Check answers | | | 4 |
| **Total** | | **50** | **50** |

The Monty Hall problem specifies that the host knows the car's location,
always reveals an unchosen goat, chooses uniformly when two goat doors are
available, and always offers a switch. Students condition on the specific
observation that Door 3 opens after their initial choice of Door 1. They
work through prior probabilities, the host's conditional probabilities,
total probability, Bayes' Rule, and the switching decision. The uniform
tie-breaking rule makes the likelihoods for this particular observed door
unambiguous.

Exact fractions are requested; no calculator is needed. The handout does not
set a notes/books policy. The timings are planning estimates, with four
minutes reserved for checking. All four problems are required; there is no
extra challenge that would extend the time budget.

For grading, use the subpart allocations in the key. Give method credit for
consistent use of an earlier answer, and avoid penalizing the same arithmetic
error repeatedly. In Problem 4, memorizing the switching probability alone
does not supply the requested conditional-probability and Bayes reasoning.

Build from this directory with a standard TeX installation. Run each command
twice to resolve the page counts:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -jobname=conditional_probability_quiz_student student.tex
pdflatex -interaction=nonstopmode -halt-on-error -jobname=conditional_probability_quiz_instructor instructor.tex
```

Only the student PDF is intended for distribution to the class. The instructor
edition and shared source include the answers.
