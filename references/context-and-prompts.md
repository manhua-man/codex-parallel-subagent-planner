# Context Boundaries & Prompt Templates

Use this reference when structuring child agent context budgets, defining scope boundaries, or generating role-tailored prompts.

## 1. Two-Layer Context Architecture

Subagent performance depends directly on context quality. Prevent context bloat and unwanted edits by structuring context into two layers:

- **Global Constraints**: Project-level directives held by the main thread and included in Full plans (architectural constraints, backward compatibility rules, forbidden directories).
- **Lane Scope**: Specific boundaries assigned to each child subagent:
  - `Read`: Canonical files or subtrees the subagent is allowed to inspect.
  - `Write`: Exact file paths or subtrees the subagent is allowed to edit (`none` for read-only).
  - `Ignore`: Explicit noise boundaries and sibling lane directories that subagents MUST NOT inspect.

### Default Ignore Scope Rules
Always exclude system noise and parallel sibling scopes:
- System Noise: `node_modules/**`, `dist/**`, `build/**`, `.git/**`, `.cache/**`, `*.log`, `tmp/**`.
- Sibling Scopes: Directories owned by other parallel lanes running in the same wave.
- **Reviewer Exception**: Ignore sibling scopes during concurrent implementation, unless a `reviewer` or integration lane is explicitly assigned frozen sibling outputs in its `Read` scope.

---

## 2. Role System & Directives

Assign each child subagent a clear, descriptive role tailored to the task (e.g., `explorer`, `implementer`, `reviewer`, `migrator`, `docs_writer`, `profiler`).

### Common Directive Patterns

- **Read-only Investigation (`explorer` / `reviewer`)**: Inspect files, map dependencies, or audit diffs/security risks. Do NOT modify files.
- **Bounded Implementation (`implementer`)**: Bounded code edits, bug fixes, or feature development strictly within the assigned `Write` scope.
- **Schema & API Migration (`migrator`)**: Schema, database, or API contract updates with backward compatibility and rollback guidance.
- **Domain Specialization**: Any domain-specific role assigned explicit `Goal`, `Read`, `Write`, and `Ignore` boundaries.

---

## 3. Standardized Child Prompt Template

When writing prompts for child subagents, use this template:

```text
Role: [explorer | implementer | reviewer | migrator | custom_role]
Goal: [one narrow outcome]
Working directory: [target repository]
Read: [files or directories to inspect]
Write: [exact files or directories to edit, or none]
Ignore: [noise and sibling scopes]
Deliverable: [expected result or audit report]
Depends on: [completed handoff artifacts or none]
Acceptance: [objective pass/fail test command]

Role Directives:
[Insert role-specific directive below]

Boundary:
- Work only inside this lane.
- Do not launch or delegate to other agents.
- Do not edit outside Write.
- Stop and report when another scope is required.
- Run only lane-local verification.
- Return changes, checks, risks, and handoff notes.
```

### Role Directive Examples

#### Read-only `explorer` / `reviewer`
```text
- Do NOT modify any files.
- Inspect files inside Read Scope to gather evidence or audit diffs.
- Return structured findings, root cause analysis, or risk reports.
```

#### Bounded `implementer`
```text
- Work strictly within the assigned Write scope.
- Do NOT perform unrelated refactoring or edit files outside Write scope.
- Run lane-local verification checks before declaring completion.
```

#### Migration `migrator`
```text
- Preserve backward compatibility when required.
- When breakage is intentional, identify affected consumers, document the migration path, and provide rollback notes.
- Write reversible, idempotent migration steps.
- Verify that old API contracts continue to resolve correctly.
```
