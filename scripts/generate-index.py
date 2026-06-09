#!/usr/bin/env python3
"""Generate Markdown and JSON IP indexes from data/ip/**/*.yaml."""

from __future__ import annotations

import json
from pathlib import Path
from datetime import date, datetime
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "ip"
MARKDOWN_OUTPUT = ROOT / "generated" / "index.md"
JSON_OUTPUT = ROOT / "generated" / "index.json"


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


def json_value(value_: Any) -> Any:
    if isinstance(value_, (date, datetime)):
        return value_.isoformat()
    if isinstance(value_, list):
        return [json_value(item) for item in value_]
    if isinstance(value_, dict):
        return {key: json_value(item) for key, item in value_.items()}
    return value_


def escape_md(value_: Any) -> str:
    return text(value_).replace("|", "\\|").replace("\n", " ")


def compact_record(record: dict[str, Any]) -> dict[str, Any]:
    return json_value({
        "uid": record.get("uid", ""),
        "repo_name": record.get("repo_name", ""),
        "slug": record.get("slug", ""),
        "display_name": record.get("display_name") or record.get("name", ""),
        "summary": record.get("summary", ""),
        "summary_zh": record.get("summary_zh", ""),
        "category": record.get("category", ""),
        "subcategories": record.get("subcategories", []),
        "ip_family": record.get("ip_family", ""),
        "implementation_style": record.get("implementation_style", ""),
        "compatibility": record.get("compatibility", []),
        "features": record.get("features", []),
        "integration_profile": record.get("integration_profile", []),
        "resource_profile": record.get("resource_profile", ""),
        "performance_profile": record.get("performance_profile", ""),
        "best_for": record.get("best_for", []),
        "not_recommended_for": record.get("not_recommended_for", []),
        "catalog_repository": value(record, "links", "catalog_repository"),
        "ip_repository": value(record, "links", "catalog_repository"),
        "upstream_repository": value(record, "links", "repository"),
        "homepage": value(record, "links", "homepage"),
        "documentation": value(record, "links", "documentation"),
        "upstream_owner": value(record, "upstream", "owner"),
        "upstream_status": value(record, "upstream", "status"),
        "current_ref": value(record, "tracking", "current_ref"),
        "current_ref_type": value(record, "tracking", "current_ref_type"),
        "languages": value(record, "technical", "languages", default=[]),
        "interfaces": value(record, "technical", "interfaces", default=[]),
        "bus_compatibility": value(record, "technical", "bus_compatibility", default=[]),
        "target_process": value(record, "technical", "target_process"),
        "fpga_support": value(record, "technical", "fpga_support"),
        "asic_support": value(record, "technical", "asic_support"),
        "maturity": value(record, "quality", "maturity"),
        "documentation_quality": value(record, "quality", "documentation_quality"),
        "integration_difficulty": value(record, "quality", "integration_difficulty"),
        "license": value(record, "legal", "license"),
        "license_risk": value(record, "legal", "license_risk"),
        "commercial_use_allowed": value(record, "legal", "commercial_use_allowed"),
        "status": value(record, "internal", "status"),
        "next_action": value(record, "internal", "next_action"),
        "data_quality": value(record, "metadata", "data_quality"),
        "last_reviewed_at": value(record, "metadata", "last_reviewed_at"),
        "path": record["_path"],
    })


def render_json(records: list[dict[str, Any]]) -> str:
    compact = [compact_record(record) for record in records]
    compact.sort(key=lambda item: str(item.get("uid", "")))
    return json.dumps(
        {
            "generated_from": "data/ip/**/*.yaml",
            "total": len(compact),
            "records": compact,
        },
        ensure_ascii=False,
        indent=2,
    ) + "\n"


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
    MARKDOWN_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    MARKDOWN_OUTPUT.write_text(render_index(records), encoding="utf-8")
    JSON_OUTPUT.write_text(render_json(records), encoding="utf-8")
    print(f"Generated {MARKDOWN_OUTPUT.relative_to(ROOT)} with {len(records)} records")
    print(f"Generated {JSON_OUTPUT.relative_to(ROOT)} with {len(records)} records")


if __name__ == "__main__":
    main()
