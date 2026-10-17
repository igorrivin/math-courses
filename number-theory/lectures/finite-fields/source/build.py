#!/usr/bin/env python3
"""Build the four slide decks and notes; bundle the editable sources."""

from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import zipfile


SOURCE = Path(__file__).resolve().parent
DESTINATION = SOURCE.parent
DECKS = {
    1: "lecture-1-rings-fields-and-vectors.pdf",
    2: "lecture-2-counting-and-building-fields.pdf",
    3: "lecture-3-cyclic-groups-and-matrices.pdf",
    4: "lecture-4-fibonacci-periods.pdf",
}


def expanded_content(path):
    content = path.read_text()
    return re.sub(r"\\input\{([^}]+)\}",
                  lambda match: expanded_content(SOURCE / (match[1] + ".tex")),
                  content)


def main():
    for number in DECKS:
        content = expanded_content(SOURCE / f"lecture-{number}-content.tex")
        minutes = re.findall(r"\\teach(?:slide|cover)\{.*?\}\{(\d+)\}", content, re.S)
        wrapper = (SOURCE / f"lecture-{number}-slides.tex").read_text()
        declared = int(re.search(r"\\newcommand\{\\coreSlides\}\{(\d+)\}", wrapper)[1])
        if sum(map(int, minutes)) != 50 or len(minutes) != declared:
            raise RuntimeError(f"Lecture {number}: check timing and declared slide count")
        print(f"Lecture {number}: {declared} main slides, 50 minutes", flush=True)

    targets = [(f"lecture-{number}-slides", filename) for number, filename in DECKS.items()]
    targets.append(("presenter-notes", "presenter-notes.pdf"))
    with tempfile.TemporaryDirectory(prefix="finite-fields-tex-") as directory:
        build = Path(directory)
        for stem, filename in targets:
            for _ in range(2):
                result = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", "-halt-on-error",
                     f"-output-directory={build}", f"{stem}.tex"],
                    cwd=SOURCE, text=True, capture_output=True,
                )
                if result.returncode:
                    raise RuntimeError(result.stdout[-12000:] + result.stderr)
            log = (build / f"{stem}.log").read_text()
            if "Overfull" in log or "LaTeX Warning:" in log or "Package hyperref Warning:" in log:
                raise RuntimeError(f"Review TeX warnings for {stem}:\n{log}")
            shutil.copyfile(build / f"{stem}.pdf", DESTINATION / filename)
            print(f"Built {filename}", flush=True)

    # Keep the previously shared Fibonacci link pointing to the current deck.
    shutil.copyfile(DESTINATION / DECKS[4],
                    DESTINATION / "lecture-3-matrices-and-fibonacci-periods.pdf")

    with zipfile.ZipFile(DESTINATION / "latex-source.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(SOURCE.iterdir()):
            if path.suffix in {".tex", ".py", ".md"}:
                archive.write(path, f"source/{path.name}")
        archive.write(DESTINATION / "README.md", "README.md")
    print("Bundled latex-source.zip", flush=True)


if __name__ == "__main__":
    main()
