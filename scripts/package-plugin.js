/**
 * Plugin Packager for Parallel Subagent Planner (v0.2.0)
 * Bundles skill assets into a plugin manifest and package distribution folder.
 */

const fs = require('fs');
const path = require('path');

function packagePlugin() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist/plugin');

  console.log(`\n--- Packaging Plugin Bundle (v0.2.0) ---\n`);

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const manifest = {
    name: "parallel-subagent-planner",
    version: "0.2.0",
    description: "Cost-aware execution parallelism planner skill for Codex (Planner Contract v0.2.0)",
    author: "manhua-man",
    entry: "SKILL.md",
    schema: "schema/planner-plan.schema.json",
    capabilities: ["explicit_model", "explicit_reasoning", "isolated_context", "read_only_agent"],
    profiles: {
      deep: "gpt-5.6-sol",
      balanced: "gpt-5.6-terra",
      fast: "gpt-5.6-luna"
    }
  };

  fs.writeFileSync(path.join(distDir, 'plugin-manifest.json'), JSON.stringify(manifest, null, 2));

  // Copy essential plugin assets
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
    const dest = path.join(distDir, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  });

  console.log(`✓ Plugin bundle packaged successfully at: ${distDir}`);
  console.log(`  - Manifest: dist/plugin/plugin-manifest.json`);
  console.log(`  - Assets: ${filesToCopy.length} files included.`);
}

if (require.main === module) {
  packagePlugin();
}

module.exports = { packagePlugin };
