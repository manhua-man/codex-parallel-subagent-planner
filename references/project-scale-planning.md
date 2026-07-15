# Project-Scale Planning

Load this reference only when the Scale Gate selects project mode.

## Objective

Turn an accepted complete-software goal into an auditable execution dependency graph and launch the largest safe, worthwhile frontier. Consume existing requirements, architecture decisions, reviewed plans, and OpenSpec tasks as authoritative inputs. Do not invent product scope or replace plan review, and do not plan only the module currently under discussion.

## 1. Discover The Product Surface

Read the smallest authoritative set that exposes the full in-scope product:

- user brief, acceptance criteria, roadmap, or specification
- repository/package tree and architecture docs
- route, service, module, schema, and test registries
- current worktree state and ownership boundaries

Do not infer independent modules from folder names alone. A module must have a coherent responsibility and a lane-local acceptance signal.

If the product surface cannot be mapped cheaply, launch one read-only discovery lane. Its deliverable is the module graph, not implementation.

## 2. Build The Module Matrix

Track each in-scope module with:

| Field | Meaning |
| --- | --- |
| module | Stable capability or ownership boundary |
| owns | Runtime behavior and artifacts owned by the module |
| depends_on | Modules or contracts required before launch |
| shared_contracts | API, schema, routes, types, config, or design tokens shared with other modules |
| read_scope | First files or dirs to inspect |
| write_scope | Exclusive files or dirs the worker may modify |
| acceptance | Lane-local pass/fail evidence |
| state | `ready`, `running`, `blocked`, `integrated`, or `done` |
| held_reason | `safe`, `dependency`, `contract`, `overlap`, `unclear_scope`, `unclear_acceptance`, or `cost` |

Include all material modules in scope, even when they cannot launch in the current wave.

## 3. Assign Shared-Contract Ownership

Give every shared contract one owner before parallel implementation starts. Typical shared contracts include:

- package manifests and lockfiles
- database schema and migrations
- public API/DTO/type definitions
- global route registries and dependency injection roots
- global state/store shape
- design tokens and cross-module test fixtures

Consumers may read an accepted contract but must not edit it concurrently. If the contract is not stable, create a contract lane in Wave 0 and hold consumers.

## 4. Compute The Parallel Frontier

A module enters the current frontier only when:

- all `depends_on` modules or required contracts are integrated
- its write scope is disjoint from every other launched lane
- its acceptance check is lane-local and concrete
- the worker should not need another worker's unfinished output
- expected wall-clock or risk reduction justifies the child context cost

Ready modules outside the concurrency limit remain queued; prefer critical-path modules, then high-unblock-value modules, then low-risk independent work.

## 5. Schedule Waves

Use waves rather than launching the entire graph at once:

1. **Wave 0: contracts and skeletons** — shared interfaces, ownership, fixtures, and integration points.
2. **Wave 1+: implementation frontiers** — independent modules whose dependencies are satisfied.
3. **Integration wave** — one owner for shared routing, manifests, migrations, and cross-module wiring.
4. **Verification wave** — cross-module E2E, visual, performance, security, and release-boundary checks as applicable.

Do not force every project to have four waves. Collapse empty waves, but never skip unresolved contract ownership.

## 6. Integrate And Replan

After each wave:

1. wait for all launched lanes
2. inspect diffs and verify lane-local checks
3. integrate through the assigned contract/integration owner
4. mark module states and record failures or changed dependencies
5. recompute the frontier from the updated graph
6. launch the next minimum useful batch

If a worker discovers an undeclared dependency or needs another write scope, stop that lane and update the graph. Do not let the worker broaden itself.

Run the broad final suite once after all required modules are integrated. Run earlier cross-module checks only when they unblock or protect a later wave.

## Project-Mode Output

Return Compact by default:

1. `Scale decision`
2. `Module matrix`
3. `Dependency or contract notes`
4. `Wave plan`
5. `Current launch status`
6. `Integration and replan note`

Show ready child prompts only when requested or when a held lane needs a future handoff.

## Stop Conditions

Hold implementation and request direction when:

- product scope is materially ambiguous
- two valid architectures create different module ownership or public contracts
- a shared one-way migration or external-state change lacks authorization
- the module graph depends on unavailable credentials, environments, or teams
- concurrency would create more integration work than useful wall-clock reduction
