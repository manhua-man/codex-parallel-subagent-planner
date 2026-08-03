# Context Engineering & Budget Harness

Use this reference when structuring child agent context budgets, defining scope boundaries, or eliminating context pollution.

## Core Philosophy

Subagent performance is governed primarily by **Context Quality**. Providing an entire repository to a subagent causes context bloat, hallucination, and unwanted cross-boundary modifications.

Context Engineering structures context into three strict layers:

```text
┌────────────────────────────────────────────────────────┐
│                   Global Context                       │
│    (Project goal, architecture constraints, forbidden) │
├────────────────────────────────────────────────────────┤
│                    Lane Context                        │
│    (Narrow goal, explicit Read Scope, Write Scope)     │
├────────────────────────────────────────────────────────┤
│                   Ignore Scope                         │
│    (Explicit Noise Boundaries — DO NOT INSPECT)        │
└────────────────────────────────────────────────────────┘
```

---

## 1. Global Context (System Invariants)
Shared project-level directives included in the parent prompt or context brief:
- High-level architectural patterns.
- Hard safety constraints (e.g. "Do not modify public API DTOs without updating contract tests").

## 2. Lane Context (Targeted Work Scope)
Minimal viable context required for the subagent to execute:
- `goal`: single narrow objective.
- `read_scope`: explicit file paths or directory subtrees (`src/auth/**`).
- `write_scope`: explicit write targets (`src/auth/service.ts`).
- `acceptance`: concrete pass/fail checks.

## 3. Ignore Scope (Noise & Pollution Boundaries)
Explicit directories and patterns that subagents MUST NOT inspect or read:
- **Default System Ignores**: `node_modules/**`, `dist/**`, `build/**`, `.git/**`, `.cache/**`, `*.log`, `tmp/**`.
- **Parallel Worker Ignores**: Directories owned by sibling parallel lanes in the same wave (e.g. A worker editing `src/auth/**` has `ignore_scope: ["src/billing/**", "src/search/**"]`).

---

## Context Budget Object Format

In Machine Schema Mode (`schema_version: "1.3"`), specify context budgets using the optional `context` object under root or lanes:

```json
{
  "context": {
    "global_constraints": ["Preserve backward compatibility for v1 routes"],
    "read_scope": ["src/auth/**"],
    "write_scope": ["src/auth/service.ts"],
    "ignore_scope": ["node_modules/**", "dist/**", ".git/**", "src/billing/**"]
  }
}
```
