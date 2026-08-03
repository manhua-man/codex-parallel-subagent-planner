# Machine Plan Output Protocol

This reference defines the Machine Plan Output Protocol format (`schema_version: "1.6"`).

## Purpose

The Machine Plan Output Protocol allows `parallel-subagent-planner` to export execution plans as structured, versioned JSON data. Downstream tools, custom orchestrators, CI scripts, or human operators can consume this plan without parsing conversational Markdown text.

## Protocol Boundaries & Versioning Policy

### Protocol Boundaries
- **Included**: Task/Project scale decision, split gate rationale, split strategy (`vertical | horizontal | hybrid`), planning principles audit, planning state awareness, context budget, prompt specialization, shared contracts & contract owners, lane boundaries, read/write scopes, lane dependencies, lane quality audits, parallel frontier waves, integration instructions, and long-term agent candidate evolution (`lifecycle_stage`, `reuse_value`).
- **Excluded**: Process IDs (PIDs), thread handles, token usage counters, wall-clock execution timers, or platform-specific runtime memory states. Execution status monitoring remains owned by the active host session.

### Versioning Policy
- **v1.6 Update**: Added optional `lifecycle_stage` and `reuse_value` under `promotion_candidates`. Fully backward compatible with `1.0`-`1.5` parsers.
- **v1.5 Update**: Added optional `planning_principles` object (`minimal_lanes`, `single_contract_owner`, `exploration_first`, `main_thread_integration`).
- **v1.4 Update**: Added optional `prompt_spec` under `lanes` (`lane_role`, `template_id`).
- **v1.3 Update**: Added optional `context` object (`global_constraints`, `read_scope`, `write_scope`, `ignore_scope`).
- **v1.2 Update**: Added optional `planning_state` object under root schema.
- **v1.1 Update**: Added optional `split_strategy` under `decision` and `lane_quality` under `lanes`.
- **Minor Upgrades (`1.0` -> `1.6`)**: New fields are introduced as optional properties. Existing core fields (`mode`, `decision`, `contracts`, `lanes`, `frontier`) remain backward compatible so downstream parsers never break.
- **Major Upgrades (`1.0` -> `2.0`)**: Reserved exclusively for breaking changes to required top-level plan structures.

## Top-Level Schema Fields (v1.6)

```json
{
  "schema_version": "1.6",
  "mode": "task | project",
  "decision": {
    "split": true,
    "reason": "Two independent feature capabilities have disjoint write scopes.",
    "split_strategy": "vertical | horizontal | hybrid"
  },
  "planning_principles": {
    "minimal_lanes": true,
    "single_contract_owner": true,
    "exploration_first": true,
    "main_thread_integration": true
  },
  "planning_state": {
    "completed_lanes": ["auth-api-lane"],
    "blocked_lanes": ["media-processing-lane"],
    "changed_contracts": ["v2-auth-contract"],
    "frontier": ["workspace-crud-lane"]
  },
  "context": {
    "global_constraints": ["Preserve backward compatibility for v1 routes"],
    "read_scope": ["src/auth/**"],
    "write_scope": ["src/auth/service.ts"],
    "ignore_scope": ["node_modules/**", "dist/**", ".git/**", "src/billing/**"]
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
      "ignore_scope": ["node_modules/**", "dist/**", ".git/**"],
      "acceptance": ["npm test"],
      "state": "ready | running | blocked | integrated | done | held",
      "held_reason": null,
      "lane_quality": {
        "single_goal": true,
        "bounded_scope": true,
        "independent_progress": true,
        "verifiable_acceptance": true
      },
      "prompt_spec": {
        "lane_role": "explorer | implementer | reviewer | migrator | default",
        "template_id": "prompt-strategy#explorer"
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
      "lifecycle_stage": "approved",
      "reuse_value": "high",
      "requires_user_approval": true
    }
  ]
}
```

## Schema File Reference

The formal JSON Schema validation file is stored at `schema/planner-plan.schema.json`. Downstream tools may validate generated machine plans against this JSON Schema contract.
