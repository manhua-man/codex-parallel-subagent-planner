---
description: Cost-aware split check for safe Codex subagent lanes
argument-hint: plan, skill, task summary, or handoff target
---

Use `$parallel-subagent-planner` as the planner.

Read any user-supplied plan, skill, task brief, files, tests, docs, ledgers, diffs, and acceptance checks first. Treat user material as intent, not as a binding lane layout.

Output modes:
- Default: `Compact` (`Why parallel`, `Lane summary`, `Launch status`, `Integration note`).
- Diagnostic: `Explain` (`Scale decision`, `Candidate lanes`, `Merged/held reasons`, `Write overlap check`, `Dependency check`, `Budget rationale`, `Launch score`).
- Structured: `Machine` (JSON conforming to `schema/planner-plan.schema.json`).

Only include `Ready prompts` when the user asks for `Full`, explicitly asks for prompts, or when a lane is held and needs a prompt for later launch.

Use the skill's core rules for:
- task-scale versus project-scale classification
- project module discovery, dependency graphs, shared-contract ownership, and wave scheduling
- fast split gating and capability-based launch rules
- model profiles (`deep`, `balanced`, `fast`) and reasoning profiles
- cost budgeting and priority scoring
- non-recursive child prompts
- main-thread integration and final verification
- long-term agent candidate policy (`promotion_check: silent`)

Do not duplicate or override the skill body here. If this command and `SKILL.md` appear to disagree, `SKILL.md` is the source of truth.
