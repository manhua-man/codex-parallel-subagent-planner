# Request Flow

This document shows where `parallel-subagent-planner` fits inside a Codex request. The skill is not a runtime component, local runner, Python package, CLI, or session manager. It is loaded by Codex as instructions that guide the main agent's split decision, subagent launch choices, and final integration.

## Host-Level Position

```text
User input
  |
  v
Codex CLI / app parses request
  |
  v
Codex creates or resumes agent session
  |
  +--> Load settings / skills / extensions
  |      |
  |      v
  |   parallel-subagent-planner becomes available as a skill
  |
  +--> Restore session state
  |
  +--> Assemble built-in tools
  |
  v
Agent loop
  |
  v
LLM decides whether the skill applies
  |
  +--> If not applicable: main agent handles the task directly
  |
  +--> If applicable: main agent follows the skill flow below
```

## Skill Flow

```text
User goal
  |
  v
+------------------------+
| Fast split gate        |
| strong split signal?   |
+-----------+------------+
            |
            v
     +-------------+
     | Consider?   |
     +------+------+ 
            |
      +-----+-----+
      |           |
      v yes       v no
+---------------------+    +--------------------------+
| Lane safety gate    |    | Main thread handles      |
| bounded scope /     |    | the request directly     |
| clear acceptance /  |    +--------------------------+
| useful deliverable  |
+----------+----------+
           |
           v
    +---------------+
    | Launchable?   |
    +-------+-------+
            |
      +-----+-----+
      |           |
      v yes       v no
+-----------------------+   +--------------------------+
| Build compact context |   | Hold lane, merge lane,   |
| brief and launch args |   | or keep in main thread   |
+----------+------------+   +--------------------------+
           |
           v
+-----------------------+
| Dispatch minimum safe |
| lane batch via Codex  |
| subagents             |
+----------+------------+
           |
           v
   +-------+--------+--------+
   |                |        |
   v                v        v
+---------+   +---------+  +---------+
| Lane A  |   | Lane B  |  | Lane C  |
| isolated|   | isolated|  | isolated|
+----+----+   +----+----+  +----+----+
     |             |            |
     +------+------+------------+
            |
            v
+-----------------------+
| Collect lane results  |
| findings / artifacts  |
| commands / questions  |
+----------+------------+
           |
           v
+-----------------------+
| Main-thread integrate |
| inspect diffs / merge |
| handoffs / resolve    |
| conflicts             |
+----------+------------+
           |
           v
+-----------------------+
| Final verification    |
| broad suite runs once |
| in the main thread    |
+----------+------------+
           |
           v
+-----------------------+
| Mandatory long-term   |
| agent check           |
| ask user if reusable  |
| candidate exists      |
+----------+------------+
           |
           v
Final response
```

## Responsibilities

Codex is responsible for:

- Loading the skill into context
- Providing actual subagent launch capability
- Managing sessions, tools, file access, and terminal execution
- Rendering the final answer

The skill is responsible for guiding:

- Whether subagents should be considered
- Which lanes are safe and useful enough to launch
- Which lanes should be held, merged, or kept in the main thread
- What compact context each child receives
- Which read and write scopes each child may use
- How child results are integrated and verified
- When to ask the user about promoting a reusable subagent role

## Mandatory Long-Term Agent Check

After every parallel run, the main thread checks whether any completed subagent
role is worth turning into a long-term agent. If a reusable candidate exists,
the main thread asks the user whether to promote it.

The output should report only:

- whether the role is worth promoting
- why it is worth promoting
- where the agent spec should be stored

Do not create or write `.codex/agents/` or `agents/` files until the user
explicitly approves that specific promotion.

## Non-Goals

This repository does not provide:

- A Python package
- A CLI
- A local task runner
- A session manager
- A replacement for Codex subagent launching
- Automatic `.codex/agents/` or `agents/` file creation without explicit approval
