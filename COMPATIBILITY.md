# Runtime Compatibility & Model Profiles

This document describes the host capability abstraction and model profile translation system introduced in **v0.2.0 Planner Contract**.

## Host Capabilities

The planner decouples core rules from host-specific tool function names by declaring `required_capabilities`:

```yaml
required_capabilities:
  explicit_model: preferred
  explicit_reasoning: preferred
  isolated_context: required
  read_only_agent: supported
```

- **`isolated_context`**: Required for child thread launches to receive a compact Context Brief rather than parent history.
- **`explicit_model`**: Preferred capability to pass child model profile.
- **`explicit_reasoning`**: Preferred capability to map thinking / effort level.
- **`read_only_agent`**: Supported capability for discovery and verification lanes.

## Semantic Model Profiles

Instead of hardcoding model names inside core planning rules, the planner uses semantic model profiles (`model_profile`):

| Model Profile | Default Model Mapping | Recommended Workloads |
|---|---|---|
| `deep` | `gpt-5.6-sol` | Flagship for complex coding, tightly scoped refactoring, mechanical transformations, concrete unit tests |
| `balanced` | `gpt-5.6-terra` | Balanced capability & cost for cross-module architecture, shared contracts, risky integration |
| `fast` | `gpt-5.6-luna` | Maximum speed & lowest cost for read-only discovery, evidence synthesis, test design, bounded analysis |

### Model Override

Child lanes may pass an explicit `model_override` string to specify a custom model name when required by specialized environments.

## Reasoning Profiles

Child lanes specify `reasoning_profile`:
- `auto`: Host runtime default.
- `low`: Mechanical edits, deterministic scans.
- `medium`: Bounded implementation or verification.
- `high`: Ambiguous cross-boundary work.

## Codex Host Adapter Matrix

| Host Environment | Thread Adapter | Model Setting | Reasoning Setting |
|---|---|---|---|
| Codex CLI | Subagent thread | CLI flag / spawn param | `reasoning_effort` |
| Codex Desktop | `create_thread` | `model` field | `thinking` field |
| Generic Host | Isolated child process | Host default | Host default |
