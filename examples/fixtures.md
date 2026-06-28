# Fixtures

These fixtures pin the intended behavior of the skill. They are examples for
maintainers, not scripts. Keep outputs compact and focused on launch decisions.

## 1. Not Split

Input:

```text
Rename one README heading and keep everything else unchanged.
```

Expected output shape:

```text
Why parallel
Not split. The task is small, tightly scoped, and has no useful independent
lane.

Lane summary
- Main thread: update the heading directly.

Launch status
- Launched: none

Integration note
Do it in the main thread and verify the diff.
```

## 2. Explorer First, Worker Held

Input:

```text
Split this task if useful:
- first verify current export behavior
- then unify export flow behavior
- keep behavior unchanged
- files: src/runtime/session-view-service.ts, src/extension.ts
```

Expected output shape:

```text
Why parallel
The behavior audit can de-risk implementation, but the implementation depends
on the audit result.

Lane summary
- Export behavior audit: agent type explorer, read_scope
  src/runtime/session-view-service.ts + src/extension.ts, write_scope none,
  deliverable behavior map, can_launch yes, held_reason safe.
- Export flow worker: agent type worker, read_scope same files plus audit
  handoff, write_scope src/runtime/session-view-service.ts + src/extension.ts,
  deliverable behavior-preserving refactor, can_launch no, held_reason blocked.

Launch status
- Launched: Export behavior audit
- Held: Export flow worker, because it depends on explorer findings

Integration note
Wait for the audit, then launch or handle the worker only after behavior and
acceptance checks are concrete.
```

## 3. Two Write Workers

Input:

```text
Split if useful:
- update the CLI help text in src/cli/help.ts
- update docs/usage.md to match the new help text
- run lane-local checks only
```

Expected output shape:

```text
Why parallel
Two write scopes are disjoint and each has a narrow deliverable.

Lane summary
- CLI help worker: agent type worker, read_scope src/cli/help.ts,
  write_scope src/cli/help.ts, deliverable updated help text, can_launch yes,
  held_reason safe.
- Docs usage worker: agent type worker, read_scope docs/usage.md plus CLI help
  brief, write_scope docs/usage.md, deliverable synchronized usage docs,
  can_launch yes, held_reason safe.

Launch status
- Launched: CLI help worker, Docs usage worker

Integration note
Main thread compares the two outputs and runs the broad final verification once.
```

## 4. Overlapping Write Scope

Input:

```text
Split this:
- worker A should refactor src/runtime/session.ts
- worker B should add tests but may also adjust src/runtime/session.ts
```

Expected output shape:

```text
Why parallel
Not launched as parallel write workers. The write scopes overlap around
src/runtime/session.ts.

Lane summary
- Runtime explorer: agent type explorer, read_scope src/runtime/session.ts and
  related tests, write_scope none, deliverable safe edit/test plan,
  can_launch yes, held_reason safe.
- Runtime worker: agent type worker, write_scope src/runtime/session.ts and
  tests, can_launch no, held_reason blocked.

Launch status
- Launched: Runtime explorer
- Held: Runtime worker, because safe write boundaries are not concrete yet

Integration note
Use the explorer result to choose a single bounded worker or keep the edit in
the main thread.
```

## 5. Long-Term Agent Candidate

Input:

```text
After the run, the verification lane repeatedly caught benchmark fixture drift
and produced stable evidence. Should anything be kept?
```

Expected output shape:

```text
Long-term agent candidate found:
- benchmark-fixture-steward — worth promoting because the role protects a
  recurring benchmark quality gate with stable evidence and bounded read/write
  scope.

Where it should live:
- agents/benchmark-fixture-steward.md if reusable across repositories
- .codex/agents/benchmark-fixture-steward.md if project-private

Do you want me to create this agent spec?
```

Must not:

```text
Created agents/benchmark-fixture-steward.md
```

File creation requires explicit user approval after the question.
