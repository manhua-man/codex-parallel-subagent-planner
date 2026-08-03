# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v1.0.0] - 2026-08-03

### Release Milestone — Agent Planning Harness Skill Mature Complete Stack
- **Full Roadmap Fulfilled**: Achieved the v1.0.0 milestone integrating Decomposition Intelligence, Planning State Awareness, Context Harness, Prompt Specialization, Planning Principles, and Agent Evolution into a unified Codex Parallel Planning Intelligence Layer.
- **Protocol Schema v1.6**: Machine Schema now supports complete end-to-end plan contracts with backward compatibility across all `1.x` versions (`1.0` through `1.6`).
- **Complete Reference Suite**: 12 dedicated reference assets in `references/` covering every aspect of senior engineering parallel planning.

## [v0.9.0] - 2026-08-03
- **Agent Evolution**: Implemented 5-stage agent candidate lifecycle (`Candidate` -> `Review` -> `Approved` -> `Persistent Agent` -> `Retire`) and 4 candidate quality filters (`Frequency`, `Stability`, `Boundary`, `Reuse Value`) in `references/agent-evolution.md`.
- **Machine Schema v1.6**: Added optional `lifecycle_stage` and `reuse_value` properties under `promotion_candidates`.

## [v0.8.0] - 2026-08-03
- **Planning Principles**: Formulated 5 senior-engineering principles (Parallelism Principle, Contract Ownership Principle, Minimal Lane Principle, Exploration First Principle, Main Thread Integration Principle) in `references/planning-principles.md`.
- **Machine Schema v1.5**: Added optional `planning_principles` object under root schema.

## [v0.7.0] - 2026-08-03
- **Prompt Specialization**: Added role-tailored prompt templates for Explorer, Implementer, Reviewer, and Migrator in `references/prompt-strategy.md`.
- **Machine Schema v1.4**: Added optional `prompt_spec` under `lanes`.

## [v0.6.0] - 2026-08-03
- **Context Harness**: Formalized Context Budget Engineering (Global Context, Lane Context, Noise Boundaries with `ignore_scope`) in `references/context-engineering.md`.
- **Machine Schema v1.3**: Added optional `context` object (`global_constraints`, `read_scope`, `write_scope`, `ignore_scope`).

## [v0.5.0] - 2026-08-03
- **Planning State Awareness**: Added incremental state-aware replanning (freezing completed lanes, recalculating affected downstream frontiers) in `references/planning-state.md`.
- **Machine Schema v1.2**: Added optional `planning_state` object (`completed_lanes`, `blocked_lanes`, `changed_contracts`, `frontier`).

## [v0.4.0] - 2026-08-03
- **Decomposition Intelligence**: Added Vertical Split (end-to-end capability slicing) vs. Horizontal Split (decoupled module slicing) heuristics in `references/decomposition.md`.
- **Six Lane Quality Criteria**: Added single goal, clear input, clear output, bounded scope, independent progress, and verifiable acceptance audits.
- **Machine Schema v1.1**: Added optional `split_strategy` under `decision` and `lane_quality` under `lanes`.

## [v0.3.0] - 2026-08-03
- Refactored project into a pure instruction-only Codex AI Skill asset.
- Streamlined `SKILL.md` into core sections with valid YAML frontmatter.
- Formulated Three-Layer Product Architecture (Planning Core + Machine Schema Protocol + Long-Term Agent Policy).
