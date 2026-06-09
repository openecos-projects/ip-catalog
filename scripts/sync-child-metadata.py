#!/usr/bin/env python3
"""Sync child repository ip.yaml files into data/ip/<category>/<uid>.yaml."""

from __future__ import annotations

from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

import yaml


ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data" / "registry.yaml"
DATA_IP_DIR = ROOT / "data" / "ip"


class IndentedDumper(yaml.SafeDumper):
    def increase_indent(self, flow: bool = False, indentless: bool = False) -> None:
        return super().increase_indent(flow, False)


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{path}: expected YAML mapping at document root")
    return data


def dump_yaml(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rendered = yaml.dump(
        data,
        Dumper=IndentedDumper,
        allow_unicode=True,
        sort_keys=False,
        default_flow_style=False,
        width=1000,
    )
    path.write_text(rendered, encoding="utf-8")


def github_raw_url(repository: str, branch: str, metadata_path: str) -> str:
    prefix = "https://github.com/"
    if not repository.startswith(prefix):
        raise ValueError(f"Only GitHub HTTPS repositories are supported: {repository}")
    owner_repo = repository.removeprefix(prefix).rstrip("/")
    return f"https://raw.githubusercontent.com/{owner_repo}/{branch}/{metadata_path.lstrip('/')}"


def fetch_yaml(url: str) -> dict[str, Any]:
    try:
        with urlopen(url, timeout=30) as response:
            raw = response.read().decode("utf-8")
    except HTTPError as exc:
        raise RuntimeError(f"HTTP {exc.code} while fetching {url}") from exc
    except URLError as exc:
        raise RuntimeError(f"Failed to fetch {url}: {exc.reason}") from exc

    data = yaml.safe_load(raw) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{url}: expected YAML mapping at document root")
    return data


def sync_child(child: dict[str, Any]) -> Path:
    uid = child.get("uid")
    repository = child.get("repository")
    branch = child.get("branch", "main")
    metadata_path = child.get("metadata_path", "ip.yaml")

    if not uid or not repository:
        raise ValueError(f"Invalid registry entry: {child}")

    url = github_raw_url(repository, branch, metadata_path)
    data = fetch_yaml(url)

    if data.get("uid") != uid:
        raise ValueError(f"{url}: uid mismatch, expected {uid}, got {data.get('uid')}")

    category = data.get("category")
    if not category:
        raise ValueError(f"{url}: missing required category")

    links = data.setdefault("links", {})
    links.setdefault("catalog_repository", repository)

    catalog = data.setdefault("catalog", {})
    catalog.setdefault("repository", "git@github.com:openecos-projects/ip-catalog.git")
    catalog["path"] = f"data/ip/{category}/{uid}.yaml"

    output = DATA_IP_DIR / category / f"{uid}.yaml"
    dump_yaml(output, data)

    for stale in DATA_IP_DIR.glob(f"**/{uid}.yaml"):
        if stale != output:
            stale.unlink()

    return output


def main() -> None:
    registry = load_yaml(REGISTRY)
    children = registry.get("children", [])
    if not isinstance(children, list):
        raise ValueError(f"{REGISTRY}: children must be a list")

    synced: list[Path] = []
    for child in children:
        if not isinstance(child, dict):
            raise ValueError(f"{REGISTRY}: child entry must be a mapping")
        synced.append(sync_child(child))

    print(f"Synced {len(synced)} child metadata files")
    for path in synced:
        print(f"- {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
