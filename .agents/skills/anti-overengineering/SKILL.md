---
name: anti-overengineering
description: >-
  Strict governance guardrail for AI coding agents. Prevents over-engineering,
  pseudo-framework inflation, fake state machines, 10+ field bureaucracy, and
  unsubstantiated rule propagation when designing skills or building software features.
---

# Anti-Overengineering Guardrail (Matt Pocock Style)

Enforce pragmatic, unbloated AI engineering. Never build pseudo-frameworks in Markdown, simulate runtime code, or invent bureaucratic rules.

## The 5 Anti-Inflation Invariants

1. **Anti-Pseudo-Framework**
   - Never design state machines (`ready/running/done/integrated/blocked/held`), fake databases, or process handles (`spawn/kill`) inside Markdown prompts.
   - If a feature requires C++/Python/TypeScript execution code, do NOT simulate it inside text files.

2. **Strict Line Count Budget**
   - Main `SKILL.md` MUST stay under 80 lines. Single reference files MUST stay under 50 lines.
   - When exceeding budget, prune fluff instead of creating nested sub-files.

3. **Negative Constraints Over Bureaucracy**
   - Constrain AI behavior using crisp negative invariants (e.g., `write(A) ∩ write(B) = ∅`), NEVER 10+ field mandatory bureaucratic tables.

4. **No Empirical Evidence, No Rule**
   - Never invent Enums, Filters, or Policy options based on imagined scenarios.
   - Only add a rule when backed by concrete failure logs from actual coding runs.

5. **User Utility First**
   - Every single line in a skill or prompt must directly improve code quality, reduce bug risk, or speed up wall-clock execution.

---

## Pre-Flight Self-Audit Checklist for AI Agents

Before delivering any plan, skill, or architectural design, audit against this checklist:

- [ ] **Am I simulating a backend software framework inside a text prompt?** *(If YES ➔ Delete it immediately)*
- [ ] **Did I invent Enums, State Machines, or Policy options that no execution code runs?** *(If YES ➔ Delete them immediately)*
- [ ] **Is this design small, easy to adapt, and composable?** *(If NO ➔ Simplify it immediately)*
- [ ] **Does every rule address a real failure mode?** *(If NO ➔ Remove it immediately)*
- [ ] **Is SKILL.md under 80 lines?** *(If NO ➔ Prune unnecessary text)*
