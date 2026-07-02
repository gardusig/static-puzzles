#!/usr/bin/env python3
"""Create one GitHub issue per planned game in games.yaml (dry-run by default)."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

REPO = "gardusig/static-puzzles"


def parse_games(games_yaml: Path) -> list[dict]:
    text = games_yaml.read_text(encoding="utf-8")
    blocks = re.split(r"\n  ([\w-]+):\n", "\n" + text)
    games = []
    for i in range(1, len(blocks), 2):
        slug = blocks[i]
        body = blocks[i + 1]

        def field(name: str) -> str:
            m = re.search(rf"^\s+{name}:\s*(.+)$", body, re.M)
            return m.group(1).strip().strip('"') if m else ""

        if field("status") != "planned" or field("github_issue") not in ("null", "", "None"):
            continue

        tags_m = re.search(r"tags:\s*\[(.*?)\]", body, re.S)
        tags = [t.strip() for t in tags_m.group(1).split(",")] if tags_m else []

        games.append(
            {
                "slug": slug,
                "title": field("title"),
                "priority": field("priority") or "medium",
                "description": field("description"),
                "tags": tags,
            }
        )
    return games


def must_section(req_md: Path, slug: str) -> str:
    text = req_md.read_text(encoding="utf-8")
    pattern = rf"## {re.escape(slug)} \{{#{re.escape(slug)}\}}\n\n(.*?)(?=\n---|\n## |\Z)"
    section = re.search(pattern, text, re.S)
    if not section:
        return ""
    m = re.search(r"\*\*Must\*\*\n\n(.*?)(?=\n\*\*Should\*\*|\n\*\*Data\*\*|\Z)", section.group(1), re.S)
    return m.group(1).strip() if m else ""


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    create = "--create" in sys.argv
    games = parse_games(root / "games.yaml")
    req_md = root / "docs" / "REQUIREMENTS.md"

    if not games:
        print("No planned games without github_issue.")
        return 0

    for g in games:
        slug = g["slug"]
        must = must_section(req_md, slug)
        body = f"""## {g['title']} (`{slug}`)

{g['description']}

**Priority:** {g['priority']}
**Tags:** {", ".join(g['tags'])}

### Must (from REQUIREMENTS.md)

{must or "_See docs/REQUIREMENTS.md_"}

### Definition of done

- [ ] Route `/play/{slug}` loads in Chrome
- [ ] Data under `games/{slug}/data/`
- [ ] `games.yaml` → `status: active`, `github_issue` set
"""
        print(f"--- {slug}: {g['title']} ---")
        if create:
            r = subprocess.run(
                [
                    "gh", "issue", "create",
                    "--repo", REPO,
                    "--title", f"[game] {g['title']}",
                    "--label", "game",
                    "--body", body,
                ],
                capture_output=True,
                text=True,
            )
            if r.returncode != 0:
                print(r.stderr, file=sys.stderr)
                return r.returncode
            print(r.stdout.strip())
        else:
            print(body[:400] + ("..." if len(body) > 400 else ""))
            print("(dry-run; pass --create to open issues)\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
