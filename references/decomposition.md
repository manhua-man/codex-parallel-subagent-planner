# Decomposition Intelligence

Use this reference when evaluating how to slice an accepted implementation goal into well-bounded execution lanes.

## Core Slicing Strategies

High-quality decomposition avoids artificial boundaries that cause inter-lane deadlocks. Choose between **Vertical Split** and **Horizontal Split** based on codebase structure and component coupling.

```text
┌────────────────────────────────────────────────────────┐
│                   Vertical Split                       │
│    (End-to-End User Capability Slicing)                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ User Profile Capability Lane                     │  │
│  │   ├── UI Components (src/components/profile/*)  │  │
│  │   ├── API Routes (src/api/profile/*)             │  │
│  │   └── Tests (test/profile/*)                     │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                  Horizontal Split                      │
│       (Decoupled Module Slicing)                       │
│                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ Payment Service │ │ Notification Svc│ │Search Svc│  │
│  └─────────────────┘ └─────────────────┘ └──────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 1. Vertical Split (End-to-End Capability Slicing)

### What it is
Groups the UI components, API routes, database access, and tests for a single end-to-end user capability into one lane.

### When to use
- Building a user-facing feature or product capability (e.g., User Profile, Checkout Flow, Authentication).
- Frontend, Backend, and Tests for the feature are tightly coupled and developed together.
- Prevents artificial deadlocks where a Frontend Lane waits for a Backend Lane while a Test Lane waits for both.

### Trade-offs
- **Pros**: Zero inter-lane waiting within the feature; single lane delivers an end-to-end working capability.
- **Cons**: Scope is larger than a single file; requires clear write scope boundaries (`src/features/profile/**`).

---

## 2. Horizontal Split (Decoupled Module Slicing)

### What it is
Separates distinct, independent modules or services into parallel lanes operating on disjoint directories or packages.

### When to use
- Work spans multiple independent microservices, packages, or decoupled modules (e.g., Payment Module vs. Notification Module vs. Search Indexer).
- Modules have zero shared file edits and communicate via established, frozen contracts.
- Refactoring or creating separate standalone utility packages.

### Trade-offs
- **Pros**: Maximum parallelism across completely independent codebase areas.
- **Cons**: Requires strict contract isolation; if shared files are touched, lanes will block.

---

## 3. Dynamic Strategy Selection Heuristic

Evaluate the codebase structure dynamically:
1. **Single Feature Request** ➔ Use **Vertical Split** (Group UI, API, DTOs, and tests into one feature capability lane).
2. **Multi-Module / Multi-Package Request** ➔ Use **Horizontal Split** across independent packages, combined with **Vertical Split** inside each package.
3. **Unclear Boundaries** ➔ Launch ONE read-only Discovery lane (`agent_type: explorer`) to map coupling before choosing the split strategy.

---

## The Six Lane Quality Criteria

Every candidate lane MUST pass the following six quality audits before being approved for launch:

1. **Single Goal**: The lane has exactly one narrow, unambiguous outcome (e.g., "Implement User Profile capability including API, UI, and test suite").
2. **Clear Input**: Explicit input files, requirements, or handoff artifacts are available before launch.
3. **Clear Output**: Well-defined deliverable artifact or concrete code changes.
4. **Bounded Scope**: Canonical `read_scope` and `write_scope` satisfying strict isolation (`write(A) ∩ write(B) = ∅`, `write(A) ∩ read(B) = ∅`).
5. **Independent Progress**: The lane can proceed in the current wave without waiting on uncompleted sibling lanes.
6. **Verifiable Acceptance**: Automated or objective pass/fail test command (e.g., `npm run test:profile`).
