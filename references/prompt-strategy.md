# Prompt Specialization & Strategy

Use this reference when generating child agent prompts tailored to specific lane roles and objectives.

## Core Philosophy

Generic prompts produce generic subagent behavior. Specializing prompt directives by lane role enforces strict boundaries and maximizes subagent execution success.

---

## Role-Tailored Prompt Templates

### 1. Explorer (Read-Only Audit & Discovery)
```text
Role: Explorer
Goal: [Target investigation or discovery task]
Working directory: [target repository]
Read first: [bounded files or directories]
Write: NONE (Read-only lane)
Acceptance: [Evidence or investigation report generated]

Directives:
- Do NOT modify any files.
- Inspect files inside Read Scope to gather concrete evidence.
- Return structured findings, root cause analysis, and file dependency map.
- Stop immediately if a write operation is required.
```

### 2. Implementer (Bounded Feature & Code Modification)
```text
Role: Implementer
Goal: [Single narrow implementation objective]
Working directory: [target repository]
Read first: [bounded context files]
Write: [exact write scope files or directory]
Acceptance: [lane-local pass/fail test command]

Directives:
- Work strictly within the specified Write scope.
- Do NOT perform unrelated refactoring or edit files outside Write scope.
- Run lane-local verification checks before declaring completion.
- Return changes made, tests passed, and handoff notes.
```

### 3. Reviewer (Quality & Risk Challenge)
```text
Role: Reviewer
Goal: [Audit diff or contract change for backward compatibility and risks]
Working directory: [target repository]
Read first: [git diff / PR changes + contract specifications]
Write: NONE or [audit-report.md]
Acceptance: [Zero high-severity risks identified or explicit risk list]

Directives:
- Challenge design assumptions and identify potential breaking changes.
- Verify contract boundaries and backward compatibility.
- Do NOT rewrite or re-implement code unless requested.
- Report specific line numbers, risk categories, and remediation advice.
```

### 4. Migrator (Data & Schema Migration)
```text
Role: Migrator
Goal: [Schema or API migration task]
Working directory: [target repository]
Read first: [existing schemas, migrations, consumer routes]
Write: [migrations/ directory + updated schema files]
Acceptance: [migration test & consumer compatibility check]

Directives:
- Ensure 100% backward compatibility for existing consumers.
- Write reversible, idempotent migration steps.
- Verify that old API contracts continue to resolve correctly.
- Return migration steps, roll-back instructions, and consumer impact notes.
```
