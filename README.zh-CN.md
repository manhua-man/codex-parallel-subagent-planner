# parallel-subagent-planner (v0.2.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是面向 Codex 的 **Planner Contract (v0.2.0)** 执行并行规划技能。它支持轻量 Task 模式与 Project 模式，提供基于 JSON Schema 的结构化规划契约、确定性验证器、可执行 Evals 回归测试与模型档位适配层。

## 核心特性 (v0.2.0)

- **Planner Contract 结构化输出**：支持输出符合 `schema/planner-plan.schema.json` 规范的 JSON/YAML 计划。
- **确定性安全验证器**：内置 `scripts/validate-plan.js`，硬性检查 8 大安全约束（无并行写域重叠、依赖满足性、无环依赖、共享契约唯一 Owner、非空验收条件、只读域保护、并发预算约束、State/Held 状态一致性）。
- **可执行 Evals 回归测试**：将 12 个 Fixtures 升级为可执行自动化测试集 (`evals/cases.json`)，以 `Unsafe Launch Rate = 0` 为核心质量指标。
- **模型档位与适配层**：通过语义化模型档位 (`deep | balanced | fast`) 解耦具体模型名，由 `references/runtime-compatibility.md` 统一映射。
- **成本与价值感知调度**：支持并发上限与成本 Profile，提供 Frontier 优先级评分 (`launch_score` + `score_reasons`)。
- **多输出模式**：支持 `Compact`（用户摘要）、`Explain`（诊断模式）与 `Machine`（结构化 JSON）。
- **TOML 长期 Agent 规范**：使用 Codex 标准 `.toml` 模板，默认采用 `promotion_check: silent` 策略。

## 运行模式

| 模式 | 适用场景 | Planner 行为 |
|---|---|---|
| Task 模式 | 单个限定修改、单模块或已确定 Lanes | 快速判定 Split 信号，避免大范围仓库扫描 |
| Project 模式 | 完整应用构建/重构，涵盖多模块与共享契约 | 扫描完整产品表面，分配契约 Owner，计算 Frontier 评分，按 Wave 调度 |

## 安装方式

### 个人技能安装（推荐）

```bash
# 个人技能路径: $HOME/.agents/skills/parallel-subagent-planner
mkdir -p "$HOME/.agents/skills/parallel-subagent-planner"
cp -r . "$HOME/.agents/skills/parallel-subagent-planner"
```

### 项目 Workspace 安装

```bash
# 项目技能路径: <repo>/.agents/skills/parallel-subagent-planner
mkdir -p .agents/skills/parallel-subagent-planner
cp -r . .agents/skills/parallel-subagent-planner
```

### Plugin 插件打包

```bash
npm run package:plugin
```

详细说明参见 [INSTALL.md](INSTALL.md)。

## 自动化测试

运行完整自动化验证套件：

```bash
npm test
```

包含静态 Integrity 检查、Schema 验证与 Evals 行为测试。

## 开源协议

[MIT License](LICENSE) © 2026 manhua-man
