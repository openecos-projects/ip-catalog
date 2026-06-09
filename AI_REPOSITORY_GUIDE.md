# AI Repository Guide

This file is the primary instruction file for AI agents and automation working with this repository.

## Repository Role

This repository is `ip-catalog`.

It is the public source of truth for open-source chip IP metadata. The current scope is open-source digital IP for RISC-V SoC design.

This repository does not store child IP repository working copies.

## Main Rules

- Manage catalog metadata only in this repository.
- Do not create or commit `child-repos/` in this repository.
- Do not vendor upstream RTL source code into `ip-catalog`.
- Treat child repository `ip.yaml` files as the source of truth for individual IP records.
- Treat `data/ip/<category>/<uid>.yaml` as synchronized mirror data generated from child repositories.
- Do not put simulation outputs, EDA build products, waveforms, downloaded source archives, or local secrets into this repository.
- Every IP record must have a stable UID.
- UID format is `ip-` plus six digits, for example `ip-000000`.
- UIDs are assigned by `ip-catalog`, increase monotonically, and are never reused.
- A child repository uses the same UID as its repository name.

## Important Paths

```text
README.md
AI_REPOSITORY_GUIDE.md
docs/
data/ip/<category>/<uid>.yaml
data/registry.yaml
schemas/
scripts/
generated/
site/
```

## IP Record Path

Each synchronized IP record is stored at:

```text
data/ip/<category>/<uid>.yaml
```

Example:

```text
data/ip/peripheral/ip-000000.yaml
```

Do not manually edit synchronized IP records for long-term changes. Update the corresponding child repository `ip.yaml`, then run the sync script.

## Child Registry

Child repositories are listed in:

```text
data/registry.yaml
```

Example:

```yaml
children:
  - uid: ip-000000
    repository: https://github.com/openecos-projects/ip-000000
    branch: main
    metadata_path: ip.yaml
```

## Required Identity Fields

Each IP record should include:

```yaml
uid: ip-000000
repo_name: ip-000000
slug: uart
display_name: SYS_UART
category: peripheral
ip_family: uart
links:
  catalog_repository: https://github.com/openecos-projects/ip-000000
```

Field meanings:

- `uid`: stable catalog identity and child repository name.
- `repo_name`: child repository name.
- `slug`: human-readable alias, not a primary key.
- `display_name`: frontend display name.
- `category`: top-level catalog category.
- `ip_family`: functional family for grouping and comparison.
- `links.catalog_repository`: URL of the child repository.

## Child Repository Rules

Child repositories are separate GitHub repositories under:

```text
https://github.com/openecos-projects/<uid>
```

Example:

```text
https://github.com/openecos-projects/ip-000000
```

When organizing a child repository, follow:

```text
docs/ip-repository-standard.md
```

Minimum child repository structure:

```text
<uid>/
  README.md
  ip.yaml
  upstream.lock
```

Recommended child repository structure:

```text
<uid>/
  README.md
  ip.yaml
  upstream.lock
  rtl/
  sim/
  formal/
  tb/
  docs/
  patches/
  wrappers/
  constraints/
  scripts/
  reports/
```

The child repository must keep the same `uid` as the catalog record.

## Index Generation

After adding or editing child repository metadata, synchronize records and regenerate generated indexes:

```bash
python3 scripts/sync-child-metadata.py
python3 scripts/generate-index.py
```

If only local catalog YAML files changed, regenerate generated indexes:

```bash
python3 scripts/generate-index.py
```

Generated outputs:

```text
generated/index.md
generated/index.json
```

## Child Metadata Sync

Child metadata sync is automated by:

```text
.github/workflows/sync-child-metadata.yml
```

The workflow:

1. Reads `data/registry.yaml`.
2. Fetches each child repository `ip.yaml`.
3. Verifies the child `uid`.
4. Writes `data/ip/<category>/<uid>.yaml`.
5. Regenerates `generated/index.md` and `generated/index.json`.
6. Commits directly to `main` if there are changes.

Direct commit is intentional because child repositories are maintained by the same team and `ip-catalog` is the aggregate display repository.

## GitHub Pages

Repository-level GitHub Pages is deployed by:

```text
.github/workflows/pages.yml
```

The workflow deploys:

```text
site/index.html -> /index.html
site/i18n/value-labels.json -> /i18n/value-labels.json
generated/index.json -> /generated/index.json
generated/index.md -> /generated/index.md
```

Public URL:

```text
https://openecos-projects.github.io/ip-catalog/
```

## Current First IP

Current first IP:

```yaml
uid: ip-000000
display_name: SYS_UART
ip_family: uart
category: peripheral
links:
  catalog_repository: https://github.com/openecos-projects/ip-000000
```

Catalog record:

```text
data/ip/peripheral/ip-000000.yaml
```

## Source Documents

Use these documents for detailed rules:

- `docs/taxonomy.md`
- `docs/license-policy.md`
- `docs/review-checklist.md`
- `docs/contribution-guide.md`
- `docs/ip-repository-standard.md`
- `docs/implementation-roadmap.md`
