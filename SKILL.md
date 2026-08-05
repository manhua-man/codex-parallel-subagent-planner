---
name: parallel-subagent-planner
description: >-
  Plan safe Codex subagent execution for coding tasks. Use when deciding whether
  subagents would help, splitting work into independent scopes, establishing
  dependency order, or writing focused subagent prompts.
---

# Parallel Subagent Planner (v3.0.0 Pure Harness Skill)

Decide whether subagents help, split work into safe independent lanes, control file scope boundaries, set execution order, and guide Codex execution.

## 1. Decide Direct Execution Or Subagents

Never split for the sake of splitting. Execute directly in the main thread unless splitting into subagents materially reduces wall-clock time or a read-only investigation de-risks implementation.

- Use a read-only investigation subagent when repository boundaries or dependencies are unclear.
- Launch implementation subagents in parallel only when:
  - Their write scopes are disjoint (`write(A) ∩ write(B) = ∅`).
  - Neither reads files being modified by another concurrent subagent (`write(A) ∩ read(B) = ∅`).
  - Their progress does not depend on another concurrent subagent's unfinished output.

## 2. Plan Subagent Lanes & File Boundaries

Read [references/lane-decomposition.md](references/lane-decomposition.md) for slicing heuristics and file isolation rules.

- **Vertical Capability Split**: Group UI, API routes, DTOs, and tests for a feature into one subagent lane to prevent inter-agent deadlocks.
- **Horizontal Module Split**: Separate distinct packages operating on disjoint directories.
- Assign explicit `Goal`, `Read` scope, `Write` scope (exact files/directories allowed to edit, or `none`), and `Ignore` scope (system noise and sibling directories).

## 3. Set Execution Order & Shared Contracts

Assign exactly one owner to each shared contract file: either the main thread or one subagent.

1. The owner completes the shared contract changes.
2. The main thread reviews and accepts that stable version.
3. Dependent subagents may then read it, but must not modify it.

If a subagent fails or violates scope, report the issue, stop dependent work, and replan only the affected scope.

## 4. Generate Subagent Prompts

Read [references/child-prompts.md](references/child-prompts.md) for prompt templates and role directive examples.

Generate self-contained subagent prompts containing: `Role`, `Goal`, `Working Directory`, `Read`, `Write`, `Ignore`, `Acceptance`, and role-specific directives.

## 5. Output

Return:

- **Decision**: Execute directly, investigate first, or use parallel subagents — with one brief reason.
- **Order**: State any work that must finish before parallel work begins.
- **Subagents**: For each subagent, provide Goal, Read, Write, Ignore, and Acceptance.
- **Integration**: State the workspace-wide checks the main thread will run.

## 6. Main Thread Integration & Custom Agent Guidance

- **Main Thread Integration**: The main thread is 100% responsible for merging child subagent deliverables and running workspace-wide integration test suites.
- **Custom Agent Guidance**: Read [references/child-prompts.md](references/child-prompts.md). If a subagent role pattern proves repeatedly useful across tasks, recommend saving it as a persistent custom agent spec (`.codex/agents/<name>.toml`) with explicit user approval.
