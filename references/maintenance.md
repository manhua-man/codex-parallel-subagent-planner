# Maintenance

Use this reference when updating the skill, prompt assets, fixtures, docs, or
benchmark notes.

## Source Of Truth

The canonical source is:

```text
https://github.com/manhua-man/codex-parallel-subagent-planner
```

The local installed skill lives at:

```text
C:\Users\ManHua\.codex\skills\parallel-subagent-planner
```

After changing the repository, sync the installed skill directory from the
canonical repository so Codex uses the same `SKILL.md` and references that were
committed.

## Content Ownership

Keep one normative owner for each rule family:

| File | Ownership |
| --- | --- |
| `SKILL.md` | Normative scale gate, composition boundary, launch protocol, and hold rules |
| `references/project-scale-planning.md` | Normative project-mode module graph, contracts, frontier, waves, and replanning |
| `references/planner-details.md` | Normative lane fields, cost, model, and hold mechanics |
| `references/prompt-templates.md` | Prompt wording only; do not introduce new planning rules |
| `examples/fixtures.md` | Behavioral regression examples; do not become a second specification |
| `docs/request-flow*.md` | Explanatory flow mirrors; do not introduce policy absent from normative files |
| `README*.md` | User-facing summary and examples; link to normative sources for detail |
| `opsx-parallel.md` | Thin invocation wrapper only |

When two files disagree, fix the normative owner first, then update mirrors. Do not resolve drift by copying the same full rule into every file.

## Update Checklist

1. Keep `SKILL.md` concise. Move detailed criteria, examples, and maintenance
   notes into `references/`, `docs/`, or `examples/`.
2. Keep `opsx-parallel.md` as a thin command wrapper. Do not duplicate the full
   launch protocol there; `SKILL.md` is the source of truth.
3. Update `agents/openai.yaml` if the default behavior or user-facing summary
   changes materially.
4. Update `README.md` and `README.zh-CN.md` when repository layout or user-facing
   scope changes.
5. Add or adjust examples in `examples/fixtures.md` when the intended launch
   behavior changes.
6. Update `docs/request-flow.md` first when request flow changes, then mirror
   the same semantic change into `docs/request-flow.zh-CN.md`.
7. Audit trigger overlap with product/plan review, OpenSpec, and backend-router skills whenever the description or project mode changes.
8. Search for conflicting copies of changed rules across README, docs, references, fixtures, and wrappers.
9. Run `git diff --check`.
10. Sync the local installed skill directory.
11. Commit and push the canonical repository.

## Benchmark Notes

Benchmark snapshots and their recording rules live only in
`references/benchmarks.md`. Read that file before adding or interpreting a
snapshot; do not copy its metric contract into maintenance docs.

## Drift Check

Before shipping a skill update, compare canonical files against the installed
skill:

```powershell
git -C C:\Users\ManHua\codex-parallel-subagent-planner status --short --branch
rg --files C:\Users\ManHua\codex-parallel-subagent-planner
rg --files C:\Users\ManHua\.codex\skills\parallel-subagent-planner
```

The installed folder may omit repository-only docs such as README files, but it
must include the same `SKILL.md`, `agents/`, `references/`, `docs/`, `examples/`,
and prompt assets that Codex may need at runtime or during maintenance.
