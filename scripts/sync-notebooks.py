#!/usr/bin/env python3
"""Build the marked Sage notebooks and mirror only student notebook downloads."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES = ("number-theory", "probability-statistics")


def notebook_from_sage(path):
    cells = []
    kind, lines = None, []

    def flush():
        if kind is None:
            return
        source = "".join(lines).strip() + "\n"
        cell = {"cell_type": kind, "id": f"sage-{len(cells):02d}",
                "metadata": {}, "source": source.splitlines(keepends=True)}
        if kind == "code":
            cell.update(execution_count=None, outputs=[])
        cells.append(cell)

    for line in path.read_text().splitlines(keepends=True):
        if line.startswith("# %%"):
            flush()
            kind = "markdown" if "[markdown]" in line else "code"
            lines = []
        elif kind == "markdown":
            if line.startswith("# "):
                lines.append(line[2:])
            elif line.strip() == "#" or not line.strip():
                lines.append("\n")
            else:
                raise ValueError(f"Uncommented markdown in {path}: {line!r}")
        elif kind == "code":
            lines.append(line)
        elif line.strip():
            raise ValueError(f"Content before first cell in {path}")
    flush()
    return {"cells": cells, "metadata": {
        "kernelspec": {"display_name": "SageMath", "language": "sage", "name": "sagemath"},
        "language_info": {"name": "sage", "file_extension": ".sage", "mimetype": "text/x-sage"},
    }, "nbformat": 4, "nbformat_minor": 5}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check without writing any files")
    args = parser.parse_args()
    differences = []

    def update(path, data):
        if path.exists() and path.read_bytes() == data:
            return
        differences.append(str(path.relative_to(ROOT)))
        if not args.check:
            path.write_bytes(data)

    for course in COURSES:
        source = ROOT / course / "book/notebooks"
        public = ROOT / course / "website/public"
        for sage in sorted(source.glob("*.sage")):
            data = (json.dumps(notebook_from_sage(sage), ensure_ascii=False, indent=2) + "\n").encode()
            update(sage.with_suffix(".ipynb"), data)
            update(public / sage.with_suffix(".ipynb").name, data)
            update(public / sage.name, sage.read_bytes())
        for notebook in sorted(source.glob("*.ipynb")):
            # Generated notebooks were already handled, including --check mode.
            if not notebook.with_suffix(".sage").exists():
                update(public / notebook.name, notebook.read_bytes())
    if args.check and differences:
        raise SystemExit("Notebook copies are out of date:\n" + "\n".join(differences))
    print("Notebook downloads are in sync." if not differences else
          "Updated " + str(len(differences)) + " notebook/script copies.")


if __name__ == "__main__":
    main()
