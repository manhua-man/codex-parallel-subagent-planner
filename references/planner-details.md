# Planner Details

Use this file when deep lane planning, budget-aware frontier scoring, or diagnostic output modes are required.

## Lane Fields

When a plan, held lane, or diagnostic output needs explicit bookkeeping, track these fields:

- `id`: unique string identifier for the lane
- `agent_type`: `explorer`, `worker`, or `default`
- `model_profile`: `deep`, `balanced`, or `fast`
- `model_override`: `null` or explicit model string
- `reasoning_profile`: `auto`, `low`, `medium`, `high`
- `read_scope`: array of glob patterns / file paths to inspect
- `write_scope`: array of glob patterns / file paths allowed for edits (empty for read-only)
- `deliverable`: expected artifact or handoff summary
- `acceptance`: array of lane-local pass/fail checks
- `depends_on`: array of prerequisite lane IDs or contract IDs
- `state`: `ready`, `running`, `blocked`, `integrated`, `done`, or `held`
- `held_reason`: `safe`, `overlap`, `blocked`, `dependency`, `contract`, `unclear_acceptance`, `unclear_scope`, or `cost`
- `launch_score`: numerical priority score
- `score_reasons`: array of explainable score rationales

Launch only when `state: ready`, `held_reason: safe`, and the lane passes the budget and safety validator.

## Model And Reasoning Allocation

Model selection is managed via semantic profiles mapped by `references/runtime-compatibility.md`:

| Profile | Default Model Mapping | Usage Guidance |
| --- | --- | --- |
| `deep` | `gpt-5.6-sol` | Tightly scoped implementation, mechanical transformations, disjoint writes, concrete tests |
| `balanced` | `gpt-5.6-terra` | Cross-module architecture, shared contracts, risky integration, ambiguous root cause |
| `fast` | `gpt-5.6-luna` | Read-only discovery, evidence synthesis, independent verification, test design |

Reasoning profile guidance:
- `low`: deterministic scans, mechanical edits.
- `medium`: bounded implementation or verification.
- `high`: ambiguous cross-boundary work.

## Budgeting & Priority Scoring

The planner enforces resource limits:

```yaml
budget:
  max_concurrency: 3
  max_write_lanes: 2
  cost_profile: cheap | balanced | quality
  write_policy: single_writer | disjoint_only
```

Priority score calculation:

```text
launch_score = critical_path_weight + unblock_value + risk_reduction + wall_clock_saved - integration_cost - context_cost
```

Score explanation example:
```yaml
launch_score: 8.5
score_reasons:
  - unblocks 2 downstream implementation lanes
  - read-only scope with zero write collision risk
  - deterministic local test suite available
```

## Hold Rules

- `overlap`: write scopes collide or overlap across lanes.
- `blocked`: lane depends on unfinished explorer findings or unverified handoff.
- `dependency`: lane depends on un-integrated upstream lanes.
- `contract`: lane requires unassigned or unaccepted shared contracts.
- `unclear_acceptance`: pass/fail conditions are not concrete.
- `unclear_scope`: target files or boundaries cannot be bounded safely.
- `safe`: lane is independent, safe, and ready to launch.

## Output Modes

- **`Compact`**: Default user response (`Why parallel`, `Launch status`, `Held lanes`, `Integration note`).
- **`Explain`**: Detailed diagnostic (`Scale decision`, `Candidate lanes`, `Merged/held reasons`, `Write overlap check`, `Dependency check`, `Budget rationale`, `Launch score`).
- **`Machine`**: Strict JSON output adhering to `schema/planner-plan.schema.json`.
