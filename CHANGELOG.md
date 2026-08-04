# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v2.0.7] - 2026-08-05

### Role Extensibility Clarification Patch
- **Role Extensibility Clarification**: Clarified in `references/context-and-prompts.md` Section 2 and `SKILL.md` Section 4 that the 4 canonical roles (`explorer`, `implementer`, `reviewer`, `migrator`) are recommended built-in defaults, not a dogmatic lock. Custom domain roles (e.g., `docs_writer`) are supported provided explicit `Goal`, `Read`, `Write`, and `Ignore` boundaries are defined.

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
- **Wave Deferred Lanes Marking**: Updated `references/project-waves.md` to explicitly mark downstream lanes with unmet dependencies as `blocked`, and ready lanes deferred by policy/concurrency as `held`.

## [v2.0.1] - 2026-08-04

### Consistency Patch
- **`done` vs. `integrated` Semantics**: Clarified `done` vs. `integrated` state semantics.

## [v2.0.0] - 2026-08-04

### Major Refactoring — Lean Agent Planning Harness Skill (Breaking Changes)
- **Removed Machine Schema & Protocol Layer**: Deleted `schema/` directory and `references/machine-schema.md`.
- **Consolidated References (13 -> 5 Assets)**: Streamlined into 5 core assets.
- **Canonical 4 Role System**: Standardized roles to `explorer`, `implementer`, `reviewer`, and `migrator`.
