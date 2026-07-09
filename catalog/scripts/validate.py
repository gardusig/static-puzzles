#!/usr/bin/env python3
"""Validate catalog YAML shape."""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    if not isinstance(data, dict):
        raise ValueError(f"{path.name}: expected mapping at root")
    return data


def main() -> int:
    games_doc = load(ROOT / "games.yaml")
    tags_doc = load(ROOT / "tags.yaml")

    games = games_doc.get("games")
    if not isinstance(games, dict) or not games:
        print("games.yaml: missing non-empty games map", file=sys.stderr)
        return 1

    tags = tags_doc.get("tags")
    if not isinstance(tags, dict) or not tags:
        print("tags.yaml: missing non-empty tags map", file=sys.stderr)
        return 1

    for slug, entry in games.items():
        if not isinstance(entry, dict):
            print(f"games.yaml: {slug} must be a mapping", file=sys.stderr)
            return 1
        if entry.get("slug") != slug:
            print(f"games.yaml: {slug} slug field mismatch", file=sys.stderr)
            return 1

    manifest = ROOT / "src/games/hub/data/manifest.yaml"
    if not manifest.is_file():
        print(f"missing {manifest}", file=sys.stderr)
        return 1

    print(f"catalog ok ({len(games)} games, {len(tags)} tags)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
