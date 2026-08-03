/**
 * Zero-Dependency Safe Skill Installer for Parallel Subagent Planner (v0.2.0)
 * Safely installs the skill to user ($HOME/.agents/skills) or project (<target-repo>/.agents/skills).
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
    console.log(`\n--- Installing Personal Skill to: ${destDir} ---\n`);
  } else {
    const targetAbs = path.resolve(process.cwd(), targetRepo);
    if (targetAbs === rootDir) {
      console.error(`Error: Target directory cannot be the skill source repository itself.`);
      process.exit(1);
    }
    destDir = path.join(targetAbs, '.agents/skills/parallel-subagent-planner');
    console.log(`\n--- Installing Project Skill to: ${destDir} ---\n`);
  }

  const excludeDirs = new Set(['.git', 'dist', 'node_modules', '.tools', 'scratch']);

  function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      const base = path.basename(src);
      if (excludeDirs.has(base)) return;
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copyRecursive(path.join(src, child), path.join(dest, child));
      });
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursive(rootDir, destDir);
  console.log(`✓ Skill successfully installed to: ${destDir}`);
}

if (require.main === module) {
  installSkill();
}

module.exports = { installSkill };
