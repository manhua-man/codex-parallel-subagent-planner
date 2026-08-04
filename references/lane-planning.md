# Lane Planning & Ready Gate

Use this reference when evaluating task decomposition, checking scope safety, or auditing lane readiness.

## 1. Slicing Strategies

Choose between **Vertical Split** and **Horizontal Split** based on codebase structure and component coupling:

- **Vertical Split (End-to-End Feature Slicing)**: Groups UI, API routes, DTOs, and tests for a single user feature into one capability lane (e.g., `user-profile-capability`). Recommended for product feature requests to eliminate inter-agent deadlocks (where Frontend waits for Backend waiting for Tests).
- **Horizontal Split (Decoupled Module Slicing)**: Separates distinct, independent packages or microservices (e.g., Payment vs. Notification vs. Search) operating on disjoint directories.

Choose dynamically: prefer Vertical Split for user feature requests, and Horizontal Split when packages are strictly decoupled. When boundaries are ambiguous, launch ONE read-only `explorer` lane first.

---

## 2. Lane Ready Gate

A candidate lane must NEVER be launched until it passes the Lane Ready Gate by defining all 6 canonical Ready Gate fields alongside essential Control Metadata:

```text
-- Six Ready Gate Fields (Prerequisites for Launch) --
Goal:             [Single narrow outcome]
Read:             [Canonical file paths or subtrees to inspect]
Write:            [Exact file paths or subtrees allowed for edits, or none]
Deliverable:      [Concrete code change or audit report]
Depends on:       [Prerequisite lane IDs or frozen contract IDs]
Acceptance:       [Objective pass/fail test or verification check]

-- Six Control Metadata Fields (Planner Management) --
ID:               [Unique string identifier]
Role:             [explorer | implementer | reviewer | migrator]
Ignore:           [Noise boundaries and sibling lane directories]
Model profile:    [deep | balanced | fast]
State:            [ready | running | blocked | integrated | done | held]
Reason:           [blocked_reason | held_reason | null]
```

Every Ready Lane satisfies:
1. **Single Goal**: One narrow, non-ambiguous objective (`Goal`).
2. **Known Input**: Explicit files or prerequisite artifacts required (`Read`, `Depends on`).
3. **Known Output**: Concrete deliverable artifact (`Deliverable`).
4. **Bounded Scope**: Disjoint read and write scopes (`Read`, `Write`, `Ignore`).
5. **Independent Progress**: No blocking dependencies on unfinished sibling lanes in the same wave (`Depends on`).
6. **Verifiable Acceptance**: Objective test or audit check (`Acceptance`).

---

## 3. Scope Collision & Safety Invariants

Frontier safety collision rules enforced in every wave:
- **Write-Write Isolation**: `write(A) ∩ write(B) = ∅`. Two lanes in the same wave must never edit overlapping files or subtrees.
- **Write-Read Isolation**: `write(A) ∩ read(B) = ∅`. A lane in the same wave must never read files currently being edited by another lane (unless reading a frozen, versioned contract).

---

## 4. Shared Contract Single Owner Rule

Every shared API, database schema, route registry, migration, or global config must have **exactly ONE owner lane per wave**.
- The contract owner lane modifies and freezes the contract specification (`draft ➔ frozen`).
- Consumer lanes may read the frozen contract once published, but MUST NOT edit contract files concurrently.
- Downstream consumer lanes may launch as soon as referenced shared contracts reach `frozen` status.

---

## 5. State Flow, Blocked vs. Held & Reason Naming

### State Flow Cycle
- **Normal Flow**: `ready ➔ running ➔ done ➔ integrated`
- **Exceptions**: `ready/running ➔ blocked`, `ready ➔ held`, `blocked/held ➔ ready`

### Blocked vs. Held Definitions
- **`blocked`**: Objective impossibility to proceed (prerequisite lane not integrated, referenced contract not frozen, verification failed, missing input).
- **`held`**: Lane is ready to execute, but Planner holds it temporarily due to policy or resource limits (concurrency budget reached, parallel benefit too low, low priority conflict).

### Standardized Reason Enum Values

#### `blocked_reason`
- `dependency`: Waiting on prerequisite lanes to reach `integrated` state.
- `contract`: Waiting on referenced shared contracts to reach `frozen` state.
- `unclear_scope`: Write scope boundaries or target file paths are ambiguous.
- `unclear_acceptance`: Acceptance criteria or verification commands are missing or non-verifiable.
- `verification_failed`: Lane-local checks or integration tests failed.

#### `held_reason`
- `concurrency_budget`: Ready lanes exceed current host concurrency limits.
- `low_parallel_benefit`: Parallel wall-clock savings do not justify integration overhead.
- `scheduling_conflict`: Temporary scheduling conflict with another ready lane.
