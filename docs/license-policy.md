# 许可证策略

## 1. 维护边界

本数据库完全公开，只记录开源 IP。

第一阶段聚焦数字 IP，并重点服务 RISC-V SoC。所有收录条目都必须记录许可证状态；许可证不清晰的 IP 可以收录，但必须标记风险，不能标记为 `approved`。

## 2. 基本要求

每条 IP 至少维护以下许可证字段：

```yaml
legal:
  license: Apache-2.0
  license_file_present: true
  license_risk: low
  patent_grant: explicit
  commercial_use_allowed: true
  third_party_components: []
```

许可证名称应优先使用 SPDX 表达式，例如：

- `Apache-2.0`
- `MIT`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `ISC`
- `GPL-3.0-only`
- `LGPL-2.1-or-later`
- `Apache-2.0 OR MIT`

## 3. 风险等级

### 3.1 低风险

一般可进入正常技术评审。

- `Apache-2.0`
- `MIT`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `ISC`

其中 `Apache-2.0` 带有明确专利授权，适合优先考虑。

### 3.2 中风险

需要许可证评审后再决定是否用于项目。

- `MPL-2.0`
- `LGPL-*`
- 多许可证混合
- 仓库根目录许可证清晰，但子目录存在不同许可证
- 依赖第三方开源组件
- 许可证允许商用，但专利授权不清楚

### 3.3 高风险

可以收录为候选或风险记录，但默认不能进入 `approved`。

- `GPL-*`
- `AGPL-*`
- `unknown`
- 没有 LICENSE 文件
- README、LICENSE、源码注释互相冲突
- 自定义许可证
- 只写了“free for non-commercial use”
- 只允许研究、教学或非商业使用
- 包含来源不明的第三方代码
- 包含来源不明的 hard macro、memory macro、PHY 或工艺文件

## 4. 商业使用判断

`commercial_use_allowed` 允许值：

- `true`：许可证明确允许商业使用。
- `false`：许可证明确禁止或限制商业使用。
- `unknown`：无法确认。

如果字段为 `false` 或 `unknown`，该 IP 不能标记为 `approved`，除非团队有明确的法律评审结论。

## 5. 专利授权判断

`patent_grant` 允许值：

- `explicit`：许可证明确包含专利授权，例如 `Apache-2.0`。
- `implicit`：许可证可能隐含授权，但没有明确专利条款。
- `none`：明确没有专利授权。
- `unknown`：无法判断。

安全、密码学、接口协议、调试协议、PHY 相关 IP 需要额外关注专利风险。

## 6. 第三方组件

如果 IP 仓库中包含第三方代码、子模块、生成代码、测试库或 vendor 文件，应记录：

```yaml
third_party_components:
  - name: common_cells
    source: https://github.com/pulp-platform/common_cells
    license: Solderpad-0.51
    usage: rtl-dependency
```

第三方组件许可证不清楚时，整条 IP 的 `license_risk` 应提升到 `medium` 或 `high`。

## 7. 许可证评审流程

1. 检查仓库根目录是否存在 LICENSE。
2. 检查 README 是否声明不同许可证。
3. 检查源码文件头是否存在不同许可证。
4. 检查 submodule、vendor、third_party 目录。
5. 检查 release artifact 是否包含额外许可证。
6. 判断是否允许商业使用。
7. 判断是否存在明确专利授权。
8. 更新 `legal` 字段和 `internal.status`。

## 8. 进入 approved 的最低要求

IP 要进入 `approved`，许可证至少应满足：

- `license` 使用 SPDX 表达式。
- `license_file_present: true`。
- `commercial_use_allowed: true`。
- `license_risk` 为 `low`，或有明确人工评审记录。
- 第三方组件许可证已记录。
- 没有明显的 README/LICENSE/源码注释冲突。

## 9. 拒绝原因模板

许可证原因导致拒绝时，建议记录：

```yaml
internal:
  status: rejected
  rejection_reason: license-risk
  review_notes: docs/reviews/<ip-id>.md
  next_action: none
```

评审记录中应说明：

- 哪些文件导致风险。
- 风险属于商用限制、专利不清、第三方来源不明，还是许可证冲突。
- 是否有联系上游澄清的可能。
