# parallel-subagent-planner

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个面向 Codex 的并行任务规划 Skill。它判断任务是否值得拆分，将已确认的实现目标拆成边界明确的 Lane，阻止存在依赖或写域冲突的并行执行，为多模块项目安排安全的 Wave，输出带版本的 Machine Schema 结构化计划，并识别可复用的长期 Agent 角色。

## 三层产品架构

1. **并行规划核心 (Parallel Planning Core)**：区分 Task 与 Project 模式，评估 Split Gate，硬性隔离写写冲突 (`write ∩ write = ∅`) 与写读数据竞争 (`write ∩ read = ∅`)，分配共享契约 Owner，并按阶段安全调度 Wave。
2. **机器数据协议 (Machine Schema Contract)**：Machine 模式遵循 `schema/planner-plan.schema.json` (`schema_version: "1.0"`) 输出结构化 JSON，为后续调度器或其他自动化工具提供稳定、带版本的数据契约。
3. **能力沉淀机制 (Long-Term Agent Candidates)**：任务集成后评估反复出现的 Subagent 角色 (`promotion_check: silent` 默认)，并在用户明确批准后生成持久化的 `.codex/agents/<name>.toml` 自定义 Agent 配置。

## 运行模式

| 模式 | 适用场景 | 行为说明 |
| --- | --- | --- |
| Task 模式 | 单个限定修改、单模块 | 快速判定 Split 信号，避免大范围扫描 |
| Project 模式 | 完整应用、多模块、共享契约 | 扫描产品表面，分配契约 Owner，计算 Frontier，按 Wave 调度 |

## 输出模式

- **Compact**（默认）：面向人类阅读的摘要（`Why split`、`Launch now`、`Held lanes`、`Integration note`）。
- **Full**：完整文本计划（包含 Lane 表格、契约 Owner、阶段 Frontier 与 Child Prompts）。
- **Machine**：遵循 `schema/planner-plan.schema.json` 规范的纯 JSON 输出。

## 快速示例

### 默认 `Compact` 输出

```text
Why parallel
任务包含一个只读行为检查与一个实现 Lane，但实现依赖检查结果。

Launch status
- Launched: Export behavior audit (agent_type explorer, model_profile fast, read_scope src/runtime/session-view-service.ts + src/extension.ts, write_scope none)
- Held: Export flow worker (agent_type worker, model_profile deep, write_scope src/runtime/session-view-service.ts + src/extension.ts, held_reason dependency)

Integration note
先执行审计 Lane，待行为与验收条件确定后再启动或处理实现 Worker。
```

## 安装方式

### 个人技能安装

克隆或复制本仓库至个人 Codex 技能目录：

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### 项目 Workspace 安装

将仓库内容复制至目标项目：

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

## 目录结构

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ references/
│  ├─ project-scale-planning.md
│  ├─ planner-details.md
│  ├─ prompt-templates.md
│  ├─ long-term-agents.md
│  └─ runtime-compatibility.md
├─ schema/
│  └─ planner-plan.schema.json
├─ README.md
├─ README.zh-CN.md
├─ CHANGELOG.md
└─ LICENSE
```

## 边界与限制

本 Skill 专注于 Codex 的执行 Lane 规划、机器计划序列化与长期 Agent 角色识别。它不用于定义产品需求、批准架构方案、管理 OpenSpec 产物或向外部 Backend 路由任务。

## 开源协议

[MIT License](LICENSE) © 2026 manhua-man
