# 贡献指南

## 1. 数据库范围

本数据库完全公开，只记录开源芯片 IP。

第一阶段只聚焦数字 IP，重点服务 RISC-V SoC。以下内容暂不作为第一阶段重点：

- 商业闭源 IP。
- 模拟 IP。
- PHY。
- hard macro。
- 工艺绑定的 memory macro。
- 仅内部可见的项目使用信息。

## 2. 贡献方式

第一阶段支持两种贡献方式：

1. 提交推荐链接。
2. 直接提交 YAML PR。

Web 表单录入会在后续阶段实现。当前阶段先用 GitHub issue 和 PR 保证数据标准稳定。

## 3. 推荐一个 IP

如果你不确定如何填写完整 YAML，可以先提交推荐信息：

```text
IP 名称：
仓库链接：
项目主页：
功能类别：
为什么值得收录：
已知许可证：
是否用于 RISC-V SoC：
```

维护者会先将其标记为候选，后续再补充完整字段。

## 4. 直接提交 YAML

新增 IP 时，在对应分类下创建文件：

```text
data/ip/<category>/<ip-id>.yaml
```

示例：

```text
data/ip/peripheral/uart-16550-opencores.yaml
```

`ip-id` 应使用 kebab-case，并尽量包含功能和来源，避免重名。

推荐格式：

```text
<function>-<project-or-owner>
```

示例：

- `uart-16550-opencores`
- `riscv-core-ibex`
- `riscv-core-cva6`
- `interconnect-axi-pulp`
- `gpio-opentitan`

## 5. 最低必填信息

新增候选 IP 至少应填写：

```yaml
id:
name:
summary:
category:
subcategories:
ip_family:
implementation_style:
links:
  homepage:
  repository:
  documentation:
upstream:
  owner:
  status:
  default_branch:
technical:
  languages:
  interfaces:
  dependencies:
legal:
  license:
  license_file_present:
  license_risk:
  commercial_use_allowed:
quality:
  maturity:
  verification:
internal:
  status: candidate
metadata:
  first_seen_at:
  last_reviewed_at:
```

如果无法确认某个字段，使用 `unknown` 或 `null`，不要猜测。

## 6. 版本要求

如果提交的是已评估 IP，必须记录具体版本：

```yaml
tracking:
  current_ref: v1.0.0
  current_ref_type: release
  baseline_ref: v1.0.0
  baseline_reviewed_at: 2026-06-09
  update_policy: manual

versions:
  - ref: v1.0.0
    ref_type: release
    commit: <commit-hash>
    released_at:
    reviewed_at:
    maturity:
    license:
    verification_summary:
    change_summary:
    risk_notes: []
```

生产或流片相关结论必须绑定 commit hash，不能只写 branch。

## 7. 许可证要求

贡献者应尽量填写 SPDX 许可证表达式。

如果许可证不清楚：

```yaml
legal:
  license: unknown
  license_file_present: false
  license_risk: high
  commercial_use_allowed: unknown
```

许可证不清楚的 IP 可以作为候选收录，但不能标记为 `approved`。

## 8. 同类型 IP 区分

同类 IP 必须填写用于比较的字段。

以 UART 为例：

```yaml
ip_family: uart
implementation_style: standard-compatible
compatibility:
  - ns16550-compatible
register_model: ns16550
features:
  - fifo
  - interrupt
integration_profile:
  - wishbone-slave
best_for:
  - linux-capable-soc
not_recommended_for:
  - ultra-small-mcu
```

不要只写：

```yaml
category: peripheral
subcategories:
  - uart
```

这种信息不足以完成同类比较。

## 9. PR 检查项

提交 PR 前请确认：

- 文件路径和 `category` 一致。
- `id` 与文件名一致。
- 仓库链接可访问。
- 许可证字段没有猜测。
- 分类符合 `docs/taxonomy.md`。
- 许可证风险符合 `docs/license-policy.md`。
- 已评估版本绑定 commit。
- 明显风险已写入 `known_issues`、`risk_notes` 或 `integration_notes`。

## 10. 不接受的贡献

以下内容暂不接受：

- 闭源 IP。
- 无法确认来源的代码。
- 只提供二进制或网表，缺少开源 RTL。
- 与芯片 IP 无关的软件库。
- 只包含营销描述，没有源码仓库。
- 要求数据库隐藏来源或许可证信息的条目。

## 11. 维护者审核

维护者审核重点：

- 是否符合公开开源数字 IP 范围。
- 是否有助于 RISC-V SoC 选型。
- 分类和标签是否准确。
- 许可证风险是否清楚。
- 是否需要进入人工评审。
- 是否存在更合适的同类 IP 对比对象。
