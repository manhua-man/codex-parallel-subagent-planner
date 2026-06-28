# Maintenance

Use this reference when updating the skill, prompt assets, fixtures, or
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

## Update Checklist

1. Keep `SKILL.md` concise. Move detailed criteria, examples, and maintenance
   notes into `references/`, `docs/`, or `examples/`.
2. Update `agents/openai.yaml` if the default behavior or user-facing summary
   changes materially.
3. Update `README.md` and `README.zh-CN.md` when repository layout or user-facing
   scope changes.
4. Add or adjust examples in `examples/fixtures.md` when the intended launch
   behavior changes.
5. Run `git diff --check`.
6. Sync the local installed skill directory.
7. Commit and push the canonical repository.

## Benchmark Notes

Benchmark snapshots in the README are historical local runs. When adding a new
snapshot, include:

- prompt group
- spawn count
- fork/model/reasoning errors
- total tokens
- estimated cost, when available
- wall-clock time
- pass/fail result
- short note on what changed in the skill since the previous snapshot

Do not claim a benchmark improvement unless the same or comparable task was run
against a baseline and the difference is visible in the recorded metrics.

## Drift Check

Before shipping a skill update, compare canonical files against the installed
skill:

```powershell
git -C C:\Users\ManHua\codex-parallel-subagent-planner status --short --branch
rg --files C:\Users\ManHua\codex-parallel-subagent-planner
rg --files C:\Users\ManHua\.codex\skills\parallel-subagent-planner
```

The installed folder may omit repository-only docs such as README files, but it
must include the same `SKILL.md`, `agents/`, `references/`, and prompt assets
that Codex needs at runtime.
