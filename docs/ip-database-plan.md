# 开源芯片 IP 数据库建设方案

## 1. 目标定位

本数据库用于系统化维护开源芯片 IP 信息，帮助团队快速完成 IP 发现、筛选、评估、复用和持续跟踪。

核心目标：

- 建立统一的开源 IP 元数据标准，避免信息分散在 README、论文、仓库、issue 和个人记录中。
- 支持按功能、接口、工艺相关性、验证成熟度、许可证、维护状态等维度检索。
- 为芯片项目选型提供可比较的数据，而不仅是链接列表。
- 跟踪 IP 的生命周期，包括版本变化、许可证变化、维护活跃度、验证状态和集成经验。
- 为后续建设 Web 检索页面、评分系统、自动同步机器人和 CI 校验打基础。

## 2. 收录范围

第一阶段已确认聚焦可复用的开源数字硬件 IP，重点服务 RISC-V SoC。模拟 IP、PHY、hard macro、商业闭源 IP 暂不作为第一阶段维护对象。

### 2.1 第一阶段优先收录

- 处理器核：RISC-V、DSP、MCU、专用加速器控制核。
- 总线与互连：AXI、AHB、APB、Wishbone、TileLink、NoC。
- 存储相关：SRAM controller、DDR controller、cache、scratchpad、FIFO。
- 外设：UART、SPI、I2C、GPIO、PWM、Timer、Interrupt Controller、DMA。
- 安全 IP：AES、SHA、TRNG、PUF、secure boot、crypto accelerator。
- 信号处理：FFT、FIR、IIR、CORDIC、NPU/DSP building blocks。
- 视频/图像：MIPI、HDMI、Display controller、ISP 子模块。
- 调试与测试：JTAG、DFT、BIST、trace、debug module。
- SoC 平台组件：boot ROM、clock/reset manager、power manager、CSR block。

### 2.2 第二阶段扩展

- 模拟与混合信号 IP：PLL、ADC、DAC、LDO、SerDes、PHY。
- 工艺相关 hard macro：SRAM macro、IO pad、standard cell wrapper。
- EDA 辅助资产：约束模板、lint 规则、UVM agent、形式验证属性库。
- 系统级参考设计：完整 SoC、FPGA demo、evaluation platform。
- 教学型 IP：适合学习但不适合生产集成的项目，单独标记。

## 3. 每个 IP 需要维护的信息

建议将信息分为“基础信息、技术信息、质量信息、法律信息、维护信息、集成信息”六组。

### 3.1 基础信息

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `id` | 数据库内唯一标识，建议 kebab-case | `uart-16550-opencores` |
| `name` | IP 名称 | `OpenCores UART16550` |
| `summary` | 一句话描述 | `16550-compatible UART controller` |
| `category` | 一级分类 | `peripheral` |
| `subcategories` | 二级分类，可多个 | `["uart", "serial"]` |
| `homepage` | 项目主页 | `https://...` |
| `repository` | 主代码仓库 | `https://github.com/...` |
| `upstream_owner` | 上游组织或作者 | `lowRISC` |
| `origin_country_region` | 可选，来源国家/地区 | `US` |
| `first_seen_at` | 首次收录日期 | `2026-06-09` |
| `last_reviewed_at` | 最近人工复核日期 | `2026-06-09` |

### 3.2 技术信息

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `languages` | HDL/建模语言 | `["SystemVerilog"]` |
| `interfaces` | 对外接口协议 | `["APB", "UART"]` |
| `bus_compatibility` | 总线兼容情况 | `["Wishbone", "AXI4-Lite"]` |
| `clock_domains` | 时钟域数量或描述 | `single-clock` |
| `reset_scheme` | 复位方式 | `async-active-low` |
| `parameterizable` | 是否可参数化 | `true` |
| `parameters` | 关键参数 | `data_width`, `fifo_depth` |
| `target_process` | 是否绑定工艺 | `process-independent` |
| `fpga_support` | FPGA 适配情况 | `tested-on-xilinx-7series` |
| `asic_support` | ASIC 适配情况 | `tapeout-reported` |
| `toolchains` | 已知可用工具链 | `["Verilator", "Yosys", "Vivado"]` |
| `dependencies` | 依赖的其他 IP 或库 | `["common_cells"]` |
| `deliverables` | 交付物类型 | RTL、testbench、docs、constraints |

### 3.3 质量与成熟度信息

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `maturity` | 成熟度等级 | `experimental`, `usable`, `production`, `silicon-proven` |
| `verification` | 验证方式 | simulation、formal、UVM、FPGA、silicon |
| `test_coverage` | 覆盖率信息，没有则为空 | line/function/toggle |
| `ci_status` | 上游 CI 情况 | `present-and-passing` |
| `known_users` | 已知使用者或项目 | OpenTitan、LiteX |
| `silicon_proven` | 是否有流片证明 | `true/false/unknown` |
| `fpga_proven` | 是否有 FPGA 验证 | `true/false/unknown` |
| `documentation_quality` | 文档质量 | `poor`, `basic`, `good`, `excellent` |
| `integration_difficulty` | 集成难度 | `low`, `medium`, `high`, `unknown` |
| `known_issues` | 已知问题摘要 | issue 链接或简述 |

### 3.4 法律与许可证信息

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `license` | SPDX 许可证表达式 | `Apache-2.0` |
| `license_file_present` | 仓库是否有 LICENSE 文件 | `true` |
| `license_risk` | 许可证风险等级 | `low`, `medium`, `high`, `unknown` |
| `patent_grant` | 是否包含明确专利授权 | `explicit`, `implicit`, `none`, `unknown` |
| `export_control_note` | 出口管制备注，可选 | crypto IP 需要重点标记 |
| `third_party_components` | 第三方组件及许可证 | 列表 |
| `commercial_use_allowed` | 是否允许商业使用 | `true/false/unknown` |

许可证建议统一使用 SPDX 表达式。对于没有 LICENSE 文件、许可证不明确、GPL/LGPL/AGPL 类、包含加密算法、含第三方 hard macro 的 IP，应单独进入人工复核队列。

### 3.5 维护状态信息

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `latest_release` | 最新 release/tag | `v1.2.0` |
| `latest_commit_at` | 最新提交日期 | `2026-05-30` |
| `activity_level` | 活跃度 | `active`, `slow`, `inactive`, `archived` |
| `issue_response` | issue 响应情况 | `fast`, `normal`, `slow`, `none`, `unknown` |
| `breaking_change_risk` | 破坏性变化风险 | `low`, `medium`, `high` |
| `upstream_status` | 上游状态 | `maintained`, `archived`, `fork-only`, `unknown` |
| `preferred_fork` | 推荐 fork，如果原仓库停更 | URL |

### 3.6 团队内部集成信息

这部分是数据库相对普通公开列表的核心价值。

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `internal_status` | 团队内部状态 | `candidate`, `evaluating`, `approved`, `rejected`, `used` |
| `review_owner` | 内部评审负责人 | `team-name/person` |
| `review_notes` | 内部评审记录 | 文档链接 |
| `integration_notes` | 集成注意事项 | 时钟、复位、参数、补丁 |
| `local_patches` | 是否有内部补丁 | patch 链接或分支 |
| `used_in_projects` | 已在哪些项目中使用 | 项目代号 |
| `rejection_reason` | 如果拒绝，记录原因 | license、quality、performance |
| `next_action` | 下一步动作 | 复测、补文档、联系上游 |

### 3.7 单个 IP 的迭代与历史版本信息

单个 IP 的版本维护要分清三件事：

- 上游 IP 版本：上游仓库的 release、tag、branch、commit。
- 数据库记录版本：本数据库中这条 IP 元数据的修订历史。
- 团队内部采用版本：某个项目实际集成、验证、流片或废弃的具体版本。

这三类版本不要混在一个字段里，否则后续会很难回答“我们当时用的是哪个版本”“这个结论对应哪个 commit”“现在上游变化是否影响已用项目”。

建议每条 IP 维护这些版本字段：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `upstream.default_branch` | 上游默认分支 | `main` |
| `upstream.latest_release` | 上游最新 release 或 tag | `v0.3.1` |
| `upstream.latest_commit` | 上游最新 commit hash | `abc123...` |
| `upstream.latest_commit_at` | 上游最新提交日期 | `2026-05-30` |
| `tracking.current_ref` | 当前数据库重点跟踪的 ref | `v0.3.1` 或 commit hash |
| `tracking.current_ref_type` | ref 类型 | `release`, `tag`, `branch`, `commit` |
| `tracking.baseline_ref` | 团队评估基线版本 | `v0.3.0` |
| `tracking.baseline_reviewed_at` | 基线版本复核日期 | `2026-06-09` |
| `tracking.update_policy` | 更新策略 | `manual`, `minor-only`, `security-only`, `follow-upstream` |
| `versions` | 已记录的重要版本列表 | 见下方示例 |
| `internal.used_versions` | 内部项目实际采用版本 | 见下方示例 |

推荐原则：

- 对生产或流片项目，不要只记录 branch，必须记录不可变 commit hash。
- 上游 release/tag 只能作为语义版本标识，最终仍建议绑定 commit。
- 每次评估结论必须绑定到具体版本，否则结论会随上游变化失效。
- 内部项目采用的版本、补丁和验证结果必须单独记录，不能被最新上游状态覆盖。
- 如果上游没有 release，团队可以建立内部 baseline，例如 `internal-baseline-2026-06-09`。

## 4. 推荐数据结构

建议采用“结构化 YAML/JSON + Markdown 说明 + 自动生成索引”的方式。

### 4.1 仓库结构

```text
ip-catalog/
  README.md
  docs/
    ip-database-plan.md
    taxonomy.md
    contribution-guide.md
    review-checklist.md
  data/
    ip/
      peripheral/
        uart-16550-opencores.yaml
        uart-16550-opencores.history.md
      processor/
        ibex.yaml
    vendors/
      lowrisc.yaml
      opencores.yaml
    licenses/
      license-policy.yaml
  schemas/
    ip.schema.json
    vendor.schema.json
  scripts/
    validate.py
    generate-index.py
    sync-github-metadata.py
  generated/
    index.json
    index.md
```

### 4.2 单条 IP YAML 示例

```yaml
id: uart-16550-opencores
name: OpenCores UART16550
summary: 16550-compatible UART controller.
category: peripheral
subcategories:
  - uart
  - serial
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
resource_profile: medium
performance_profile: standard
best_for:
  - legacy-compatibility
  - linux-capable-soc
not_recommended_for:
  - ultra-small-mcu

links:
  homepage: https://opencores.org/projects/uart16550
  repository: https://github.com/freecores/uart16550
  documentation: null

upstream:
  owner: OpenCores
  status: maintained
  default_branch: master
  latest_release: null
  latest_commit: null
  latest_commit_at: null

tracking:
  current_ref: master
  current_ref_type: branch
  baseline_ref: null
  baseline_reviewed_at: null
  update_policy: manual

versions:
  - ref: master
    ref_type: branch
    commit: null
    released_at: null
    reviewed_at: 2026-06-09
    maturity: usable
    license: unknown
    verification_summary: Basic upstream testbench exists.
    change_summary: Initial database entry.
    risk_notes:
      - License needs confirmation.

technical:
  languages:
    - Verilog
  interfaces:
    - Wishbone
    - UART
  bus_compatibility:
    - Wishbone
  clock_domains: single-clock
  reset_scheme: unknown
  parameterizable: true
  target_process: process-independent
  fpga_support: unknown
  asic_support: unknown
  toolchains: []
  dependencies: []
  deliverables:
    rtl: true
    testbench: true
    docs: false
    constraints: false

quality:
  maturity: usable
  verification:
    simulation: true
    formal: false
    fpga: unknown
    silicon: unknown
  documentation_quality: basic
  integration_difficulty: medium
  known_issues: []

legal:
  license: unknown
  license_file_present: false
  license_risk: high
  patent_grant: unknown
  commercial_use_allowed: unknown
  third_party_components: []

internal:
  status: candidate
  review_owner: null
  review_notes: null
  integration_notes: []
  local_patches: []
  used_versions: []
  used_in_projects: []
  rejection_reason: null
  next_action: confirm-license

metadata:
  first_seen_at: 2026-06-09
  last_reviewed_at: 2026-06-09
  data_quality: partial
```

## 5. 分类体系

建议分类不要过细，一级分类保持稳定，二级分类允许扩展。

### 5.1 一级分类

- `processor`
- `accelerator`
- `interconnect`
- `memory`
- `peripheral`
- `security`
- `dsp`
- `video`
- `debug-test`
- `analog-mixed-signal`
- `soc-platform`
- `eda-support`

### 5.2 标签体系

标签用于横向检索，不替代分类。

建议维护这些标签：

- 架构：`risc-v`, `arm-compatible`, `custom-isa`
- 接口：`axi4`, `axi4-lite`, `apb`, `ahb`, `wishbone`, `tilelink`
- 验证：`formal`, `uvm`, `cocotb`, `verilator`, `fpga-proven`, `silicon-proven`
- 工具：`yosys`, `openroad`, `vivado`, `quartus`, `verilator`, `icarus`
- 适用场景：`education`, `production`, `research`, `low-power`, `high-performance`
- 风险：`license-risk`, `inactive-upstream`, `poor-docs`, `process-bound`

### 5.3 同类型不同 IP 的区分方式

同一类型下会有很多不同实现，例如 UART 可能有 16550 兼容实现、极简 UART、带 FIFO 的 UART、APB UART、AXI4-Lite UART、低功耗 UART、带 DMA/中断的 UART。数据库不能只用 `category: peripheral` 和 `subcategories: uart` 区分，否则后续筛选会很困难。

建议用五层信息区分同类型 IP：

1. 唯一 `id`：区分具体项目来源和实现。
2. 功能族 `ip_family`：表示它属于哪类功能，例如 `uart`。
3. 兼容标准 `compatibility`：表示是否兼容某个事实标准或寄存器模型，例如 `ns16550-compatible`。
4. 实现特性 `features`：表示 FIFO、中断、DMA、低功耗、流控等具体能力。
5. 接口和集成形态 `interfaces`、`integration_profile`：表示 APB、AXI4-Lite、Wishbone、TileLink、独立端口等。

推荐增加这些字段：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `ip_family` | 功能族，用于同类聚合 | `uart` |
| `implementation_style` | 实现定位 | `minimal`, `standard-compatible`, `feature-rich`, `low-power`, `high-throughput` |
| `compatibility` | 兼容性声明 | `["ns16550-compatible"]` |
| `register_model` | 寄存器模型 | `ns16550`, `custom`, `vendor-specific` |
| `features` | 功能特性 | `fifo`, `interrupt`, `dma`, `flow-control` |
| `integration_profile` | 集成画像 | `apb-slave`, `axi4-lite-slave`, `wishbone-slave`, `standalone` |
| `resource_profile` | 资源画像 | `small`, `medium`, `large`, `unknown` |
| `performance_profile` | 性能画像 | `low-speed`, `standard`, `high-speed`, `unknown` |
| `best_for` | 推荐适用场景 | `small-mcu`, `linux-capable-soc`, `fpga-demo` |
| `not_recommended_for` | 不推荐场景 | `production-asic`, `low-power-design` |

UART 条目的区分示例：

```yaml
id: uart-16550-opencores
name: OpenCores UART16550
category: peripheral
subcategories:
  - uart
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
resource_profile: medium
performance_profile: standard
best_for:
  - legacy-compatibility
  - linux-capable-soc
not_recommended_for:
  - ultra-small-mcu
```

```yaml
id: simple-uart-example
name: Simple UART
category: peripheral
subcategories:
  - uart
ip_family: uart
implementation_style: minimal
compatibility: []
register_model: custom
features:
  - tx
  - rx
integration_profile:
  - standalone
resource_profile: small
performance_profile: low-speed
best_for:
  - education
  - fpga-demo
not_recommended_for:
  - linux-capable-soc
  - production-asic
```

生成索引时，建议为每个 `ip_family` 自动生成对比表。例如 UART 对比表可以展示：

| IP | 寄存器兼容 | 总线接口 | FIFO | 中断 | DMA | 验证成熟度 | 许可证 | 推荐场景 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `uart-16550-opencores` | NS16550 | Wishbone | yes | yes | no | usable | unknown | legacy/Linux |
| `simple-uart-example` | custom | standalone | no | no | no | experimental | MIT | education/FPGA demo |

这样同类型 IP 的差异可以通过结构化字段直接比较，而不是依赖维护者读完整 README 后人工判断。

## 6. 评分模型

建议评分只作为辅助排序，不作为唯一决策依据。每项 0-5 分，最终展示分项分数和总分。

| 维度 | 权重 | 说明 |
| --- | ---: | --- |
| 功能匹配度 | 20% | 是否满足目标接口、参数、性能和场景 |
| 验证成熟度 | 20% | 仿真、形式验证、FPGA、流片证据 |
| 文档与可集成性 | 15% | 文档、示例、参数说明、约束说明 |
| 维护活跃度 | 15% | 提交、issue、release、社区活跃度 |
| 许可证清晰度 | 15% | SPDX、商业使用、专利授权、第三方依赖 |
| 工具链兼容 | 10% | 开源 EDA、主流 FPGA/ASIC 工具支持 |
| 团队经验 | 5% | 内部是否已评审或集成 |

成熟度等级建议：

- `experimental`：研究或教学性质，缺测试或文档。
- `usable`：功能基本可用，有基本测试，但生产集成仍需较多工作。
- `production`：文档、测试、维护状态较好，适合项目集成评估。
- `silicon-proven`：有明确流片或量产使用证据。

## 7. 数据库构建方式

### 7.1 最小可行版本

第一版建议不要直接做复杂后端系统，而是先用 Git 仓库维护结构化数据。

原因：

- 容易审查，每条 IP 修改都可以走 PR。
- 变更历史清晰，可追踪谁修改了许可证、成熟度、集成状态。
- YAML/JSON Schema 可做 CI 校验。
- 后续可以自动生成网站、搜索索引、API 数据。

第一版交付物：

- `schemas/ip.schema.json`：定义字段、枚举和必填项。
- `data/ip/**/*.yaml`：每个 IP 一条记录。
- `generated/index.md`：自动生成的人类可读索引。
- `generated/index.json`：供 Web 或脚本消费的机器索引。
- CI：校验 YAML 格式、schema、SPDX license、链接可访问性。

### 7.2 单个 IP 的版本维护方式

建议采用“单条 IP 文件保留当前状态 + 重要版本快照 + Git 提交历史”的方式，而不是为每个上游 commit 都创建一条记录。

推荐维护粒度：

- 最新状态：记录在 `upstream`、`tracking`、`quality`、`legal` 等当前字段中。
- 重要版本：记录在 `versions` 列表中，只保留 release、评估基线、内部采用版本、重大风险变化版本。
- 完整修改历史：交给本数据库仓库的 Git 历史保存。
- 内部采用历史：记录在 `internal.used_versions`，绑定项目、commit、补丁和验证结果。

`versions` 示例：

```yaml
versions:
  - ref: v1.0.0
    ref_type: release
    commit: 8f2c1a9e4d...
    released_at: 2025-11-18
    reviewed_at: 2026-01-05
    maturity: usable
    license: Apache-2.0
    verification_summary: Verilator smoke test passed; no formal evidence found.
    change_summary: First reviewed release.
    risk_notes:
      - Documentation lacks reset timing details.

  - ref: v1.1.0
    ref_type: release
    commit: c42f0a173b...
    released_at: 2026-04-22
    reviewed_at: 2026-05-08
    maturity: production
    license: Apache-2.0
    verification_summary: Upstream CI and team integration test passed.
    change_summary: Added AXI4-Lite register interface and fixed FIFO overflow issue.
    risk_notes: []
```

`internal.used_versions` 示例：

```yaml
internal:
  used_versions:
    - project: soc-alpha
      ref: v1.1.0
      commit: c42f0a173b...
      adopted_at: 2026-05-20
      status: used
      integration_owner: digital-platform-team
      local_patches:
        - patches/soc-alpha/uart-fifo-depth.patch
      verification:
        simulation: passed
        lint: passed
        synthesis: passed
        fpga: passed
        silicon: not-run
      notes:
        - FIFO depth changed from 16 to 64.
        - Reset synchronizer added at SoC wrapper level.
```

版本更新流程：

1. 自动同步脚本发现上游有新 release、tag、默认分支 commit 或仓库状态变化。
2. 数据库只更新 `upstream.latest_*` 这类事实字段，不自动改变 `tracking.baseline_ref`。
3. 维护者判断是否需要评估新版本。
4. 如果需要评估，新增一条 `versions` 记录，并把评估结论绑定到具体 commit。
5. 如果团队项目采用该版本，新增 `internal.used_versions` 记录。
6. 如果新版本改变许可证、接口、依赖、验证状态或兼容性，必须更新风险字段并记录 `change_summary`。

什么时候必须新增版本记录：

- 上游发布正式 release/tag。
- 团队完成一次评估并形成结论。
- 团队项目实际采用某个 commit。
- 许可证、第三方依赖或专利声明发生变化。
- 接口、寄存器、时钟复位、参数、依赖发生破坏性变化。
- 验证状态有重大提升或下降，例如新增 formal、流片证明、CI 失效。
- 上游停更、归档、迁移仓库或出现推荐 fork。

什么时候不需要新增版本记录：

- 只是同步 stars、issue 数量、最新提交日期。
- 只是修正文档拼写、分类标签或无行为影响的备注。
- 上游普通开发分支有提交，但团队暂不评估、不采用。

对于长期维护的重点 IP，可以再增加单独的版本日志文件：

```text
data/ip/peripheral/uart-16550-opencores.yaml
data/ip/peripheral/uart-16550-opencores.history.md
```

`.history.md` 用于记录人工评审过程、关键 issue、集成经验和版本取舍原因；YAML 只保留可检索、可校验的结构化摘要。

### 7.3 后续演进

第二阶段可以增加：

- 静态网站：基于 `generated/index.json` 提供筛选、搜索、排序。
- GitHub/GitLab 同步机器人：定期更新 stars、latest commit、release、archive 状态。
- 许可证扫描：集成 licensee、scancode-toolkit 或类似工具。
- 质量仪表盘：展示高风险 IP、长期未复核 IP、许可证未知 IP。
- 内部评审工作流：候选、评估中、批准、拒绝、已使用。

第三阶段再考虑：

- 独立后端数据库：PostgreSQL + API。
- 和内部芯片项目管理系统集成。
- 和仿真/综合 CI 联动，自动记录测试结果。
- 面向外部社区开放提交和维护机制。

### 7.4 数据录入方式

建议分阶段建设，不要一开始就做完整后台系统。

第一阶段推荐“人工写 YAML + PR 审核 + CI 校验”：

- 维护者在 `data/ip/<category>/<id>.yaml` 新增或修改记录。
- CI 自动校验 YAML 格式、JSON Schema、枚举值、必填字段、SPDX license、链接可访问性。
- 通过 PR review 审查分类、许可证、版本、质量结论。
- 合并后自动生成 `generated/index.json` 和 `generated/index.md`。

这种方式适合早期，因为字段还在变化，团队需要先把分类、字段、评审标准打磨稳定。直接做前后端容易过早固化错误字段。

第二阶段可以增加“Web 表单辅助录入”，但表单不应该绕过 Git：

```text
Web 表单
   |
   v
生成 YAML 草稿
   |
   v
自动创建 PR
   |
   v
CI 校验 + 人工 review
   |
   v
合并到 GitHub 仓库
```

也就是说，页面是录入入口，GitHub 仓库仍然是权威数据源。

第三阶段如果数据量很大、权限复杂、需要多人频繁编辑，再考虑后端数据库：

```text
前端页面
   |
   v
后端 API + 权限系统
   |
   v
PostgreSQL
   |
   v
定期导出 YAML/JSON 或同步到 Git 仓库
```

但即使进入第三阶段，也建议保留 Git 导出物，保证开源社区可以审查、复刻和长期保存数据。

推荐录入策略：

| 阶段 | 录入方式 | 适用情况 | 优点 | 风险 |
| --- | --- | --- | --- | --- |
| 第一阶段 | 人工写 YAML | 0-200 条 IP，字段仍在打磨 | 简单、透明、容易 review | 对非技术贡献者不友好 |
| 第二阶段 | Web 表单生成 PR | 200-1000 条 IP，社区参与增多 | 降低录入门槛，仍保留 Git 审核 | 需要维护表单和字段映射 |
| 第三阶段 | 后端数据库 + API | 大规模、多角色、高频编辑 | 权限、检索、批量操作更强 | 系统复杂，开源协作成本更高 |

Web 表单建议只做结构化字段，不做自由发挥式编辑：

- 分类选择：`category`、`subcategories`、`ip_family`。
- 链接填写：homepage、repository、documentation。
- 技术字段：语言、接口、兼容性、特性、依赖。
- 版本字段：release/tag/commit、评估基线、采用版本。
- 许可证字段：SPDX license、许可证风险、第三方依赖。
- 质量字段：验证方式、成熟度、文档质量、已知问题。
- 内部字段：评审状态、项目使用、补丁、集成记录。

表单提交后只生成草稿，不直接入库。维护者确认后再合并。

对于外部社区贡献者，建议提供三种入口：

- 简单推荐：只提交项目链接和一句话说明，进入待整理队列。
- 标准录入：填写 Web 表单，生成完整 YAML 草稿。
- 高级维护：直接提交 YAML PR。

这样既能降低外部贡献门槛，也能保持核心数据库质量。

## 8. 数据来源

建议从以下来源收集，但所有条目都要经过人工复核：

- GitHub、GitLab、OpenCores、CHIPS Alliance、lowRISC、OpenTitan、LiteX、PULP Platform 等开源组织。
- 论文和会议 artifact。
- 开源 SoC 项目的依赖列表。
- EDA 工具示例项目。
- 团队已有项目中的 IP 使用记录。
- 社区推荐和 issue 提交。

每条记录应尽量保留来源链接，避免只记录口头结论。

## 9. 维护流程

### 9.1 新增 IP

1. 创建 `data/ip/<category>/<id>.yaml`。
2. 填写基础信息、技术信息和许可证信息。
3. 标记 `internal.status: candidate`。
4. 运行 schema 校验。
5. 由至少一名维护者复核许可证和分类。
6. 合并后进入候选池。

### 9.2 评估 IP

1. 明确目标使用场景。
2. 检查接口、参数、依赖和工具链。
3. 拉取代码并运行最小仿真或 lint。
4. 检查 LICENSE、第三方依赖和专利声明。
5. 记录集成风险和已知问题。
6. 更新 `quality` 和 `internal` 字段。

### 9.3 定期复核

建议每季度自动生成复核清单：

- 超过 180 天未复核的 IP。
- 上游仓库 archived 的 IP。
- LICENSE 或主分支发生变化的 IP。
- 最新提交超过 2 年的候选 IP。
- 内部项目正在使用但上游已停更的 IP。
- `license_risk` 为 `high` 或 `unknown` 的 IP。

## 10. 风险控制

重点风险：

- 许可证不清晰：没有 LICENSE 文件、README 与 LICENSE 冲突、第三方文件许可证不同。
- 专利风险：部分加密、安全、接口协议、PHY 相关 IP 可能有额外专利问题。
- 维护风险：上游长期停更或仓库归档。
- 验证不足：README 宣称可用但没有测试、覆盖率或实际使用证据。
- 工具链锁定：只能在特定商业工具或 FPGA 平台上工作。
- 工艺绑定：模拟、PHY、SRAM、PLL 等 hard macro 难以跨工艺复用。
- 文档不足：参数、时序、寄存器、复位行为不清楚。

建议数据库不要只记录“好 IP”，也记录“拒绝原因”。这能避免团队后续重复踩坑。

## 11. 建议的初始实施计划

### 第 1 周：标准和骨架

- 建立仓库目录结构。
- 定义 `ip.schema.json`。
- 编写分类体系、贡献指南和评审 checklist。
- 手工录入 10-20 个代表性 IP。

### 第 2-3 周：校验和索引

- 实现 YAML schema 校验脚本。
- 实现 Markdown/JSON 索引生成脚本。
- 增加 SPDX license 校验。
- 建立 CI。

### 第 4-6 周：评估流程

- 扩展到 50-100 个 IP。
- 为重点类别建立评审模板。
- 建立许可证高风险清单。
- 建立内部 `approved/rejected/used` 状态流转。

### 第 7 周以后：自动化和网站

- 增加上游仓库元数据同步。
- 生成静态检索页面。
- 加入评分排序。
- 接入团队内部项目的使用记录。

## 12. 推荐优先级

第一阶段最重要的不是收录数量，而是字段标准、许可证清晰度和评审流程。

推荐优先级：

1. 先定 schema 和分类。
2. 先保证许可证、接口、验证状态、维护状态准确。
3. 再扩充数量。
4. 最后做网站和自动评分。

## 13. 需要团队进一步确认的问题

- 许可证风险较高的 IP 是否只作为候选记录，还是完全不收录？
- 是否需要记录国内外供应链、出口管制、加密算法合规等字段？
- 后续是否要把模拟/PHY/hard macro 纳入同一个数据库，还是拆成独立库？
- 团队内部最终批准一个 IP 的标准是什么？

已确认事项：

- 数据库完全公开。
- 只记录开源 IP。
- 第一阶段聚焦数字 IP。
- 第一阶段重点服务 RISC-V SoC。

## 14. 建议结论

建议采用 Git 仓库作为第一版数据库载体，以 YAML 存储 IP 元数据，以 JSON Schema 保证字段质量，以脚本自动生成索引和网站数据。

第一版应重点维护这些核心字段：

- IP 名称、分类、链接、上游维护者。
- HDL 语言、接口协议、依赖、工具链。
- 验证状态、成熟度、FPGA/ASIC/流片证据。
- SPDX 许可证、商业使用、专利授权、第三方依赖。
- 上游活跃度、最新提交、release、archive 状态。
- 团队内部评审状态、集成记录、拒绝原因。

这样既能支持公开社区协作，也能沉淀团队真实的工程选型经验。
