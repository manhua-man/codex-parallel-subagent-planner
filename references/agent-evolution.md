# Agent Evolution & Candidate Lifecycle

Use this reference when evaluating whether a completed subagent role should evolve into a persistent custom agent spec (`.codex/agents/<name>.toml`).

## Core Philosophy

Not every subagent role deserves to become a permanent custom agent. Creating custom agents for temporary tasks pollutes the agent ecosystem with low-value, one-off scripts.

Agent Evolution enforces a strict 5-stage candidate lifecycle:

```text
┌────────────────────────────────────────────────────────┐
│               Agent Candidate Lifecycle                │
│                                                        │
│   Candidate ──► Review ──► Approved ──► Persistent ──► Retire │
└────────────────────────────────────────────────────────┘
```

---

## The 5-Stage Candidate Lifecycle

1. **Candidate**: A subagent role executes successfully and exhibits potential reuse.
2. **Review**: The planner audits the role against 4 candidate quality filters.
3. **Approved**: The role passes all filters and is reported to the user (max 1 per run).
4. **Persistent Agent**: The user explicitly approves candidate creation; `.codex/agents/<name>.toml` is generated.
5. **Retire**: A persistent agent whose stewardship is obsolete or subsumed by a broader role is flagged for deletion.

---

## The 4 Candidate Quality Filters

Promote a candidate ONLY when ALL 4 quality filters pass:

1. **Frequency**: The exact same stewardship or verification pattern has appeared 2+ times across tasks or releases.
2. **Stability**: The role has stable, well-bounded `read_scope` and `write_scope` definitions.
3. **Boundary**: The role operates with explicit, objective pass/fail acceptance checks.
4. **Reuse Value**: Creating a dedicated agent eliminates repeated manual prompt setup and yields high recurring value.

---

## Strict Rejection List (DO NOT PROMOTE)

Reject candidate evolution if ANY of the following apply:
- ❌ **Temporary Feature Workers**: Roles created for a specific feature or temporary task (e.g. `payment-refactor-agent`, `login-fix-agent`).
- ❌ **Single-Use Unblockers**: Temporary agents launched solely to unblock a single task dependency.
- ❌ **Vague Boundaries**: Generic "coder" or "researcher" roles with no stable quality invariant.
- ❌ **Unstable Specs**: Roles whose behavior, inputs, or acceptance checks change with every task.

---

## Machine Schema Representation (v1.6)

In Machine Schema Mode (`schema_version: "1.6"`), represent candidate evolution using the updated `promotion_candidates` array:

```json
{
  "promotion_candidates": [
    {
      "role": "api_contract_reviewer",
      "reason": "Repeated API backward-compatibility reviews detected.",
      "confidence": "high",
      "lifecycle_stage": "approved",
      "reuse_value": "high",
      "requires_user_approval": true
    }
  ]
}
```
