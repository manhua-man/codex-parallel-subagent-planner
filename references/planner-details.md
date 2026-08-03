# Planner Details

Use this reference when defining lane fields, checking scope boundaries, or evaluating hold conditions.

## Lane Fields

- `id`: unique string identifier for the lane.
- `agent_type`: `explorer` (read-only audit/discovery), `worker` (implementation), or `default`.
- `model_profile`: `deep`, `balanced`, or `fast`.
- `reasoning_profile`: `auto`, `low`, `medium`, or `high`.
- `read_scope`: array of canonical exact file paths (`src/api/index.ts`) or subtree globs (`src/api/**`).
- `write_scope`: array of canonical exact file paths or subtree globs allowed for edits (empty `[]` for read-only).
- `deliverable`: expected code change, audit report, or handoff summary.
- `acceptance`: array of lane-local pass/fail checks.
- `depends_on`: array of prerequisite lane IDs or contract IDs.
- `state`: `ready`, `running`, `blocked`, `integrated`, `done`, or `held`.
- `held_reason`: `safe`, `overlap`, `blocked`, `dependency`, `contract`, `unclear_scope`, `unclear_acceptance`, `verification_failed`.

## Scope Collision & Race Condition Rules

Scope paths must use canonical relative paths without `.`, `..`, double slashes `//`, or arbitrary wildcards outside `/**`.

Frontier safety collision rules:
- **Write-Write Isolation**: `write(A) ∩ write(B) = ∅`. Two lanes in the same wave must never modify overlapping files or subtrees.
- **Write-Read Isolation**: `write(A) ∩ read(B) = ∅`. A lane in the same wave must never read files currently being edited by another lane (unless reading a frozen, versioned contract).

## Hold Conditions

Hold a candidate lane when any condition is met:
1. Scope overlaps with another ready worker.
2. Read scope conflicts with another ready worker's write scope.
3. Depends on an unfinished investigation, explorer lane, or contract wave.
4. Scope boundary or acceptance criteria are vague or unverified.
5. Integration or context cost exceeds wall-clock savings.

## Main Thread Integration

Child lanes execute in isolated contexts and perform only lane-local verification. The main thread is responsible for:
- Merging child lane outputs into the target repository.
- Running comprehensive workspace verification and cross-module integration tests.
- Recomputing the parallel frontier for project waves.
