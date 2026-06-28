---
name: parallel-subagent-planner
description: Lightweight default parallelism gate for Codex coding, debugging, refactoring, testing, verification, docs writeback, and cleanup tasks. Use to decide cheaply whether to launch safe Codex subagents, then send minimal non-recursive worker prompts. Load detailed planning references only when lane boundaries, write scopes, model choices, or acceptance checks are unclear.
---

# Parallel Subagent Planner

Default behavior: cost-aware split check. Consider subagents when there is one strong split signal; launch only lanes that are bounded enough to execute safely. Do not load detailed references unless the split is unclear.

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
explicitly approves that specific promotion.

## Fast Gate

Consider subagents when any one is true:

- independent workstreams can reduce wall-clock
- a read-only explorer or verification lane can unblock or de-risk implementation
- the user provided separable files, tests, docs, ledgers, or named workstreams
- the task is broad or risky enough that parallel investigation, review, or cleanup is useful

No strong signal means `Not split` and main-thread work. Considering subagents does not require launching them: launch only lanes with a clear goal, bounded read/write scope, a useful deliverable, and an acceptance check. Hold or merge lanes that are tiny, coupled, unclear, or likely to duplicate broad verification.

## Launch Protocol

When launching, use the minimum viable lane count. Multiple write-enabled workers are allowed when the workstreams are genuinely independent and the expected benefit should justify child context cost. More than 3 lanes is allowed when the lanes have clearly independent write scopes, lane-local checks, and a concrete expected time or cost benefit.

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

After launching workers, the main thread waits once, then integrates and runs final verification. Do not edit a launched worker's write scope while it is running. If spawn still fails because of fork/model/reasoning constraints, treat it as a planner bug, retry once with the valid pairing, and preserve the failure as benchmark evidence.

## Hold Or Escalate

Do not launch a worker when write scopes overlap, work is small, a worker may need to touch another lane's files, it depends on unfinished investigation, acceptance is unclear, or scope cannot be bounded. If deeper lane planning, ready prompts, model/reasoning allocation, or held-lane output is needed, read [references/planner-details.md](references/planner-details.md).
