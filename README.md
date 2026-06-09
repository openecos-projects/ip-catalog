# ip-catalog

`ip-catalog` is a public catalog of open-source chip IP.

The first implementation phase focuses on open-source digital IP for RISC-V SoC design, evaluation, and integration.

## Scope

Currently in scope:

- Open-source digital IP.
- RISC-V SoC building blocks.
- IP metadata, version tracking, license status, verification status, and review notes.

Currently out of scope for the first phase:

- Closed-source or commercial IP.
- Analog IP.
- PHY.
- Hard macro.
- Process-bound memory macro.

## Repository Layout

```text
ip-catalog/
  docs/        # Plans, taxonomy, contribution rules, review checklist.
  data/        # Structured IP metadata.
  schemas/     # JSON Schema definitions.
  scripts/     # Validation, index generation, metadata sync.
  generated/   # Generated indexes and reports.
```

## Data Model

Each IP is stored as one YAML file named by its stable UID:

```text
data/ip/<category>/<uid>.yaml
```

Examples:

```text
data/ip/peripheral/ip-000000.yaml
data/ip/processor/ip-000001.yaml
data/ip/interconnect/ip-000002.yaml
```

This repository stores metadata and review information. It does not vendor the full upstream RTL source code.

## Current Phase

The project is currently implementing P0/P1:

- P0: scope, taxonomy, license policy, review process, contribution rules.
- P1: Git repository MVP and first representative IP records.

See:

- [AI repository guide](AI_REPOSITORY_GUIDE.md)
- [Web catalog](site/index.html)
- [IP index](generated/index.md)
- [Database plan](docs/ip-database-plan.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Taxonomy](docs/taxonomy.md)
- [License policy](docs/license-policy.md)
- [Review checklist](docs/review-checklist.md)
- [Contribution guide](docs/contribution-guide.md)
- [Single IP repository standard](docs/ip-repository-standard.md)
