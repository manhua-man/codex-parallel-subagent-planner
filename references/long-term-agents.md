# Long-Term Agent Candidates

Use this reference after a parallel run when deciding whether a completed
subagent role should become a long-term agent. Promote recurring role templates,
not temporary child-agent instances or their transient conversation context.

This reference is advisory until the user explicitly approves file creation.
If a reusable candidate exists, ask whether to promote it; do not create or
write persistent agent files from this judgment alone.

## Core Rule

Make long-term agents rare. A persistent agent is justified only when it
captures a recurring quality gate or stewardship responsibility that will save
future orchestration work and can be verified with stable evidence.

Do not preserve a child agent instance. Preserve a short role specification
that can be launched fresh with bounded scope.

Creation rule: recommend first, write later. A phrase like "this is worth
long-term use" is not permission to create `.codex/agents/` or `agents/`
files.

## Promotion Criteria

Promote when all are true:

- The same class of work will recur across multiple tasks or releases.
- The role has a stable chain of ownership, such as `source -> transform ->
  verify`, or a stable boundary, such as public surface, storage invariant, or
  benchmark quality.
- The role can work from explicit read/write scopes and objective checks.
- The output shape is repeatable: findings, benchmark evidence, invariant
  status, patch summary, or verification results.
- Keeping the role reduces future planning cost without adding user-facing
  surface, modes, or compatibility promises.
- The role can be launched with fresh context; it does not need stale memory
  from a previous child thread.

## Rejection Criteria

Do not promote when any are true:

- The subagent was a one-off implementation worker.
- The role is a generic "coder", "fixer", "researcher", or "architect" with
  no stable boundary.
- The task was a small docs/config/ledger edit.
- The role overlaps heavily with another proposed long-term role and can be
  combined into one steward.
- The role would carry project secrets, private architecture debt, customer
  details, or temporary task context into a public template.
- The only evidence is that the worker was useful once.

## Consolidation Rule

Prefer one steward role when multiple candidate agents guard the same quality
chain. For example, benchmark maintenance and storage invariant auditing can be
one role if they both protect a single read path:

```text
canonical truth -> derived index -> optional acceleration -> public read result
```

Split only when responsibilities have different owners, different checks, or
conflicting write scopes.

## Suggested Storage Locations

For project-private roles:

```text
.codex/agents/<role-name>.md
```

Keep `.codex/` ignored if the role contains project-specific strategy, private
debt, or internal operating notes.

For open-source reusable roles:

```text
agents/<role-name>.md
```

Public roles must be generic, must not mention private projects, and must not
require proprietary tools.

Only create either location after explicit user approval. Without approval,
include it as a suggested path in the decision output.

## Minimal Agent Spec

````text
# [Role Name]

Purpose:
[One sentence explaining the recurring stewardship or verification job.]

Scope:
[Stable chain or boundary this role owns.]

Responsibilities:
- [Recurring check or evidence]
- [Recurring benchmark/invariant/public-surface guard]
- [Expected output]

Non-Goals:
- [What this role must not own]
- [What should stay in the main thread or temporary workers]

Default Checks:
```bash
[targeted command]
```

Prompt Template:
```text
Goal: [audit/improve/verify the named boundary]
Working directory: [absolute repo path]
Read: [stable first-read scope]
Write: [none or explicitly assigned files]
Acceptance: [objective evidence]
Hard boundary: [no expansion rules]
Verification: [targeted checks]
Do not split, delegate, launch subagents, or run orchestration.
```

Output Shape:
```text
Boundary reviewed:
Evidence:
Regressions or risks:
Recommended next action:
Verification run:
```
````

## Decision Output

When a candidate exists, ask the user with this shape:

```text
Long-term agent candidate found:
- [role name] — [why it is worth promoting]

Where it should live:
- [path]

Do you want me to create this agent spec?
```

When candidates should not be promoted, report briefly:

```text
No long-term agent candidates worth promoting.
Reason: [one sentence]
```
