# Agent Planning Harness Skill Strategic Roadmap (v0.3.0 —> v1.0.0)

This document defines the strategic vision, boundary rules, and release roadmap for `parallel-subagent-planner`.

## Product Positioning

`parallel-subagent-planner` is an **Agent Planning Harness Skill** (also referred to as the **Codex Parallel Planning Intelligence Layer**).

It is NOT an Agent Runtime, Multi-Agent Framework, or programmatic SDK. Its core value is helping Codex act like a senior engineer when organizing multi-agent work—making decisions on decomposition, scope boundaries, context budget, prompt specialization, and role evolution.

```text
┌────────────────────────────────────────────────────────┐
│             parallel-subagent-planner                  │
│             (Planning Harness Skill)                   │
│                                                        │
│  - Split Decision (Scale Gate & Split Gate)            │
│  - Decomposition Intelligence (Vertical vs Horizontal) │
│  - Context Engineering (Read, Write, Ignore Scopes)    │
│  - Prompt Specialization (Role-Tailored Prompts)       │
│  - Machine Schema Protocol (schema/planner-plan.json)  │
│  - Agent Evolution (Candidate Quality & Noise Filter)  │
│  - Planning Personalization (User Preference Style)    │
└──────────────────────────┬─────────────────────────────┘
                           │
             [ Guides Active Codex Session ]
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 Codex Agent Runtime                    │
│                                                        │
│  - Thread Handles & Process Execution                  │
│  - File System Access & Tool Execution                 │
│  - Subagent Spawning & Message IPC                     │
└────────────────────────────────────────────────────────┘
```

---

## Skill Boundaries & Anti-Scope

To maintain clean skill boundaries, `parallel-subagent-planner` will **NEVER**:

- ❌ Manage physical Agent lifecycles (`spawn()`, `run()`, `kill()`).
- ❌ Maintain physical runtime databases or persistent state stores.
- ❌ Execute automatic programmatic retries or worker queues.
- ❌ Handle Agent-to-Agent IPC message routing.
- ❌ Compete with multi-agent runtimes (e.g., LangGraph, AutoGen, CrewAI).

All physical execution, threading, tool calling, and IPC belong 100% to **Codex / Agent Runtime**.

---

## Release Roadmap

### v0.3.0 — Planning Protocol Foundation (Current Release)
- **Focus**: Core split gate, Task vs Project mode, safety invariants (`write ∩ write = ∅`, `write ∩ read = ∅`), contract owners, wave scheduling, Machine Schema contract (`schema_version: "1.0"`), Long-Term Agent Candidate policy (`promotion_check: silent`).

### v0.4.0 — Decomposition Intelligence
- **Focus**: Planning Quality Upgrade.
- **Capabilities**:
  - **Vertical vs. Horizontal Split**: Vertical Split (end-to-end capability slicing, e.g., API + UI + Test per user value) vs. Horizontal Split (decoupled module slicing) to prevent inter-agent blocking.
  - **Lane Quality Criteria**: Validating single goal, bounded scopes, explicit deliverables, and pass/fail acceptance per lane.

### v0.5.0 — Context Engineering
- **Focus**: Agent Context Budget Policy.
- **Capabilities**:
  - **Context Scope**: Bounding `read_scope`, `write_scope`, and `ignore_scope` (e.g., excluding `node_modules/**`, build artifacts, and irrelevant packages) to eliminate context bloat.
  - **Noise Boundaries**: Explicitly defining files and directories that child subagents must NOT inspect or touch.

### v0.6.0 — Prompt Specialization
- **Focus**: Role-Tailored Prompt Templates.
- **Capabilities**: Specialized prompts tailored to lane objectives: Explorer (read-only audit), Implementer (bounded modification), Reviewer (risk challenge), Migrator (backward compatibility).

### v0.7.0 — Agent Evolution
- **Focus**: Candidate Quality & Noise Filter.
- **Capabilities**: Candidate Quality Filters (`Frequency` + `Stability` + `Boundary` + `Reuse Value`); rejecting temporary task workers; max 1 candidate per run; explicit user approval required before generating `.toml` files.

### v0.8.0 — Planning Personalization
- **Focus**: User Preference Learning.
- **Capabilities**: Adapt planning styles to user preferences (e.g., risk tolerance, maximum concurrency limits, discovery bias, single-owner preference).

### v1.0.0 — Mature Planning Harness Skill
- **Focus**: Complete Planning Intelligence Stack.
- **Capabilities**: Unified synthesis of Decomposition, Context Engineering, Prompt Specialization, Agent Evolution, and Personalization guiding host runtimes.
