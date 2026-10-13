# Continued fractions: editable lecture sources

Two 50-minute lectures for Igor Rivin's introductory number theory course,
following Chapter 3 of Patterns, Proofs, and Primes.

## Build

Use a TeX distribution with Beamer and latexmk. From this folder, run:

    latexmk -pdf -interaction=nonstopmode -halt-on-error lecture-1-slides.tex
    latexmk -pdf -interaction=nonstopmode -halt-on-error lecture-2-slides.tex
    latexmk -pdf -interaction=nonstopmode -halt-on-error presenter-notes.tex

The results are lecture-1-slides.pdf, lecture-2-slides.pdf, and
presenter-notes.pdf. The delivered slide PDFs have descriptive filenames:
lecture-1-matrix-fixed-points.pdf and lecture-2-lagrange-galois.pdf.
No external images or network services are required to compile or present.

## Contents and editing

- lecture-1-content.tex: matrix actions, periodic fixed points, prefix
  conjugation, worked examples, and reduced surds.
- lecture-2-content.tex: Lagrange's converse first, with proofs of the
  conjugation rules and each step of the bounded-integer-pair argument;
  then Galois's criterion, examples, and optional extensions.
- slide-style.tex: shared slide colors, type sizes, margins, and macros.
- lecture-1-slides.tex and lecture-2-slides.tex: deck wrappers and metadata.
- presenter-notes.tex: printable notes, timing, prerequisites, and sources.

Each main slide uses four arguments:

    \teachslide{Title}{Minutes}{Visible slide content}{Presenter notes}

The cover uses the same arguments with \teachcover. The slide and notes
PDFs read the same content files, so edit each explanation in one place.
Question and answer slides are separate pages; there are no animations.

Lecture 1 has 22 main slides and 3 backup slides. Lecture 2 has 30 main
slides and 7 backup slides. The main slides include the cover and exit
question. Backup slides follow the 50-minute stopping point and are marked
Further questions in their footers.

The notes compiler checks that each main lecture adds up to 50 minutes.
If you add or remove main slides, update the coreSlides value in that
deck's wrapper, and rebalance the minute allocations. The durations are
suggestions for delivery, including student work and discussion.

Lecture 2 completes Lagrange's converse at minute 34 and reviews it
with an exercise before introducing Galois at minute 39. The conjugate
is defined and its arithmetic proved before it is used. The inverse
prefix formula, the convergence sign argument, integrality, and both
integer bounds are derived on the main slides. Slide 23 is a natural
checkpoint if Galois needs to wait until the next meeting.

## Presenting

Open the slide PDF in a full-screen or presentation view and share that
window in Zoom. Keep presenter-notes.pdf in a separate, unshared window or
on another device. Download the PDFs before traveling.

These are LaTeX/PDF presentations, not PowerPoint files. Canva is not
required. Source references and mathematical conventions are in the
presenter notes.
