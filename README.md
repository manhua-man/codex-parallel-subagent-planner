# parallel-subagent-planner (v0.2.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` is a **Planner Contract (v0.2.0)** execution-parallelism skill for Codex. It chooses between a lightweight task split and project-scale module planning, validates structured plans against compiled standalone JSON schemas and 9 safety invariants, and generates minimal child prompts.

## Key Capabilities (v0.2.0)

- **Planner Contract & Standalone Compiled Schema**: Generates structured plan JSON conforming to `schema/planner-plan.schema.json`, validated at 100% byte-for-byte schema compilation parity (`npm run schema:check`).
- **Deterministic Invariant Validator**: Enforces 9 safety invariants (disjoint write scopes, write-read race condition prevention, satisfied dependencies, acyclic graph, contract single owner, non-empty acceptance, read-only enforcement, concurrency budget, state/held consistency).
- **Recorded Golden Contract Fixtures (`npm run eval:golden`)**: Recorded test suite (`evals/cases.json`) with explicit assertion handler registry and an **`Unsafe Launch Rate = 0`** target assertion.
- **Model Profiles & Compatibility Layer**: Decouples model names via semantic profiles (`deep | balanced | fast`) mapped through `references/runtime-compatibility.md`.
  - `deep` (`gpt-5.6-sol`): Flagship model for ambiguous root cause, security audits, complex contracts, high-risk integration.
  - `balanced` (`gpt-5.6-terra`): General-purpose model for routine implementation, bounded refactoring, standard development.
  - `fast` (`gpt-5.6-luna`): Read-only scans, information extraction, deterministic transformations.
- **Value & Cost-Aware Scheduling**: Priority scoring (`launch_score` + `score_reasons`) and cost budget enforcement.
- **Output Modes**: Supports `Compact` (human summary), `Explain` (diagnostic view), and `Machine` (strict JSON output).
- **TOML Custom Agent Specification**: Persistent agent specs use standard Codex `.toml` templates (`~/.codex/agents/<agent>.toml` and `.codex/agents/<agent>.toml`) with a `promotion_check: silent` default policy.

## Operating Modes

| Mode | Use when | Planner behavior |
|---|---|---|
| Task mode | One bounded change, one module, or accepted named lanes | Run the lightweight split gate; avoid broad repository discovery |
| Project mode | A complete application or accepted goal spans multiple modules and shared contracts | Map the full execution surface, assign contract owners, score frontier priority, and schedule dependency-safe waves |

## Installation

### Personal Skill Installation (Recommended)

```bash
# Personal install path: $HOME/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js
```

### Target Project Workspace Installation

```bash
# Target path: <target-repo>/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js /path/to/target-repo
```

### Plugin Distribution

```bash
npm run package:plugin
```

For more details, see [INSTALL.md](INSTALL.md).

## Output Modes Example

### Default `Compact` Output

```text
Why parallel
The task has one read-only behavior check and one implementation lane, but the implementation depends on the check result.

Lane summary
- Export behavior audit: agent_type explorer, model_profile fast, reasoning_profile high, read_scope src/runtime/session-view-service.ts + src/extension.ts, write_scope none, deliverable behavior map, state ready, held_reason safe
- Export flow worker: agent_type worker, model_profile deep, reasoning_profile medium, read_scope same files plus audit handoff, write_scope src/runtime/session-view-service.ts + src/extension.ts, deliverable behavior-preserving refactor, state blocked, held_reason dependency

Launch status
- Launched: Export behavior audit
- Held: Export flow worker, because it depends on explorer findings

Integration note
Start with the audit, then launch or handle the worker only after current behavior and acceptance checks are concrete.
```

### `Machine` Output (JSON Schema)

```json
{
  "schema_version": 1,
  "mode": "task",
  "budget": {
    "max_concurrency": 2,
    "max_write_lanes": 2,
    "cost_profile": "balanced"
  },
  "contracts": [],
  "lanes": [
    {
      "id": "cli-help-worker",
      "agent_type": "worker",
      "model_profile": "balanced",
      "reasoning_profile": "medium",
      "depends_on": [],
      "read_scope": ["src/cli/help.ts"],
      "write_scope": ["src/cli/help.ts"],
      "acceptance": ["npm run test:cli"],
      "deliverable": "Updated CLI help text",
      "state": "ready",
      "held_reason": null,
      "launch_score": 7.5,
      "score_reasons": ["Disjoint write scope", "Lane-local checks pass"]
    }
  ],
  "frontier": ["cli-help-worker"]
}
```

## Repository Layout

```text
parallel-subagent-planner/
├─ SKILL.md
├─ opsx-parallel.md
├─ schema/
│  └─ planner-plan.schema.json
├─ evals/
│  └─ cases.json
├─ examples/
│  ├─ fixtures.md
│  └─ plans/
├─ test/
│  └─ validator.test.js
├─ .tools/
│  ├─ validate-plan.js
│  ├─ generate-schema-validator.js
│  ├─ check-schema-parity.js
│  ├─ schema-validator.js
│  ├─ run-evals.js
│  ├─ check-drift.js
│  ├─ package-plugin.js
│  └─ install-skill.js
├─ references/
│  ├─ benchmarks.md
│  ├─ long-term-agents.md
│  ├─ maintenance.md
│  ├─ project-scale-planning.md
│  ├─ planner-details.md
│  ├─ prompt-templates.md
│  └─ runtime-compatibility.md
├─ docs/
│  ├─ request-flow.md
│  └─ request-flow.zh-CN.md
├─ INSTALL.md
├─ COMPATIBILITY.md
├─ CHANGELOG.md
├─ LICENSE
└─ CONTRIBUTING.md
```

## Automated Verification

Run the full automated test suite:

```bash
npm test
```

Includes byte-for-byte schema parity verification, static integrity audit, validator and assertion handler unit tests, and recorded golden contract fixture evals.

## License

[MIT License](LICENSE) © 2026 manhua-man
