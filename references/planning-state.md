# Planning State Awareness

Use this reference when evaluating runtime execution updates, incremental lane completions, or contract state shifts.

## Core Philosophy

`parallel-subagent-planner` does NOT implement a physical database or runtime state store. Instead, it provides **Planning State Awareness**: the cognitive ability to parse current execution progress and recalculate ONLY affected parallel frontiers without re-planning the entire project.

```text
┌────────────────────────────────────────────────────────┐
│             Planning State Awareness                   │
│                                                        │
│  [Completed Lanes]  ──► Freeze & Keep Integrated      │
│  [Blocked Lanes]    ──► Identify Root Dependency      │
│  [Changed Contracts]──► Invalidate Downstream Scope   │
│  [Frontier]         ──► Recalculate Affected Lanes    │
└────────────────────────────────────────────────────────┘
```

---

## Incremental Replanning Rules

1. **Freeze Completed Lanes**: Lanes marked as `done` or `integrated` are frozen. Never re-plan, re-run, or re-open completed lanes unless a shared contract has explicitly changed.
2. **Local Frontier Recalculation**: When a lane completes:
   - Update its status to `done` or `integrated`.
   - Check all downstream lanes that depend on it (`depends_on`).
   - If all dependencies for a blocked lane are now satisfied, transition its state from `blocked` to `ready` and add it to the `frontier`.
3. **Failure & Block Handling**: When a lane fails or blocks:
   - Mark the lane `blocked` with a specific `held_reason` (`verification_failed`, `dependency`, etc.).
   - Invalidate dependent downstream lanes by marking them `blocked`.
   - Keep unblocked, independent ready lanes in the `frontier` so unrelated parallel work continues.
4. **Contract Shift Re-evaluation**: If a shared API, database schema, or router contract changes:
   - Re-evaluate ONLY the consumer lanes reading that contract.
   - Do not touch independent modules unaffected by the contract change.

---

## Planning State Object Format

In Machine Schema Mode (`schema_version: "1.2"`), represent execution state using the optional `planning_state` object:

```json
{
  "planning_state": {
    "completed_lanes": ["auth-api-lane"],
    "blocked_lanes": ["media-processing-lane"],
    "changed_contracts": ["v2-auth-contract"],
    "frontier": ["workspace-crud-lane"]
  }
}
```
