# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v0.4.0] - 2026-08-03

### Added
- **Decomposition Intelligence**: Added Vertical Split (end-to-end capability slicing) vs. Horizontal Split (decoupled module slicing) heuristics in `references/decomposition.md`.
- **Six Lane Quality Criteria**: Added single goal, clear input, clear output, bounded scope, independent progress, and verifiable acceptance audits.
- **Machine Schema Protocol v1.1**: Added optional `split_strategy` under `decision` and `lane_quality` under `lanes` in `schema/planner-plan.schema.json`. Fully backward compatible with `1.0` parsers.
- **Updated Section 3 in SKILL.md**: Integrated slicing strategy guidelines and lane quality audits.

## [v0.3.0] - 2026-08-03

### Changed
- Refactored project into a pure instruction-only Codex AI Skill asset.
- Streamlined `SKILL.md` into 8 core sections with valid YAML frontmatter (`name` and `description`).
- Consolidated reference documentation into core files (`project-scale-planning.md`, `planner-details.md`, `machine-schema.md`, `long-term-agents.md`, `prompt-templates.md`, `runtime-compatibility.md`).
- Made `references/runtime-compatibility.md` the single source of truth for model profile mappings (`deep` -> `gpt-5.6-sol`, `balanced` -> `gpt-5.6-terra`, `fast` -> `gpt-5.6-luna`).
- Updated `agents/openai.yaml` skill metadata.

### Removed
- Removed experimental validator, schema definitions, eval runners, packaging scripts, test suites, and Node-based maintenance tooling.
