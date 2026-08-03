# Runtime Compatibility Matrix

This document defines how the Parallel Subagent Planner maps generic execution requirements to host capabilities and model runtimes.

## Host Required Capabilities

Core planning logic expresses agent launch requirements as generic host capabilities rather than binding to specific host API functions.

| Capability | Requirement Level | Description |
|---|---|---|
| `explicit_model` | Preferred | Ability to pass an explicit model selection per child thread. |
| `explicit_reasoning` | Preferred | Ability to pass an explicit reasoning effort or thinking setting per child thread. |
| `isolated_context` | Required | Ability to spawn a child thread with an isolated context brief (`fork_context=false`). |
| `read_only_agent` | Supported | Ability to restrict explorer or verification agents to read-only tools. |

If a host lacks `explicit_model` or `explicit_reasoning` on a specific spawn tool, inspect all host launch adapters (such as project thread creation) before marking model selection unavailable. If no authorized host adapter supports explicit model and reasoning allocation, hold the lane or execute it in the main thread.

## Model Profiles Mapping

The planner allocates models using semantic profiles (`model_profile`). The compatibility layer maps these profiles to concrete host model identifiers.

| Profile | Capability Profile | Default Model Mapping | Usage Guidance |
|---|---|---|---|
| `deep` | High reasoning & complex coding | `gpt-5.6-sol` | Tightly scoped implementation, complex logic, mechanical transformations, concrete tests |
| `balanced` | Balanced capability & cost | `gpt-5.6-terra` | Cross-module architecture, shared contracts, risky integration, ambiguous root cause |
| `fast` | Maximum speed & lowest cost | `gpt-5.6-luna` | Read-only discovery, evidence synthesis, independent verification, test design |

### Model Override

Child lanes may specify `model_override: null` by default. When `model_override` is set to a non-null model name, the runtime compatibility layer uses that specific model identifier directly.

## Reasoning Profiles

Reasoning effort is specified via `reasoning_profile`:

- `auto`: Host default reasoning level.
- `low`: Deterministic scans, simple edits.
- `medium`: Bounded implementation or verification.
- `high`: Ambiguous root cause, cross-boundary work.

Host-specific reasoning parameters (such as `thinking` or `reasoning_effort`) are mapped by the runtime adapter to match host-supported ranges.

## Host Adapters Matrix

| Host Environment | Isolation Adapter | Model/Reasoning Adapter | Context Brief |
|---|---|---|---|
| Codex CLI | Isolated subagent thread | Command flags / spawn options | Compact Context Brief |
| Codex Desktop | Project thread / `create_thread` | `model` + `thinking` fields | Compact Context Brief |
| Generic Spawn | Parent session child | Fallback to main thread if routing unexposed | Compact Context Brief |

## Model Family Substitution

When model families are updated in future runtime releases, update this mapping table (`references/runtime-compatibility.md`) rather than modifying `SKILL.md`, fixtures, or prompt templates.
