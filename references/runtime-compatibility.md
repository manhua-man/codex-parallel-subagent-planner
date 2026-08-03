# Runtime Compatibility

This reference defines how generic planner requirements map to concrete host environments and model runtimes.

## Model Profiles Mapping

The planner allocates models using semantic profiles (`model_profile`). This file is the single source of truth for mapping profiles to concrete model identifiers:

| Model Profile | Default Model Identifier | Workload & Task Guidance |
| --- | --- | --- |
| `deep` | `gpt-5.6-sol` | Flagship model for ambiguous root cause analysis, security audits, complex shared contract design, high-risk cross-module integration, and final review |
| `balanced` | `gpt-5.6-terra` | General-purpose model for routine module implementation, bounded refactoring, standard feature development, and targeted integration |
| `fast` | `gpt-5.6-luna` | Fast/cheap model for read-only scans, information extraction, evidence collection, and deterministic transformations |

## Reasoning Profiles

Reasoning effort is specified via `reasoning_profile`:
- `auto`: Host default reasoning level.
- `low`: Deterministic scans, mechanical edits.
- `medium`: Bounded feature development or verification.
- `high`: Ambiguous root cause, security review, or complex shared contract design.

## Host Capabilities

The planner expresses agent execution requirements through generic host capabilities:

- **`isolated_context`** (Required): Ability to spawn a child thread with a clean Context Brief (`fork_context=false`).
- **`explicit_model`** (Preferred): Ability to specify a model identifier per child lane.
- **`explicit_reasoning`** (Preferred): Ability to set explicit reasoning/thinking effort per child lane.
- **`read_only_agent`** (Supported): Ability to enforce read-only tool access for discovery and audit lanes.

If a host environment cannot pass explicit model or reasoning parameters on a child spawn tool, fall back to the host default or execute the lane directly in the main thread.
