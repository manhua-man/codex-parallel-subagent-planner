# parallel-subagent-planner (v1.0.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is an **Agent Planning Harness Skill** (Codex Parallel Planning Intelligence Layer) that injects senior engineering cognitive capabilities into an Agent Runtime—guiding Codex on task decomposition, context budgeting, prompt specialization, wave scheduling, Machine Schema serialization (v1.6), and agent role evolution.

---

## Three-Layer Harness Architecture

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

### Core Design Principles

- **Skill is the Cognitive Layer; Runtime is the Execution Layer**: Skill owns structure understanding, multi-agent collaboration planning, context budget allocation, and candidate evolution. Physical code modifications, thread handles, scheduling, and execution belong 100% to Codex Runtime.
- **Machine Schema Protocol (v1.6)**: Machine mode outputs structured JSON adhering to `schema/planner-plan.schema.json` (`schema_version: "1.6"`, documented in `references/machine-schema.md`) so downstream tools and schedulers can consume plans through a stable data contract.
- **Long-Term Agent Evolution**: Evaluates recurring subagent roles after integration (`promotion_check: silent` default, documented in `references/agent-evolution.md`) through a 5-stage lifecycle (`Candidate` ➔ `Review` ➔ `Approved` ➔ `Persistent Agent` ➔ `Retire`) and generates persistent `.codex/agents/<name>.toml` custom agent specs upon explicit user approval.

---

## Anti-Scope (The Four Hard Boundaries)

This skill strictly avoids physical runtime infrastructure:
- ❌ **No Physical Runtime**: Does not implement `spawn()`, `run()`, `kill()` process handles.
- ❌ **No Physical Scheduler**: Does not maintain physical task queues, priority queues, or worker thread pools.
- ❌ **No Communication Layer**: Does not implement inter-agent message buses or mailboxes.
- ❌ **No Physical Database**: Does not maintain task databases, execution logs, or metrics systems.

All physical execution, threading, tool calling, and IPC belong 100% to **Codex / Agent Runtime / External Orchestrator**.

---

## Operating Modes

| Mode | Use Case | Behavior |
| --- | --- | --- |
| Task Mode | Single bounded change or one module | Fast split gate; avoids broad repository scanning |
| Project Mode | Complete product, multi-module app, or shared contracts | Maps full product surface, assigns contract owners, computes parallel frontier, schedules waves |

---

## Output Modes

- **Compact** (Default): Human-readable summary (`Why split`, `Launch now`, `Held lanes`, `Integration note`).
- **Full**: Comprehensive text plan with lane tables, contract owners, slicing strategies, context budgets, and ready child prompts.
- **Machine**: Pure structured JSON output following `schema/planner-plan.schema.json` (`schema_version: "1.6"`).

---

## Installation

### Personal Skill Installation

Clone or copy this repository into your personal Codex skills directory:

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### Target Project Workspace Installation

Copy the repository contents into a target workspace:

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

---

## File Structure

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ schema/
│  └─ planner-plan.schema.json
├─ references/
│  ├─ decomposition.md
│  ├─ planning-state.md
│  ├─ context-engineering.md
│  ├─ prompt-strategy.md
│  ├─ planning-principles.md
│  ├─ agent-evolution.md
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

## Roadmap & Release Milestone (v1.0.0 Complete)

| Version | Feature | Layer | Status |
| --- | --- | --- | --- |
| **v0.3.0** | Planning Protocol (Task/Project Scale Gate, Wave Scheduling, Machine Schema v1.0, Long-Term Candidate) | Planner | Released |
| **v0.4.0** | Decomposition Intelligence (Vertical vs Horizontal Split, 6 Lane Quality Criteria, Machine Schema v1.1) | Planner | Released |
| **v0.5.0** | Planning State Awareness (Incremental execution state understanding & frontier re-calculation, Schema v1.2) | State | Released |
| **v0.6.0** | Context Harness (Context Budget Engineering & `ignore_scope` Noise Boundaries, Schema v1.3) | Context | Released |
| **v0.7.0** | Prompt Specialization (Role-tailored templates: Explorer, Implementer, Reviewer, Migrator, Schema v1.4) | Policy | Released |
| **v0.8.0** | Planning Principles (Formalized 5 senior-engineering principles, Schema v1.5) | Policy | Released |
| **v0.9.0** | Agent Evolution (5-stage lifecycle, 4 quality filters: Frequency/Stability/Boundary/Reuse, Schema v1.6) | Memory | Released |
| **v1.0.0** | Agent Planning Harness Skill (Mature Harness Intelligence Stack) | All Layers | **v1.0.0 Milestone** |

For detailed roadmap descriptions, see [references/roadmap.md](references/roadmap.md).

---

## License

[MIT License](LICENSE) © 2026 manhua-man
