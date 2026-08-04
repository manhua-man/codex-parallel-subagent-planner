# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.2] - 2026-08-04

### Consistency Patch
- **Wave Deferred Lanes Marking**: Updated `references/project-waves.md` to explicitly mark downstream lanes with unmet dependencies as `blocked` (`blocked_reason: dependency`), and ready lanes deferred by policy/concurrency as `held` (`held_reason: concurrency_budget`).
- **Lane vs. Shared Contract Dependency Distinction**: Refined Safety Rule 10 in `SKILL.md`, `lane-planning.md`, and `project-waves.md`: *"A downstream lane may launch only when every prerequisite lane is integrated and every referenced shared contract is frozen."*
- **Reviewer Custom Agent Sandbox Mode Alignment**: Changed `sandbox_mode = "workspace-write"` to `sandbox_mode = "read-only"` in `references/agent-evolution.md` Reviewer custom agent `.toml` template.
- **Migrator Backward Compatibility Directive Refinement**: Softened `references/context-and-prompts.md` Migrator directive to handle intentional, approved breaking changes gracefully.

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
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`.
- **Consolidated References (13 -> 5 Assets)**: Streamlined into 5 core assets (`lane-planning.md`, `project-waves.md`, `context-and-prompts.md`, `agent-evolution.md`, `runtime-compatibility.md`).
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`.
- **Streamlined SKILL.md**: Refactored into clean sections with 11 Canonical Safety Rules.
