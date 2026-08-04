# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.4] - 2026-08-05

### Automated Diagnostic Logging Patch
- **Zero-Human Automated Diagnostic Logging**: Formalized 100% automated failure diagnostic logging in `references/project-waves.md` Section 4 and `SKILL.md` Section 6. During main thread integration, if a child lane fails, violates scope, or fails acceptance, the main thread automatically runs failure diagnosis and appends a 5-line failure card entry to `failures.md` (zero human effort required).

## [v2.0.3] - 2026-08-04

### Consistency Patch
- **Frozen Contract Wording Fix**: Replaced leftover `integrated contract IDs` with `frozen contract IDs` in `references/lane-planning.md:26`.
- **Contract State Wording Fix**: Replaced `contract un-integrated` with `referenced contract not frozen` in `SKILL.md:63` and `references/lane-planning.md:72`.
- **Disambiguated `blocked_reason` Enums**: Separated `blocked_reason: dependency` (waiting for prerequisite lanes to reach `integrated` state) from `blocked_reason: contract` (waiting for referenced shared contracts to reach `frozen` state) in `references/lane-planning.md`.

## [v2.0.2] - 2026-08-04

### Consistency Patch
- **Wave Deferred Lanes Marking**: Updated `references/project-waves.md` to explicitly mark downstream lanes with unmet dependencies as `blocked` (`blocked_reason: dependency`), and ready lanes deferred by policy/concurrency as `held` (`held_reason: concurrency_budget`).
- **Lane vs. Shared Contract Dependency Distinction**: Refined Safety Rule 10 in `SKILL.md`, `lane-planning.md`, and `project-waves.md`.
- **Reviewer Custom Agent Sandbox Mode Alignment**: Changed `sandbox_mode = "workspace-write"` to `sandbox_mode = "read-only"` in `references/agent-evolution.md` Reviewer custom agent `.toml` template.

## [v2.0.1] - 2026-08-04

### Consistency Patch
- **`done` vs. `integrated` Semantics**: Clarified `done` vs. `integrated` state semantics.
- **`blocked` vs. `held` & Reason Enum Standard**: Distinguished objective execution blocks from Planner policy holds.

## [v2.0.0] - 2026-08-04

### Major Refactoring — Lean Agent Planning Harness Skill (Breaking Changes)
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`.
- **Consolidated References (13 -> 5 Assets)**: Streamlined into 5 core assets (`lane-planning.md`, `project-waves.md`, `context-and-prompts.md`, `agent-evolution.md`, `runtime-compatibility.md`).
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`.
