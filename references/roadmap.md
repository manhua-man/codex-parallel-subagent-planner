# Agent Planning Harness Skill Strategic Roadmap (v0.3.0 —> v1.0.0)

This document defines the strategic vision, boundary rules, and release roadmap for `parallel-subagent-planner`.

## Product Positioning & Philosophy

`parallel-subagent-planner` is an **Agent Planning Harness Skill** (also referred to as the **Codex Parallel Planning Intelligence Layer**).

It is an instruction-only AI Skill that injects senior engineering cognitive capabilities into an Agent Runtime. It helps Codex decide how to split tasks, isolate contexts, schedule waves, serialize versioned plan schemas, and evolve long-term agent candidates.

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

### Core Principle
- **Skill is the Cognitive Layer; Runtime is the Execution Layer**: The Skill owns structure understanding, multi-agent collaboration planning, context budget allocation, and candidate evolution. Physical code modifications, thread handles, scheduling, and execution belong 100% to Codex Runtime.

---

## Anti-Scope (The Four Hard Boundaries)

To maintain clean skill boundaries, `parallel-subagent-planner` will **NEVER**:

- ❌ **No Physical Runtime**: Does not implement `spawn()`, `run()`, `kill()` process handles.
- ❌ **No Physical Scheduler**: Does not maintain physical task queues, priority queues, or worker thread pools.
- ❌ **No Communication Layer**: Does not implement inter-agent message buses or mailboxes.
- ❌ **No Physical Database**: Does not maintain task databases, execution logs, or metrics systems.

All physical execution, threading, tool calling, and IPC belong 100% to **Codex / Agent Runtime / External Orchestrator**.

---

## Complete Release Roadmap

| Release | Focus Area | Harness Layer | Key Capabilities |
| --- | --- | --- | --- |
| **v0.3.0 (Current)** | **Planning Protocol Foundation** | Planner | Task vs. Project Scale Gate, Split Gate, scope safety invariants (`write ∩ write = ∅`, `write ∩ read = ∅`), contract owners, wave scheduling, Machine Schema (`schema_version: "1.0"`), Long-Term Agent Candidates (`promotion_check: silent`). |
| **v0.4.0** | **Decomposition Intelligence** | Planner | Vertical Split (end-to-end capability slicing, e.g., API + UI + Test per user value) vs. Horizontal Split (decoupled module slicing); Lane Quality Criteria (single goal, bounded scopes, clear deliverables, verifiable acceptance). |
| **v0.5.0** | **Planning State Awareness** | State | Planner understands execution state without maintaining a runtime database; recomputes only affected parallel frontiers upon incremental status updates. |
| **v0.6.0** | **Context Harness** | Context | Context Budget Engineering: formalizing Global Context, Lane Context, and Noise Boundaries (`ignore_scope` for `node_modules/**`, build artifacts, etc.) to eliminate context bloat. |
| **v0.7.0** | **Prompt Specialization** | Policy | Role-tailored child prompts: Explorer (read-only audit), Implementer (bounded modification), Reviewer (risk challenge), Migrator (backward compatibility). |
| **v0.8.0** | **Planning Principles** | Policy | Formalizing planning principles (Parallelism Principle, Contract Ownership Principle, Minimal Lane Principle, Exploration Principle, Integration Principle). |
| **v0.9.0** | **Agent Evolution** | Memory | Enhanced agent candidate lifecycle (`Candidate` ➔ `Review` ➔ `Approved` ➔ `Persistent Agent` ➔ `Retire`) with strict candidate quality filters (`Frequency` + `Stability` + `Boundary` + `Reuse Value`). |
| **v1.0.0** | **Agent Planning Harness Skill** | All Layers | Complete, mature Planning Harness Intelligence stack for host runtimes. |
