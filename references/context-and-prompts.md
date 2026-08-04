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

## 2. Canonical 4 Role System

Role selection directly dictates the subagent's directives:

- **`explorer`**: Read-only discovery, dependency mapping, and root cause analysis. (Must NOT edit files; returns findings).
- **`implementer`**: Bounded feature implementation, bug fixes, or refactoring within assigned `Write` scope.
- **`reviewer`**: Diff review, risk challenge, test audit, and compatibility checks. (Default read-only; returns risk report).
- **`migrator`**: Schema, API, database, or data migrations. (Must verify backward compatibility and provide rollback notes).

### Role Selection Rule
- Read-only investigation ➔ `explorer` or `reviewer`
- Feature / Bug code edits ➔ `implementer`
- Schema / API migration ➔ `migrator`
- Final integration ➔ Main Thread (not a subagent role)

---

## 3. Standardized Child Prompt Template

When writing prompts for child subagents, use this template:

```text
Role: [explorer | implementer | reviewer | migrator]
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

### Role-Specific Directives

#### `explorer`
```text
- Do NOT modify any files.
- Inspect files inside Read Scope to gather evidence.
- Return structured findings, root cause analysis, and dependency maps.
```

#### `implementer`
```text
- Work strictly within the assigned Write scope.
- Do NOT perform unrelated refactoring or edit files outside Write scope.
- Run lane-local verification checks before declaring completion.
```

#### `reviewer`
```text
- Challenge design assumptions and identify potential breaking changes.
- Verify contract boundaries and backward compatibility.
- Do NOT rewrite code unless explicitly requested.
```

#### `migrator`
```text
- Ensure 100% backward compatibility for existing consumers.
- Write reversible, idempotent migration steps.
- Verify that old API contracts continue to resolve correctly.
```
