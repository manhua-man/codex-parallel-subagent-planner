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

## 6. Complete Multi-Module Application

Input:

```text
Build the complete application. It needs authentication, workspace CRUD, media
uploads, a dashboard, and end-to-end tests. Decide what can run in parallel.
```

Expected output shape:

```text
Scale decision
Project mode. The goal spans several independently testable capabilities and
must not be reduced to the first module inspected.

Module matrix
- Shared contracts: owns session/workspace/media interfaces and route skeleton,
  state ready, Wave 0, single write owner.
- Auth: depends_on shared contracts, disjoint auth scope, state blocked until
  Wave 0 passes.
- Workspace: depends_on shared contracts, disjoint workspace scope, state
  blocked until Wave 0 passes.
- Media: depends_on shared contracts, disjoint media scope, state blocked until
  Wave 0 passes.
- Dashboard: depends_on Auth + Workspace + Media, state blocked.
- E2E: depends_on integrated application, state blocked.

Wave plan
- Wave 0: Shared contracts
- Wave 1: Auth, Workspace, Media in parallel
- Wave 2: Dashboard and integration owner
- Wave 3: E2E and broad final verification

Current launch status
- Launched: Shared contracts owner only
- Held: Auth, Workspace, Media, Dashboard, E2E with dependency reasons
```

Must not:

```text
Start by implementing authentication and decide about other modules later.
```

## 7. Project Scope Requires Discovery

Input:

```text
Finish this existing SaaS product. There are many packages, but no current
architecture document. Parallelize whatever is safe.
```

Expected output shape:

```text
Scale decision
Project mode, but the module graph and shared contracts are unclear.

Current launch status
- Launched: one read-only project-surface explorer
- Held: all implementation workers, held_reason unclear_scope

Explorer deliverable
- module matrix covering all in-scope packages and capabilities
- dependency and shared-contract graph
- candidate write ownership and lane-local checks
- proposed first parallel frontier
```

Must not launch one implementation worker per top-level directory before the
explorer establishes module responsibility and dependency edges.

## 8. Shared Router And Schema Block Parallel Writes

Input:

```text
Implement account, billing, projects, and admin modules. Every module needs to
add routes and database tables. Use as many agents as useful.
```

Expected output shape:

```text
Scale decision
Project mode. Capability implementations may become independent, but the route
registry and schema are shared contracts.

Wave plan
- Wave 0: one contract owner defines route slots, schema/migration ownership,
  public types, and module-local write scopes.
- Wave 1: account, billing, projects, and admin workers may launch in parallel
  only if they no longer edit the shared router or schema files.
- Integration wave: the contract owner applies or reconciles shared wiring.
```

Must not assign the same router, migration, manifest, or shared type file to
multiple concurrent workers.

## 9. Recompute The Frontier

Input:

```text
The contract wave is complete. Auth passed, media failed its local tests, and
workspace discovered a new storage dependency. Continue the project plan.
```

Expected output shape:

```text
Integration and replan note
- Mark Auth integrated.
- Keep Media blocked on its failed local acceptance check.
- Add Storage to the module graph and hold Workspace on that dependency.
- Recompute the frontier; launch only modules whose dependencies and contracts
  still pass.
- Do not reuse the original Wave 2 plan unchanged.
```

## 10. Plan Review Owns The Decision First

Input:

```text
Run autoplan on this draft architecture, challenge the product scope, and then
parallelize whatever implementation survives review.
```

Expected output shape:

```text
Composition decision
- Autoplan owns scope and plan review first.
- Parallel Subagent Planner does not dispatch implementation while review
  decisions are unresolved.
- After approval, consume the accepted implementation steps, build the
  execution dependency graph, and schedule the current frontier.
```

Must not run autoplan and implementation workers concurrently against an
unapproved plan.

## 11. OpenSpec Tasks Are Authoritative

Input:

```text
This repository has an active OpenSpec change with proposal, design, and tasks.
Use subagents to continue implementation.
```

Expected output shape:

```text
Composition decision
- Keep `openspec-apply-change` as the governing workflow for task selection and
  checkbox/status updates.
- Read the active change and treat its pending tasks as the implementation
  scope and lane inputs.
- Preserve OpenSpec artifact ownership and do not create a second task state.
- Map task dependencies and write scopes, then launch only the current safe
  frontier.
- Do not regenerate proposal/design/tasks or invent a parallel task list that
  competes with OpenSpec.
```

## 12. Resolve The Desktop Launch Adapter

Input:

```text
The generic spawn_agent tool has no model or effort fields, but Codex Desktop
also exposes create_thread with model and thinking. Launch the approved lane
with gpt-5.6-luna and high reasoning.
```

Expected output shape:

```text
Launch adapter decision
- Do not use generic spawn_agent for this Planner lane.
- Use create_thread with model gpt-5.6-luna and thinking high.
- Send only the compact Context Brief to the new project-local/background task.
- Do not hold the lane merely because one different adapter lacks routing fields.
```

Must hold only when no authorized host adapter can pass both an allowlisted model
and explicit effort.
