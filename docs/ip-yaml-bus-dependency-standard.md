# `ip.yaml` 总线依赖与能力提供规则

## 1. 文档目的

本文档规定 `ip.yaml` 中总线接口、总线连接依赖和总线能力提供的描述方式，作为以下功能的共同输入约束：

- IP 库导入和 schema 校验。
- SoC 总线互联视图。
- IP 集成依赖检查。
- 总线连接推荐和桥接器选择。
- 地址空间检查与后续 SoC 代码生成。

本文中的“必须”“禁止”“应”“可以”分别表示强制规则、禁止规则、推荐规则和可选能力。

## 2. 核心概念

总线相关信息必须分为三层，不得用一个字段同时表达端口、依赖和系统能力。

| 层次 | `ip.yaml` 字段 | 表达内容 |
| --- | --- | --- |
| 接口事实 | `bus_interfaces` | IP 自身暴露出的总线端口 |
| 集成依赖 | `prerequisite_dependencies` | IP 实例加入 SoC 后必须获得的连接能力 |
| 能力提供 | `provided_capabilities` | IP 可向其他实例或系统提供的总线能力 |

基本规则：

1. `bus_interfaces` 只描述端口，不表示端口已经连接。
2. `prerequisite_dependencies` 描述需要被满足的条件，不直接绑定具体工程实例。
3. `provided_capabilities` 描述可用能力，不表示该能力在工程中已经生效。
4. 工程中的实际网络、实例和连接路径不得写入库级 `ip.yaml`。
5. 依赖是否满足必须根据 SoC 工程拓扑计算，而不能仅根据工程中是否存在某种 IP 判断。

## 3. 命名和通用规则

### 3.1 字段命名

- `ip.yaml` 字段统一使用 `snake_case`。
- `id` 必须在所属数组内唯一，且创建后应保持稳定。
- `id` 必须匹配 `^[a-z][a-z0-9_]*$`。
- `interface_ref` 必须引用同一份 `ip.yaml` 中存在的 `bus_interfaces[].id`。
- 协议、角色和能力类型必须使用本文规定的规范值，显示名称不得参与匹配。

### 3.2 协议表示

协议族与协议版本必须分开记录：

```yaml
protocol: APB
protocol_version: "4"
```

禁止使用下面的混合写法作为新数据的规范格式：

```yaml
protocol: APB4
```

首批规范协议族：

- `APB`
- `AHB`
- `AXI`
- `Wishbone`
- `TileLink`
- `custom`

`AXI` 的子类型使用 `profile` 表达：

```yaml
protocol: AXI
protocol_version: "4"
profile: lite
```

`profile` 首批允许值为 `full`、`lite`、`stream`。非 AXI 协议通常省略该字段。

### 3.3 接口角色

`role` 统一使用：

- `initiator`：发起事务的一侧。
- `target`：接收事务的一侧。

旧数据中的 `master`、`slave` 可以在导入时分别转换为 `initiator`、`target`，但新 `ip.yaml` 不应继续产生旧值。

## 4. `bus_interfaces` 规则

### 4.1 字段定义

```yaml
bus_interfaces:
  - id: s_apb
    name: control
    kind: memory_mapped
    protocol: APB
    protocol_version: "4"
    role: target
    address_width: 12
    data_width: 32
    required: true
    description: Register access interface.
```

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `id` | 是 | IP 内稳定且唯一的接口标识 |
| `name` | 否 | 面向用户的接口名称 |
| `kind` | 是 | `memory_mapped` 或 `stream` |
| `protocol` | 是 | 规范协议族 |
| `protocol_version` | 是 | 使用字符串保存，避免 YAML 数值转换 |
| `profile` | 条件必填 | AXI 接口必须填写 |
| `role` | 是 | `initiator` 或 `target` |
| `address_width` | 条件必填 | `memory_mapped` 接口必须为正整数 |
| `data_width` | 是 | 必须为正整数，单位为 bit |
| `required` | 否 | 默认 `true`，表示该接口是否随 IP 实例启用 |
| `description` | 否 | 接口用途，不参与机器匹配 |

### 4.2 接口约束

- `stream` 接口不得填写 `address_width`。
- 同一个接口不得同时声明多个 `role`。
- 一个 IP 可以有多个相同协议的接口，每个接口必须有独立 `id`。
- 配置接口、DMA 读接口和 DMA 写接口等不同用途必须分别声明。
- 信号级端口展开不属于本文范围，后续可通过接口的扩展字段描述。

## 5. `prerequisite_dependencies` 规则

### 5.1 推荐结构

```yaml
prerequisite_dependencies:
  - id: control_bus_access
    type: bus_connectivity
    interface_ref: s_apb
    required: true
    requirement:
      capability: addressable_bus_access
      protocol: APB
      protocol_version: "4"
      connection_modes:
        - native
        - bridge
      reachable_from:
        - system_control
    description: The APB4 target must be reachable from a system control initiator.
```

### 5.2 字段定义

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `id` | 是 | IP 内稳定且唯一的依赖标识 |
| `type` | 是 | 总线依赖固定为 `bus_connectivity` |
| `interface_ref` | 是 | 该依赖所约束的本地总线接口 |
| `required` | 是 | `true` 表示未满足时阻断完整集成检查 |
| `requirement` | 是 | 机器可检查的能力要求 |
| `description` | 否 | 面向用户的依赖原因和用途 |

`requirement` 字段：

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `capability` | 是 | 本文定义的能力类型 |
| `protocol` | 是 | 必须与 `interface_ref` 的协议族一致 |
| `protocol_version` | 是 | 必须与接口版本要求一致 |
| `profile` | 条件必填 | 必须与接口的 profile 一致 |
| `connection_modes` | 是 | 允许 `native`、`bridge` |
| `reachable_from` | 条件必填 | target 接口应声明允许的事务源类别 |

首批能力类型：

- `addressable_bus_access`：memory-mapped target 需要可寻址访问路径。
- `transaction_source`：CPU、DMA 或调试模块可以发起 memory-mapped 事务。
- `transaction_target`：initiator 需要可到达的 memory-mapped 目标。
- `stream_source`：stream target 需要上游数据源。
- `stream_sink`：stream initiator 需要下游数据接收端。

首批 `reachable_from` 类别：

- `system_control`：CPU、管理核或调试控制端。
- `dma`：DMA 类事务源。
- `debug`：调试访问端。
- `any_initiator`：不限制事务源类别。
- `upstream_initiator`：仅用于 bridge/fabric 提供的派生能力，表示沿已满足的上游路径继承事务源。

### 5.3 依赖语义

- target 外设的总线依赖表示“必须存在一条从兼容 initiator 到该接口的有效路径”。
- `connection_modes: [native, bridge]` 表示允许通过兼容桥接器到达，不要求直接连接原生 fabric。
- `required: false` 的依赖可以不满足，但互联视图应显示为未连接的可选接口。
- 一个依赖只能约束一个 `interface_ref`；多个接口必须建立多个依赖。
- `description` 不得替代结构化约束，校验器不得解析自然语言来推断协议或连接方式。

## 6. `provided_capabilities` 规则

### 6.1 推荐结构

```yaml
provided_capabilities:
  - id: downstream_apb_access
    type: bus_connectivity
    interface_ref: m_apb
    capability:
      name: addressable_bus_access
      protocol: APB
      protocol_version: "4"
      connection_mode: bridge
      reachable_from:
        - upstream_initiator
    description: Provides APB4 access converted from the upstream AXI interface.
```

### 6.2 字段定义

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `id` | 是 | IP 内稳定且唯一的能力标识 |
| `type` | 是 | 总线能力固定为 `bus_connectivity` |
| `interface_ref` | 是 | 能力从哪个本地接口向系统提供 |
| `capability` | 是 | 机器可匹配的能力描述 |
| `description` | 否 | 能力用途，不参与机器匹配 |

`capability` 字段：

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `name` | 是 | 必须使用第 5.2 节定义的能力类型 |
| `protocol` | 是 | 必须与 `interface_ref` 一致 |
| `protocol_version` | 是 | 必须与 `interface_ref` 一致 |
| `profile` | 条件必填 | 必须与 `interface_ref` 一致 |
| `connection_mode` | 是 | `native` 或 `bridge` |
| `reachable_from` | 否 | 描述能力依赖的上游事务源类别 |

### 6.3 能力提供约束

- 普通 target 外设禁止仅因为暴露 target 接口就声明 `addressable_bus_access`。
- 普通 target 可以在需要被 initiator 自动发现时声明 `transaction_target`，但这不代表它提供总线基础设施。
- fabric、crossbar、decoder、bridge 和具备事务发起能力的 IP 可以声明 `provided_capabilities`。
- 面向下游 target 提供访问能力的 `interface_ref` 通常必须引用 `initiator` 接口。
- bridge 的下游能力只有在它自身的必需上游依赖已满足时才生效。
- fabric 的下游能力只有在至少存在一条有效上游事务路径时才视为可用。
- `provided_capabilities` 不能代替 `bus_interfaces`，所有能力都必须落到真实接口上。

## 7. 依赖满足判定

一个必需总线依赖只有同时满足以下条件才是 `satisfied`：

1. `interface_ref` 存在且接口已启用。
2. 工程中存在连接到该接口的连续路径。
3. 路径两端角色兼容，即 `initiator` 最终连接 `target`。
4. 协议族、版本和 profile 兼容。
5. 连接方式属于 `connection_modes` 允许的范围。
6. 数据位宽兼容，或路径中存在已声明的位宽转换器。
7. memory-mapped 路径的地址范围合法且不冲突。
8. `reachable_from` 要求的事务源可以沿该路径到达目标。
9. 路径上每个 bridge/fabric 的必需上游依赖均已满足。
10. 跨时钟域或复位域时，路径中存在对应适配器；总线桥接本身不得隐式代表 CDC 已完成。

判定结果统一使用：

- `satisfied`：依赖已满足。
- `unresolved`：尚未选择或创建连接。
- `incompatible`：存在连接，但协议、角色、位宽或其他约束不兼容。
- `disabled`：依赖对应的可选接口未启用。

`required: true` 的 `unresolved` 或 `incompatible` 必须产生错误；可选依赖只产生提示。

## 8. 完整示例

### 8.1 APB4 外设

```yaml
schema_version: 1
id: ip.uart
name: uart
version: "1.0.0"

bus_interfaces:
  - id: s_apb
    name: control
    kind: memory_mapped
    protocol: APB
    protocol_version: "4"
    role: target
    address_width: 12
    data_width: 32
    required: true

prerequisite_dependencies:
  - id: control_bus_access
    type: bus_connectivity
    interface_ref: s_apb
    required: true
    requirement:
      capability: addressable_bus_access
      protocol: APB
      protocol_version: "4"
      connection_modes: [native, bridge]
      reachable_from: [system_control]
    description: Requires a reachable APB4 register access path.

provided_capabilities: []
```

### 8.2 AXI-to-APB4 bridge

```yaml
schema_version: 1
id: ip.axi_to_apb_bridge
name: axi_to_apb_bridge
version: "1.0.0"

bus_interfaces:
  - id: s_axi
    kind: memory_mapped
    protocol: AXI
    protocol_version: "4"
    profile: lite
    role: target
    address_width: 32
    data_width: 32
    required: true

  - id: m_apb
    kind: memory_mapped
    protocol: APB
    protocol_version: "4"
    role: initiator
    address_width: 32
    data_width: 32
    required: true

prerequisite_dependencies:
  - id: upstream_axi_access
    type: bus_connectivity
    interface_ref: s_axi
    required: true
    requirement:
      capability: addressable_bus_access
      protocol: AXI
      protocol_version: "4"
      profile: lite
      connection_modes: [native, bridge]
      reachable_from: [system_control, debug]

provided_capabilities:
  - id: downstream_apb_access
    type: bus_connectivity
    interface_ref: m_apb
    capability:
      name: addressable_bus_access
      protocol: APB
      protocol_version: "4"
      connection_mode: bridge
      reachable_from: [upstream_initiator]
    description: Provides APB4 access when the upstream AXI dependency is satisfied.
```

### 8.3 带配置 target 和 DMA initiator 的 IP

```yaml
bus_interfaces:
  - id: s_axi_cfg
    kind: memory_mapped
    protocol: AXI
    protocol_version: "4"
    profile: lite
    role: target
    address_width: 16
    data_width: 32
    required: true

  - id: m_axi_dma
    kind: memory_mapped
    protocol: AXI
    protocol_version: "4"
    profile: full
    role: initiator
    address_width: 40
    data_width: 128
    required: true

prerequisite_dependencies:
  - id: configuration_access
    type: bus_connectivity
    interface_ref: s_axi_cfg
    required: true
    requirement:
      capability: addressable_bus_access
      protocol: AXI
      protocol_version: "4"
      profile: lite
      connection_modes: [native, bridge]
      reachable_from: [system_control]

  - id: dma_memory_target
    type: bus_connectivity
    interface_ref: m_axi_dma
    required: true
    requirement:
      capability: transaction_target
      protocol: AXI
      protocol_version: "4"
      profile: full
      connection_modes: [native, bridge]

provided_capabilities: []
```

## 9. 非法示例

### 9.1 协议和能力混写

```yaml
prerequisite_dependencies:
  - type: bus-infrastructure
    capability: APB4
```

问题：无法定位接口，无法区分能力类型与协议版本，也无法表达桥接路径。

### 9.2 把 target 端口误报为基础设施能力

```yaml
bus_interfaces:
  - id: s_apb
    role: target

provided_capabilities:
  - id: apb_provider
    interface_ref: s_apb
    capability:
      name: addressable_bus_access
```

问题：target 只能被访问，不能向其他 target 提供访问路径。

### 9.3 在库定义中绑定工程实例

```yaml
prerequisite_dependencies:
  - id: control_bus_access
    provider_instance: apb_fabric0
```

问题：`apb_fabric0` 属于具体 SoC 工程，不属于可复用 IP 定义。

## 10. 校验器最低要求

IP 库导入器至少必须检查：

1. 接口、依赖和能力 `id` 的格式及唯一性。
2. 所有 `interface_ref` 均可解析。
3. 接口和依赖中的协议、版本、profile 一致。
4. 能力和其引用接口中的协议、版本、profile 一致。
5. `memory_mapped` 与 `stream` 字段组合合法。
6. `role` 使用规范值。
7. target 外设没有错误声明下游访问能力。
8. 必需字段不得只存在于 `description` 中。
9. 未识别的协议、能力类型和连接模式必须报告明确错误。

## 11. 旧字段迁移

已经使用以下扁平格式的数据可以由导入器进行一次性规范化：

```yaml
prerequisite_dependencies:
  - type: bus-infrastructure
    capability: APB4
    required: true
    description: Requires APB4 access.
```

对于已知的 `APB4`，导入器可以转换为：

```yaml
prerequisite_dependencies:
  - id: control_bus_access
    type: bus_connectivity
    interface_ref: s_apb
    required: true
    requirement:
      capability: addressable_bus_access
      protocol: APB
      protocol_version: "4"
      connection_modes: [native, bridge]
      reachable_from: [system_control]
    description: Requires APB4 access.
```

迁移限制：

- `interface_ref` 无法从旧字段唯一推断时，导入器必须要求补充，禁止任意选择接口。
- 只允许迁移器拆分已注册的协议标识，例如 `APB4`；未知标识必须报错。
- 规范化结果必须持久化为新结构，新导出的 `ip.yaml` 不再生成旧格式。

## 12. 工程绑定边界

`ip.yaml` 只描述可复用约束。SoC 工程应另行保存：

- IP 实例名。
- 总线网络实例。
- 接口到网络的绑定。
- fabric 和 bridge 实例。
- 实际连接路径。
- 地址窗口。
- 依赖状态及诊断信息。

推荐的工程级绑定示例：

```yaml
dependency_bindings:
  - instance_ref: uart0
    dependency_ref: control_bus_access
    status: satisfied
    network_ref: apb_bus0
    path:
      - cpu0.m_axi
      - axi_fabric0
      - axi_to_apb0
      - apb_bus0
      - uart0.s_apb
```

该绑定是依赖求解结果，不得回写到原始 `ip.yaml`。
