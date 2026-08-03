# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v0.3.0] - 2026-08-03

### Changed
- Refactored project into a pure instruction-only Codex AI Skill asset.
- Streamlined `SKILL.md` into 7 core sections (~70-100 lines) with valid YAML frontmatter (`name` and `description`).
- Consolidated reference documentation into 4 core files (`project-scale-planning.md`, `planner-details.md`, `prompt-templates.md`, `runtime-compatibility.md`).
- Made `references/runtime-compatibility.md` the single source of truth for model profile mappings (`deep` -> `gpt-5.6-sol`, `balanced` -> `gpt-5.6-terra`, `fast` -> `gpt-5.6-luna`).
- Updated `agents/openai.yaml` skill metadata.
- Combined installation guides directly into `README.md` and `README.zh-CN.md`.

### Removed
- Removed experimental validator, schema definitions, eval runners, packaging scripts, test suites, and Node-based maintenance tooling (`.tools/`, `test/`, `evals/`, `schema/`, `examples/`, `docs/`, `.github/`, `dist/`, `package.json`, `package-lock.json`, `INSTALL.md`, `COMPATIBILITY.md`, `CONTRIBUTING.md`, `opsx-parallel.md`).
- Removed long-term agent candidate policy and `.toml` generation rules.
- Removed Machine Schema output mode and mathematical `launch_score` formula.
