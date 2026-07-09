#!/usr/bin/env python3
"""Ensure markdown docs have paired txt mirrors with matching slugs."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

SLUGS = [
    "sudoku",
    "chess",
    "checkers",
    "go",
    "logic-puzzles",
    "nonogram",
    "sorting-puzzle",
    "unscrew-puzzle",
    "bubble-shooter",
    "domino",
    "spider-solitaire",
    "n-queens",
    "crosswords",
]


def main() -> int:
    pairs = [
        ("GAMES.md", "GAMES.txt", SLUGS),
        ("REQUIREMENTS.md", "REQUIREMENTS.txt", SLUGS),
        ("GOALS.md", "GOALS.txt", ["sudoku", "chess", "crosswords"]),
    ]
    for md_name, txt_name, slugs in pairs:
        md = DOCS / md_name
        txt = DOCS / txt_name
        if not md.is_file() or not txt.is_file():
            print(f"missing pair {md_name} / {txt_name}", file=sys.stderr)
            return 1
        md_text = md.read_text(encoding="utf-8")
        txt_text = txt.read_text(encoding="utf-8")
        for slug in slugs:
            if slug not in md_text:
                print(f"{md_name}: missing slug {slug}", file=sys.stderr)
                return 1
            if slug not in txt_text and slug.replace("-", " ") not in txt_text:
                print(f"{txt_name}: missing slug {slug}", file=sys.stderr)
                return 1
        if md_name == "REQUIREMENTS.md" and "Must" in md_text and "Must" not in txt_text:
            print(f"{txt_name}: missing Must sections", file=sys.stderr)
            return 1
        if md_name == "GOALS.md":
            for phrase in ("Success criteria", "Not in scope"):
                if phrase not in md_text or phrase not in txt_text:
                    print(f"{md_name}/{txt_name}: missing {phrase}", file=sys.stderr)
                    return 1

    print("docs pairs ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
