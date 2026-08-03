# Project-Scale Planning

Load this reference only when the Scale Gate selects project mode.

## Objective

Turn an accepted complete-software goal into an auditable execution dependency graph and launch the largest safe, worthwhile frontier. Consume existing requirements, architecture decisions, reviewed plans, and OpenSpec tasks as authoritative inputs. Do not plan only the module currently under discussion.

## 1. Discover The Product Surface

Read the smallest authoritative set that exposes the full in-scope product:

- user brief, acceptance criteria, roadmap, or specification
- repository/package tree and architecture docs
- route, service, module, schema, and test registries
- current worktree state and ownership boundaries

If the product surface cannot be mapped cheaply, launch one read-only discovery lane (`fast` model profile). Its deliverable is the module graph, not implementation.

## 2. Shared-Contract Ownership

Assign every shared contract exactly one owner before parallel implementation starts. Typical shared contracts include:

- package manifests and lockfiles
- database schema and migrations
- public API / DTO / type definitions
- global route registries
- design tokens and shared test fixtures

Consumers may read an accepted contract but must not edit it concurrently. If the contract is unstable, assign a contract lane in Wave 0 and hold consumers.

## 3. Budgeting & Value-Based Frontier Calculation

Compute the parallel frontier by ranking ready modules using cost budgets and priority scores:

```yaml
budget:
  max_concurrency: 3
  max_write_lanes: 2
  cost_profile: balanced
```

Priority score calculation:

```text
launch_score = critical_path_weight + unblock_value + risk_reduction + wall_clock_saved - integration_cost - context_cost
```

A module enters the ready frontier only when:
- all `depends_on` modules and contracts are integrated (`state: done` or `integrated`)
- its `write_scope` is disjoint from every other launched lane
- its acceptance checks are lane-local and non-empty
- `launch_score` ranks within `max_concurrency`

## 4. Wave Scheduling

1. **Wave 0: Contracts & Skeletons** — shared interfaces, public API schema, migrations, routes.
2. **Wave 1+: Implementation Frontiers** — independent modules whose dependencies are satisfied.
3. **Integration Wave** — shared routing, manifests, and cross-module wiring.
4. **Verification Wave** — cross-module E2E, visual, performance, and release-boundary checks.

## 5. Schema Validation

Project plans must conform to `schema/planner-plan.schema.json`. Ensure:
- No cyclic dependencies in `lanes[].depends_on`.
- Every shared contract in `contracts[]` has exactly one owner in `lanes[]`.
- No two ready/launched lanes share overlapping `write_scope` elements.
- `frontier[]` lists exactly the ready lanes selected for current wave launch.
