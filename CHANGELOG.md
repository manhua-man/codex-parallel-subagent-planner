# Changelog

All notable changes to the `codex-parallel-subagent-planner` project will be documented in this file.

## [0.2.0] - 2026-08-03

### Added
- **Planner Output Schema**: Introduced `schema/planner-plan.schema.json` defining structured JSON contract output format (v1).
- **Deterministic Validator**: Added `scripts/validate-plan.js` enforcing 8 safety & contract invariants (disjoint write scopes, satisfied dependencies, acyclic graph, contract single owner, non-empty acceptance, read-only enforcement, concurrency budget, held reason consistency).
- **Executable Behavioral Evals**: Converted 12 fixtures into structured test cases in `evals/cases.json` and implemented `scripts/run-evals.js` with `Unsafe Launch Rate = 0` target assertion.
- **Static Integrity & Drift Auditor**: Added `scripts/check-drift.js` verifying link integrity, frontmatter, TOML/YAML syntax, and language sync.
- **Plugin Packager**: Added `scripts/package-plugin.js` for packaging plugin bundles into `dist/plugin/`.
- **Value-Based Frontier Scoring**: Added cost budgets (`cheap`, `balanced`, `quality`) and priority scoring (`launch_score` + `score_reasons`).
- **Output Modes**: Formally specified `Compact`, `Explain`, and `Machine` output modes.
- **Project Documentation**: Added `INSTALL.md`, `COMPATIBILITY.md`, `CHANGELOG.md`, `LICENSE`, and `CONTRIBUTING.md`.

### Changed
- **Model Profiles**: Replaced hardcoded model names in core logic with semantic model profiles (`deep`, `balanced`, `fast`) backed by a mapping table in `references/runtime-compatibility.md`.
- **Long-Term Agent Format**: Updated agent specification format from `.md` to standard Codex `.toml` template, and default promotion check policy to `promotion_check: silent`.
- **Decoupled Host API Names**: Replaced specific host function names with generic `required_capabilities` (`explicit_model`, `explicit_reasoning`, `isolated_context`, `read_only_agent`).
- **Installation Paths**: Updated documentation to reference standard `$HOME/.agents/skills/parallel-subagent-planner` and project `.agents/skills/parallel-subagent-planner`.
