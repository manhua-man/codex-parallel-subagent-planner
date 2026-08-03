# parallel-subagent-planner

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a Codex Skill that decides whether subagents would materially help, splits accepted implementation work into bounded lanes, holds coupled work, and schedules multi-module projects in dependency-safe waves.

## What It Does

- **Task vs Project Mode**: Distinguishes between bounded single-module tasks and multi-module project requests.
- **Split Gate**: Evaluates whether parallel subagent execution is worthwhile before spawning child lanes.
- **Safety Invariants**: Enforces strict write-write (`write(A) ∩ write(B) = ∅`) and write-read (`write(A) ∩ read(B) = ∅`) isolation.
- **Shared Contract Owners**: Ensures shared APIs, schemas, and routes have a single owner lane per wave.
- **Wave Scheduling**: Computes parallel frontiers for multi-module projects and schedules execution in safe waves.
- **Bounded Child Prompts**: Generates non-recursive, scope-bounded child prompts with explicit boundaries.

## Operating Modes

| Mode | Use Case | Behavior |
| --- | --- | --- |
| Task Mode | Single bounded change or one module | Fast split gate; avoids broad repository scanning |
| Project Mode | Complete product, multi-module app, or shared contracts | Maps full product surface, assigns contract owners, computes parallel frontier, schedules waves |

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
│  └─ runtime-compatibility.md
├─ README.md
├─ README.zh-CN.md
├─ CHANGELOG.md
└─ LICENSE
```

## Scope & Limitations

This skill focuses strictly on execution-lane planning and wave scheduling for Codex. It does not define product requirements, approve software architecture, manage OpenSpec artifacts, or route tasks to external coding backends.

## License

[MIT License](LICENSE) © 2026 manhua-man
