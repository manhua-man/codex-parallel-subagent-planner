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
| `deep` | `gpt-5.6-sol` | Flagship model for ambiguous root cause, security audits, complex shared contracts, high-risk cross-module integration, complex planning & final review |
| `balanced` | `gpt-5.6-terra` | General-purpose model for routine module implementation, bounded refactoring, standard feature development, integrated verification |
| `fast` | `gpt-5.6-luna` | Fast/cheap model for read-only scans, information extraction, deterministic transformations, narrow low-risk tasks |

### Model Override

Child lanes may pass an explicit `model_override` string to specify a custom model name when required by specialized environments.

## Custom Agent Specification Paths

Persistent custom agents use official Codex `.toml` template files:
- Personal custom agents: `~/.codex/agents/<agent>.toml`
- Project custom agents: `.codex/agents/<agent>.toml`

## Codex Host Adapter Matrix

| Host Environment | Thread Adapter | Model Setting | Reasoning Setting |
|---|---|---|---|
| Codex CLI | Subagent thread | CLI flag / spawn param | `reasoning_effort` |
| Codex Desktop | `create_thread` | `model` field | `thinking` field |
| Generic Host | Isolated child process | Host default | Host default |
