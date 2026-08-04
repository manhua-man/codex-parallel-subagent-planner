# parallel-subagent-planner (v2.0.9)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个轻量级的 **Agent Planning Harness Skill**，帮助 Codex 在复杂任务中决策何时使用子 Agent、构建安全的执行 Lane、控制上下文边界、按依赖调度波次，并发现可复用的长期 Agent 角色。

---

## 核心循环架构

```text
Task ➔ Plan ➔ Launch ➔ Observe ➔ Replan ➔ Integrate ➔ Evolve

        Skill 指导 (认知与策略层)
                    │
       Codex Agent Runtime (物理执行层)
                    │
            子 Agent (Child Agents)
```

### 核心设计原则

- **Skill 是认知层，Runtime 是执行层**：Skill 负责任务结构理解、Lane 规划、上下文边界工程与角色演进；具体代码修改、线程调度与物理执行由 Codex Runtime 掌管。
- **Lane Ready Gate 准入检查**：每个候选 Lane 必须在启动前明确定义 6 项核心要素 (`Goal`, `Read`, `Write`, `Deliverable`, `Depends on`, `Acceptance`) 以及控制元数据 (`ID`, `Role`, `Ignore`, `Model profile`, `State`, `Reason`)。
- **描述性角色体系**：灵活自然的描述性角色标签（如 `explorer`, `implementer`, `reviewer`, `migrator`, `docs_writer`, `profiler` 等），完全按任务目标按需赋予。
- **可控的能力沉淀 (Agent Evolution)**：任务集成后评估反复出现的 Subagent 角色模式（`promotion_check: silent` 默认，详见 `references/agent-evolution.md`），并在取得用户明确授权后生成 `.codex/agents/<name>.toml` 配置。

---

## 明确边界 (Anti-Scope)

本 Skill 永远不做物理 Runtime 框架的事情：
- ❌ **不做物理 Runtime**：不实现 `spawn()`、`run()`、`kill()` 进程生命周期管理。
- ❌ **不做物理 Scheduler**：不维护物理任务队列、优先级队列或 Worker 线程池。
- ❌ **不做通信层**：不实现 Agent 间消息总线 (Message Bus) 或 Mailbox。
- ❌ **不维护持久运行状态**：不维护任务数据库、执行日志、失败日志或指标监控系统。

上述能力 100% 交由 Codex Runtime、OpenAI Agent Runtime 或外部 Orchestrator 管理。

---

## 运行模式 (Operating Modes)

| 模式 | 适用场景 | 行为说明 |
| --- | --- | --- |
| Task 模式 | 单个限定修改、单模块 | 快速判定 Split 信号，避免大范围扫描 |
| Project 模式 | 完整应用、多模块、共享契约 | 扫描产品表面，分配契约 Owner，计算 Frontier，按 Wave 调度 |

---

## 输出模式 (Output Modes)

- **Compact**（默认）：面向人类阅读的摘要（`Decision`, `Launch now` [包含 Goal/Write/Deliverable/Acceptance], `Hold / Block`, `Integration`, 可选 `Agent candidates`）。
- **Full**：完整文本计划（包含 Lane 表格、契约 Owner、切分策略、上下文边界与 Child Prompts）。

---

## 安装方式 (Installation)

### 个人技能安装 (Personal Skill Installation)

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### 项目 Workspace 安装 (Project Workspace Installation)

复制仓库内容至目标项目：

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

---

## 目录结构 (File Structure)

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ references/
│  ├─ lane-planning.md
│  ├─ project-waves.md
│  ├─ context-and-prompts.md
│  ├─ agent-evolution.md
│  └─ runtime-compatibility.md
├─ README.md
├─ README.zh-CN.md
├─ CHANGELOG.md
└─ LICENSE
```

---

## 开源协议 (License)

[MIT License](LICENSE) © 2026 manhua-man
