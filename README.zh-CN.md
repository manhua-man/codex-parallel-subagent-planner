# parallel-subagent-planner (v0.4.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个注入 Agent Runtime 的 **Planning Harness Skill**，让 Codex 在复杂任务中拥有类似资深工程师的任务拆解、上下文控制、协作规划和能力沉淀能力。

## v0.4.0 新特性 (Decomposition Intelligence)

- **纵向与横向切分启发式 (Vertical vs. Horizontal Split)**：动态选择纵向切分（端到端闭环用户价值，如 UI + API + Test 封入单个 Capability Lane）或横向切分（解耦独立模块），消除 Agent 间不必要的互相等待。
- **6 大 Lane 质量判定标准**：提供单一目标、明确输入、明确输出、限定作用域、独立推进与可校验验收条件的硬性审计检查（详见 `references/decomposition.md`）。
- **Machine Schema 协议 v1.1**：新增可选的 `split_strategy` (`vertical | horizontal | hybrid`) 与 `lane_quality` 属性，与 v1.0 解析器 100% 向前兼容。

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
- **机器计划协议 (Machine Schema v1.1)**：Machine 模式遵循 `schema/planner-plan.schema.json` (`schema_version: "1.1"`，详见 `references/machine-schema.md`) 输出纯 JSON，为后续调度器或自动化工具提供稳定、带版本的数据契约。
- **可控的能力沉淀 (Long-Term Agent Policy)**：评估反复出现的 Subagent 角色（`promotion_check: silent` 默认，单次最多 1 个候选），并在用户明确授权后生成 `.codex/agents/<name>.toml` 配置。

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
- **Machine**：遵循 `schema/planner-plan.schema.json` 规范的纯 JSON 输出 (`schema_version: "1.1"`)。

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
│  ├─ decomposition.md
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

| 版本 | 核心能力 | 架构层 | 状态 |
| --- | --- | --- | --- |
| **v0.3.0** | Planning Protocol (任务/项目划分、Wave调度、Machine Schema v1.0、Agent Candidate) | Planner | 已发布 |
| **v0.4.0** | Decomposition Intelligence (纵向切分 Vertical Split / 横向切分 Horizontal Split / Lane 质量检查 / Schema v1.1) | Planner | **当前版本** |
| **v0.5.0** | Planning State Awareness (规划状态感知，根据增量变化局部计算 Frontier) | State | 下一阶段 |
| **v0.6.0** | Context Harness (上下文预算工程，定义 Global / Lane / Noise Boundary) | Context | 下一阶段 |
| **v0.7.0** | Prompt Specialization (特化提示词：Explorer / Implementer / Reviewer / Migrator) | Policy | 下一阶段 |
| **v0.8.0** | Planning Principles (规划原则策略沉淀) | Policy | 下一阶段 |
| **v0.9.0** | Agent Evolution (长期 Agent 降噪与完整生命周期管理) | Memory | 下一阶段 |
| **v1.0.0** | Agent Planning Harness Skill (成熟体 Harness 认知控制层) | 全部 | 愿景 |

详见 [references/roadmap.md](references/roadmap.md)。

---

## 开源协议 (License)

[MIT License](LICENSE) © 2026 manhua-man
