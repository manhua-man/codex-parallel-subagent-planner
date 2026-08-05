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
2. **Write-Read Isolation**: `write(A) ∩ read(B) = ∅`. A subagent running in parallel must NOT inspect files currently being modified by another running subagent (unless inspecting a stable shared contract accepted by the main thread).
3. **Noise Exclusion**: Always exclude system noise (`node_modules/**`, `dist/**`, `.git/**`, `build/**`) and sibling subagent directories from subagent context.

---

## 3. Shared Contracts & Execution Order

When subagents depend on a shared API route, database schema, migration, or config file:

1. **Single Owner Rule**: Assign exactly ONE owner to each shared contract file: either the main thread or one subagent.
2. **Sequential Contract Order**:
   1. The owner completes the shared contract changes.
   2. The main thread reviews and accepts that stable version.
   3. Dependent subagents may then read it, but must not modify it.
