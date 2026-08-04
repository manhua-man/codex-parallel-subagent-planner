# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.0] - 2026-08-04

### Major Refactoring — Lean Agent Planning Harness Skill (Breaking Changes)
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`. Removed all `Machine Mode`, `schema_version`, and downstream tool contract claims across the repository. Retained `Compact` and `Full` output modes only.
- **Consolidated References (13 -> 5 Assets)**:
  - `references/lane-planning.md`: Merged decomposition heuristics, Lane Ready Gate (6 core fields: Goal, Read, Write, Deliverable, Depends on, Acceptance), scope collision rules (`write ∩ write = ∅`, `write ∩ read = ∅`), and Hold conditions.
  - `references/project-waves.md`: Merged project surface discovery, Shared Contract Owners, Frontier computation, Wave launching, incremental replanning (recompute affected frontier only), and Main thread integration.
  - `references/context-and-prompts.md`: Merged Global Constraints, Lane Scopes (`Read`, `Write`, `Ignore`), default system noise boundaries, Common Boundary Block, and Role Directives.
  - `references/agent-evolution.md`: Merged candidate evidence identification, 4 Candidate Quality Filters (`Frequency` 2+, `Stability`, `Boundary`, `Reuse Value`), multi-candidate reporting, and strict user approval rule before TOML generation.
  - `references/runtime-compatibility.md`: Cleaned up concrete model IDs and `reasoning_profile`. Standardized on pure semantic profiles (`deep`, `balanced`, `fast`) and host capability handling.
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`. Purged obsolete role keywords (`worker`, `verifier`, `default`, `prompt_spec.lane_role`, `agent_type`, `reasoning_profile`).
- **Streamlined SKILL.md**: Refactored into 8 clean sections (~110 lines) with valid YAML frontmatter and 11 Canonical Safety Rules.

## [v1.0.0] - 2026-08-03
- Initial v1.0.0 complete stack release milestone.
