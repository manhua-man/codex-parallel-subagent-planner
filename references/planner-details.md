# Planner Details

Use this file only when fast gating is not enough: unclear split, risky write scopes, held lanes, model/reasoning allocation, or the user asks for ready prompts.

## Lane Fields

Lane fields are planner bookkeeping for launch/hold decisions and handoff. Child prompts can stay shorter and usually need only Goal, Read, Write, Acceptance, and the hard boundary.

When a full plan, held lane, or diagnostic output needs explicit bookkeeping,
track enough of these fields to make the launch decision auditable. Do not force
all fields into Compact output or child prompts:

- lane name
- agent type: `explorer`, `worker`, or `default`
- model
- reasoning
- read_scope
- write_scope
- deliverable
- can_launch: `yes` or `no`
- held_reason: `safe`, `overlap`, `blocked`, `unclear_acceptance`, or `unclear_scope`

Launch only when the planner can establish `can_launch: yes`, `held_reason:
safe`, and the lane passes the cost gate. In normal child prompts, collapse this
into the shorter `Goal`, `Working directory`, `Read`, `Write`, `Acceptance`,
`Preflight`, and `Boundary` shape.

Field meanings:

- `read_scope`: what the lane may inspect first; keeps context loading bounded.
- `write_scope`: files or dirs the lane may modify; used to detect overlap and enforce hard boundaries.
- `deliverable`: the artifact expected back, such as patch, findings, verification evidence, or doc update.
- `can_launch`: whether this lane is ready to start now.
- `held_reason`: why a lane is launched, held, or merged.
- `acceptance checks`: concrete pass/fail evidence for this lane.
- `working directory`: absolute target repo, worktree, or run directory. Pass it
  to every worker; do not rely on the child thread's default cwd.

## Agent Types

- `explorer`: read-only code archaeology, root-cause, audit, verification planning, fixture hunting.
- `worker`: bounded implementation, refactor, tests, docs, ledgers, cleanup, writeback.
- `default`: mixed work that cannot be reduced cleanly.

## Model And Reasoning

Choose child model and reasoning from the lane itself, not from the main thread
settings. The main thread may be expensive because it owns orchestration,
history, and final integration; that does not make every child lane equally
hard.

Use the lowest capable setting that should complete the lane reliably. Raise
model strength or reasoning only when the lane itself has high ambiguity, broad
blast radius, cross-boundary coupling, expensive failure modes, or weak
acceptance signals. Lower them when the lane is narrow, reversible, well
bounded, or has concrete tests.

The child-model allowlist is exactly `gpt-5.6-terra`, `gpt-5.6-luna`, and
`gpt-5.6-sol`. Do not use another model family, inherit the parent model, or
launch without an explicit model. Sol is not the default; select the variant
from the lane:

| Variant | Prefer for |
| --- | --- |
| `gpt-5.6-terra` | cross-module architecture, shared contracts, risky integration, security-sensitive investigation, ambiguous root cause |
| `gpt-5.6-luna` | read-only discovery, evidence synthesis, independent verification, test design, bounded analysis |
| `gpt-5.6-sol` | tightly scoped implementation, mechanical transformation, disjoint writes, concrete lane-local tests |

Reasoning efforts are `low`, `medium`, `high`, and `xhigh`. Choose effort
independently from model: `low` for deterministic scans or mechanical edits,
`medium` for bounded implementation or verification, `high` for ambiguous or
cross-boundary work, and `xhigh` only for exceptional high-consequence work
with weak evidence. Record one sentence of rationale when using Terra, `high`,
or `xhigh`.

## Hold Rules

- `overlap`: workers would write the same file, module family, or interface boundary.
- `blocked`: a worker depends on unfinished explorer findings.
- `unclear_acceptance`: pass/fail condition is not concrete.
- `unclear_scope`: allowed files or responsibilities cannot be bounded safely.
- `safe`: lane is independent and ready.

If a worker depends on explorer findings, launch only the explorer and return the worker as held with `held_reason: blocked`.

Hold or merge implementation workers when any are true:

- the lane is mostly docs, config, ledger, or one-file cleanup
- the worker may need to inspect and adjust another worker's output
- final correctness requires iterative cross-lane repair
- the main thread cannot stay out of the worker write scope while it runs
- two workers would both run the same broad test suite instead of narrow checks
- multiple workers would only duplicate broad verification without reducing wall-clock

## Output Modes

Compact:

1. `Why parallel`
2. `Lane summary`
3. `Launch status`
4. `Integration note`

Show full ready prompts only when the user asks for `Full`, explicitly asks for prompts, or a lane is held and needs later manual launch.

## Cost Rules

- Prefer fewer launched threads over finer file-level purity.
- Do not create one worker per tiny docs/config/ledger file when one bounded worker or main-thread work is enough.
- Separate Codex subagents still receive runtime base context; this skill reduces copied history, recursive planning, and lane prompt size, but cannot make agents share one prompt context.
- Require explicit `fork_context=false`, a compact Context Brief, one allowlisted 5.6 model, and one explicit `reasoning_effort` for every launch.
- Never use `fork_context=true`; summarize the required context instead of inheriting a parent model that may fall outside the allowlist.
- Resolve all launch adapters exposed by the host before declaring model routing unavailable. On Codex Desktop, map `reasoning_effort` to `thinking` and use an authorized `create_thread(model, thinking, target)` lane when generic `spawn_agent` lacks model fields.
- Do not use a generic spawn adapter that cannot pass model and effort, but do not treat that adapter's schema as proof that every host adapter has the same limitation.
- If the runtime cannot pass both model and effort explicitly, hold the lane or execute it in the main thread.
- Do not name this skill inside child prompts.
- Default to main-thread implementation when the split is merely "two small edits in different folders".
- Prefer read-only explorer or verification lanes when implementation workers are likely to duplicate effort.
- In one shared worktree, multiple write-enabled workers are allowed when write scopes are disjoint, lane-local checks exist, and the expected benefit should justify child context cost.
- Treat a single broad final suite, such as `npm test`, as final integration work for the main thread, not as something every worker should run.
- Worker lanes must run lane-local checks only. Main thread runs the full final verification once.
- If a child needs to edit outside `write_scope`, it must stop and return a handoff instead of broadening itself.
- Every launched child prompt must include an absolute working directory and a
  preflight check for Read/Write targets. If the working directory is unknown or
  the lane cannot use absolute paths, hold the lane or do it in the main thread.
- If a spawn attempt fails because the selected 5.6 variant or effort is unavailable, retry once with another allowed Terra/Luna/Sol pairing justified by the lane. Never fall back outside the allowlist. Record the failure in benchmark notes. Target fork/model/reasoning failures: zero.
