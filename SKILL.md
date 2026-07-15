---
name: parallel-subagent-planner
description: Cost-aware Codex execution-parallelism planner for both bounded tasks and multi-module software work. Use to decide whether to launch safe subagents, discover execution modules and dependencies when an approved goal spans a complete app or several capabilities, schedule independent work in waves, and send minimal non-recursive worker prompts. Do not use it as a substitute for product requirements, architecture or plan review, OpenSpec artifact management, or external coding-agent backend routing.
---

# Parallel Subagent Planner

Default behavior: classify task scale first, then use the cheapest safe planning path. Keep bounded tasks on the fast split gate; build a module dependency graph for project-scale goals before choosing lanes.

## Scale Gate

Use **task mode** for one bounded change, one module, or already-named lanes under one accepted task. Continue to the Fast Gate without a broad repository scan.

Use **project mode** when any one is true:

- the user asks to build, rebuild, migrate, or finish a complete application or product
- the goal spans multiple modules, services, packages, routes, or independently testable capabilities
- several modules are visible but their dependencies, shared contracts, or ownership are not yet mapped
- completing only the currently discussed module would leave material parts of the stated goal unplanned

In project mode, read [references/project-scale-planning.md](references/project-scale-planning.md). Inventory the whole in-scope product surface, build the dependency graph, assign shared-contract ownership, and compute the current parallel frontier before launching implementation workers. If the module map is unclear, launch one bounded read-only discovery lane first and hold implementation.

Do not silently reduce a project-scale request to the current module. Record the remaining modules and their launch or hold state even when only the first wave can start now.

## Composition Boundaries

Own execution-lane discovery, dependency scheduling, launch/hold decisions, and main-thread integration. Compose with other workflows instead of replacing them:

- Product requirements or scope are unclear: use the relevant requirements/product skill first.
- A plan needs CEO, design, engineering, or DX review: run the requested review or `autoplan` first; schedule the accepted plan afterward.
- OpenSpec artifacts or tasks exist: keep `openspec-apply-change` as the governing implementation workflow and owner of task selection/status updates. Treat its pending tasks as authoritative lane inputs; do not regenerate, bypass, or create a competing task state.
- The user requests Codex, Claude, Antigravity, Hermes, or another external backend: let `coding-agents` own backend routing. This skill may define lane boundaries only when explicitly combined.

Do not run two execution orchestrators over the same write scopes at the same time. When another workflow already owns dispatch, provide a lane/dependency recommendation or wait for its handoff.

## Mandatory Long-Term Agent Check

After every parallel run, check whether any completed subagent role is worth
turning into a long-term agent. If a reusable candidate exists, proactively ask
the user whether to promote it. Do not wait for the user to ask first.

Promotion is advisory until the user explicitly approves file creation. When
asking, report only:
- Whether the role is worth promoting
- Why it is worth promoting
- Where the agent spec should be stored

Recommend promotion only for recurring, bounded steward/verifier roles with
objective checks. Do not promote temporary task workers, broad coordinators, or
roles that depend on one-off session context.

Do not create or write `.codex/agents/` or `agents/` files until the user
explicitly approves that specific promotion. If a reusable candidate is unclear
or the user asks for criteria/spec details, read
[references/long-term-agents.md](references/long-term-agents.md).

## Fast Gate

Consider subagents when any one is true:

- independent workstreams can reduce wall-clock
- a read-only explorer or verification lane can unblock or de-risk implementation
- the user provided separable files, tests, docs, ledgers, or named workstreams
- the task is broad or risky enough that parallel investigation, review, or cleanup is useful

No strong signal in task mode means `Not split` and main-thread work. In project mode, evaluate independent modules from the current parallel frontier rather than only the module currently being discussed. Considering subagents does not require launching them: launch only lanes with a clear goal, bounded read/write scope, a useful deliverable, and an acceptance check. Hold or merge lanes that are tiny, coupled, unclear, or likely to duplicate broad verification.

## Launch Protocol

When launching, use the minimum viable lane count. Multiple write-enabled workers are allowed when the workstreams are genuinely independent and the expected benefit should justify child context cost. More than 3 lanes is allowed when the lanes have clearly independent write scopes, lane-local checks, and a concrete expected time or cost benefit. In project mode, launch only the current frontier; keep later waves held until their dependencies and contracts pass.

One broad final test suite, such as `npm test`, is a merge risk. It does not forbid two workers, but each worker must have lane-local checks and the main thread must run the broad final suite once.

Default spawn mode is explicit `fork_context=false`: pass only a compact Context Brief and assign `agent_type`, `model`, and `reasoning_effort` when they materially improve cost or quality. Child model and reasoning are lane-level judgments, not copies of the main thread settings; choose the lowest capable setting from the lane's risk, ambiguity, blast radius, and expected savings. Before spawning, normalize the launch args so `fork_context=true` is never combined with `agent_type`, `model`, or `reasoning_effort`. Use `fork_context=true` only when the lane cannot be safely described without full conversation history; if inheriting context, omit all three overrides.

Child prompts must be short and non-recursive:

```text
Goal: [one narrow task]
Working directory: [absolute path to the target repo/worktree/run directory]
Read: [exact files/dirs]
Write: [exact files/dirs or none]
Acceptance: [checks]
Preflight: before reading or editing, switch to Working directory or use absolute
paths, then verify every Read/Write target exists. If a target is missing, stop
and report the missing path and current cwd.
Hard boundary: modify only Write. If another file is needed, stop and report.
Verification: run only lane-local checks. Main thread runs final verification once.
This lane is already scoped. Execute locally in this child thread.
Do not split, delegate, launch subagents, or run orchestration.
```

When the user's task names an absolute work directory, repeat that directory in
every child prompt. Do not rely on the child thread's default cwd, projectless
output directory, or inherited context to find files. Prefer absolute Read/Write
paths when the worker may run outside the target directory.

After launching a task-mode batch, the main thread waits once, integrates, and runs final verification. In project mode, the main thread integrates each wave, verifies shared contracts and lane-local outputs, updates module states, and recomputes the next parallel frontier. Run the broad final suite once after the final wave. Do not edit a launched worker's write scope while it is running. If spawn still fails because of fork/model/reasoning constraints, treat it as a planner bug, retry once with the valid pairing, and preserve the failure as benchmark evidence.

## Hold Or Escalate

Do not launch a worker when write scopes overlap, work is small, a worker may need to touch another lane's files, it depends on unfinished investigation or a shared contract, acceptance is unclear, or scope cannot be bounded. If deeper lane planning, ready prompts, model/reasoning allocation, or held-lane output is needed, read [references/planner-details.md](references/planner-details.md).
