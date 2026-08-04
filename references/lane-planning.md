# Lane Planning & Ready Gate

Use this reference when evaluating task decomposition, checking scope safety, or auditing lane readiness.

## 1. Slicing Strategies

Choose between **Vertical Split** and **Horizontal Split** based on codebase structure and component coupling:

- **Vertical Split (End-to-End Feature Slicing)**: Groups UI, API routes, DTOs, and tests for a single user feature into one capability lane (e.g., `user-profile-capability`). Recommended for product feature requests to eliminate inter-agent deadlocks (where Frontend waits for Backend waiting for Tests).
- **Horizontal Split (Decoupled Module Slicing)**: Separates distinct, independent packages or microservices (e.g., Payment vs. Notification vs. Search) operating on disjoint directories.

Choose dynamically: prefer Vertical Split for user feature requests, and Horizontal Split when packages are strictly decoupled. When boundaries are ambiguous, launch ONE read-only `explorer` lane first.

---

## 2. Lane Ready Gate

A candidate lane must NEVER be launched until it passes the Lane Ready Gate by defining all 6 canonical lane fields:

```text
ID:           [Unique string identifier]
Role:         [explorer | implementer | reviewer | migrator]
Goal:         [Single narrow outcome]
Read:         [Canonical file paths or subtrees to inspect]
Write:        [Exact file paths or subtrees allowed for edits, or none]
Ignore:       [Noise boundaries and sibling lane directories]
Deliverable:  [Concrete code change or audit report]
Depends on:   [Prerequisite lane IDs or completed contracts]
Acceptance:   [Objective pass/fail test or verification check]
State:        [ready | running | blocked | integrated | done | held]
Hold reason:  [overlap | dependency | contract | unclear_scope | verification_failed]
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
- **Write-Read Isolation**: `write(A) ∩ read(B) = ∅`. A lane in the same wave must never read files currently being modified by another lane (unless reading a frozen, versioned contract).

---

## 4. Shared Contract Single Owner Rule

Every shared API, database schema, route registry, migration, or global config must have **exactly ONE owner lane per wave**.
- The contract owner lane modifies and freezes the contract specification.
- Consumer lanes may read the frozen contract but MUST NOT edit contract files concurrently.

---

## 5. Hold Conditions

Hold a candidate lane (`state: held`) when any condition is met:
1. Write scope overlaps with another ready worker (`held_reason: overlap`).
2. Read scope conflicts with another ready worker's write scope (`held_reason: overlap`).
3. Depends on an unfinished investigation, explorer lane, or contract wave (`held_reason: dependency`).
4. Scope boundary or acceptance criteria are vague or unverified (`held_reason: unclear_scope`).
