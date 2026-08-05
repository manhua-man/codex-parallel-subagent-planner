# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v3.0.0] - 2026-08-05

### Major Release — Pure Pragmatic Planning Skill (Breaking Refactor)
- **Purged Pseudo-Engineering Bloat**:
  - Removed state machine systems (`ready`, `running`, `done`, `integrated`, `blocked`, `held`).
  - Removed anti-scope disclaimers ("Four Hard Boundaries", "No Physical Runtime").
  - Removed 12-field Ready Gate bureaucracy.
  - Removed simulated evolution engines (`promotion_check: silent/ask/off` policies & 4 Quality Filters).
- **v3.0.0 Refinements**:
  - Decoupled read-only investigation rules from parallel implementation write isolation.
  - Replaced residual state terms (`blocked`, `frozen`) with behavioral execution directives.
  - Extended shared contract ownership to support either the main thread or a subagent.
  - Standardized minimal output format specification (`Decision`, `Order`, `Subagents`, `Integration`).
  - Updated `agents/openai.yaml` metadata and default prompt to align with v3 capabilities.
  - Updated Core Cycle in README docs to `Decide ➔ Split ➔ Isolate ➔ Order ➔ Prompt ➔ Integrate`.
- **Consolidated References (5 Assets -> 2 Assets)**:
  - `references/lane-decomposition.md`: Task slicing, scope isolation, and shared contract execution order.
  - `references/child-prompts.md`: Subagent prompt templates, directive examples, and custom agent `.toml` guidance.
- **Streamlined SKILL.md**: Reduced to ~50 lines of clean, pragmatic instructions focused 100% on real cognitive value (Split decision, file scope isolation, execution order, clean prompts, minimal output, main thread integration).

## [v2.0.10] - 2026-08-05
- Refined role metadata table and read-only sandboxing wording.

## [v2.0.0] - 2026-08-04
- Refactored repository into Lean Agent Planning Harness Skill.
