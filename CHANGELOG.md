# Changelog

All notable changes to the `parallel-subagent-planner` skill will be documented in this file.

## [v3.0.1] - 2026-08-05

### Patch Release — Pragmatic Refinements & Output Standardization
- **Decoupled Read-Only Investigation**: Separated read-only Explorer rules from parallel implementation write-isolation criteria.
- **Purged State Machine Residuals**: Replaced `blocked` and `frozen` terms with natural, step-by-step behavioral execution directives.
- **Flexible Contract Ownership**: Extended shared contract file ownership to support either the main thread or a subagent.
- **Minimal Output Specification**: Added standardized `## 5. Output` section (`Decision`, `Order`, `Subagents`, `Integration`).
- **Text & Metadata Consistency**:
  - Updated `agents/openai.yaml` short description and default prompt.
  - Updated Core Cycle in README docs to `Decide ➔ Split ➔ Isolate ➔ Order ➔ Prompt ➔ Integrate`.
  - Removed non-coding disclaimer from frontmatter.

## [v3.0.0] - 2026-08-05

### Major Release — Pure Pragmatic Planning Skill (Breaking Refactor)
- **Purged Pseudo-Engineering Bloat**:
  - Removed state machine systems (`ready`, `running`, `done`, `integrated`, `blocked`, `held`).
  - Removed anti-scope disclaimers ("Four Hard Boundaries", "No Physical Runtime").
  - Removed 12-field Ready Gate bureaucracy.
  - Removed simulated evolution engines (`promotion_check: silent/ask/off` policies & 4 Quality Filters).
- **Consolidated References (5 Assets -> 2 Assets)**:
  - `references/lane-decomposition.md`: Task slicing, scope isolation, and shared contract execution order.
  - `references/child-prompts.md`: Subagent prompt templates, directive examples, and custom agent `.toml` guidance.
- **Streamlined SKILL.md**: Reduced to ~50 lines of clean, pragmatic instructions focused 100% on real cognitive value.

## [v2.0.10] - 2026-08-05
- Refined role metadata table and read-only sandboxing wording.

## [v2.0.0] - 2026-08-04
- Refactored repository into Lean Agent Planning Harness Skill.
