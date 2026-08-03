# parallel-subagent-planner (v0.3.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个注入 Agent Runtime 的 **Planning Harness Skill**，让 Codex 在复杂任务中拥有类似资深工程师的任务拆解、上下文控制、协作规划和能力沉淀能力。

---

## 总体架构 (Harness Architecture)

```text
                         Harness Skill


                              |

        ------------------------------------------------

        Planner        Planning State        Memory

           |                 |                 |

        Policy          Machine Schema     Agent Evolution


                              |

                     Planning Protocol


                              |

                    Codex / Agent Runtime


                              |

                           Agents
```

### 核心设计原则

- **Skill 是认知层，Runtime 是执行层**：Skill 负责任务结构理解、多 Agent 协作规划、上下文预算分配与能力沉淀；具体代码修改、线程调度与物理执行由 Codex Runtime 掌管。
- **机器计划协议 (Machine Schema)**：Machine 模式遵循 `schema/planner-plan.schema.json` (`schema_version: "1.0"`) 输出纯 JSON，为后续调度器或自动化工具提供稳定、带版本的数据契约。
- **可控的能力沉淀 (Long-Term Agent Policy)**：评估反复出现的 Subagent 角色（`promotion_check: silent` 默认，单次最多 1 个候选），并在用户明确授权后生成 `.codex/agents/<name>.toml` 配置。

---

## 明确边界 (Anti-Scope)

本 Skill 永远不做物理 Runtime 框架的事情：
- ❌ **不做物理 Runtime**：不实现 `spawn()`、`run()`、`kill()` 进程生命周期管理。
- ❌ **不做物理 Scheduler**：不维护物理任务队列、优先级队列或 Worker 线程池。
- ❌ **不做通信层**：不实现 Agent 间消息总线 (Message Bus) 或 Mailbox。
- ❌ **不做物理数据库**：不维护物理运行数据库、执行日志库或指标监控系统。

上述能力 100% 交由 Codex Runtime、OpenAI Agent Runtime 或外部 Orchestrator 管理。

---

## 运行模式 (Operating Modes)

| 模式 | 适用场景 | 行为说明 |
| --- | --- | --- |
| Task 模式 | 单个限定修改、单模块 | 快速判定 Split 信号，避免大范围扫描 |
| Project 模式 | 完整应用、多模块、共享契约 | 扫描产品表面，分配契约 Owner，计算 Frontier，按 Wave 调度 |

---

## 输出模式 (Output Modes)

- **Compact**（默认）：面向人类阅读的摘要（`Why split`、`Launch now`、`Held lanes`、`Integration note`）。
- **Full**：完整文本计划（包含 Lane 表格、契约 Owner、阶段 Frontier 与 Child Prompts）。
- **Machine**：遵循 `schema/planner-plan.schema.json` 规范的纯 JSON 输出。

---

## 快速示例 (Quick Example)

### Default `Compact` Output

```text
Why parallel
任务包含一个只读行为检查与一个实现 Lane，但实现依赖检查结果。

Launch status
- Launched: Export behavior audit (agent_type explorer, model_profile fast, read_scope src/runtime/session-view-service.ts + src/extension.ts, write_scope none)
- Held: Export flow worker (agent_type worker, model_profile deep, write_scope src/runtime/session-view-service.ts + src/extension.ts, held_reason dependency)

Integration note
先执行审计 Lane，待行为与验收条件确定后再启动或处理实现 Worker。
```

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
├─ schema/
│  └─ planner-plan.schema.json
├─ references/
│  ├─ planner-details.md
│  ├─ project-scale-planning.md
│  ├─ machine-schema.md
│  ├─ long-term-agents.md
│  ├─ prompt-templates.md
│  ├─ runtime-compatibility.md
│  └─ roadmap.md
├─ README.md
├─ README.zh-CN.md
├─ CHANGELOG.md
└─ LICENSE
```

---

## 路线图概览 (Roadmap Summary)

| 版本 | 核心能力 | 架构层 |
| --- | --- | --- |
| **v0.3.0 (当前)** | Planning Protocol (任务/项目划分、Wave调度、Machine Schema、Agent Candidate) | Planner |
| **v0.4.0** | Decomposition Intelligence (纵向切分 Vertical Split / 横向切分 Horizontal Split / Lane 质量检查) | Planner |
| **v0.5.0** | Planning State Awareness (规划状态感知，根据增量变化局部计算 Frontier) | State |
| **v0.6.0** | Context Harness (上下文预算工程，定义 Global / Lane / Noise Boundary) | Context |
| **v0.7.0** | Prompt Specialization (特化提示词：Explorer / Implementer / Reviewer / Migrator) | Policy |
| **v0.8.0** | Planning Principles (规划原则策略沉淀) | Policy |
| **v0.9.0** | Agent Evolution (长期 Agent 降噪与完整生命周期管理) | Memory |
| **v1.0.0** | Agent Planning Harness Skill (成熟体 Harness 认知控制层) | 全部组合 |

详见 [references/roadmap.md](references/roadmap.md)。

---

## 开源协议 (License)

[MIT License](LICENSE) © 2026 manhua-man
