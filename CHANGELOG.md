# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.1] - 2026-08-04

### Consistency Patch
- **`done` vs. `integrated` Semantics**: Clarified `done` (subagent completed local checks; awaiting main thread merge) vs. `integrated` (main thread merged & verified cross-module integration). Downstream lanes depend strictly on `integrated` state.
- **`blocked` vs. `held` & Reason Enum Standard**: Distinguished objective execution blocks (`blocked`) from Planner policy holds (`held`). Standardized enums for `blocked_reason` and `held_reason`.
- **Ready Gate vs. Metadata Fields**: Grouped `Goal`, `Read`, `Write`, `Deliverable`, `Depends on`, `Acceptance` as the 6 Ready Gate Fields, and `ID`, `Role`, `Ignore`, `Model profile`, `State`, `Reason` as Control Metadata in `references/lane-planning.md`.
- **Term Cleanup**: Purged remaining `worker` / `Child Workers` wording across `lane-planning.md` and README ASCII charts, replacing with `lane` / `Child Agents`.
- **Custom Agent Model Template Fix**: Updated `references/agent-evolution.md` template to `model = "<host-supported-model-id>"` with instruction to map semantic profiles.
- **Bounded `Frequency` Evidence**: Restricted `Frequency` filter counting to visible conversation history, user-provided logs, or host memory.
- **Reviewer Sibling Scope Exception**: Added exception in `references/context-and-prompts.md` allowing `reviewer` / integration lanes to read frozen sibling outputs.
- **Compact Output Enhancements**: Added `Goal`, `Deliverable`, and `Acceptance` fields to launched lanes in Compact output mode in `SKILL.md`.
- **Soften Sandbox Wording**: Aligned sandbox execution wording in `references/project-waves.md` with host capability handling.

## [v2.0.0] - 2026-08-04

### Major Refactoring — Lean Agent Planning Harness Skill (Breaking Changes)
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`. Removed all `Machine Mode`, `schema_version`, and downstream tool contract claims across the repository. Retained `Compact` and `Full` output modes only.
- **Consolidated References (13 -> 5 Assets)**:
  - `references/lane-planning.md`: Merged decomposition heuristics, Lane Ready Gate, scope collision rules, and Hold conditions.
  - `references/project-waves.md`: Merged project surface discovery, Shared Contract Owners, Frontier computation, Wave launching, incremental replanning, and Main thread integration.
  - `references/context-and-prompts.md`: Merged Global Constraints, Lane Scopes (`Read`, `Write`, `Ignore`), default system noise boundaries, Common Boundary Block, and Role Directives.
  - `references/agent-evolution.md`: Merged candidate evidence identification, 4 Candidate Quality Filters, multi-candidate reporting, and strict user approval rule before TOML generation.
  - `references/runtime-compatibility.md`: Cleaned up concrete model IDs and `reasoning_profile`. Standardized on pure semantic profiles (`deep`, `balanced`, `fast`) and host capability handling.
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`. Purged obsolete role keywords (`worker`, `verifier`, `default`, `prompt_spec.lane_role`, `agent_type`, `reasoning_profile`).
- **Streamlined SKILL.md**: Refactored into 8 clean sections (~110 lines) with valid YAML frontmatter and 11 Canonical Safety Rules.

## [v1.0.0] - 2026-08-03
- Initial v1.0.0 complete stack release milestone.
