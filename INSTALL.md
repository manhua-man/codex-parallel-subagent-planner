# Installation Guide

`parallel-subagent-planner` (v0.2.0) can be installed for personal use, included in a repository workspace, or packaged as a plugin.

## Standard Installation Options

### Option A: Personal Skill Installation (Recommended)

Install the skill for your user account so it is available across all projects:

```bash
# Target path: $HOME/.agents/skills/parallel-subagent-planner
mkdir -p "$HOME/.agents/skills/parallel-subagent-planner"
cp -r . "$HOME/.agents/skills/parallel-subagent-planner"
```

On Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\.agents\skills\parallel-subagent-planner"
Copy-Item -Recurse -Force .* "$HOME\.agents\skills\parallel-subagent-planner"
```

### Option B: Project Workspace Installation

To share planner rules with all team members working in a specific repository:

```bash
# Target path: <repo>/.agents/skills/parallel-subagent-planner
mkdir -p .agents/skills/parallel-subagent-planner
cp -r . .agents/skills/parallel-subagent-planner
```

### Option C: Plugin Package Distribution

To package and distribute as a plugin bundle:

```bash
npm run package:plugin
```

The output bundle will be generated in `dist/plugin/` with `plugin-manifest.json`.

## Verification

After installation, verify skill integrity by running:

```bash
npm test
```
