# Benchmark Snapshots

Historical local runs. Treat these as evidence snapshots, not permanent product
claims. Add new snapshots only when the task, baseline, and metric collection
are comparable.

## Snapshot 1

| Group | Prompt | Spawn | Fork errors | Total tokens | Wall-clock | Result |
|---|---|---:|---:|---:|---:|---|
| A | no skill, no subagent prompt | 0 | 0 | 416,979 | 139.6s | pass |
| B | no skill, explicitly asks for subagents | 2 | 2 | 1,309,759 | 253.1s | pass |
| C | Parallel Subagents enabled | 2 | 2 | 603,194 | 159.0s | pass |

## Snapshot 2

| Group | Meaning | Spawn | Fork errors | Total tokens | Estimated cost | Wall-clock | Result |
|---|---|---:|---:|---:|---:|---:|---|
| A | no skill, no subagent | 0 | 0 | 394,547 | `$0.657297` | 238.0s | pass |
| B | no-skill manual parallel | 3 | 0 | 728,096 | `$1.025731` | 285.3s | pass |
| C | skill parallel | 3 | 0 | 1,064,149 | `$0.838304` | 287.1s | pass |

## Recording Rules

When adding a new snapshot, include:

- prompt group
- spawn count
- fork/model/reasoning errors
- total tokens
- estimated cost, when available
- wall-clock time
- pass/fail result
- short note on what changed in the skill since the previous snapshot

Do not claim a benchmark improvement unless the same or comparable task was run
against a baseline and the difference is visible in the recorded metrics.
