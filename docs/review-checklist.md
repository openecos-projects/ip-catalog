# IP 评审 Checklist

## 1. 评审目标

本 checklist 用于判断一个开源数字 IP 是否适合 RISC-V SoC 项目进一步采用。

评审结论必须绑定具体版本、tag 或 commit。不能只基于上游默认分支给出长期有效结论。

## 2. 状态流转

```text
candidate
  -> evaluating
  -> approved
  -> used

candidate
  -> evaluating
  -> rejected

approved
  -> needs-review
  -> approved / rejected / deprecated
```

状态含义：

- `candidate`：已收录，尚未完整评审。
- `evaluating`：正在做技术、许可证或集成评审。
- `approved`：已通过当前版本评审，可进入项目选型。
- `used`：已被团队项目实际采用。
- `rejected`：已评审但不推荐使用。
- `needs-review`：上游变化或内部需求变化后需要重新评审。
- `deprecated`：曾经可用，但现在不推荐新项目使用。

## 3. 基础信息检查

- `id` 是否唯一且使用 kebab-case。
- `name` 是否使用上游项目名称。
- `summary` 是否能一句话说明用途。
- `category` 是否符合 `docs/taxonomy.md`。
- `subcategories` 是否准确。
- `ip_family` 是否能用于同类比较。
- `repository` 是否指向主代码仓库。
- `homepage` 和 `documentation` 是否可访问。
- 上游 owner 是否记录清楚。

## 4. 技术检查

- HDL 语言是否记录，例如 Verilog、SystemVerilog、VHDL、Chisel、SpinalHDL。
- 总线接口是否清楚，例如 AXI4-Lite、APB、Wishbone、TileLink。
- 寄存器模型是否清楚。
- 是否兼容事实标准，例如 NS16550、RISC-V Debug Spec。
- 是否有参数化能力。
- 关键参数是否记录，例如 data width、FIFO depth、address width。
- 时钟域数量是否清楚。
- 复位方式是否清楚。
- 是否存在 CDC 或 reset domain crossing 风险。
- 依赖项是否记录。
- 是否绑定特定 FPGA、工艺或工具链。

## 5. 同类 IP 区分检查

对于 UART、SPI、I2C、GPIO、Timer、DMA、interconnect 等常见类别，必须检查：

- `implementation_style` 是否合理。
- `compatibility` 是否记录。
- `features` 是否覆盖核心差异。
- `integration_profile` 是否记录。
- `best_for` 是否准确。
- `not_recommended_for` 是否记录明显不适用场景。

示例：UART 不应只记录为 `peripheral/uart`，还应区分是否 NS16550 兼容、是否带 FIFO、中断、DMA、流控，以及总线接口类型。

## 6. 版本检查

- 是否记录上游默认分支。
- 是否记录最新 release/tag。
- 当前评审版本是否绑定 commit。
- 如果上游没有 release，是否建立内部 baseline。
- `versions` 中是否记录评审日期和评审结论。
- 内部项目采用版本是否记录在 `internal.used_versions`。
- 是否避免只记录 branch 作为生产版本依据。

## 7. 许可证检查

- 是否存在 LICENSE 文件。
- SPDX 表达式是否正确。
- README 和 LICENSE 是否一致。
- 源码文件头是否存在不同许可证。
- 是否存在 third_party、vendor、submodule。
- 是否允许商业使用。
- 是否包含明确专利授权。
- `license_risk` 是否符合 `docs/license-policy.md`。

如果许可证为 `unknown`、没有 LICENSE 文件、存在商用限制或许可证冲突，不能标记为 `approved`。

## 8. 验证成熟度检查

- 是否有 testbench。
- 是否有 CI。
- 是否支持 Verilator、Icarus、cocotb 或其他仿真。
- 是否有 UVM 环境。
- 是否有 formal property 或形式验证记录。
- 是否有 lint 记录。
- 是否有综合记录。
- 是否有 FPGA 验证记录。
- 是否有 ASIC 流片或硅后使用记录。
- 上游声称的验证结果是否有证据链接。

成熟度建议：

- `experimental`：测试和文档不足，只适合研究或学习。
- `usable`：有基本测试，可进入项目评估。
- `production`：文档、测试、维护状态较好，可作为项目候选。
- `silicon-proven`：有明确流片或硅后使用证据。

## 9. 文档与集成检查

- 是否有接口说明。
- 是否有寄存器说明。
- 是否有参数说明。
- 是否有时钟复位说明。
- 是否有集成示例。
- 是否有仿真运行说明。
- 是否有综合或约束说明。
- 是否说明已知限制。
- 是否说明依赖项。

文档不足但技术上可用时，应标记 `documentation_quality: basic` 或 `poor`，并记录集成风险。

## 10. 维护状态检查

- 上游最近提交时间。
- 是否有 release。
- issue 是否长期无人响应。
- 仓库是否 archived。
- 默认分支是否变化。
- 是否存在活跃 fork。
- 是否有社区或项目实际使用。

如果上游长期停更但 IP 简单、许可证清晰、内部可维护，可以保留为 `approved`，但应记录维护风险。

## 11. 批准标准

进入 `approved` 至少需要满足：

- 许可证低风险或有明确人工评审结论。
- 当前评审版本绑定 commit。
- 接口、依赖、时钟复位信息足够完成集成评估。
- 至少有基本仿真或可信使用证据。
- 已知风险已记录。
- 同类型 IP 的关键差异字段已填写。

## 12. 拒绝标准

以下情况建议标记为 `rejected`：

- 许可证禁止商业使用。
- 许可证不清且上游无法澄清。
- 代码来源不明。
- 缺少可用 RTL。
- 功能与描述严重不符。
- 接口或依赖无法集成。
- 存在严重 bug 且上游无维护迹象。
- 已有明显更优替代，且该 IP 没有特殊价值。

## 13. 评审记录模板

```markdown
# <ip-id> 评审记录

## 评审结论

- 状态：
- 评审版本：
- commit：
- 评审日期：
- 评审人：

## 技术结论

## 许可证结论

## 验证结论

## 集成风险

## 后续动作
```
