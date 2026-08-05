# Subagent Prompts & Custom Agent Guidance

Use this reference when generating child subagent prompts or recommending persistent custom agent specs.

## 1. Subagent Prompt Structure

When spawning a child subagent, provide a clear, self-contained prompt specifying goal, working directories, file boundaries, and verification:

```text
Role: [descriptive role label, e.g., explorer, implementer, reviewer, migrator, docs_writer]
Goal: [single narrow outcome]
Working Directory: [target repository path]
Read: [explicit files or subtrees to inspect]
Write: [exact files or subtrees allowed to edit, or "none"]
Ignore: [node_modules/**, dist/**, .git/**, sibling lane directories]
Acceptance: [objective pass/fail test command or verification step]

Directives:
- Work strictly within assigned Write scope.
- Do not edit outside Write scope.
- Run lane-local verification before declaring completion.
- Return summary of changes, test results, and handoff notes.
```

---

## 2. Standard Directive Examples

### Read-Only Investigation (`explorer` / `reviewer`)
```text
- Do NOT modify any files.
- Inspect files inside Read Scope to gather evidence, trace dependencies, or audit diffs.
- Return structured findings, root cause analysis, or risk notes.
```

### Bounded Implementation (`implementer`)
```text
- Modify code strictly within the assigned Write scope.
- Do NOT perform unrelated refactoring outside Write scope.
- Run local unit tests or build commands to verify changes before completing.
```

### Schema & API Migration (`migrator`)
```text
- Maintain backward compatibility for existing API consumers unless breakage is explicitly approved.
- Write reversible migration steps and update dependent DTO types.
- Verify that existing test suites pass clean.
```

---

## 3. Persistent Custom Agent Specs (`.toml`)

If a subagent role pattern proves repeatedly useful across multiple tasks (e.g., an API contract reviewer or database migration auditor):

- Recommend saving it as a persistent custom agent spec file:
  - Personal: `~/.codex/agents/<name>.toml`
  - Project: `.codex/agents/<name>.toml`
- **User Approval Rule**: Ask for user approval before writing any `.toml` file.

### Sample Custom Agent Template

```toml
name = "api_contract_reviewer"
description = "Maintains API backward compatibility and verifies route contract invariants."
model = "<host-supported-model-id>"
sandbox_mode = "read-only"

developer_instructions = """
Review API schema modifications, report backward-incompatible changes, and verify route contracts.
Inspect target schema files and route definitions provided dynamically in the task context.
Do not modify contract specifications or workspace source code without explicit user approval.
"""
```
