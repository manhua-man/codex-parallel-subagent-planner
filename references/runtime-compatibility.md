# Runtime & Model Compatibility

Use this reference when assigning model profiles to execution lanes or mapping host capabilities.

## 1. Semantic Model Profiles

`parallel-subagent-planner` uses semantic profiles rather than concrete model IDs. This decouples the skill from specific LLM model naming changes:

- **`deep`**: Complex root cause analysis, security-sensitive work, shared contract design, high-risk integration, final review.
- **`balanced`**: Bounded feature implementation, ordinary refactoring, standard feature development, targeted verification.
- **`fast`**: Read-only scans, information extraction, evidence collection, deterministic transformations.

The host runtime maps these semantic profiles to specific model identifiers.

---

## 2. Host Capability Handling

Adapt execution lane definitions to the active host runtime's capabilities:

- **Isolated Context**: If the host supports subagents with isolated context windows, assign strict `Read`, `Write`, and `Ignore` scopes per lane.
- **Explicit Model Selection**: If the host allows specifying models per subagent, pass the recommended model profile (`deep`, `balanced`, `fast`).
- **Read-Only Subagents**: If the host supports read-only subagent sandboxing, enforce zero write permissions (`write: none`) for read-only audit lanes (such as `explorer` or read-only `reviewer`).
