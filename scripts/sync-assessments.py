#!/usr/bin/env python3
"""Mirror listed student PDFs to public/ and instructor PDFs to private/ only."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = Path(__file__).with_name("assessment-catalog.json")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    differences = []

    def update(path, data):
        if path.exists() and path.read_bytes() == data:
            return
        differences.append(str(path.relative_to(ROOT)))
        if not args.check:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)

    for course, entries in json.loads(CATALOG.read_text()).items():
        website = ROOT / course / "website"
        public_entries = []
        for entry in entries:
            assert Path(entry["studentFile"]).name == entry["studentFile"]
            assert entry["id"].replace("-", "").isalnum()
            student = (ROOT / course / entry["studentSource"]).read_bytes()
            instructor = (ROOT / course / entry["instructorSource"]).read_bytes()
            assert student.startswith(b"%PDF-") and instructor.startswith(b"%PDF-")
            assert student != instructor, f"Student and instructor editions match: {entry['id']}"
            update(website / "public" / entry["studentFile"], student)
            update(website / "private" / f"{entry['id']}.pdf", instructor)
            public_entries.append({key: value for key, value in entry.items()
                                   if key not in ("studentSource", "instructorSource")})
        data = (json.dumps(public_entries, ensure_ascii=False, indent=2) + "\n").encode()
        update(website / "content/assessments.json", data)

    if args.check and differences:
        raise SystemExit("Assessment copies are out of date:\n" + "\n".join(differences))
    print("Assessment editions are in sync." if not differences else
          f"Updated {len(differences)} assessment files; instructor PDFs remain private.")


if __name__ == "__main__":
    main()
