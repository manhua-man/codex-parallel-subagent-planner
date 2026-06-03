---
description: Cost-aware split check for safe Codex subagent lanes
argument-hint: plan, skill, task summary, or handoff target
---

Use `$parallel-subagent-planner` as the planner.
Read any user-supplied plan, skill, or task brief first.
Consider subagents when the task has one strong split signal, then launch only lanes that pass safety and cost checks.
Treat the user's material as intent, not as a binding lane layout.
Decide for yourself whether to:
- not split the work
- split the work and launch only lanes whose saved wall-clock likely justifies child context cost
- return ready prompts for lanes that should be held back

Operating rules:
- Prefer the minimum viable lane count.
- Any one strong split signal is enough to consider subagents: independent workstreams, useful read-only exploration or verification, user-provided separable files/tests/docs/ledgers, or broad/risky work that benefits from parallel investigation.
- If the task is too small or too coupled, say not to split it.
- Prefer no launch or one read-only explorer/verification lane before launching write-enabled workers.
- In one shared worktree, multiple write-enabled workers are allowed when write scopes are disjoint, lane-local checks exist, and the expected benefit should justify child context cost.
- Treat one broad final test suite, such as `npm test`, as final integration work for the main thread, not something every worker should run.
- Optimize after the skill is invoked: fewer launched threads beat finer file-level purity when the work is low-risk and shares one acceptance gate.
- Merge docs/config/ledger writebacks into one worker or keep them in the main thread instead of launching one worker per file.
- Build a compact Context Brief from user-provided files, tests, docs, ledgers, diffs, and acceptance checks.
- Return provisional lane boundaries and assumptions when exact file scope is unknown; do not start with heavy repository-wide analysis unless required.
- Use `explorer` lanes first when workers may touch the same file family or when implementation depends on unknown behavior.
- Use simultaneous write-enabled `worker` lanes only when their prompts are compact, their write scopes are disjoint, and they should reduce wall-clock without duplicating broad verification.
- If the user provides a skill, decide whether it belongs on the controller, on one lane, on multiple lanes, or is unnecessary.
- Print the compact lane plan first, then launch only lanes with `can_launch: yes` and `held_reason: safe`.
- Hold lanes with overlapping write scopes, unclear scope, unclear acceptance, or dependency on another lane.
- Do not launch when the user asks for planning only.
- Default to explicit `fork_context=false`: pass only the Context Brief and assign child agent type, model, and reasoning when they materially improve cost or quality. Choose child model and reasoning from the lane's own risk, ambiguity, blast radius, and expected savings; do not copy the main thread settings by default. Preflight launch args before spawning: `fork_context=true` must omit agent type, model, and reasoning. Use inheritance only when a lane cannot be safely described without full conversation history.
- In every child prompt, say the lane is already scoped and must be executed locally; do not ask child agents to split, delegate, launch subagents, or run orchestration again.
- Do not name the planner skill inside child prompts; naming it can load the skill body again.
- Wait once for launched lanes unless a partial result immediately unblocks local integration.
- After launching workers, do not implement their write scopes in the main thread until they return.
- Child prompts must include `Working directory`, exact `read_scope` and `write_scope`, and a hard boundary: modify only `write_scope`; if another file is required, stop and report.
- Child prompts must include `Preflight`: switch to `Working directory` or use absolute paths, then verify every Read/Write target exists before reading or editing. If any target is missing, stop and report the missing path and current cwd.

Return Compact by default:
1. `Why parallel`
2. `Lane summary`
3. `Launch status`
4. `Integration note`

Only include `Ready prompts` when the user asks for `Full`, explicitly asks for prompts, or when a lane is held and needs a prompt for later launch. `Standard` shows fuller lane summaries without all prompts.

Each lane summary and ready prompt must include:
- agent type
- model
- reasoning effort
- read_scope
- write_scope
- deliverable
- can_launch: yes/no
- held_reason: safe/overlap/blocked/unclear_acceptance/unclear_scope
- acceptance checks
- required output format

Do not equate consideration with launch. Launch only when the lane has a clear goal, bounded read/write scope, useful deliverable, and concrete acceptance check.
Keep overlapping, integration-sensitive, small, or shared-acceptance work in the main thread; return ready prompts only for truly held lanes.
