# Maintenance Guide

Use this reference when updating the skill, prompt assets, fixtures, schema, evals, docs, or compatibility rules.

## Source Of Truth & Canonical Paths

The canonical repository is:

```text
https://github.com/manhua-man/codex-parallel-subagent-planner
```

Installation paths:
- Personal skill: `$HOME/.agents/skills/parallel-subagent-planner`
- Project skill: `<repo>/.agents/skills/parallel-subagent-planner`
- Plugin package: Plugin distribution bundle

## Content Ownership

| File / Path | Ownership |
| --- | --- |
| `SKILL.md` | Normative scale gate, composition boundary, launch protocol, and hold rules |
| `references/project-scale-planning.md` | Normative project-mode module graph, contracts, frontier, waves, and replanning |
| `references/planner-details.md` | Normative lane fields, budget scoring, model profiles, and hold mechanics |
| `references/runtime-compatibility.md` | Host capability mappings, model profile translations, and adapter rules |
| `references/prompt-templates.md` | Prompt wording only; do not introduce new planning rules |
| `schema/planner-plan.schema.json` | Normative structured plan output schema |
| `evals/cases.json` | Executable behavioral test cases converted from fixtures |
| `docs/request-flow*.md` | Explanatory flow mirrors; do not introduce policy absent from normative files |
| `README*.md` | User-facing summary and examples |
| `opsx-parallel.md` | Thin invocation wrapper |

## Automated Maintenance Checklist

Before committing or releasing updates, run the automated validation suite:

```bash
npm run test:drift      # Validate YAML/TOML syntax, link integrity, language parity
npm run validate:plan   # Validate example plans against JSON schema & 8 invariants
npm run test:evals      # Execute behavioral evals (zero unsafe launches assert)
npm run package:plugin  # Verify plugin packaging build
npm test                # Run full automated verification suite
```

## Local Sync & Drift Verification

Sync canonical workspace files to local agent skill folder:

```powershell
# Sync repository skill files to local agents directory
git status --short
npm test
```
