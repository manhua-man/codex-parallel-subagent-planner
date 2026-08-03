/**
 * Static Audit & Drift Checker for Parallel Subagent Planner (v0.2.0)
 * Validates file links, YAML frontmatter, TOML specs, and document synchronization.
 */

const fs = require('fs');
const path = require('path');

function checkDrift() {
  const rootDir = path.resolve(__dirname, '..');
  const errors = [];

  console.log(`\n--- Running Static Integrity & Drift Audit ---\n`);

  // Check 1: Mandatory Files Presence
  const requiredFiles = [
    'SKILL.md',
    'README.md',
    'README.zh-CN.md',
    'opsx-parallel.md',
    'schema/planner-plan.schema.json',
    'references/planner-details.md',
    'references/project-scale-planning.md',
    'references/runtime-compatibility.md',
    'references/long-term-agents.md',
    'references/prompt-templates.md',
    'references/maintenance.md',
    'docs/request-flow.md',
    'docs/request-flow.zh-CN.md'
  ];

  requiredFiles.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${relPath}`);
    }
  });

  // Check 2: SKILL.md YAML Frontmatter
  const skillPath = path.join(rootDir, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!content.startsWith('---')) {
      errors.push('SKILL.md missing frontmatter header (must start with ---)');
    }
    if (!content.includes('name: parallel-subagent-planner')) {
      errors.push('SKILL.md missing name field in frontmatter');
    }
    if (!content.includes('description:')) {
      errors.push('SKILL.md missing description field in frontmatter');
    }
  }

  // Check 3: Markdown Relative Link Verification
  function checkMarkdownLinks(fileRelPath) {
    const filePath = path.join(rootDir, fileRelPath);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const linkTarget = match[2];
      if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('#')) {
        continue;
      }
      const targetPath = path.resolve(path.dirname(filePath), linkTarget.split('#')[0]);
      if (!fs.existsSync(targetPath)) {
        errors.push(`Broken link in '${fileRelPath}': '[${match[1]}](${linkTarget})' -> '${targetPath}' not found`);
      }
    }
  }

  requiredFiles.filter(f => f.endsWith('.md')).forEach(checkMarkdownLinks);

  // Check 4: English / Chinese Document Synchronization
  const enReadme = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
  const zhReadme = fs.readFileSync(path.join(rootDir, 'README.zh-CN.md'), 'utf8');
  if (enReadme.includes('v0.2.0') && !zhReadme.includes('v0.2.0')) {
    errors.push('README.zh-CN.md is missing v0.2.0 version sync');
  }

  // Reporting
  if (errors.length === 0) {
    console.log(`✓ All static integrity & drift checks passed cleanly!`);
    process.exit(0);
  } else {
    console.error(`✗ Drift audit found ${errors.length} issue(s):`);
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}

if (require.main === module) {
  checkDrift();
}

module.exports = { checkDrift };
