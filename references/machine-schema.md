# Machine Plan Output Protocol

This reference defines the Machine Plan Output Protocol format (`schema_version: "1.2"`).

## Purpose

The Machine Plan Output Protocol allows `parallel-subagent-planner` to export execution plans as structured, versioned JSON data. Downstream tools, custom orchestrators, CI scripts, or human operators can consume this plan without parsing conversational Markdown text.

## Protocol Boundaries & Versioning Policy

### Protocol Boundaries
- **Included**: Task/Project scale decision, split gate rationale, split strategy (`vertical | horizontal | hybrid`), planning state awareness (`completed_lanes`, `blocked_lanes`, `changed_contracts`, `frontier`), shared contracts & contract owners, lane boundaries, read/write scopes, lane dependencies, lane quality audits, parallel frontier waves, integration instructions, and long-term agent candidate recommendations.
- **Excluded**: Process IDs (PIDs), thread handles, token usage counters, wall-clock execution timers, or platform-specific runtime memory states. Execution status monitoring remains owned by the active host session.

### Versioning Policy
- **v1.2 Update**: Added optional `planning_state` object under root schema. Fully backward compatible with `1.0` and `1.1` parsers.
- **v1.1 Update**: Added optional `split_strategy` under `decision` and `lane_quality` under `lanes`.
- **Minor Upgrades (`1.0` -> `1.2`)**: New fields are introduced as optional properties. Existing core fields (`mode`, `decision`, `contracts`, `lanes`, `frontier`) remain backward compatible so downstream parsers never break.
- **Major Upgrades (`1.0` -> `2.0`)**: Reserved exclusively for breaking changes to required top-level plan structures.

## Top-Level Schema Fields (v1.2)

```json
{
  "schema_version": "1.2",
  "mode": "task | project",
  "decision": {
    "split": true,
    "reason": "Two independent feature capabilities have disjoint write scopes.",
    "split_strategy": "vertical | horizontal | hybrid"
  },
  "planning_state": {
    "completed_lanes": ["auth-api-lane"],
    "blocked_lanes": ["media-processing-lane"],
    "changed_contracts": ["v2-auth-contract"],
    "frontier": ["workspace-crud-lane"]
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
      "held_reason": null,
      "lane_quality": {
        "single_goal": true,
        "bounded_scope": true,
        "independent_progress": true,
        "verifiable_acceptance": true
      }
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
