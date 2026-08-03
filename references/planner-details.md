# Planner Details

Use this file when deep lane planning, budget-aware frontier scoring, or diagnostic output modes are required.

## Lane Fields

When a plan, held lane, or diagnostic output needs explicit bookkeeping, track these fields:

- `id`: unique string identifier for the lane
- `agent_type`: `explorer`, `worker`, `verification`, `cleanup`, or `default`
- `model_profile`: `deep`, `balanced`, or `fast`
- `model_override`: `null` or explicit model string
- `reasoning_profile`: `auto`, `low`, `medium`, `high`
- `read_scope`: array of glob patterns / file paths to inspect (`dir/**` or `path/to/file`)
- `write_scope`: array of glob patterns / file paths allowed for edits (empty for read-only)
- `deliverable`: expected artifact or handoff summary
- `acceptance`: array of lane-local pass/fail checks
- `depends_on`: array of prerequisite lane IDs or contract IDs
- `state`: `ready`, `running`, `blocked`, `integrated`, `done`, or `held`
- `held_reason`: `safe`, `overlap`, `blocked`, `dependency`, `contract`, `unclear_scope`, `unclear_acceptance`, `verification_failed`, or `cost`
- `launch_score`: numerical priority score
- `score_reasons`: array of explainable score rationales

Launch only when `state: ready`, `held_reason: safe`, and the lane passes the budget and safety validator.

## Model Profile Task Mapping

Model selection is managed via semantic profiles mapped by `references/runtime-compatibility.md`:

| Profile | Default Model Mapping | Workload & Task Shape Guidance |
| --- | --- | --- |
| `deep` | `gpt-5.6-sol` | Flagship for ambiguous root cause, security audits, complex shared contracts, high-risk cross-module integration, multi-step planning, and final review |
| `balanced` | `gpt-5.6-terra` | General-purpose implementation, routine refactoring, standard feature development, and integrated verification |
| `fast` | `gpt-5.6-luna` | Read-only scans, information extraction, deterministic transformations, and narrow low-risk tasks |

Reasoning profile guidance:
- `low`: deterministic scans, mechanical edits.
- `medium`: bounded implementation or verification.
- `high`: ambiguous cross-boundary work or complex shared contract design.

## Scope Syntax & Collision Rules

Scope paths must follow strict syntax:
- Exact file paths: `src/api/index.ts`
- Subtree globs: `src/api/**`
- Prohibited: relative parents (`..`), absolute paths, double slashes (`//`), arbitrary wildcards (`*`) outside `/**`.

Frontier safety collision rules:
- `write_scope(A) ∩ write_scope(B) == ∅` (No write-write overlap)
- `write_scope(A) ∩ read_scope(B) == ∅` (No write-read race condition, unless reading frozen contract)

## Output Modes

- **`Compact`**: Default user response (`Why parallel`, `Launch status`, `Held lanes`, `Integration note`).
- **`Explain`**: Detailed diagnostic (`Scale decision`, `Candidate lanes`, `Merged/held reasons`, `Write overlap check`, `Dependency check`, `Budget rationale`, `Launch score`).
- **`Machine`**: Strict JSON output adhering to `schema/planner-plan.schema.json`.
