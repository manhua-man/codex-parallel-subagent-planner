---
name: parallel-subagent-planner
description: >-
  Plan safe Codex subagent execution for bounded coding tasks and multi-module
  software work. Use when deciding whether parallel agents would help, splitting
  an accepted implementation goal into independent lanes, mapping dependencies
  and shared write boundaries, scheduling project work in waves, outputting a
  machine-readable schema plan, evaluating long-term agent candidates, or
  generating bounded non-recursive child prompts. Do not use it to define
  product requirements, approve architecture, replace specification workflows, or
  route work to external coding-agent backends.
---

# Parallel Subagent Planner

Decide whether subagents materially help, split accepted implementation work into bounded lanes, hold coupled work, and schedule multi-module projects in dependency-safe waves.

## 1. Choose Task Or Project Mode

Use **task mode** for one bounded change, one module, or already-named lanes under one accepted task.

Use **project mode** when any one is true:
- The goal spans multiple modules, services, packages, routes, or testable capabilities.
- Building, migrating, or finishing a complete product or application.
- Several modules are visible but dependencies, shared contracts, or ownership are not yet mapped.

In project mode, read [references/project-scale-planning.md](references/project-scale-planning.md). Map the full product surface, assign shared contract owners, and compute the parallel frontier before launching workers. If scope is unclear, launch one read-only discovery lane first and hold implementation. Never silently reduce a project request to a single module.

## 2. Decide Whether To Split

Consider subagents only when independent workstreams reduce wall-clock time or a read-only lane de-risks implementation.

Split only if ALL of the following are true:
- Workstreams are genuinely independent.
- Each lane has a clear goal, bounded scope, deliverable, and acceptance check.
- Write scopes are disjoint with zero overlap (`write(A) ∩ write(B) = ∅`).
- No lane reads a file currently being modified by another lane (`write(A) ∩ read(B) = ∅`).

If any condition fails or there is no strong parallel benefit, do NOT split: execute directly in the main thread.

## 3. Define Safe Lanes

Assign each lane an explicit role (`explorer`, `worker`, `verifier`, or `default`), read/write scopes, deliverable, acceptance criteria, and model profile:
- `deep`: ambiguous root cause, security-sensitive work, complex shared contracts, high-risk integration, final review.
- `balanced`: bounded implementation, ordinary refactoring, standard feature development, targeted verification.
- `fast`: read-only scans, information extraction, evidence collection, deterministic transformations.

Model mappings and host capability rules are defined in [references/runtime-compatibility.md](references/runtime-compatibility.md).

**Shared Contract Rule**: Every shared API, database schema, route registry, migration, or global config must have exactly ONE owner lane per wave. Consumers may read established contracts but must not edit them concurrently.

## 4. Launch Or Hold

Use the minimum viable lane count. When ready lanes exceed concurrency budget:
1. Launch critical-path work first.
2. Launch lanes that unblock the most downstream work.
3. Launch low-risk independent work.
4. Hold lanes whose context or integration cost exceeds their wall-clock benefit.

Hold any lane that touches another lane's files, depends on uncompleted investigation or shared contracts, or lacks clear acceptance. See [references/planner-details.md](references/planner-details.md) for lane mechanics.

## 5. Write Child Prompts

Child prompts must be short, non-recursive, and isolated:

```text
Goal: [one narrow outcome]
Working directory: [target repository]
Read first: [bounded files or directories]
Write: [exact files or directories, or none]
Acceptance: [lane-local checks]

Boundary:
- Work only inside this lane.
- Do not launch or delegate to other agents.
- Do not edit outside Write.
- Stop and report when another scope is required.
- Run only lane-local verification.
- Return changes, checks, risks, and handoff notes.
```

Role-specific prompt templates are provided in [references/prompt-templates.md](references/prompt-templates.md).

## 6. Integrate And Replan

In task mode: wait for child lanes to complete, integrate changes, and run main-thread verification.

In project mode: after each wave completes, verify shared contracts and outputs, update module states, recompute the next parallel frontier, and launch the next wave.

## 7. Output Modes

### Compact (Default)
Return Compact by default for human review:
1. **Why split or not split**: brief rationale.
2. **Launch now**: list of ready lanes with model profiles and scopes.
3. **Held lanes**: list of held lanes with specific hold reasons.
4. **Integration note**: main thread verification and integration sequence.

### Full
Return Full when requested or during complex diagnostic reviews:
1. Scale decision & surface map.
2. Complete lane table with dependencies & contract owners.
3. Current wave & ready child prompts.
4. Integration and replan instructions.

### Machine
Return Machine JSON only when explicitly requested, when another program will consume the result, or when downstream schedulers require a versioned contract:
- Follow `schema/planner-plan.schema.json` with `"schema_version": "1.0"`.
- Read [references/machine-schema.md](references/machine-schema.md) for protocol details and boundaries.
- Do not include Markdown fences or conversational text.

## 8. Long-Term Agent Candidates

After completing integration, optionally evaluate whether a subagent role qualifies as a reusable custom agent.

Only propose promotion when:
- The same bounded stewardship or verification responsibility has appeared repeatedly.
- Its scope, inputs, outputs, and acceptance checks are stable.
- A dedicated agent would eliminate repeated manual setup.

**Policy Settings** (`promotion_check`):
- `off`: do not evaluate promotion.
- `silent` (default): evaluate internally; report a candidate only when a high-confidence recurring role exists.
- `ask`: explicitly report qualified candidates after integration.

Never propose more than one candidate per run. Never generate or write a custom agent `.toml` file without explicit user approval. Read [references/long-term-agents.md](references/long-term-agents.md) when a qualified candidate exists or when creating a persistent agent spec.
