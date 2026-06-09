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

Each IP is stored as one YAML file:

```text
data/ip/<category>/<ip-id>.yaml
```

Examples:

```text
data/ip/peripheral/uart-16550-opencores.yaml
data/ip/processor/riscv-core-ibex.yaml
data/ip/interconnect/axi-pulp.yaml
```

This repository stores metadata and review information. It does not vendor the full upstream RTL source code.

## Current Phase

The project is currently implementing P0/P1:

- P0: scope, taxonomy, license policy, review process, contribution rules.
- P1: Git repository MVP and first representative IP records.

See:

- [AI repository guide](AI_REPOSITORY_GUIDE.md)
- [IP index](generated/index.md)
- [Database plan](docs/ip-database-plan.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Taxonomy](docs/taxonomy.md)
- [License policy](docs/license-policy.md)
- [Review checklist](docs/review-checklist.md)
- [Contribution guide](docs/contribution-guide.md)
- [Single IP repository standard](docs/ip-repository-standard.md)
