#!/usr/bin/env python3
"""Generate a Markdown IP index from data/ip/**/*.yaml."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "ip"
OUTPUT = ROOT / "generated" / "index.md"


def load_ip_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []

    for path in sorted(DATA_DIR.glob("**/*.yaml")):
        with path.open("r", encoding="utf-8") as f:
            record = yaml.safe_load(f) or {}

        if not isinstance(record, dict):
            raise ValueError(f"{path}: expected YAML mapping at document root")

        record["_path"] = path.relative_to(ROOT).as_posix()
        records.append(record)

    return records


def value(record: dict[str, Any], *keys: str, default: str = "") -> Any:
    current: Any = record
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]
    return default if current is None else current


def text(value_: Any) -> str:
    if value_ is None:
        return ""
    if isinstance(value_, list):
        return ", ".join(str(item) for item in value_)
    return str(value_)


def escape_md(value_: Any) -> str:
    return text(value_).replace("|", "\\|").replace("\n", " ")


def render_index(records: list[dict[str, Any]]) -> str:
    lines: list[str] = [
        "# IP Catalog Index",
        "",
        f"Total IP records: {len(records)}",
        "",
        "| UID | Name | Family | Category | Status | License | Maturity | Source |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]

    for record in sorted(records, key=lambda item: str(item.get("uid", ""))):
        uid = escape_md(record.get("uid", ""))
        name = escape_md(record.get("display_name") or record.get("name", ""))
        family = escape_md(record.get("ip_family", ""))
        category = escape_md(record.get("category", ""))
        status = escape_md(value(record, "internal", "status"))
        license_ = escape_md(value(record, "legal", "license"))
        maturity = escape_md(value(record, "quality", "maturity"))
        source = escape_md(value(record, "upstream", "owner"))
        path = record["_path"]

        lines.append(
            f"| [{uid}](../{path}) | {name} | {family} | {category} | "
            f"{status} | {license_} | {maturity} | {source} |"
        )

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- `candidate` records are not approved for project use.",
            "- `unknown` license records require manual review before approval.",
            "- This file is generated from `data/ip/**/*.yaml`.",
        ]
    )

    return "\n".join(lines) + "\n"


def main() -> None:
    records = load_ip_records()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render_index(records), encoding="utf-8")
    print(f"Generated {OUTPUT.relative_to(ROOT)} with {len(records)} records")


if __name__ == "__main__":
    main()
