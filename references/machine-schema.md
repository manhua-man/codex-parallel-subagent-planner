# Machine Plan Output Protocol

This reference defines the Machine Plan Output Protocol format (`schema_version: "1.0"`).

## Purpose

The Machine Plan Output Protocol allows `parallel-subagent-planner` to export execution plans as structured, versioned JSON data. Downstream tools, custom orchestrators, CI scripts, or human operators can consume this plan without parsing conversational Markdown text.

## Protocol Boundaries

The protocol defines the **Plan Contract**, NOT an execution runtime state database:

- **Included**: Task/Project scale decision, split gate rationale, shared contracts & contract owners, lane boundaries, read/write scopes, lane dependencies, parallel frontier waves, integration instructions, and long-term agent candidate recommendations.
- **Excluded**: Process IDs (PIDs), thread handles, token usage counters, wall-clock execution timers, or platform-specific runtime memory states. Execution status monitoring remains owned by the active host session.

## Top-Level Schema Fields

```json
{
  "schema_version": "1.0",
  "mode": "task | project",
  "decision": {
    "split": true,
    "reason": "Two independent workstreams have disjoint write scopes."
  },
  "contracts": [
    {
      "id": "shared-api-contract",
      "owner": "contract-owner-lane",
      "state": "pending | active | done",
      "description": "API schema and DTO contract boundary"
    }
  ],
  "lanes": [
    {
      "id": "lane-id",
      "role": "explorer | worker | verifier | default",
      "model_profile": "deep | balanced | fast",
      "goal": "Lane objective description",
      "depends_on": ["prerequisite-lane-id"],
      "read_scope": ["src/api/**"],
      "write_scope": ["src/api/v1/**"],
      "acceptance": ["npm test"],
      "state": "ready | running | blocked | integrated | done | held",
      "held_reason": null
    }
  ],
  "frontier": ["lane-id"],
  "integration": {
    "owner": "main-thread",
    "instructions": ["Run comprehensive cross-module tests after wave completes."]
  },
  "promotion_check": "off | silent | ask",
  "promotion_candidates": [
    {
      "role": "api_contract_reviewer",
      "reason": "Repeated API backward-compatibility reviews detected.",
      "confidence": "high",
      "requires_user_approval": true
    }
  ]
}
```

## Schema File Reference

The formal JSON Schema validation file is stored at `schema/planner-plan.schema.json`. Downstream tools may validate generated machine plans against this JSON Schema contract.
