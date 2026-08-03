/**
 * Schema Compilation Parity Checker for Parallel Subagent Planner (v0.2.0)
 * Compiles schema/planner-plan.schema.json in memory and compares byte-for-byte with .tools/schema-validator.js
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const standaloneCode = require('ajv/dist/standalone').default;

function checkSchemaParity() {
  console.log(`\n--- Running Schema Standalone Parity Check ---\n`);

  const schemaPath = path.resolve(__dirname, '../schema/planner-plan.schema.json');
  const compiledPath = path.resolve(__dirname, './schema-validator.js');

  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(compiledPath)) {
    console.error(`Error: Compiled standalone validator not found: ${compiledPath}`);
    console.error(`Run 'npm run schema:generate' to generate it.`);
    process.exit(1);
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    code: { source: true, esm: false }
  });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const expectedCode = standaloneCode(ajv, validate);
  const actualCode = fs.readFileSync(compiledPath, 'utf8');

  if (expectedCode.trim() !== actualCode.trim()) {
    console.error(`✗ Schema parity check failed!`);
    console.error(`  '.tools/schema-validator.js' is out of sync with 'schema/planner-plan.schema.json'.`);
    console.error(`  Run 'npm run schema:generate' to update compiled validator.`);
    process.exit(1);
  }

  console.log(`✓ Standalone schema validator has 100% byte-for-byte parity with schema/planner-plan.schema.json!`);
}

if (require.main === module) {
  checkSchemaParity();
}

module.exports = { checkSchemaParity };
