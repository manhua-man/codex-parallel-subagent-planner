# Installation Guide

`parallel-subagent-planner` (v0.2.0) can be installed for personal use, included in a project workspace, or packaged as an official Codex Plugin.

## Testing Before Installation

Before installing, run the automated zero-dependency verification suite in the source repository:

```bash
npm test
```

## Standard Installation Options

### Option A: Personal Skill Installation (Recommended)

Install minimal runtime skill assets for your user account:

```bash
# Personal install path: $HOME/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js
```

Or manually copy runtime skill assets:

```bash
mkdir -p "$HOME/.agents/skills/parallel-subagent-planner"
cp -r SKILL.md opsx-parallel.md schema references docs examples "$HOME/.agents/skills/parallel-subagent-planner/"
```

### Option B: Target Project Workspace Installation

To share planner rules with team members in a target repository:

```bash
# Target path: <target-repo>/.agents/skills/parallel-subagent-planner
node .tools/install-skill.js /path/to/target-repo
```

Or manually copy runtime skill assets to the target repository:

```bash
TARGET_REPO="/path/to/target-repo"
mkdir -p "$TARGET_REPO/.agents/skills/parallel-subagent-planner"
cp -r SKILL.md opsx-parallel.md schema references docs examples "$TARGET_REPO/.agents/skills/parallel-subagent-planner/"
```

### Option C: Official Plugin Package Distribution

To package and distribute as an official Codex plugin bundle:

```bash
npm run package:plugin
```

The plugin bundle is generated in `dist/plugin/` with manifest `.codex-plugin/plugin.json` and skills directory `skills/parallel-subagent-planner/`.
