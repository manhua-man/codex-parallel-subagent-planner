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
- **Frontier Definition**: The **Frontier** is the exact set of ready lanes (`state: ready`) whose dependencies and prerequisite contracts are fully satisfied (`done` or `integrated`).
- **Wave Launching**: Launch only ready frontier lanes within budget constraints. Hold downstream dependent lanes (`state: blocked` or `state: held`).

---

## 3. Incremental Replanning

Skill does NOT maintain a persistent runtime state store. It consumes status updates provided by the active session or host runtime:

1. **Freeze Completed Lanes**: Lanes marked `done` or `integrated` are frozen. Never re-plan or re-run completed lanes unless a shared contract has explicitly changed.
2. **Incremental Frontier Recalculation**: When status updates arrive:
   - Update finished lanes to `done` or `integrated`.
   - Re-evaluate downstream lanes (`depends_on`).
   - Transition unblocked lanes from `blocked` to `ready` and add them to the updated Frontier.
   - Recalculate ONLY affected downstream lanes—do not re-plan the entire project from scratch.
3. **Contract Shifts**: If a shared API, database schema, or router contract changes, re-evaluate ONLY the consumer lanes reading that contract.

---

## 4. Main Thread Integration

Child lanes execute in isolated sandbox environments and perform only lane-local checks. Main thread responsibilities:
- Merge child lane deliverables into the target repository.
- Run workspace-wide verification and cross-module integration test suites.
- Trigger incremental replanning for the next wave.
