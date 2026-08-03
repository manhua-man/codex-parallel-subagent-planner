# Prompt Templates

Use these templates when generating non-recursive, bounded child prompts for subagents.

## Common Boundary Block

Include this standard boundary block in every child prompt:

```text
Boundary:
- Work strictly within assigned Read and Write scopes.
- Do not launch, delegate, or spawn subagents.
- Do not modify files outside Write.
- Stop and report immediately if another scope or file is required.
- Run only lane-local checks. Main thread executes final verification.
- Return a summary of changes, checks, risks, and handoff notes.
```

---

## 1. Project Discovery Template

```text
Goal: Map project structure, module boundaries, dependencies, and shared contract ownership.
Working directory: [target repository]
Read first: [packages/**, docs/**, or top-level architecture files]
Write: [] (Read-only discovery)
Acceptance: Return complete module matrix, dependency graph, and proposed contract owners.

[Insert Common Boundary Block]
```

---

## 2. Explorer Template

```text
Goal: [specific investigation or behavior audit]
Working directory: [target repository]
Read first: [exact files or subtrees to inspect]
Write: [] (Read-only audit)
Acceptance: [concrete audit report or behavior map]

[Insert Common Boundary Block]
```

---

## 3. Worker Template

```text
Goal: [one narrow implementation or refactoring goal]
Working directory: [target repository]
Read first: [exact files or subtrees]
Write: [exact files or subtrees to modify]
Acceptance: [lane-local pass/fail test command]

[Insert Common Boundary Block]
```

---

## 4. Verifier Template

```text
Goal: [verify feature implementation against spec or run targeted quality check]
Working directory: [target repository]
Read first: [target implementation files & test suites]
Write: [test files or report path]
Acceptance: [verification test suite command]

[Insert Common Boundary Block]
```
