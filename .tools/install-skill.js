/**
 * Zero-Dependency Safe Minimal Runtime Skill Installer for Parallel Subagent Planner (v0.2.0)
 * Safely installs ONLY runtime skill assets to user ($HOME/.agents/skills) or project (<target-repo>/.agents/skills).
 */

const fs = require('fs');
const path = require('path');

function installSkill() {
  const targetRepo = process.argv[2];
  const rootDir = path.resolve(__dirname, '..');

  let destDir;
  if (!targetRepo || targetRepo === '--personal') {
    const home = process.env.HOME || process.env.USERPROFILE;
    destDir = path.join(home, '.agents/skills/parallel-subagent-planner');
    console.log(`\n--- Installing Minimal Personal Skill to: ${destDir} ---\n`);
  } else {
    const targetAbs = path.resolve(process.cwd(), targetRepo);
    if (targetAbs === rootDir) {
      console.error(`Error: Target directory cannot be the skill source repository itself.`);
      process.exit(1);
    }
    destDir = path.join(targetAbs, '.agents/skills/parallel-subagent-planner');
    console.log(`\n--- Installing Minimal Project Skill to: ${destDir} ---\n`);
  }

  // Runtime Skill Assets to install
  const runtimeItems = [
    'SKILL.md',
    'opsx-parallel.md',
    'schema',
    'references',
    'docs',
    'examples'
  ];

  function copyItem(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copyItem(path.join(src, child), path.join(dest, child));
      });
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  runtimeItems.forEach(item => {
    const src = path.join(rootDir, item);
    const dest = path.join(destDir, item);
    copyItem(src, dest);
  });

  console.log(`✓ Minimal Runtime Skill successfully installed to: ${destDir}`);
}

if (require.main === module) {
  installSkill();
}

module.exports = { installSkill };
