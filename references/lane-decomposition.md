# Task Slicing & Scope Isolation Guide

Use this reference when deciding how to split a coding goal into parallel or sequential subagent lanes.

## 1. Slicing Strategies

- **Vertical Capability Split (Recommended for User Features)**: Group UI, API routes, DTOs, and tests for a single feature into one subagent lane. This prevents deadlocks where a frontend subagent waits for a backend subagent.
- **Horizontal Module Split (Recommended for Independent Packages)**: Separate distinct, independent microservices, packages, or utilities that operate on disjoint directories.

If boundary files are ambiguous, launch ONE read-only subagent first to inspect the codebase and map file paths.

---

## 2. Scope Isolation Rules

To prevent subagents from overwriting each other's code or reading unstable drafts:

1. **Write Isolation**: `write(A) ∩ write(B) = ∅`. Two subagents running in parallel must NEVER edit the same file or directory.
2. **Write-Read Isolation**: `write(A) ∩ read(B) = ∅`. A subagent running in parallel must NOT inspect files currently being modified by another running subagent (unless inspecting a frozen shared contract).
3. **Noise Exclusion**: Always exclude system noise (`node_modules/**`, `dist/**`, `.git/**`, `build/**`) and sibling subagent directories from subagent context.

---

## 3. Shared Contracts & Execution Order

When subagents depend on a shared API route, database schema, migration, or config file:

1. **Single Owner Rule**: Assign exactly ONE subagent to own and edit the shared contract file.
2. **Sequential Contract Order**:
   - Phase 1: Launch the contract owner subagent to modify and freeze the shared contract file.
   - Phase 2: Once the shared contract is frozen, launch consumer subagents in parallel to implement dependent code.
