# 开源芯片 IP 数据库分阶段实现流程计划

## 1. 实施原则

本计划建议采用“先数据标准，后自动化；先 Git 仓库，后前后端系统”的路径。

核心原则：

- GitHub 仓库作为第一阶段权威数据源。
- 所有字段先经过人工维护和 PR 审查，再逐步自动化。
- 每个阶段都要有可交付物，避免长期停留在设计状态。
- 先保证许可证、版本、验证状态、接口信息准确，再追求录入数量。
- Web 页面和后端系统必须复用同一套 schema，不能形成另一套字段标准。

## 2. 阶段总览

| 阶段 | 名称 | 目标 | 建议周期 | 数据规模 |
| --- | --- | --- | --- | --- |
| P0 | 准备与标准确认 | 明确字段、分类、维护边界 | 3-5 天 | 0-10 条 |
| P1 | Git 仓库 MVP | 建立可维护的数据仓库骨架 | 1 周 | 10-30 条 |
| P2 | Schema 与 CI 校验 | 保证数据格式和字段质量 | 1-2 周 | 30-80 条 |
| P3 | 人工评审流程 | 建立候选、评估、批准、拒绝流程 | 2-3 周 | 50-150 条 |
| P4 | 自动索引与静态展示 | 支持检索、筛选、对比 | 2-3 周 | 100-300 条 |
| P5 | Web 表单录入 | 降低社区和非技术人员录入门槛 | 3-5 周 | 200-1000 条 |
| P6 | 元数据自动同步 | 自动跟踪上游版本和维护状态 | 3-6 周 | 500+ 条 |
| P7 | 后端数据库/API | 支持高频编辑、权限和复杂查询 | 按需启动 | 1000+ 条 |

## 3. P0：准备与标准确认

### 3.1 目标

明确数据库维护范围、公开边界、字段标准和团队协作方式。

### 3.2 主要任务

- 数据库已确认为完全公开。
- 数据范围已确认为只记录开源 IP。
- 第一阶段重点 IP 范围已确认为 RISC-V SoC 常用数字 IP。
- 确认一级分类和标签体系。
- 确认许可证风险策略。
- 确认单个 IP 的版本维护方式。
- 确认人工评审负责人和合并权限。

### 3.3 交付物

- `docs/ip-database-plan.md`
- `docs/taxonomy.md`
- `docs/license-policy.md`
- `docs/review-checklist.md`

### 3.4 退出标准

- 团队认可第一版字段范围。
- 明确数据库完全公开，只记录开源 IP。
- 明确新增 IP 和评审 IP 的基本流程。

## 4. P1：Git 仓库 MVP

### 4.1 目标

建立最小可用的数据仓库，可以手工录入 IP，并通过 PR 审查。

### 4.2 仓库结构

```text
ip-catalog/
  README.md
  docs/
    ip-database-plan.md
    implementation-roadmap.md
    taxonomy.md
    contribution-guide.md
    review-checklist.md
    license-policy.md
    ip-repository-standard.md
  data/
    ip/
      peripheral/
      processor/
      interconnect/
      memory/
      security/
    vendors/
    licenses/
  schemas/
  scripts/
  generated/
```

### 4.3 主要任务

- 创建目录结构。
- 编写 README，说明数据库用途、录入方式和维护状态。
- 录入 10-30 个代表性 IP。
- 每个一级分类至少录入 1-2 个样例。
- 为 UART、RISC-V core、AXI/APB 组件建立完整样例。
- 先人工检查 YAML 格式和字段完整性。

### 4.4 交付物

- 基础仓库结构。
- 10-30 条 IP YAML。
- 至少 1 条包含完整版本历史的 IP 样例。
- 至少 1 条被拒绝的 IP 样例，记录拒绝原因。

### 4.5 退出标准

- 团队可以通过读 YAML 理解每个 IP 的来源、许可证、接口、成熟度和当前状态。
- 维护者可以通过 PR 新增一条 IP。
- 已经暴露出字段不合理之处，并完成第一轮字段修正。

## 5. P2：Schema 与 CI 校验

### 5.1 目标

用机器校验保证数据质量，减少人工 review 的低级错误。

### 5.2 主要任务

- 编写 `schemas/ip.schema.json`。
- 定义必填字段、可选字段、枚举值和日期格式。
- 编写 `scripts/validate.py`。
- 校验 YAML 语法。
- 校验 IP `id` 唯一性。
- 校验分类和标签是否在允许列表中。
- 校验 SPDX license 表达式。
- 校验 `repository`、`homepage`、`documentation` 链接格式。
- 检查 `versions[*].commit` 和 `internal.used_versions[*].commit` 的格式。
- 配置 GitHub Actions。

### 5.3 交付物

- `schemas/ip.schema.json`
- `scripts/validate.py`
- `.github/workflows/validate.yml`
- CI 校验报告。

### 5.4 退出标准

- 每次 PR 都能自动校验。
- 错误字段、重复 ID、非法枚举值会阻止合并。
- 维护者不用靠肉眼检查基础格式。

## 6. P3：人工评审流程

### 6.1 目标

让 IP 从“候选链接”变成“可比较、可决策的工程资产”。

### 6.2 状态流转

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

### 6.3 主要任务

- 编写 `docs/review-checklist.md`。
- 编写 `docs/contribution-guide.md`。
- 定义 `internal.status` 枚举。
- 定义评审角色：录入人、技术评审、许可证评审、合并维护者。
- 建立许可证高风险清单。
- 建立定期复核规则。
- 对重点 IP 完成最小验证，例如 lint、仿真、文档检查。

### 6.4 评审维度

- 功能是否满足目标场景。
- 总线接口和寄存器模型是否清楚。
- 版本是否绑定 commit。
- LICENSE 是否清晰。
- 是否存在第三方依赖。
- 是否有仿真、形式验证、FPGA 或流片证据。
- 文档是否足够完成集成。
- 上游是否仍在维护。
- 团队是否需要本地 patch。

### 6.5 交付物

- 评审 checklist。
- 贡献指南。
- 至少 20 条完成评审的 IP。
- 许可证风险清单。
- 拒绝原因模板。

### 6.6 退出标准

- 每条 `approved` IP 都能说明批准依据。
- 每条 `rejected` IP 都能说明拒绝原因。
- 每条 `used` IP 都绑定具体 commit 和项目记录。

## 7. P4：自动索引与静态展示

### 7.1 目标

把 YAML 数据转换成人类和程序都容易消费的索引。

### 7.2 主要任务

- 编写 `scripts/generate-index.py`。
- 生成 `generated/index.json`。
- 生成 `generated/index.md`。
- 为每个 `ip_family` 生成对比表。
- 支持按分类、接口、许可证、成熟度、验证状态筛选。
- 支持标记高风险 IP。
- 增加 GitHub Pages 或其他静态站点展示。

### 7.3 交付物

- `generated/index.json`
- `generated/index.md`
- `generated/families/uart.md`
- `generated/families/riscv-core.md`
- 静态展示页面。

### 7.4 退出标准

- 用户不用读每个 YAML，也能浏览和比较 IP。
- UART、RISC-V core、interconnect 等同类 IP 能自动生成对比表。
- 每次合并后索引自动更新。

## 8. P5：Web 表单录入

### 8.1 目标

降低录入门槛，让非技术贡献者或外部社区也能提交 IP 信息。

### 8.2 工作流

```text
Web 表单
  -> 字段校验
  -> 生成 YAML 草稿
  -> 自动创建 PR
  -> CI 校验
  -> 维护者 review
  -> 合并入库
```

### 8.3 主要任务

- 设计表单字段，直接映射 `ip.schema.json`。
- 表单支持分类选择、接口选择、许可证选择、特性勾选。
- 表单支持填写 repository 后自动抓取基础元数据。
- 提交后生成 YAML。
- 集成 GitHub API 自动创建 PR。
- 对外部用户提供“只推荐链接”的轻量入口。

### 8.4 交付物

- Web 表单页面。
- YAML 预览功能。
- PR 自动创建功能。
- 表单字段与 schema 的一致性校验。

### 8.5 退出标准

- 非维护者可以通过页面提交候选 IP。
- 页面不会绕过 CI 和人工 review。
- 生成的 YAML 能通过 schema 校验。

## 9. P6：元数据自动同步

### 9.1 目标

自动跟踪上游仓库变化，减少维护者手工巡检。

### 9.2 自动同步字段

- 默认分支。
- 最新 commit。
- 最新 release/tag。
- 仓库是否 archived。
- LICENSE 文件变化。
- stars/forks，可选。
- issue/PR 活跃度，可选。
- README 或文档链接变化，可选。

### 9.3 主要任务

- 编写 `scripts/sync-github-metadata.py`。
- 支持 GitHub、GitLab，OpenCores 可后续处理。
- 自动生成更新 PR，而不是直接改主分支。
- 标记需要人工复核的变化。
- 对 license、archive、default branch 变化设置高优先级提醒。

### 9.4 交付物

- 元数据同步脚本。
- 定期运行的 GitHub Actions。
- 自动复核清单。
- 高风险变化报告。

### 9.5 退出标准

- 上游 release 或 archive 状态变化能被发现。
- 自动同步不会覆盖人工评审结论。
- 新版本不会自动变成团队采用版本。

## 10. P7：后端数据库与 API

### 10.1 启动条件

只有满足以下情况时，才建议启动后端化：

- IP 数量超过 1000 条。
- 多角色频繁编辑，Git PR 工作流效率不足。
- 需要复杂权限，例如公开字段、内部字段、项目字段分离。
- 需要复杂查询、统计、仪表盘或和内部系统集成。
- 需要记录大量测试结果、综合结果、版本矩阵。

### 10.2 架构建议

```text
Frontend
  |
  v
Backend API
  |
  v
PostgreSQL
  |
  v
YAML/JSON export
  |
  v
GitHub repository
```

### 10.3 主要任务

- 设计数据库表结构。
- 实现 API。
- 实现权限系统。
- 实现数据导入导出。
- 保持与 `ip.schema.json` 的字段兼容。
- 支持从 Git 仓库迁移现有 YAML。

### 10.4 退出标准

- 后端数据库可以承载高频编辑。
- Git 仓库仍能保留可审查的导出数据。
- 公开数据和内部数据可以安全分离。

## 11. 推荐当前立即执行的任务

建议当前从 P0/P1 开始，不要立即开发前后端。

优先任务：

1. 完成 `docs/taxonomy.md`。
2. 完成 `docs/review-checklist.md`。
3. 完成 `docs/contribution-guide.md`。
4. 创建 `data/ip/` 目录。
5. 录入 10 条代表性 IP。
6. 为其中 2 条写完整版本记录。
7. 初步编写 `schemas/ip.schema.json`。

## 12. 决策门槛

每个阶段结束时建议做一次评审。

| 阶段 | 评审问题 |
| --- | --- |
| P0 | 字段和分类是否足够覆盖第一批 IP？ |
| P1 | 人工录入是否可行？字段是否太重？ |
| P2 | CI 是否能阻止低质量数据进入？ |
| P3 | approved/rejected 结论是否可追溯？ |
| P4 | 用户是否能通过索引完成比较和选型？ |
| P5 | 表单是否降低录入门槛，同时不降低质量？ |
| P6 | 自动同步是否能发现真正有用的变化？ |
| P7 | 后端复杂度是否真的必要？ |

## 13. 里程碑建议

### M1：可维护数据仓库

完成 P0-P2。

结果：数据库可以通过 GitHub PR 维护，数据格式可校验。

### M2：可决策 IP 清单

完成 P3-P4。

结果：团队可以按接口、许可证、成熟度、验证状态比较 IP，并形成选型结论。

### M3：社区可参与

完成 P5。

结果：外部用户可以通过页面推荐或录入 IP，但仍由维护者审核。

### M4：可持续维护

完成 P6。

结果：数据库能自动发现上游变化，并生成复核任务。

### M5：平台化

按需完成 P7。

结果：数据库具备复杂权限、API、统计和内部系统集成能力。
