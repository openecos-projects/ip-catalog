# 单 IP 子仓库结构规范

## 1. 目标

本规范用于约束单个 IP 仓库的命名、目录结构、元数据和维护方式。

总仓库 `ip-catalog` 负责维护所有 IP 的索引、分类、评审、唯一编号和子仓库地址。单 IP 子仓库用于承载某个具体 IP 的镜像、适配、补丁、验证记录或封装资产。

`ip-catalog` 不维护单 IP 子仓库的工作副本，也不在主仓库中提交 `child-repos/` 目录。

## 2. 仓库命名

单 IP 仓库统一使用数据库分配的唯一 ID：

```text
ip-000000
ip-000002
ip-000003
```

规则：

- 格式为 `ip-` + 6 位递增数字。
- 编号由 `ip-catalog` 分配。
- 编号只递增，不复用。
- 废弃、删除、迁移后的编号也不回收。
- 仓库名不表达 IP 类型、来源或特性。
- 前端展示和同类比较依赖 `ip-catalog` 中的结构化字段。

示例：

```text
openecos-projects/ip-000000
openecos-projects/ip-000001
```

## 3. 与 ip-catalog 的关系

`ip-catalog` 中的记录是权威索引。

单 IP 仓库必须能被 `ip-catalog` 中的 `uid` 对应：

```yaml
uid: ip-000000
repo_name: ip-000000
links:
  catalog_repository: https://github.com/openecos-projects/ip-000000
slug: uart-opencores-16550
display_name: UART
ip_family: uart
category: peripheral
```

单 IP 仓库内也应保留同一个 `uid`，避免仓库被移动或 fork 后丢失身份。

## 4. 推荐目录结构

```text
ip-000000/
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
  .github/
    workflows/
      validate.yml
```

目录说明：

| 路径 | 说明 | 是否必需 |
| --- | --- | --- |
| `README.md` | IP 摘要、来源、当前状态、使用方式 | 必需 |
| `ip.yaml` | 子仓库本地元数据，包含 `uid`、来源、版本、许可证摘要 | 必需 |
| `upstream.lock` | 上游来源和锁定版本 | 必需 |
| `rtl/` | RTL 源码或上游源码镜像 | 可选 |
| `sim/` | 仿真工程、仿真脚本 | 可选 |
| `formal/` | 形式验证脚本和属性 | 可选 |
| `tb/` | testbench、cocotb、UVM 环境 | 可选 |
| `docs/` | 本地补充文档、评审记录、集成说明 | 可选 |
| `patches/` | 对上游的补丁 | 可选 |
| `wrappers/` | SoC 集成 wrapper、总线适配层 | 可选 |
| `constraints/` | FPGA/ASIC 约束文件 | 可选 |
| `scripts/` | 拉取、构建、仿真、校验脚本 | 可选 |
| `reports/` | lint、仿真、综合、覆盖率等报告摘要 | 可选 |

空目录不需要提前创建。只有确实存在内容时再加入。

## 5. 最小仓库结构

如果暂时只建立子仓库占位，最小结构为：

```text
ip-000000/
  README.md
  ip.yaml
  upstream.lock
```

## 6. README 要求

`README.md` 至少包含：

- UID。
- 显示名称。
- 功能族。
- 上游仓库链接。
- 当前锁定版本。
- 许可证摘要。
- 当前状态。
- 本仓库是否包含 RTL 镜像。
- 与 `ip-catalog` 的对应关系。

示例：

```markdown
# ip-000000

Display name: UART

UID: ip-000000

Family: uart

Upstream: https://github.com/freecores/uart16550

Current baseline: v1.0.0 / commit abc123

License: unknown

Status: candidate

This repository is managed as a child repository of `ip-catalog`.
```

## 7. ip.yaml 要求

`ip.yaml` 是子仓库内部的最小元数据，不替代 `ip-catalog` 中的完整记录。

示例：

```yaml
uid: ip-000000
repo_name: ip-000000
catalog:
  repository: git@github.com:openecos-projects/ip-catalog.git
  path: data/ip/peripheral/ip-000000.yaml

display_name: UART
ip_family: uart
category: peripheral
slug: uart-opencores-16550

upstream:
  repository: https://github.com/freecores/uart16550
  homepage: https://opencores.org/projects/uart16550
  ref: master
  ref_type: branch
  commit: null

legal:
  license: unknown
  license_file_present: false
  license_risk: high

status: candidate
```

## 8. upstream.lock 要求

`upstream.lock` 用于记录本仓库对应的上游来源和锁定版本。

示例：

```text
uid: ip-000000
upstream_repository: https://github.com/freecores/uart16550
upstream_ref: master
upstream_ref_type: branch
upstream_commit:
mirrored_at:
mirror_policy: reference-only
```

`mirror_policy` 允许值：

- `reference-only`：只记录上游链接，不镜像 RTL。
- `source-mirror`：镜像上游源码。
- `patched-mirror`：镜像源码并维护本地补丁。
- `wrapper-only`：不镜像源码，只维护 wrapper、脚本或集成资产。

## 9. RTL 存放策略

第一阶段建议默认使用 `reference-only`，也就是不把上游 RTL 复制进子仓库。

只有满足以下情况时，才建议镜像源码：

- 上游不稳定，存在丢失风险。
- 团队需要维护补丁。
- 团队需要固定一个可复现 baseline。
- 上游仓库结构复杂，需要裁剪或封装。
- 需要长期保存已验证版本。

如果镜像 RTL，应放在：

```text
rtl/
```

并在 `upstream.lock` 记录 commit。

## 10. 补丁策略

本地修改不要直接混入无法追踪的源码，应优先使用 patch。

推荐结构：

```text
patches/
  0001-fix-reset-polarity.patch
  0002-add-apb-wrapper.patch
```

如果维护了本地 patched mirror，必须在 `README.md` 和 `ip.yaml` 中说明：

- 基于哪个上游 commit。
- 应用了哪些 patch。
- patch 是否计划 upstream。
- patch 是否改变接口、寄存器或许可证边界。

## 11. Wrapper 策略

总线适配、寄存器封装、时钟复位适配建议放在：

```text
wrappers/
```

示例：

```text
wrappers/
  apb/
  axi4-lite/
  wishbone/
```

Wrapper 应尽量不修改上游 RTL，便于后续升级。

## 12. 验证和报告

如果子仓库包含验证资产，建议结构为：

```text
tb/
sim/
formal/
reports/
```

报告目录只提交摘要，不提交大型波形和构建产物。

允许提交：

- lint summary。
- simulation summary。
- formal summary。
- synthesis summary。
- coverage summary。

不应提交：

- `.vcd`
- `.fst`
- `.fsdb`
- 大型 build 目录。
- 工具临时数据库。

## 13. 分支策略

推荐分支：

- `main`：当前维护版本。
- `upstream/<ref>`：可选，上游镜像分支。
- `integration/<project>`：可选，项目集成分支。
- `archive/<date>`：可选，归档分支。

第一阶段可以只使用 `main`。

## 14. Tag 策略

如果子仓库形成内部 baseline，可以打 tag：

```text
baseline-2026-06-09
used-by-<project>-2026-06-09
```

tag 必须能对应 `ip-catalog` 中的 `versions` 或 `internal.used_versions` 记录。

## 15. 废弃和归档

如果某个 IP 不再推荐使用，不删除仓库。

处理方式：

- 在 `ip-catalog` 中标记 `deprecated` 或 `rejected`。
- 在子仓库 README 顶部说明状态。
- 如果 GitHub 仓库归档，保留 `uid` 和历史。
- 编号不回收。

## 16. 子仓库 .gitignore 建议

单 IP 仓库应忽略仿真、EDA 和构建产物。

可复用 `ip-catalog` 的 `.gitignore`，并根据具体工具增加规则。

## 17. 创建子仓库流程

1. 在 `ip-catalog` 中分配新的 `uid`。
2. 创建 `data/ip/<category>/<uid>.yaml`。
3. 创建 GitHub 子仓库 `openecos-projects/<uid>`。
4. 在子仓库添加 `README.md`、`ip.yaml`、`upstream.lock`。
5. 在 `ip-catalog` 中记录 `repo_name` 和子仓库 URL。
6. 如需镜像源码，记录 `upstream.lock` 并提交对应源码或 patch。
7. 提交 PR，经过 CI 和维护者 review 后合并。

## 18. 不建议的做法

- 用 `uart`、`spi`、`gpio` 这类通用词作为仓库名。
- 用仓库名表达过多特征。
- 删除废弃 IP 仓库并复用编号。
- 在没有 commit 锁定的情况下记录生产采用结论。
- 把大型仿真波形、工具数据库、下载包提交进仓库。
- 未说明来源就复制第三方 RTL。
