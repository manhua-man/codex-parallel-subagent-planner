---
name: parallel-subagent-planner
description: >-
  Plan safe Codex subagent execution for coding tasks. Use when deciding whether
  parallel subagents would help, splitting work into independent lanes, setting
  disjoint file boundaries, establishing execution order, or writing clean subagent
  prompts. Do not use it to manage physical processes, run background servers, or
  replace runtime execution frameworks.
---

# Parallel Subagent Planner (v3.0.0 Pure Harness Skill)

Decide whether subagents help, split work into safe independent lanes, control file scope boundaries, set execution order, and guide Codex execution.

## 1. Decide Direct Execution Or Subagents

Never split for the sake of splitting. Execute directly in the main thread unless splitting into subagents materially reduces wall-clock time or a read-only investigation de-risks implementation.

Only split if ALL of the following are true:
- Workstreams operate on genuinely independent code paths.
- Write scopes are completely disjoint with zero overlap (`write(A) ∩ write(B) = ∅`).
- No subagent reads files currently being edited by another parallel subagent (`write(A) ∩ read(B) = ∅`).

## 2. Plan Subagent Lanes & File Boundaries

Read [references/lane-decomposition.md](references/lane-decomposition.md) for slicing heuristics and file isolation rules.

- **Vertical Capability Split**: Group UI, API routes, DTOs, and tests for a feature into one subagent lane to prevent inter-agent deadlocks.
- **Horizontal Module Split**: Separate distinct packages operating on disjoint directories.
- Assign explicit `Goal`, `Read` scope, `Write` scope (exact files/directories allowed to edit, or `none`), and `Ignore` scope (system noise and sibling directories).

## 3. Set Execution Order & Shared Contracts

Every shared contract (API route, database schema, DTO) must have exactly ONE owner subagent per wave:
1. **Phase 1**: Launch the contract owner subagent first. Wait for shared contract files to be modified and frozen.
2. **Phase 2**: Launch dependent consumer subagents in parallel to read the frozen contract.

If a subagent fails or violates scope, mark it blocked, report the issue in the current response, and replan only the affected work.

## 4. Generate Subagent Prompts

Read [references/child-prompts.md](references/child-prompts.md) for prompt templates and role directive examples.

Generate self-contained subagent prompts containing: `Role`, `Goal`, `Working Directory`, `Read`, `Write`, `Ignore`, `Acceptance`, and role-specific directives.

## 5. Main Thread Integration & Custom Agent Guidance

- **Main Thread Integration**: The main thread is 100% responsible for merging child subagent deliverables and running workspace-wide integration test suites.
- **Custom Agent Guidance**: Read [references/child-prompts.md](references/child-prompts.md). If a subagent role pattern proves repeatedly useful across tasks, recommend saving it as a persistent custom agent spec (`.codex/agents/<name>.toml`) with explicit user approval.
