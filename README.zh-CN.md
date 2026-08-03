# parallel-subagent-planner (v0.2.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是面向 Codex 的 **Planner Contract (v0.2.0)** 执行并行规划技能。它支持轻量 Task 模式与 Project 模式，提供基于独立编译 JSON Schema 的结构化规划契约、确定性验证器、Recorded Golden Contract Fixtures 回归测试与模型档位适配层。

## 核心特性 (v0.2.0)

- **Planner Contract 结构化输出**：支持输出符合 `schema/planner-plan.schema.json` 规范的 JSON/YAML 计划，由 Ajv 编译校验器实现 100% 字节级 Schema 编译一致性校验 (`npm run schema:check`)。
- **确定性安全验证器**：硬性检查 9 大安全约束（写写与写读重叠隔离、依赖满足性、无环依赖、共享契约唯一 Owner、非空验收条件、只读域保护、并发预算约束、State/Held 状态一致性）。
- **Recorded Golden Contract Fixtures (`npm run eval:golden`)**：静态契约测试套件 (`evals/cases.json`)，带有显式断言注册表，以 **`Unsafe Launch Rate = 0`** 为核心质量指标。
- **模型档位与适配层**：通过语义化模型档位 (`deep | balanced | fast`) 解耦具体模型名，由 `references/runtime-compatibility.md` 统一映射：
  - `deep` (`gpt-5.6-sol`)：旗舰模型，用于模糊根因、安全审计、复杂契约与高风险集成。
  - `balanced` (`gpt-5.6-terra`)：通用模型，用于常规模块开发、限定重构与标准开发。
  - `fast` (`gpt-5.6-luna`)：只读扫描、信息提取与确定性转换。
- **成本与价值感知调度**：支持并发上限与成本 Profile，提供 Frontier 优先级评分 (`launch_score` + `score_reasons`)。
- **多输出模式**：支持 `Compact`（用户摘要）、`Explain`（诊断模式）与 `Machine`（结构化 JSON）。
- **TOML 长期 Agent 规范**：使用 Codex 标准 `.toml` 模板（`~/.codex/agents/<agent>.toml` 与 `.codex/agents/<agent>.toml`），默认采用 `promotion_check: silent` 策略。

## 运行模式

| 模式 | 适用场景 | Planner 行为 |
|---|---|---|
| Task 模式 | 单个限定修改、单模块或已确定 Lanes | 快速判定 Split 信号，避免大范围仓库扫描 |
| Project 模式 | 完整应用构建/重构，涵盖多模块与共享契约 | 扫描完整产品表面，分配契约 Owner，计算 Frontier 评分，按 Wave 调度 |

## 安装方式

### 个人技能安装（推荐）

```bash
# 个人技能路径: $HOME/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js
```

### 项目 Workspace 安装

```bash
# 项目技能路径: <target-repo>/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js /path/to/target-repo
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

包含字节级 Schema Parity 校验、静态 Integrity 检查、Validator & Assertion Handler 单元测试与 Recorded Golden Fixtures 契约测试。

## 开源协议

[MIT License](LICENSE) © 2026 manhua-man
