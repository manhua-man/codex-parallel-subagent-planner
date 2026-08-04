# parallel-subagent-planner (v2.0.6)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a lightweight **Agent Planning Harness Skill** that helps Codex decide when to use subagents, create safe execution lanes, control context boundaries, schedule dependency-safe waves, and discover reusable long-term agent roles.

---

## Core Cycle Architecture

```text
Task ➔ Plan ➔ Launch ➔ Observe ➔ Replan ➔ Integrate ➔ Evolve

      Skill Guidance (Cognitive Layer)
                     │
            Codex Agent Runtime (Execution Layer)
                     │
             Subagents (Child Agents)
```

### Core Design Principles

- **Skill is the Cognitive Layer; Runtime is the Execution Layer**: Skill owns task structure understanding, lane planning, context boundary engineering, and role evolution. Physical code modifications, thread handles, scheduling, and execution belong 100% to Codex Runtime.
- **Lane Ready Gate**: Every candidate lane must satisfy 6 core requirements (`Goal`, `Read`, `Write`, `Deliverable`, `Depends on`, `Acceptance`) alongside Control Metadata (`ID`, `Role`, `Ignore`, `Model profile`, `State`, `Reason`) before launching.
- **Canonical 4 Role System**: Standardized directives for `explorer` (read-only discovery), `implementer` (bounded modifications), `reviewer` (diff & risk audit), and `migrator` (schema & API migration).
- **Controlled Agent Evolution**: Evaluates recurring subagent roles after integration (`promotion_check: silent` default, documented in `references/agent-evolution.md`) and generates persistent `.codex/agents/<name>.toml` specs ONLY upon explicit user approval.

---

## Anti-Scope (The Four Hard Boundaries)

This skill strictly avoids physical runtime infrastructure:
- ❌ **No Physical Runtime**: Does not implement `spawn()`, `run()`, `kill()` process handles.
- ❌ **No Physical Scheduler**: Does not maintain physical task queues, priority queues, or worker thread pools.
- ❌ **No Communication Layer**: Does not implement inter-agent message buses or mailboxes.
- ❌ **No Persistent Runtime State**: Does not maintain task databases, execution logs, failure logs, or metrics systems.

All physical execution, threading, tool calling, and IPC belong 100% to **Codex / Agent Runtime / External Orchestrator**.

---

## Operating Modes

| Mode | Use Case | Behavior |
| --- | --- | --- |
| Task Mode | Single bounded change or one module | Fast split gate; avoids broad repository scanning |
| Project Mode | Complete product, multi-module app, or shared contracts | Maps full product surface, assigns contract owners, computes parallel frontier, schedules waves |

---

## Output Modes

- **Compact** (Default): Human-readable summary (`Decision`, `Launch now` with Goal/Write/Deliverable/Acceptance, `Hold / Block`, `Integration`, optional `Agent candidates`).
- **Full**: Comprehensive text breakdown with lane tables, contract owners, slicing strategies, context boundaries, and ready child prompts.

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

## License

[MIT License](LICENSE) © 2026 manhua-man
