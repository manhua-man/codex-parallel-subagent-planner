---
description: Cost-aware split check for safe Codex subagent lanes
argument-hint: plan, skill, task summary, or handoff target
---

Use `$parallel-subagent-planner` as the planner.

Read any user-supplied plan, skill, task brief, files, tests, docs, ledgers,
diffs, and acceptance checks first. Treat user material as intent, not as a
binding lane layout.

Return Compact by default:

1. `Why parallel`
2. `Lane summary`
3. `Launch status`
4. `Integration note`

Only include `Ready prompts` when the user asks for `Full`, explicitly asks for
prompts, or when a lane is held and needs a prompt for later launch.

Use the skill's core rules for:

- fast split gating
- launch versus hold decisions
- read/write scope boundaries
- child model, reasoning, and `fork_context` choices
- non-recursive child prompts
- main-thread integration and final verification
- mandatory long-term agent candidate checks

Do not duplicate or override the skill body here. If this command and
`SKILL.md` appear to disagree, `SKILL.md` is the source of truth.
