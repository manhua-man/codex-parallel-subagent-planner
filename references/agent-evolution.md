# Agent Evolution & Custom Agent Candidates

Use this reference when evaluating whether a recurring subagent role should evolve into a persistent custom agent spec (`.codex/agents/<name>.toml`).

## Practical Candidate Evolution Flow

Subagents created for temporary, feature-specific tasks must NEVER be promoted into persistent custom agents.

A subagent role evolves into a persistent custom agent through a practical 4-step flow:

```text
Identify recurring role pattern ➔ Audit against quality filters ➔ Obtain user explicit approval ➔ Generate .toml spec
```

---

## 1. Candidate Quality Filters

Promote a candidate ONLY when ALL 4 quality filters are satisfied:

1. **Frequency**: The exact same stewardship or verification pattern has appeared 2+ times across visible conversation history, user-provided logs, or host persistent memory. Never infer unseen past occurrences.
2. **Stability**: The role pattern has a stable directive pattern, clear boundary invariants (e.g., read-only audit, contract verification, or schema migration), and consistent acceptance rules across different tasks (rather than requiring static hardcoded file paths).
3. **Boundary**: The role operates with explicit, objective pass/fail acceptance checks.
4. **Reuse Value**: Creating a dedicated custom agent eliminates repeated manual prompt setup and yields clear recurring value.

### Rejection List (DO NOT PROMOTE)
- ❌ **Temporary Feature Workers**: Roles created for a specific feature or temporary task (e.g., `payment-refactor-agent`, `login-fix-agent`).
- ❌ **Single-Use Unblockers**: Temporary agents launched solely to unblock a single task dependency.
- ❌ **Vague Boundaries**: Generic "coder" or "researcher" roles with no stable quality invariant.
- ❌ **Unstable Specs**: Roles whose behavior, inputs, or acceptance checks change unpredictably with every task.

---

## 2. Policy Settings (`promotion_check`)

- `promotion_check: off` — do not evaluate candidate promotion.
- `promotion_check: silent` (default) — evaluate candidates internally; report high-confidence candidates in a concise section at the end of output.
- `promotion_check: ask` — list all qualified candidates and evidence after integration.

Multiple candidates may be reported together when qualified.

---

## 3. Strict User Approval Rule & Template Specification

**Hard Requirement**: NEVER create, write, or modify any custom agent `.toml` file without explicit user confirmation.

Map the recommended semantic profile (`deep`, `balanced`, `fast`) to a model supported by the active host. Set `sandbox_mode` according to host capabilities (`read-only` or `<host-supported-read-only-mode>` for audit/reviewer agents).

### Abstraction: Reusable Role Invariants vs. Dynamic Task File Paths
Temporary lanes hardcode concrete target file paths for single-task safety. In contrast, persistent custom agent `.toml` files extract **reusable role invariants, developer instructions, and sandbox modes**, leaving target file paths and context scopes to be passed dynamically in the task context at runtime.

Persistent custom agent storage locations:
- Personal custom agents: `~/.codex/agents/<agent-name>.toml`
- Project custom agents: `.codex/agents/<agent-name>.toml`

### Sample Custom Agent `.toml` Template

```toml
name = "api_contract_reviewer"
description = "Maintains API backward compatibility and checks route contract invariants."
model = "<host-supported-model-id>"
sandbox_mode = "read-only"

developer_instructions = """
Review API schema modifications, report backward-incompatible changes, and verify route contracts.
Inspect target schema files and route definitions provided dynamically in the task context.
Do not modify contract specifications or workspace source code without explicit user approval.
"""
```

---

## 4. Reporting Format

When candidate roles pass all quality filters:

```text
Long-term agent candidates:
- api_contract_reviewer — maintains API backward compatibility and route contract invariants.
- migration_compatibility_reviewer — checks database schema migrations and consumer compatibility.

Creation requires explicit user approval. Do you want me to generate these custom agent specs?
```
