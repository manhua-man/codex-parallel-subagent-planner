# parallel-subagent-planner (v3.0.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a lightweight **Agent Planning Harness Skill** for Codex. It helps Codex decide when to split work into subagents, set safe file scope boundaries, establish execution order, generate clean subagent prompts, and recommend reusable custom agent roles.

---

## What It Does

- **Split Decision**: Evaluates whether splitting into subagents saves wall-clock time vs. direct execution.
- **File Boundary Isolation**: Enforces disjoint write scopes (`write(A) ∩ write(B) = ∅`) so parallel subagents never overwrite each other's work.
- **Execution Order**: Ensures shared contract/DTO files are modified and frozen before dependent consumer subagents launch.
- **Clean Subagent Prompts**: Generates clear prompts specifying goals, read/write file scopes, and acceptance tests.
- **Main Thread Integration**: Merges subagent outputs and runs workspace-wide integration checks.
- **Custom Agent Guidance**: Suggests saving recurring subagent roles into `.codex/agents/<name>.toml` specs with user approval.

---

## Core Cycle

```text
Task ➔ Plan ➔ Launch ➔ Observe ➔ Replan ➔ Integrate ➔ Evolve
```

---

## File Structure

```text
parallel-subagent-planner/
├─ SKILL.md                          # Core skill instructions (~50 lines)
├─ agents/
│  └─ openai.yaml                    # Codex metadata configuration
├─ references/
│  ├─ lane-decomposition.md          # Slicing heuristics, scope isolation & execution order
│  └─ child-prompts.md               # Subagent prompt templates & custom agent guidance
├─ README.md                         # English documentation
├─ README.zh-CN.md                   # Chinese documentation
├─ CHANGELOG.md                      # Release notes
└─ LICENSE                           # MIT License
```

---

## Installation

### Personal Skill Installation

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### Project Workspace Installation

Copy the repository contents into a target workspace:

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

---

## License

[MIT License](LICENSE) © 2026 manhua-man
