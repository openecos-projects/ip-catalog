# IP 分类与标签规范

## 1. 维护边界

本数据库完全公开，只记录开源芯片 IP。

第一阶段聚焦数字 IP，重点服务 RISC-V SoC 选型、评估和集成。模拟 IP、PHY、hard macro、商业闭源 IP 暂不作为第一阶段维护对象。

## 2. 一级分类

一级分类应保持稳定，用于目录结构、索引生成和主导航。

| 分类 | 说明 | 示例 |
| --- | --- | --- |
| `processor` | 处理器核和处理器相关子系统 | RISC-V core、DSP core、MCU core |
| `accelerator` | 专用计算加速器 | NPU、crypto accelerator、matrix engine |
| `interconnect` | 总线、互连和桥接 | AXI、APB、AHB、Wishbone、TileLink、NoC |
| `memory` | 存储控制和缓存相关 IP | SRAM controller、cache、FIFO、DDR controller |
| `peripheral` | 常规 SoC 外设 | UART、SPI、I2C、GPIO、Timer、PWM |
| `security` | 安全和密码学 IP | AES、SHA、TRNG、secure boot、PUF |
| `dsp` | 数字信号处理 IP | FFT、FIR、IIR、CORDIC |
| `video` | 视频、显示和图像处理 IP | Display controller、ISP 子模块、MIPI wrapper |
| `debug-test` | 调试、测试和可观测性 IP | JTAG、debug module、trace、BIST |
| `soc-platform` | SoC 平台级组件 | boot ROM、CSR block、clock/reset manager |
| `eda-support` | 辅助集成和验证资产 | UVM agent、lint rule、formal property |

暂缓分类：

- `analog-mixed-signal`
- `phy`
- `hard-macro`
- `commercial-ip`

这些类别可以在后续阶段扩展，但 P0/P1 不作为重点。

## 3. 二级分类

二级分类用于描述 IP 的具体功能族。一个 IP 可以有多个 `subcategories`，但应避免过度细分。

推荐二级分类：

| 一级分类 | 二级分类 |
| --- | --- |
| `processor` | `risc-v-core`, `dsp-core`, `mcu-core`, `debug-module` |
| `accelerator` | `crypto-accelerator`, `ai-accelerator`, `matrix`, `compression` |
| `interconnect` | `axi`, `apb`, `ahb`, `wishbone`, `tilelink`, `noc`, `bridge`, `crossbar` |
| `memory` | `sram-controller`, `cache`, `fifo`, `dma`, `ddr-controller`, `scratchpad` |
| `peripheral` | `uart`, `spi`, `i2c`, `gpio`, `timer`, `pwm`, `watchdog`, `interrupt-controller` |
| `security` | `aes`, `sha`, `rsa`, `ecc`, `trng`, `puf`, `secure-boot` |
| `dsp` | `fft`, `fir`, `iir`, `cordic`, `filter`, `modem` |
| `video` | `display-controller`, `camera`, `isp`, `mipi`, `hdmi` |
| `debug-test` | `jtag`, `trace`, `bist`, `dft`, `logic-analyzer` |
| `soc-platform` | `boot-rom`, `csr`, `clock-reset`, `power-manager`, `register-block` |
| `eda-support` | `uvm-agent`, `cocotb-testbench`, `formal-property`, `lint-rule`, `constraints` |

## 4. 功能族

`ip_family` 用于同类型 IP 的聚合和横向比较。例如不同 UART 实现都应使用：

```yaml
ip_family: uart
```

常用 `ip_family`：

- `risc-v-core`
- `uart`
- `spi`
- `i2c`
- `gpio`
- `timer`
- `interrupt-controller`
- `dma`
- `axi-interconnect`
- `apb-bridge`
- `wishbone-interconnect`
- `sram-controller`
- `cache`
- `aes`
- `sha`
- `jtag`
- `debug-module`

## 5. 实现风格

`implementation_style` 用于描述同类 IP 的实现定位。

允许值：

- `minimal`：极简实现，适合教学、小 MCU、demo。
- `standard-compatible`：兼容事实标准或常见寄存器模型。
- `feature-rich`：功能完整，通常包含 FIFO、中断、DMA、配置项等。
- `low-power`：面向低功耗设计。
- `high-throughput`：面向高带宽或高性能。
- `platform-integrated`：与某个 SoC 平台深度绑定。
- `unknown`：信息不足。

## 6. 接口标签

接口标签用于检索和集成判断。

常用接口：

- `axi4`
- `axi4-lite`
- `axi-stream`
- `apb`
- `ahb`
- `wishbone`
- `tilelink`
- `avalon`
- `uart`
- `spi`
- `i2c`
- `jtag`
- `gpio`
- `interrupt`
- `dma`

## 7. 兼容性标签

`compatibility` 用于描述是否兼容某个标准、协议、寄存器模型或生态。

示例：

- `riscv-privileged-spec`
- `riscv-debug-spec`
- `riscv-vector`
- `ns16550-compatible`
- `amba-axi4`
- `amba-apb`
- `wishbone-b4`
- `tilelink-ul`
- `opentitan-compatible`
- `litex-compatible`

## 8. 功能特性标签

`features` 用于描述同类 IP 的功能差异。

常用特性：

- `fifo`
- `interrupt`
- `dma`
- `flow-control`
- `parity`
- `multi-master`
- `multi-channel`
- `low-power-mode`
- `clock-domain-crossing`
- `register-file`
- `error-detection`
- `ecc`
- `formal-props`
- `uvm-testbench`
- `cocotb-testbench`

## 9. 适用场景

`best_for` 和 `not_recommended_for` 用于帮助选型。

推荐场景标签：

- `small-mcu`
- `linux-capable-soc`
- `fpga-demo`
- `education`
- `research`
- `production-asic`
- `open-eda-flow`
- `low-power-design`
- `high-performance-design`
- `legacy-compatibility`

## 10. 第一批重点类别

P1 阶段建议优先录入这些数字 IP：

- RISC-V processor core
- RISC-V debug module
- UART
- SPI
- I2C
- GPIO
- Timer/watchdog
- Interrupt controller
- AXI/APB/Wishbone interconnect
- SRAM controller/cache/FIFO
- DMA
- AES/SHA/TRNG

这些类别最能覆盖 RISC-V SoC 的基础选型需求。
