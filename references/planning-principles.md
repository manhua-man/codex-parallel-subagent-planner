# Planning Principles

Use this reference when evaluating planning trade-offs, determining lane budgets, or auditing plan quality.

## Core Planning Principles

The planner operates according to 5 fundamental senior-engineering principles:

```text
┌────────────────────────────────────────────────────────┐
│                   Planning Principles                  │
│                                                        │
│  1. Parallelism Principle  ──► No unnecessary splits   │
│  2. Contract Single-Owner ──► 1 Owner per Contract     │
│  3. Minimal Lane Principle ──► Minimum viable lanes    │
│  4. Exploration First     ──► Audit ambiguous scope    │
│  5. Main Thread Integration──► Explicit verifications  │
└────────────────────────────────────────────────────────┘
```

---

## 1. Parallelism Principle (Pragmatic Split)
Never split a task into subagents solely for the sake of parallelism.
- Only split when independent workstreams materially reduce wall-clock time or a read-only investigation de-risks implementation.
- If a task touches a single file, a single module, or has tightly coupled sequential steps, execute it directly in the main thread.

## 2. Contract Ownership Principle (Single Owner)
Every shared contract (API DTO, database migration, router registry, global config) MUST have exactly ONE owner lane per wave.
- The contract owner lane is responsible for modifying and freezing the contract.
- Consumer lanes may read frozen contracts but MUST NOT touch contract files concurrently.

## 3. Minimal Lane Principle (Budget & Concurrency)
Use the minimum viable lane count.
- Excess lanes increase integration overhead, context switching, and main-thread merge costs.
- Respect host concurrency budgets. When ready lanes exceed budget, launch critical-path work first and hold remaining lanes.

## 4. Exploration First Principle (De-Risking)
When architectural boundaries, dependency coupling, or root causes are ambiguous:
- Always launch ONE read-only discovery lane (`agent_type: explorer`, `write_scope: []`).
- Hold all implementation workers until the discovery lane returns verified evidence and scope boundaries.

## 5. Main Thread Integration Principle (Verification)
Child lanes execute in isolated sandbox environments and perform only lane-local checks.
- Every parallel plan MUST define explicit main-thread integration steps.
- The main thread merges child lane outputs, resolves cross-module wiring, and runs workspace-wide integration test suites.
