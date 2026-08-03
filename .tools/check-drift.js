/**
 * Zero-Dependency Pure Node.js Static Integrity & Drift Checker for Parallel Subagent Planner (v0.2.0)
 * Validates file links, YAML frontmatter, TOML syntax, document synchronization, and Schema Validator drift.
 */

const fs = require('fs');
const path = require('path');

// Simple pure JS YAML Frontmatter parser
function parseYamlFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const parts = content.split('---');
  if (parts.length < 3) return null;
  const yamlText = parts[1];
  const data = {};
  yamlText.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      data[key] = val;
    }
  });
  return data;
}

// Simple pure JS TOML Key-Value parser
function parseTomlSnippet(tomlText) {
  const data = {};
  const lines = tomlText.split('\n');
  let currentKey = null;
  let inMultiline = false;
  let multilineVal = [];

  lines.forEach(line => {
    if (inMultiline) {
      if (line.includes('"""')) {
        inMultiline = false;
        multilineVal.push(line.replace('"""', ''));
        data[currentKey] = multilineVal.join('\n').trim();
      } else {
        multilineVal.push(line);
      }
      return;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim();
      if (val.startsWith('"""')) {
        inMultiline = true;
        currentKey = key;
        multilineVal = [val.replace('"""', '')];
      } else {
        data[key] = val.replace(/^"|"$/g, '');
      }
    }
  });
  return data;
}

function checkDrift() {
  const rootDir = path.resolve(__dirname, '..');
  const errors = [];

  console.log(`\n--- Running Zero-Dependency Static Integrity & Drift Audit ---\n`);

  // Check 1: Mandatory Files Presence
  const requiredFiles = [
    'SKILL.md',
    'README.md',
    'README.zh-CN.md',
    'opsx-parallel.md',
    'schema/planner-plan.schema.json',
    '.tools/schema-validator.js',
    'references/planner-details.md',
    'references/project-scale-planning.md',
    'references/runtime-compatibility.md',
    'references/long-term-agents.md',
    'references/prompt-templates.md',
    'references/maintenance.md',
    'docs/request-flow.md',
    'docs/request-flow.zh-CN.md',
    'INSTALL.md',
    'COMPATIBILITY.md',
    'CHANGELOG.md',
    'LICENSE',
    'CONTRIBUTING.md'
  ];

  requiredFiles.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${relPath}`);
    }
  });

  // Check 2: Schema Standalone Validator Integrity Check
  const schemaValidatorPath = path.join(rootDir, '.tools/schema-validator.js');
  if (fs.existsSync(schemaValidatorPath)) {
    const content = fs.readFileSync(schemaValidatorPath, 'utf8');
    if (!content.includes('validate') || !content.includes('exports')) {
      errors.push('.tools/schema-validator.js is missing compiled validate function export');
    }
  }

  // Check 3: SKILL.md YAML Frontmatter Validation
  const skillPath = path.join(rootDir, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf8');
    const fmData = parseYamlFrontmatter(content);
    if (!fmData) {
      errors.push('SKILL.md missing valid YAML frontmatter (must start and end with ---)');
    } else {
      if (!fmData.name || fmData.name !== 'parallel-subagent-planner') {
        errors.push(`SKILL.md invalid frontmatter name: '${fmData.name}'`);
      }
      if (!fmData.description || fmData.description.trim() === '') {
        errors.push('SKILL.md missing description in frontmatter');
      }
    }
  }

  // Check 4: Long-Term Agent TOML Template Validation
  const ltaPath = path.join(rootDir, 'references/long-term-agents.md');
  if (fs.existsSync(ltaPath)) {
    const ltaContent = fs.readFileSync(ltaPath, 'utf8');
    if (!ltaContent.includes('.toml')) {
      errors.push('references/long-term-agents.md must use .toml agent specification format');
    }
    const tomlMatch = ltaContent.match(/```toml([\s\S]*?)```/);
    if (tomlMatch) {
      const parsedToml = parseTomlSnippet(tomlMatch[1]);
      if (!parsedToml.name || !parsedToml.description || !parsedToml.developer_instructions) {
        errors.push('references/long-term-agents.md TOML template missing required fields (name, description, developer_instructions)');
      }
    } else {
      errors.push('references/long-term-agents.md missing valid ```toml code snippet');
    }
  }

  // Check 5: Markdown Relative Link Verification
  function checkMarkdownLinks(fileRelPath) {
    const filePath = path.join(rootDir, fileRelPath);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const linkTarget = match[2];
      if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('#') || linkTarget.startsWith('file://')) {
        continue;
      }
      const targetPath = path.resolve(path.dirname(filePath), linkTarget.split('#')[0]);
      if (!fs.existsSync(targetPath)) {
        errors.push(`Broken link in '${fileRelPath}': '[${match[1]}](${linkTarget})' -> '${targetPath}' not found`);
      }
    }
  }

  requiredFiles.filter(f => f.endsWith('.md')).forEach(checkMarkdownLinks);

  // Check 6: English / Chinese Document Synchronization
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
