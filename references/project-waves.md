# Project Waves & Incremental Replanning

Use this reference when planning multi-module software projects, computing wave frontiers, or handling incremental replanning.

## Project Wave Cycle

```text
Discover surface ➔ Map dependencies ➔ Assign contract owners ➔ Compute frontier ➔ Launch wave ➔ Integrate ➔ Recompute affected frontier
```

---

## 1. Project Surface Discovery & Module Matrix

In project mode, inventory all packages, modules, routes, databases, and services within scope:

```text
- module: [name]
  owns: [primary capability or service]
  slicing_strategy: vertical | horizontal
  depends_on: [prerequisite modules or contract IDs]
  shared_contracts: [contract IDs assigned or consumed]
  read_scope: [dir/** or path/to/file]
  write_scope: [dir/** or path/to/file]
  acceptance: [pass/fail checks]
  state: ready | running | blocked | integrated | done | held
```

If architecture or boundaries are unclear, launch ONE read-only `explorer` lane first and hold implementation lanes until discovery completes.

---

## 2. Shared Contract Owners & Parallel Frontier

- **Contract Ownership**: Assign exactly ONE owner lane per wave for each shared API, schema, router, or global config.
- **Frontier Definition**: The **Frontier** is the exact set of ready lanes (`state: ready`) whose prerequisite dependencies are fully satisfied (`integrated`).
- **Wave Launching**: Launch only ready frontier lanes within budget constraints. Hold downstream dependent lanes (`state: blocked` or `state: held`).

---

## 3. Incremental Replanning & State Semantics

Skill does NOT maintain a persistent runtime state store. It consumes status updates provided by the active session or host runtime.

### State Semantics
- **`done`**: Child agent completed local work and lane-local checks. Deliverable is awaiting main-thread integration.
- **`integrated`**: Main thread has merged deliverables and verified workspace integration. Downstream lanes can now safely depend on it.

### Incremental Replanning Rules
1. **Preserve `done` Lanes / Freeze `integrated` Lanes**: Preserve `done` lanes while awaiting main-thread integration. Once `integrated`, freeze them. Never re-plan or re-run completed lanes unless a shared contract has explicitly changed.
2. **Dependency Satisfaction**: Downstream dependencies are satisfied ONLY when prerequisite lanes reach `integrated` state (or when an explicitly frozen contract artifact is available).
3. **Incremental Frontier Recalculation**: When status updates arrive:
   - Mark integrated lanes as `integrated`.
   - Re-evaluate downstream lanes (`depends_on`).
   - Transition unblocked lanes from `blocked` to `ready` and add them to the updated Frontier.
   - Recalculate ONLY affected downstream lanes—do not re-plan the entire project from scratch.
4. **Contract Shifts**: If a shared API, database schema, or router contract changes, re-evaluate ONLY the consumer lanes reading that contract.

---

## 4. Main Thread Integration & Environment Handling

Child lanes execute in isolated scopes and perform only lane-local checks:
- **Sandbox Handling**: When the host provides isolated sandboxes or worktrees, execute child lanes inside them. Otherwise, preserve logical isolation through strict ownership scopes (`Read`, `Write`, `Ignore`).
- **Main Thread Responsibilities**:
  - Merge child lane deliverables into the target repository.
  - Run workspace-wide verification and cross-module integration test suites.
  - Transition lanes from `done` to `integrated` and trigger incremental replanning for the next wave.
