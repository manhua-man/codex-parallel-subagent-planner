# parallel-subagent-planner

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a Codex skill that helps decide whether a task has a useful parallel split, then sends minimal non-recursive prompts for lanes that are bounded enough to launch.

It focuses on:

- deciding whether a task should be split at all
- keeping the default decision path small
- choosing lane ownership and avoiding overlapping write scopes
- suggesting `agent type`, model, and reasoning effort for each lane
- considering Codex subagents when a strong split signal appears, then launching only bounded lanes
- generating ready-to-send prompts for lanes that should be held back

This repository contains the maintained version of the skill and its companion prompt assets.

Execution still depends on Codex's host session, tools, and subagent launcher. This repository provides planning instructions and prompt assets; it does not provide a local runner, Python package, CLI, or session manager.

Current scope:

- built for Codex and Codex subagent workflows
- model and `agent type` guidance is based on Codex-supported subagents
- Claude or other agent runtimes are not claimed as supported here unless documented explicitly later

## Quick Example

Input:

```text
Split this task if it helps:
- verify current export behavior first
- then unify export flow behavior
- keep behavior unchanged
- files: src/runtime/session-view-service.ts, src/extension.ts
```

Default Compact output:

```text
Why parallel
The task has one read-only behavior check and one implementation lane, but the implementation depends on the check result.

Lane summary
- Export behavior audit: agent type explorer, model gpt-5.4, reasoning high, read_scope src/runtime/session-view-service.ts + src/extension.ts, write_scope none, deliverable behavior map, can_launch yes, held_reason safe
- Export flow worker: agent type worker, model gpt-5.5, reasoning high, read_scope same files plus audit handoff, write_scope src/runtime/session-view-service.ts + src/extension.ts, deliverable behavior-preserving refactor, can_launch no, held_reason blocked

Launch status
- Launched: Export behavior audit
- Held: Export flow worker, because it depends on explorer findings

Integration note
Start with the audit, then launch or handle the worker only after the current behavior and acceptance checks are concrete.
```

Ready prompts are omitted in Compact output unless a lane is held. Use `Full` when you want every ready-to-send prompt displayed.

Each lane carries explicit `read_scope`, `write_scope`, `can_launch`, and `held_reason` fields so Codex can launch only worthwhile safe lanes and hold risky, dependent, or too-small lanes.

## Benchmark Snapshots

Historical local runs:

Snapshot 1:

| Group | Prompt | Spawn | Fork errors | Total tokens | Wall-clock | Result |
|---|---|---:|---:|---:|---:|---|
| A | no skill, no subagent prompt | 0 | 0 | 416,979 | 139.6s | pass |
| B | no skill, explicitly asks for subagents | 2 | 2 | 1,309,759 | 253.1s | pass |
| C | Parallel Subagents enabled | 2 | 2 | 603,194 | 159.0s | pass |

Snapshot 2:

| Group | Meaning | Spawn | Fork errors | Total tokens | Estimated cost | Wall-clock | Result |
|---|---|---:|---:|---:|---:|---:|---|
| A | no skill, no subagent | 0 | 0 | 394,547 | `$0.657297` | 238.0s | pass |
| B | no-skill manual parallel | 3 | 0 | 728,096 | `$1.025731` | 285.3s | pass |
| C | skill parallel | 3 | 0 | 1,064,149 | `$0.838304` | 287.1s | pass |

## Repository Layout

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ docs/
│  ├─ request-flow.md
│  └─ request-flow.zh-CN.md
├─ examples/
│  └─ fixtures.md
├─ references/
│  ├─ long-term-agents.md
│  ├─ maintenance.md
│  ├─ planner-details.md
│  └─ prompt-templates.md
└─ opsx-parallel.md
```

File roles:

- `SKILL.md`: core planning logic, lane heuristics, model/reasoning guidance
- `agents/openai.yaml`: agent metadata and default prompt entry
- `docs/request-flow.md`: where the skill fits in a Codex request and what happens after lanes return
- `docs/request-flow.zh-CN.md`: Chinese request-flow explanation
- `examples/fixtures.md`: expected behavior examples for launch, hold, and promotion decisions
- `references/long-term-agents.md`: detailed criteria for reusable agent promotion
- `references/maintenance.md`: source-of-truth, drift check, and benchmark update guidance
- `references/prompt-templates.md`: reusable lane prompt templates
- `references/planner-details.md`: detailed lane planning rules loaded only when the split is unclear
- `opsx-parallel.md`: companion command entry for lightweight planning and prompt generation

## Design Principles

- Minimum viable lanes, not arbitrary lane counts
- Cost-aware launches: consider subagents on one strong split signal, but merge tiny same-gate writebacks instead of spawning one worker per file
- Child prompts are non-recursive: spawned lanes execute locally and do not split or launch more subagents
- Task-first planning before repository-heavy analysis
- Real execution constraints matter: only use actual supported agent types
- Considering subagents is not the same as launching them; launch only lanes with a clear goal, bounded scopes, useful deliverable, and acceptance checks
- Multiple write-enabled workers are allowed when prompts are compact, write scopes are disjoint, and expected benefit should justify child context cost
- Agent type, model, and reasoning can be assigned per lane; default to non-inheriting child context, and inherit full history only when a compact lane brief is not enough
- Treat one broad final test suite as main-thread integration work; workers should run lane-local checks instead of duplicating broad verification
- Hold lanes when write scopes overlap, acceptance is unclear, or a worker depends on unfinished explorer findings
- Prefer concrete files, tests, docs, and ledgers when the user provides them
- Keep integration and final reconciliation in the main thread, and do not edit a launched worker's write scope while it is running
- Separate Codex subagents still receive runtime base context; this skill reduces copied history, recursive planning, and lane prompt size rather than claiming shared prompt context

## Maintenance Workflow

1. Update the skill sources and companion prompt assets.
2. Update fixtures or references when behavior changes.
3. Sync the installed local skill from this repository.
4. Review the diff and run `git diff --check`.
5. Commit and push the repository changes.
