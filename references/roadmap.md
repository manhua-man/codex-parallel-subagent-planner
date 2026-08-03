# Skill-Boundary Strategic Roadmap (v0.3.0 —> v0.8.0)

This document defines the strategic vision, boundary rules, and release roadmap for `parallel-subagent-planner`.

## Product Positioning

`parallel-subagent-planner` is an **Instruction-Only Codex Skill**. It is NOT an Agent Runtime, Multi-Agent Orchestrator framework, or programmatic SDK.

Its sole purpose is to serve as the **intelligence and policy control layer that makes Codex smarter when using subagents**.

```text
┌────────────────────────────────────────────────────────┐
│             parallel-subagent-planner                  │
│                    (AI Skill)                          │
│                                                        │
│  - Split Decision (Scale & Split Gate)                 │
│  - Decomposition Rules (Vertical vs. Horizontal)       │
│  - Context Scope (Read, Write, Ignore Scopes)          │
│  - Prompt Specialization (Role-based Prompts)          │
│  - Machine Schema Protocol (schema/planner-plan.json)  │
│  - Agent Candidate Identification (Long-Term Policy)   │
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

### v0.3.0 — Planning Protocol (Current Release)
- **Focus**: Core split gate, Task vs Project mode, safety invariants (`write ∩ write = ∅`, `write ∩ read = ∅`), shared contract owners, wave scheduling, Machine Schema contract (`schema_version: "1.0"`), Long-Term Agent Candidate policy (`promotion_check: silent`).

### v0.4.0 — Better Decomposition
- **Focus**: Planning Quality Upgrade.
- **Capabilities**: Introduce Vertical Split (end-to-end user value slicing, e.g., API + UI + Test per capability) vs. Horizontal Split (decoupled module slicing) to prevent inter-agent blocking.

### v0.5.0 — Context Engineering
- **Focus**: Agent Context Budget Policy.
- **Capabilities**: Explicitly bound `read_scope`, `write_scope`, and `ignore_scope` (e.g., excluding `node_modules/**`, build artifacts, and irrelevant packages) to eliminate context bloat.

### v0.6.0 — Prompt Specialization Layer
- **Focus**: Role-Specific Prompt Templates.
- **Capabilities**: Specialized prompts tailored to lane objectives: Explorer (read-only audit), Worker (bounded modification), Reviewer (risk challenge), Migration Worker (backward compatibility).

### v0.7.0 — Agent Evolution
- **Focus**: High-Value Role Identification.
- **Capabilities**: Strict candidate quality filters (excluding temporary bug-fix workers; promoting stable stewardship roles like API compatibility reviewers).

### v0.8.0 — Planning Personalization
- **Focus**: User Preference Learning.
- **Capabilities**: Adapt planning styles to user preferences (e.g., concurrency limits, discovery preference, single-owner bias).
