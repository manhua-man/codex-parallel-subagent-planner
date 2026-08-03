# Request Flow (v0.2.0)

This document shows where `parallel-subagent-planner` fits inside a Codex request flow as a **Planner Contract (v0.2.0)** execution-parallelism skill.

## Host-Level Position

```text
User input
  |
  v
Codex CLI / Desktop / App parses request
  |
  v
Codex creates or resumes agent session
  |
  +--> Load skills ($HOME/.agents/skills or .agents/skills)
  |      |
  |      v
  |   parallel-subagent-planner loaded into context
  |
  +--> Restore session state
  |
  v
Agent loop
  |
  v
LLM decides whether the skill applies
  |
  +--> If not applicable: main agent handles task directly
  |
  +--> If applicable: main agent executes planner flow below
```

## Skill Flow

```text
User goal
  |
  v
+--------------------------+
| Scale gate               |
| bounded task or project? |
+------------+-------------+
             |
       +-----+------+
       |            |
       v task       v project
+----------------+  +--------------------------+
| Fast split     |  | Discover modules,        |
| gate           |  | dependencies, contracts  |
+-------+--------+  +------------+-------------+
        |                        |
        |                        v
        |            +--------------------------+
        |            | Assign contract owners   |
        |            | & wave scheduling        |
        |            +------------+-------------+
        +-------------------------+
                                  |
                                  v
+-------------------------------------------------------+
| Capability & Safety Gate                              |
| - required_capabilities (isolated_context, etc.)      |
| - model_profile (deep | balanced | fast)             |
| - budget bounds & priority launch_score               |
+-------------------------+-----------------------------+
                          |
                          v
+-------------------------------------------------------+
| Planner Contract Validation                           |
| Validate structured plan against JSON Schema &        |
| 8 safety invariants (write overlap, dependencies)     |
+-------------------------+-----------------------------+
                          |
                          v
+-------------------------------------------------------+
| Output Mode Generation                                |
| - Compact (User default)                              |
| - Explain (Diagnostic view)                           |
| - Machine (Strict JSON schema output)                 |
+-------------------------------------------------------+
```

## Responsibilities

Codex is responsible for:
- Session management, tool access, file I/O, terminal execution.
- Isolated child thread lifecycle (`isolated_context: required`).
- Execution of child prompts.

The skill is responsible for:
- Task vs Project scale classification.
- Module matrix discovery, shared contract ownership, wave frontier calculation.
- Model profile (`deep`, `balanced`, `fast`) and reasoning profile selection.
- Budgeting constraints and priority scoring (`launch_score`).
- Structured JSON plan generation conforming to `schema/planner-plan.schema.json`.
- Enforcing safety invariants and outputting `Compact`, `Explain`, or `Machine` formats.
- Evaluating long-term agent candidates with a default `promotion_check: silent` policy.
