#!/usr/bin/env python3
"""Execute Sage notebooks in fresh kernels; keep rendered output outside the sources.

In an activated Sage environment, run
`python scripts/check-sage-notebooks.py --output-dir /tmp/course-notebook-check`.
Requires nbformat, nbclient, and the SageMath Jupyter kernel (included in Sage).
"""
import argparse
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("notebooks", nargs="*", type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()
    notebooks = args.notebooks or [
        path.with_suffix(".ipynb")
        for course in ("number-theory", "probability-statistics")
        for path in sorted((ROOT / course / "book/notebooks").glob("*.sage"))
    ]
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for path in notebooks:
        print("Executing", path, flush=True)
        notebook = nbformat.read(path, as_version=4)
        nbformat.validate(notebook)
        assert notebook.metadata.kernelspec.name == "sagemath", path
        NotebookClient(notebook, kernel_name="sagemath", timeout=900,
                       resources={"metadata": {"path": str(path.parent.resolve())}}).execute()
        output = args.output_dir / path.name
        nbformat.write(notebook, output)
        count = sum(cell.cell_type == "code" for cell in notebook.cells)
        print(f"Passed {count} cells; rendered notebook: {output}", flush=True)


if __name__ == "__main__":
    main()
