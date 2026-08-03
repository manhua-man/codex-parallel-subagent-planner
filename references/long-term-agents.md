# Long-Term Agent Candidates

Use this reference when evaluating whether a completed subagent role qualifies as a reusable long-term custom agent.

## Core Policy

Long-term custom agents are persistent, named agent roles defined in official Codex `.toml` template format. A persistent agent spec is justified only when it captures a recurring, bounded stewardship or quality-review responsibility with stable, objective verification.

### Strict Anti-Noise & Output Balance Rules
1. **Max 1 Candidate Per Run**: Never propose or report more than one long-term agent candidate in a single execution run.
2. **Compact Output Notification Rule**: In default `promotion_check: silent` mode, append a 1-line lightweight notification at the end of Compact output ONLY when a candidate has `confidence: high`. For low or medium confidence candidates, remain completely silent in Compact mode to prevent output noise.
3. **Explicit User Approval Required**: Never create, write, or modify a custom agent `.toml` file without explicit user confirmation.

### Promotion Check Settings (`promotion_check`)
- `promotion_check: off` — do not evaluate candidate promotion.
- `promotion_check: silent` (default) — evaluate candidates internally; report a 1-line note in Compact mode only for `high` confidence candidates.
- `promotion_check: ask` — explicitly prompt the user whenever a qualified candidate is identified after integration.

## Promotion Criteria

Promote a role ONLY when ALL of the following are true:
- The exact same stewardship or verification responsibility has appeared repeatedly across tasks or releases.
- The role has a stable, well-defined ownership boundary or quality invariant.
- The role operates with explicit read/write scopes and objective pass/fail checks.
- A dedicated custom agent would eliminate repeated manual prompt setup.

## Strict Rejection Criteria (Do NOT Promote)

Do NOT promote a subagent role when any of the following are true:
- **Temporary Project Roles**: Roles created for a specific feature or temporary task (e.g., `payment-refactor-agent`, `login-fix-agent`).
- **Feature-Specific Workers**: Workers tied to temporary file paths or narrow, one-off implementation details.
- **Single-Use Unblockers**: Temporary agents launched solely to unblock a single task dependency.
- **Vague Boundaries**: Generic "coder" or "researcher" roles with no stable quality invariant.
- **Unstable Inputs/Outputs**: Roles whose behavior or acceptance checks change with every task.

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

When reporting a high-confidence candidate in Compact (1 line) or Full mode:

```text
Compact (1-line lightweight note):
Long-term candidate: api_contract_reviewer — recurring review role. Creation requires user approval.

Full Mode:
Long-term agent candidate identified:
- api_contract_reviewer — maintains API backward compatibility and route contract invariants.

Suggested location:
- .codex/agents/api_contract_reviewer.toml

Creation requires explicit user approval. Do you want me to generate this custom agent spec?
```
