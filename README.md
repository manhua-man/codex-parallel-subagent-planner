# parallel-subagent-planner (v0.4.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a Codex Skill that decides whether subagents would materially help, splits accepted implementation work into bounded lanes, holds coupled work, schedules multi-module projects in dependency-safe waves, outputs a versioned Machine Schema plan (v1.1), and identifies reusable long-term agent candidates.

## What's New in v0.4.0 (Decomposition Intelligence)

- **Vertical vs. Horizontal Split Slicing**: Dynamically chooses between Vertical Split (end-to-end user feature capability lanes, e.g. UI + API + Test in one lane) and Horizontal Split (decoupled module lanes) to eliminate inter-agent waiting.
- **Six Lane Quality Criteria**: Audit checks ensuring Single Goal, Clear Input, Clear Output, Bounded Scope, Independent Progress, and Verifiable Acceptance per lane (`references/decomposition.md`).
- **Machine Schema Protocol v1.1**: Added optional `split_strategy` (`vertical | horizontal | hybrid`) and `lane_quality` audit properties. Fully backward compatible with `1.0` parsers.

---

## Three-Layer Product Architecture

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
- **Machine Schema Protocol (v1.1)**: Machine mode outputs structured JSON adhering to `schema/planner-plan.schema.json` (`schema_version: "1.1"`, documented in `references/machine-schema.md`) so downstream tools and schedulers can consume plans through a stable data contract.
- **Long-Term Agent Candidates**: Evaluates recurring subagent roles after integration (`promotion_check: silent` default, documented in `references/long-term-agents.md`) and generates persistent `.codex/agents/<name>.toml` custom agent specs upon explicit user approval.

---

## Operating Modes

| Mode | Use Case | Behavior |
| --- | --- | --- |
| Task Mode | Single bounded change or one module | Fast split gate; avoids broad repository scanning |
| Project Mode | Complete product, multi-module app, or shared contracts | Maps full product surface, assigns contract owners, computes parallel frontier, schedules waves |

---

## Output Modes

- **Compact** (Default): Human-readable summary (`Why split`, `Launch now`, `Held lanes`, `Integration note`).
- **Full**: Comprehensive text plan with lane tables, contract owners, slicing strategies, and ready child prompts.
- **Machine**: Pure structured JSON output following `schema/planner-plan.schema.json` (`schema_version: "1.1"`).

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

## Roadmap Summary

| Version | Feature | Layer | Status |
| --- | --- | --- | --- |
| **v0.3.0** | Planning Protocol (Task/Project Scale Gate, Wave Scheduling, Machine Schema v1.0, Long-Term Candidate) | Planner | Released |
| **v0.4.0** | Decomposition Intelligence (Vertical vs Horizontal Split, 6 Lane Quality Criteria, Machine Schema v1.1) | Planner | **Current** |
| **v0.5.0** | Planning State Awareness (Incremental execution state understanding & frontier re-calculation) | State | Upcoming |
| **v0.6.0** | Context Harness (Context Budget Engineering & `ignore_scope` Noise Boundaries) | Context | Upcoming |
| **v0.7.0** | Prompt Specialization (Role-tailored templates: Explorer, Implementer, Reviewer, Migrator) | Policy | Upcoming |
| **v0.8.0** | Planning Principles (Formalized planning principles) | Policy | Upcoming |
| **v0.9.0** | Agent Evolution (Candidate quality filtering & full lifecycle management) | Memory | Upcoming |
| **v1.0.0** | Agent Planning Harness Skill (Mature Harness Intelligence Layer) | All | Vision |

For detailed roadmap descriptions, see [references/roadmap.md](references/roadmap.md).

---

## License

[MIT License](LICENSE) © 2026 manhua-man
