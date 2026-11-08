# Probability makeup midterm

50 minutes; six required problems; 100 points. Both editions have four US Letter
pages. Student papers include writing space; instructor keys include worked
solutions, subpart scores, and guidance for carrying forward earlier errors.

A parallel form of `../midterm-01/exam.tex`: the same six topics, subpart structure,
point allocations, and four-page layout, with changed data and contexts.
The collection problem has five types rather than four; an exact sum is accepted.

## Files and handling

- `probability_midterm_01_makeup_student.pdf`: student paper to print.
- `probability_midterm_01_makeup_instructor.pdf`: private worked key.
- `exam.tex`: shared questions and answers; instructor material.
- `student.tex`, `instructor.tex`: edition selectors.
- `Makefile`: builds both PDFs (two passes per edition).

Distribute only the student PDF. These exams are deliberately absent from the
website assessment catalog; do not publish or synchronize an upcoming exam.
No notes, textbook, or formula-sheet policy is imposed; set that policy before
administration. No calculator is needed. Timings below are estimates, not
classroom-tested completion times.

## Coverage and pacing

| Problem | Topic | Points | Suggested minutes |
| --- | --- | ---: | ---: |
| 1 | Sets and a containment counterexample | 10 | 5 |
| 2 | Finite probability space | 10 | 5 |
| 3 | Three-set inclusion-exclusion | 15 | 6 |
| 4 | Sampling without replacement | 20 | 8 |
| 5 | Density normalization, mean, and variance | 25 | 10 |
| 6 | Guided collection of five equally likely types | 20 | 9 |
| Check work | | | 7 |
| **Total** | | **100** | **50** |

## Build

Run `make` in this directory with the same LaTeX installation used for the
original probability midterm. Run `make clean` to remove intermediates while
keeping the named PDFs.

## Instructor answer checks

1. Sets: `{1,3,5}`, `{7,9,11}`, `{6,8,10,12}`; counterexample `{2,7}`.
2. `k=1/14`; probabilities `3/7`, `2/7`, `4/7`.
3. At least one: 34; none: 11. All seven Venn regions have nonnegative counts.
4. `choose(6,2) choose(3,1) choose(4,1) / choose(13,4) = 36/143`;
   `1 - choose(9,4)/choose(13,4) = 589/715`.
5. `c=3`, mean `3/4`, second moment `3/5`, variance `3/80`.
6. Success probabilities `1,4/5,3/5,2/5,1/5`; means `1,5/4,5/3,5/2,5`;
   total `137/12` packets.

The numerical answers were independently checked with exact arithmetic and/or
exhaustive finite enumeration. Both editions were compiled without LaTeX
warnings or overfull boxes and all pages were rendered and visually inspected.
These checks do not establish classroom pacing or equivalence to an unseen exam.
