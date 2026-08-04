# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.10] - 2026-08-05

### Zero-Leftover Consistency & Softened Sandbox Wording Patch
- **Purged Leftover Worker Term**: Replaced `Temporary Feature Workers` with `Temporary Feature Lanes` in `references/agent-evolution.md:27`.
- **Flexible Role Metadata Table**: Updated `Role` entry in `references/lane-planning.md:31` metadata table to specify flexible descriptive role labels.
- **Softened Read-Only Sandboxing Wording**: Updated `references/runtime-compatibility.md:23` to flexibly cover all read-only audit lanes (`explorer` or read-only `reviewer`).

## [v2.0.9] - 2026-08-05

### Role System Simplification Patch
- **Role System Simplification**: Simplified role guidance across `references/context-and-prompts.md` Section 2, `SKILL.md` Section 4, and READMEs to treat roles as flexible descriptive labels.

## [v2.0.8] - 2026-08-05

### Agent Evolution Boundary Abstraction Patch
- **Role Invariant Abstraction**: Clarified in `references/agent-evolution.md` Section 1 & 3 and `SKILL.md` Section 8 that custom agent candidate promotion evaluates recurring role invariants.

## [v2.0.7] - 2026-08-05

### Role Extensibility Clarification Patch
- **Role Extensibility Clarification**: Clarified role system extensibility in `references/context-and-prompts.md` Section 2 and `SKILL.md` Section 4.

## [v2.0.6] - 2026-08-05

### Streamlined Failure Handling Patch
- **Streamlined In-Session Failure Handling**: Streamlined failure handling text in `SKILL.md` Section 6 and `references/project-waves.md` Section 4.

## [v2.0.5] - 2026-08-05

### Scope Convergence Patch
- **Removed Persistent Failure Logging**: Removed automatic `failures.md` creation and all zero-human diagnostic logging behavior.

## [v2.0.4] - 2026-08-05

### Automated Diagnostic Logging Patch
- **Zero-Human Automated Diagnostic Logging**: Formalized automated failure diagnostic logging behavior.

## [v2.0.3] - 2026-08-04

### Consistency Patch
- **Frozen Contract Wording Fix**: Replaced leftover `integrated contract IDs` with `frozen contract IDs`.
- **Contract State Wording Fix**: Replaced `contract un-integrated` with `referenced contract not frozen`.
- **Disambiguated `blocked_reason` Enums**: Separated `blocked_reason: dependency` from `blocked_reason: contract`.

## [v2.0.2] - 2026-08-04

### Consistency Patch
- **Wave Deferred Lanes Marking**: Updated `references/project-waves.md` to explicitly mark downstream lanes with unmet dependencies as `blocked`.

## [v2.0.1] - 2026-08-04

### Consistency Patch
- **`done` vs. `integrated` Semantics**: Clarified `done` vs. `integrated` state semantics.

## [v2.0.0] - 2026-08-04

### Major Refactoring — Lean Agent Planning Harness Skill (Breaking Changes)
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`.
- **Consolidated References (13 -> 5 Assets)**: Streamlined into 5 core assets.
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`.
