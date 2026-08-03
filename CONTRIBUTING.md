# Contributing to Parallel Subagent Planner

Thank you for contributing to `codex-parallel-subagent-planner`!

## Development Workflow

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/manhua-man/codex-parallel-subagent-planner.git
   cd codex-parallel-subagent-planner
   ```

2. Run automated validation:
   ```bash
   npm test
   ```

3. Adding or updating behavioral fixtures:
   - Update `examples/fixtures.md` to document intended human-readable behavior.
   - Update `evals/cases.json` with corresponding structured test assertions.
   - Verify zero unsafe launches with `npm run test:evals`.

4. Schema & Validator changes:
   - Update `schema/planner-plan.schema.json` if plan fields change.
   - Update `scripts/validate-plan.js` to enforce new safety invariants.

5. Submitting a Pull Request:
   - Ensure `npm test` passes cleanly.
   - Ensure `npm run test:drift` returns zero errors.
   - Open a PR describing your changes.
