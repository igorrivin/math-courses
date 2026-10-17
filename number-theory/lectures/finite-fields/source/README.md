# Editable sources: finite fields and Fibonacci

Four 50-minute lectures in the same LaTeX/Beamer style as the earlier
continued-fraction decks.

## Build

Install a TeX distribution with Beamer, Latin Modern, and the packages
used in `slide-style.tex` and `presenter-notes.tex`. Python 3 is required
only for the convenience build script. No external assets or network
services are needed.

From this folder, run:

    python3 build.py

The script checks the main-slide counts and 50-minute totals, compiles
each PDF twice, rejects layout warnings, and writes the named PDFs and
source ZIP to the parent folder. TeX intermediates stay in a temporary
directory. You can also compile an individual wrapper with `pdflatex`.

## Editing

Each content file contains visible slides and their corresponding notes:

    \teachslide{Title}{Minutes}{Visible content}{Presenter notes}

The cover uses `\teachcover` with the same four arguments. Optional
material follows `\backups` and uses:

    \backupslide{Title}{Visible content}{Presenter notes}

Slide PDFs use the visible-content argument; the notes PDF uses the
presenter-notes argument. Edit the content once to keep them aligned.
If you change the number of main slides, update `\coreSlides` in the
wrapper. Rebalance the minute allocations so each main route totals 50.

The scalar field is explicit throughout. The prime-power theorem proves
a necessary condition on finite-field sizes, while the construction
supplies the specific quadratic extensions needed for Fibonacci.
For odd primes the Fibonacci matrix has determinant -1; its square,
rather than the matrix itself, belongs to SL(2,p).

Lecture 2 includes `dimension-content.tex` as main slides 7–12. It proves
the independent-versus-spanning length inequality by exchange, then
compares two bases to establish well-definedness of dimension over any
field. Coordinate counting is a later application, rather than an
assumption in that proof. A Gaussian-elimination alternative is optional.

Lecture 3 includes `cyclicity-content.tex` for the complete elementary
proof that a finite field's multiplicative group is cyclic. The
optional `prime-power-units-content.tex` compares this with the units
of residue rings, proves primitive-root lifting for odd primes, and
describes the exception at powers of 2 starting at 8.

The previously shared `lecture-3-matrices-and-fibonacci-periods.pdf`
filename is retained as a copy of the current Lecture 4 PDF, so its link
continues to work. The canonical filenames and lecture numbers appear
in the parent README.
