---
name: parallel-subagent-planner
description: Cost-aware Codex execution-parallelism planner for both bounded tasks and multi-module software work. Use to decide whether to launch safe subagents, discover execution modules and dependencies when an approved goal spans a complete app or several capabilities, schedule independent work in waves, validate structured plan safety against schemas, and send minimal child prompts. Do not use it as a substitute for product requirements, architecture or plan review, OpenSpec artifact management, or external coding-agent backend routing.
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
- The user requests an external backend: let the backend-routing skill own that choice. This skill may define lane boundaries only when explicitly combined.

Do not run two execution orchestrators over the same write scopes at the same time. When another workflow already owns dispatch, provide a lane/dependency recommendation or wait for its handoff.

## Long-Term Agent Candidate Policy

The planner evaluates whether completed worker or verifier roles qualify as long-term agent candidates.

Promotion check modes:
- `off`: do not evaluate long-term candidates
- `silent` (default): evaluate internally; report candidates only when requested or in `Full`/`Explain` mode
- `ask`: prompt the user when a high-confidence candidate exists

Recommended promotion applies only to recurring, bounded steward/verifier roles with objective checks. Do not promote temporary task workers or broad coordinators.

When approved by the user, persistent agent definitions use Codex `.toml` format (`.codex/agents/<agent>.toml` or `$HOME/.agents/<agent>.toml`). Never create or write agent `.toml` files without explicit user approval. Details live in [references/long-term-agents.md](references/long-term-agents.md).

## Fast Gate

Consider subagents when any one is true:

- independent workstreams can reduce wall-clock
- a read-only explorer or verification lane can unblock or de-risk implementation
- the user provided separable files, tests, docs, ledgers, or named workstreams
- the task is broad or risky enough that parallel investigation, review, or cleanup is useful

No strong signal in task mode means `Not split` and main-thread work. In project mode, evaluate independent modules from the current parallel frontier rather than only the module currently being discussed. Considering subagents does not require launching them: launch only lanes with a clear goal, bounded read/write scope, a useful deliverable, and an acceptance check. Hold or merge lanes that are tiny, coupled, unclear, or likely to duplicate broad verification.

## Launch & Capability Protocol

When launching, use the minimum viable lane count. Multiple write-enabled workers are allowed when workstreams are genuinely independent and the expected benefit justifies context cost. In project mode, launch only the current frontier; keep later waves held until dependencies and contracts pass.

The planner expresses requirements through generic host capabilities:

```yaml
required_capabilities:
  explicit_model: preferred
  explicit_reasoning: preferred
  isolated_context: required
  read_only_agent: supported
```

Map these capabilities using [references/runtime-compatibility.md](references/runtime-compatibility.md). Every launched child uses isolated context (`isolated_context: required`), a compact Context Brief, and explicit semantic model and reasoning profiles.

Child lane profiles:
- `model_profile`: `deep` | `balanced` | `fast` (with optional `model_override`)
- `reasoning_profile`: `auto` | `low` | `medium` | `high`

Default profile mapping baseline:
- `fast`: read-only discovery, evidence synthesis, independent verification, test design, bounded analysis (`gpt-5.6-luna`).
- `balanced`: cross-module architecture, shared contracts, risky integration, security investigation, ambiguous root cause (`gpt-5.6-terra`).
- `deep`: tightly scoped implementation or mechanical transformation with disjoint writes and concrete lane-local tests (`gpt-5.6-sol`).

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

When the user's task names an absolute work directory, repeat that directory in every child prompt.

After launching a task-mode batch, the main thread waits once, integrates, and runs final verification. In project mode, the main thread integrates each wave, verifies shared contracts and lane-local outputs, updates module states, and recomputes the next parallel frontier.

## Budgeting & Priority Scoring

The planner enforces cost and concurrency budgets:

```yaml
budget:
  max_concurrency: 3
  max_write_lanes: 2
  cost_profile: cheap | balanced | quality
  write_policy: single_writer | disjoint_only
```

When eligible candidate lanes exceed `max_concurrency`, rank lanes by `launch_score`:

```text
launch_score = critical_path_weight + unblock_value + risk_reduction + wall_clock_saved - integration_cost - context_cost
```

Record human-explainable `score_reasons` for each launch decision.

## Output Modes

1. **`Compact`** (Default): User-facing summary (`Why parallel`, `Launch status`, `Held lanes`, `Integration note`).
2. **`Explain`**: Diagnostic output (`Scale decision`, `Candidate lanes`, `Merged/held reasons`, `Write overlap check`, `Dependency check`, `Budget rationale`, `Launch score`).
3. **`Machine`**: Machine-readable JSON adhering to `schema/planner-plan.schema.json`.

## Hold Or Escalate

Do not launch a worker when write scopes overlap, work is small, a worker may need to touch another lane's files, it depends on unfinished investigation or a shared contract, acceptance is unclear, or scope cannot be bounded. Read [references/planner-details.md](references/planner-details.md) for detailed lane mechanics.
