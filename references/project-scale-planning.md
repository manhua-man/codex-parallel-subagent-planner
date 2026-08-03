# Project-Scale Planning

Use this guide when a goal spans multiple modules, services, packages, or testable capabilities, or involves building a complete product.

## Execution Workflow

1. **Discover Product Surface**: Inventory all packages, modules, routes, databases, and services within scope.
2. **Build Module Matrix**: Map each module's capabilities, dependencies, read/write scopes, and acceptance criteria.
3. **Assign Shared Contract Owners**: Assign exactly one owner lane per wave for each shared API, schema, router, or global config.
4. **Compute Parallel Frontier**: Identify lanes whose dependencies and prerequisite contracts are fully satisfied (`done` or `integrated`).
5. **Launch Wave**: Launch only ready frontier lanes within budget constraints. Hold dependent downstream modules.
6. **Integrate & Replan**: After wave completion, integrate outputs, update module statuses, and recompute the next frontier.

## Module Matrix Template

Track module work using these fields:

```text
- module: [name]
  owns: [primary capability or service]
  depends_on: [prerequisite modules or contract IDs]
  shared_contracts: [contract IDs assigned or consumed]
  read_scope: [dir/** or path/to/file]
  write_scope: [dir/** or path/to/file]
  acceptance: [checks]
  state: ready | blocked | running | integrated | done | held
  held_reason: safe | overlap | blocked | dependency | contract | unclear_scope | unclear_acceptance | verification_failed
```

## Discovery First Rule

If the project architecture or module boundaries are unclear:
- Launch ONE read-only discovery lane (`agent_type: explorer`, `write_scope: []`).
- Hold all implementation workers until the discovery lane returns a verified module matrix and dependency graph.
