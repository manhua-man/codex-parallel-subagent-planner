# Long-Term Agent Candidates

Use this reference after a parallel run when evaluating whether a completed subagent role should become a long-term agent.

## Core Policy

Long-term agents are rare. A persistent agent spec is justified only when it captures a recurring quality gate or stewardship responsibility with stable, objective verification.

### Promotion Check Setting
- `promotion_check: off` — disable candidate evaluation
- `promotion_check: silent` (default) — evaluate candidates internally; list candidates only in `Full` / `Explain` mode or when requested
- `promotion_check: ask` — prompt the user proactively whenever a high-confidence candidate exists

Never create or write persistent custom agent files without explicit user approval.

## Promotion Criteria

Promote when all are true:
- The same class of work recurs across multiple tasks or releases.
- The role has a stable ownership boundary or invariant.
- The role works from explicit read/write scopes and objective checks.
- The output format is repeatable.
- The role can launch with fresh isolated context (`isolated_context: required`).

## Rejection Criteria

Do not promote when any are true:
- The worker was a temporary task worker.
- The role is a generic "coder" or "researcher" with no stable boundary.
- The task was a small one-off edit.
- The role relies on transient parent conversation history.

## Storage Paths & Format

Persistent custom agents use official Codex `.toml` file format:

- Personal custom agents: `~/.codex/agents/<agent>.toml`
- Project custom agents: `.codex/agents/<agent>.toml`

### Minimal Custom Agent `.toml` Template

```toml
name = "benchmark_fixture_steward"
description = "Maintains planner fixtures and detects behavioral drift."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"

developer_instructions = """
Validate planner fixtures, report drift, and update only assigned eval assets.
Do not modify planner policy without explicit approval.
"""
```

## Decision Output Format

When reporting a candidate (in `Full`, `Explain`, or `ask` mode):

```text
Long-term agent candidate found:
- benchmark_fixture_steward — maintains planner fixtures and detects behavioral drift.

Suggested location:
- .codex/agents/benchmark_fixture_steward.toml

Do you want me to create this agent spec?
```
