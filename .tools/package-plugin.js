/**
 * Zero-Dependency Plugin Packager for Parallel Subagent Planner (v0.2.0)
 * Bundles skill assets into official Codex Plugin directory layout (.codex-plugin/plugin.json).
 */

const fs = require('fs');
const path = require('path');

function packagePlugin() {
  const rootDir = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(rootDir, 'package.json');

  let version = '0.2.0';
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (pkg.version) version = pkg.version;
  }

  const distDir = path.join(rootDir, 'dist/plugin');
  const codexPluginDir = path.join(distDir, '.codex-plugin');
  const pluginSkillDir = path.join(distDir, 'skills/parallel-subagent-planner');

  console.log(`\n--- Packaging Official Codex Plugin Bundle (v${version}) ---\n`);

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(codexPluginDir, { recursive: true });
  fs.mkdirSync(pluginSkillDir, { recursive: true });

  // Official Plugin Manifest
  const officialManifest = {
    name: "parallel-subagent-planner",
    version: version,
    description: "Cost-aware execution parallelism planner skill for Codex",
    skills: "./skills/"
  };

  fs.writeFileSync(path.join(codexPluginDir, 'plugin.json'), JSON.stringify(officialManifest, null, 2));

  // Copy essential skill assets to skills/parallel-subagent-planner/
  const filesToCopy = [
    'SKILL.md',
    'opsx-parallel.md',
    'schema/planner-plan.schema.json',
    'references/planner-details.md',
    'references/project-scale-planning.md',
    'references/runtime-compatibility.md',
    'references/long-term-agents.md',
    'references/prompt-templates.md'
  ];

  filesToCopy.forEach(relPath => {
    const src = path.join(rootDir, relPath);
    const dest = path.join(pluginSkillDir, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  });

  console.log(`✓ Official Plugin bundle packaged successfully at: ${distDir}`);
  console.log(`  - Manifest: dist/plugin/.codex-plugin/plugin.json`);
  console.log(`  - Skill Dir: dist/plugin/skills/parallel-subagent-planner/`);
  console.log(`  - Assets: ${filesToCopy.length} files included.`);
}

if (require.main === module) {
  packagePlugin();
}

module.exports = { packagePlugin };
