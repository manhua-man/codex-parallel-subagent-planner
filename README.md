# parallel-subagent-planner

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a Codex Skill that decides whether subagents would materially help, splits accepted implementation work into bounded lanes, holds coupled work, schedules multi-module projects in dependency-safe waves, outputs a versioned Machine Schema plan, and identifies reusable long-term agent candidates.

## Three-Layer Product Architecture

1. **Parallel Planning Core**: Distinguishes Task vs. Project mode, evaluates the Split Gate, enforces disjoint scopes (`write ∩ write = ∅`, `write ∩ read = ∅`), assigns shared contract owners, and schedules multi-module projects in safe waves.
2. **Machine Schema Contract**: Machine mode outputs structured JSON adhering to `schema/planner-plan.schema.json` (`schema_version: "1.0"`) so downstream tools and schedulers can consume plans through a stable data contract.
3. **Long-Term Agent Candidates**: Evaluates recurring subagent roles after integration (`promotion_check: silent` default) and generates persistent `.codex/agents/<name>.toml` custom agent specs upon explicit user approval.

## Operating Modes

| Mode | Use Case | Behavior |
| --- | --- | --- |
| Task Mode | Single bounded change or one module | Fast split gate; avoids broad repository scanning |
| Project Mode | Complete product, multi-module app, or shared contracts | Maps full product surface, assigns contract owners, computes parallel frontier, schedules waves |

## Output Modes

- **Compact** (Default): Human-readable summary (`Why split`, `Launch now`, `Held lanes`, `Integration note`).
- **Full**: Comprehensive text plan with lane tables, contract owners, and ready child prompts.
- **Machine**: Pure structured JSON output following `schema/planner-plan.schema.json`.

## Quick Example

### Default `Compact` Output

```text
Why parallel
The task has one read-only behavior check and one implementation lane, but the implementation depends on the check result.

Launch status
- Launched: Export behavior audit (agent_type explorer, model_profile fast, read_scope src/runtime/session-view-service.ts + src/extension.ts, write_scope none)
- Held: Export flow worker (agent_type worker, model_profile deep, write_scope src/runtime/session-view-service.ts + src/extension.ts, held_reason dependency)

Integration note
Start with the audit, then launch or handle the worker only after current behavior and acceptance checks are concrete.
```

## Installation

### Personal Skill Installation

Clone or copy this repository into your personal Codex skills directory:

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### Target Project Workspace Installation

Copy the repository contents into a target workspace:

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

## File Structure

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ references/
│  ├─ project-scale-planning.md
│  ├─ planner-details.md
│  ├─ prompt-templates.md
│  ├─ long-term-agents.md
│  └─ runtime-compatibility.md
├─ schema/
│  └─ planner-plan.schema.json
├─ README.md
├─ README.zh-CN.md
├─ CHANGELOG.md
└─ LICENSE
```

## Scope & Limitations

This skill focuses strictly on execution-lane planning, machine plan serialization, and long-term agent role identification for Codex. It does not define product requirements, approve software architecture, manage OpenSpec artifacts, or route tasks to external coding backends.

## License

[MIT License](LICENSE) © 2026 manhua-man
