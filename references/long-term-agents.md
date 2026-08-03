# Long-Term Agent Candidates

Use this reference when evaluating whether a completed subagent role qualifies as a reusable long-term custom agent.

## Core Policy

Long-term custom agents are persistent, named agent roles defined in official Codex `.toml` template format. A persistent agent spec is justified only when it captures a recurring, bounded stewardship or quality-review responsibility with stable, objective verification.

### Key Rules
1. **Max 1 Candidate Per Task**: Never propose more than one long-term agent candidate in a single task execution.
2. **Explicit User Approval Required**: Never create, write, or modify a custom agent `.toml` file without explicit user confirmation.

### Promotion Check Settings
- `promotion_check: off` — do not evaluate candidate promotion.
- `promotion_check: silent` (default) — evaluate candidates internally; report candidates only in `Full` mode or when a high-confidence candidate exists.
- `promotion_check: ask` — explicitly prompt the user whenever a qualified candidate is identified after integration.

## Promotion Criteria

Promote a role ONLY when ALL of the following are true:
- The exact same responsibility has appeared repeatedly across tasks or releases.
- The role has a stable, well-defined ownership boundary or quality invariant.
- The role operates with explicit read/write scopes and objective pass/fail checks.
- A dedicated agent would eliminate repeated manual prompt setup.

## Rejection Criteria

Do NOT promote when any of the following are true:
- The subagent was a temporary, one-off task worker.
- The role is a generic "coder" or "researcher" with no stable boundary.
- The role relies on transient parent conversation history.

## Custom Agent Storage Paths & Format

Persistent custom agents use official Codex `.toml` file format:
- Personal custom agents: `~/.codex/agents/<agent-name>.toml`
- Project custom agents: `.codex/agents/<agent-name>.toml`

### Sample Custom Agent `.toml` Template

```toml
name = "api_contract_reviewer"
description = "Maintains API backward compatibility and checks route contract invariants."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"

developer_instructions = """
Review API schema modifications, report backward-incompatible changes, and verify route contracts.
Do not modify contract specifications without explicit user approval.
"""
```

## Reporting Format

When reporting a candidate in `Full` or `ask` mode (only when a high-confidence candidate exists):

```text
Long-term agent candidate identified:
- api_contract_reviewer — maintains API backward compatibility and route contract invariants.

Suggested location:
- .codex/agents/api_contract_reviewer.toml

Creation requires explicit user approval. Do you want me to generate this custom agent spec?
```
