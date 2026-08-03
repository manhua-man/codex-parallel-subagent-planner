# Agent Harness Skill Strategic Roadmap (v0.3.0 —> v1.0.0)

This document defines the strategic vision, architectural boundaries, and release roadmap for `parallel-subagent-planner`.

## Product Positioning

`parallel-subagent-planner` is an **Agent Harness Skill** that provides the **Cognitive, Protocol, and Policy Layer** for agent execution. It guides the active Codex or LLM Agent Runtime without implementing physical runtime infrastructure.

```text
                  Agent Harness Skill
                           │
       ┌───────────────────┼───────────────────┐
    Planner            State Model          Memory
       │                   │                   │
    Policy           Machine Schema      Agent Evolution
       └───────────────────┬───────────────────┘
                           │
                 [ Machine Protocol ]
                           │
               ┌───────────┴───────────┐
               ▼                       ▼
       [ Codex Runtime ]      [ Host Orchestrator ]
               │                       │
               └───────────┬───────────┘
                           ▼
                    [ Child Agents ]
```

- **Skill Layer**: Brain, rules, boundary engineering, state-awareness, and protocol specification.
- **Runtime Layer**: Process handles, threading, workspace IPC, and physical execution (owned by Codex / Host Runtime).

---

## The Four Hard Boundaries

To maintain clean skill boundaries, `parallel-subagent-planner` will **NEVER**:

1. ❌ **Implement Physical Execution Runtimes**: No `spawn()`, `run()`, or `kill()` process handles.
2. ❌ **Implement Runtime State Stores**: No SQLite databases, workers registries, or disk state locks.
3. ❌ **Implement Programmatic Task Schedulers**: No custom binary queues or worker pools.
4. ❌ **Implement Custom Message Buses**: No custom IPC protocol layers between agents.

Physical execution and IPC remain 100% owned by Codex / OpenAI Agent Runtime or external orchestrators.

---

## Release Roadmap

### v0.3.0 — Planning Protocol (Current Release)
- **Layer**: Planner Core & Protocol
- **Capabilities**: Task vs. Project Scale Gate, Split Gate, scope safety invariants (`write ∩ write = ∅`, `write ∩ read = ∅`), contract owners, wave scheduling, Machine Schema (`schema_version: "1.0"`), Long-Term Agent Candidate policy (`promotion_check: silent`).

### v0.4.0 — State-Aware Planning
- **Layer**: State Model
- **Goal**: Enable the skill to consume execution status without managing a runtime store (`references/execution-state.md`).
- **Capabilities**: Recompute only affected parallel frontiers upon status updates (`pending`, `ready`, `running`, `completed`, `failed`, `blocked`), avoiding full-project replanning.

### v0.5.0 — Adaptive Replanning
- **Layer**: Planner + State
- **Goal**: Establish feedback loop for replanning triggers (`references/replanning.md`).
- **Capabilities**: Handle lane failures, contract spec shifts, and runtime scope collision detection dynamically.

### v0.6.0 — Context Harness (Quality Gate)
- **Layer**: Policy Layer
- **Goal**: Eliminate agent context pollution and boundary drift (`references/context-engineering.md`).
- **Capabilities**: Formalize Global Context, Lane Context, and explicit Forbidden Context boundaries per subagent.

### v0.7.0 — Policy-Driven Planning
- **Layer**: Policy Layer
- **Goal**: Abstract experience rules into declarative planning policies (`references/policies.md`).
- **Capabilities**: Declarative Parallel Policy, Split Policy, and Single-Owner rules.

### v0.8.0 — Agent Evolution Layer
- **Layer**: Memory & Evolution
- **Goal**: Deepen long-term candidate management (`references/agent-evolution.md`).
- **Capabilities**: Full agent candidate lifecycle (`Candidate` ➔ `Approved` ➔ `Persistent Agent` ➔ `Retire`).

### v0.9.0 — Planning Memory Layer
- **Layer**: Memory Layer
- **Goal**: Learn user execution preferences without persistent databases (`references/user-preferences.md`).
- **Capabilities**: Adapt to user risk tolerance, maximum parallelism limits, and contract ownership preferences.

### v1.0.0 — Unified Agent Harness Skill
- **Layer**: Complete Harness Intelligence Stack
- **Goal**: Unified synthesis of Planner, State Model, Policy, Memory, and Agent Evolution layers guiding host runtimes.
