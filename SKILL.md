---
name: parallel-subagent-planner
description: >-
  Plan safe Codex subagent execution for bounded coding tasks and multi-module
  software work. Use when deciding whether parallel agents would help, splitting
  an accepted implementation goal into independent lanes, mapping dependencies
  and shared write boundaries, scheduling project work in waves, or evaluating
  long-term custom agent candidates. Do not use it to define product requirements,
  approve architecture, replace specification workflows, or route work to external
  coding-agent backends.
---

# Parallel Subagent Planner (v2.0.4 Lean Harness Skill)

Decide whether subagents materially help, split accepted work into bounded lanes, hold coupled work, schedule project work in waves, and guide Codex execution.

## 1. Choose Task Or Project Mode

Use **task mode** for one bounded change, one module, or already-named lanes under one accepted task.

Use **project mode** when the goal spans multiple modules, services, or packages. Read [references/project-waves.md](references/project-waves.md) to discover product surfaces, map module dependencies, and assign shared contract owners before launching waves.

## 2. Decide Direct Execution Or Subagents

Never split for the sake of splitting. Split only if independent workstreams reduce wall-clock time or a read-only investigation de-risks implementation.

Split only if ALL of the following are true:
- Workstreams are genuinely independent.
- Every lane passes the Lane Ready Gate with clear goal, scopes, deliverable, and acceptance.
- Write scopes are disjoint with zero overlap (`write(A) ∩ write(B) = ∅`).
- No lane reads a file currently being edited by another lane (`write(A) ∩ read(B) = ∅`).

If any condition fails or there is no strong parallel benefit, execute directly in the main thread.

## 3. Build Ready Lanes

Read [references/lane-planning.md](references/lane-planning.md) for decomposition heuristics and Ready Gate rules.

Choose slicing strategy based on codebase coupling:
- **Vertical Split (End-to-End Capability)**: Groups UI, API, and tests for a user feature into one lane (e.g., `user-profile-capability`) to prevent inter-agent deadlocks.
- **Horizontal Split (Decoupled Module)**: Separates distinct, independent packages (e.g., Payment vs Notification).

Every candidate lane MUST pass the Lane Ready Gate by defining all 6 canonical Ready Gate fields (`Goal`, `Read`, `Write`, `Deliverable`, `Depends on`, `Acceptance`) alongside Control Metadata (`ID`, `Role`, `Ignore`, `Model profile`, `State`, `Reason`).

**Shared Contract Rule**: Every shared API, database schema, route registry, migration, or global config must have exactly ONE owner lane per wave. Consumers may read established contracts once frozen, but must not edit contract files concurrently.

## 4. Assign Context, Role And Model Profile

Read [references/context-and-prompts.md](references/context-and-prompts.md) for context layers and prompt templates.

Assign each lane an explicit canonical role (`explorer`, `implementer`, `reviewer`, `migrator`), `Read`, `Write`, `Ignore` (system noise + sibling scopes), and model profile:
- `deep`: ambiguous root cause, security-sensitive work, shared contracts, high-risk integration.
- `balanced`: bounded feature implementation, ordinary refactoring, standard feature development.
- `fast`: read-only scans, information extraction, evidence collection, deterministic transformations.

Model mappings and host capability rules are defined in [references/runtime-compatibility.md](references/runtime-compatibility.md).

## 5. Launch Or Hold

Use the minimum viable lane count. Compute the **Frontier** (lanes ready to launch right now).

Distinguish Blocked vs. Held states:
- **`blocked`**: Objective block (prerequisite lane not integrated, referenced contract not frozen, verification failed, unclear scope).
- **`held`**: Planner policy hold (concurrency budget reached, parallel benefit too low, scheduling conflict).

When ready lanes exceed concurrency budget:
1. Launch critical-path work first.
2. Launch lanes that unblock downstream work.
3. Launch low-risk independent work.
4. Hold remaining lanes (`state: held`, `held_reason: concurrency_budget`).

## 6. Integrate And Replan (State-Aware Incremental Replanning & Auto-Logging)

Read [references/project-waves.md](references/project-waves.md) for incremental replanning and automated diagnostic logging guidelines.

In task mode: wait for child lanes to complete, merge deliverables, and run main-thread verification.

In project mode: after each wave completes or when status updates arrive:
- **`done`**: Child agent completed local work. Preserve `done` lanes while awaiting main-thread integration.
- **`integrated`**: Main thread has merged deliverables and verified workspace integration. Freeze `integrated` lanes.
- A downstream lane may launch only when every prerequisite lane is `integrated` and every referenced shared contract is `frozen`.
- Recalculate ONLY affected downstream lanes and unblocked dependencies to form the next parallel frontier.
- **Automated Failure Logging**: If a child lane fails, violates scope, or fails acceptance, the main thread automatically runs failure diagnosis and appends a 5-line failure card entry to `failures.md` (100% zero-human intervention).

Main thread is 100% responsible for final integration and global workspace verification.

## 7. Output Modes

### Compact (Default)
Return Compact by default for human review:
- **Decision**: brief rationale on why to split or execute directly.
- **Launch now**: list of ready frontier lanes with `Lane ID`, `Role`, `Goal`, `Write`, `Deliverable`, and `Acceptance`.
- **Hold / Block**: list of held or blocked lanes with explicit reasons (`blocked_reason` or `held_reason`).
- **Integration**: main thread verification and integration sequence.
- **Agent candidates**: optional concise list when high-confidence candidates exist.

### Full
Return Full when requested or during complex diagnostic reviews:
- Project scale decision, surface map, global constraints, and slicing strategy.
- Complete lane table with dependencies, contract owners, and Ready Gate audits.
- Current Frontier and ready child prompts.
- Integration sequence, incremental replanning rules, and long-term agent candidates.

## 8. Evaluate Long-Term Agent Candidates

Read [references/agent-evolution.md](references/agent-evolution.md) for candidate quality auditing rules.

After integration, evaluate whether recurring subagent roles pass the 4 candidate quality filters (`Frequency` 2+ in visible history, `Stability`, `Boundary`, `Reuse Value`).

**Policy Settings** (`promotion_check`):
- `off`: do not evaluate promotion.
- `silent` (default): evaluate internally; report high-confidence candidates in a concise section at the end of output.
- `ask`: explicitly report all qualified candidates after integration.

Multiple qualified candidates may be reported together.

**Hard Requirement**: NEVER create, write, or modify any custom agent `.toml` file without explicit user approval.

---

## Canonical Safety Rules

1. Do not split for the sake of splitting.
2. Write scopes in the same wave must never overlap (`write ∩ write = ∅`).
3. No lane may read a file currently being modified by another lane (`write ∩ read = ∅`).
4. Each shared contract has exactly ONE owner lane per wave.
5. No lane may launch until it passes the Lane Ready Gate.
6. When boundaries are ambiguous, launch ONE read-only `explorer` first.
7. Use the minimum viable lane count.
8. Subagents must never recursively launch or delegate to other agents.
9. Main thread is 100% responsible for final integration and global verification.
10. A downstream lane may launch only when every prerequisite lane is integrated and every referenced shared contract is frozen.
11. Never create or edit persistent custom agent `.toml` files without explicit user approval.
