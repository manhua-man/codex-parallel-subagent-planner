/**
 * Standalone Schema Validator Generator for Parallel Subagent Planner (v0.2.0)
 * Compiles schema/planner-plan.schema.json into a standalone zero-dependency JS file: .tools/schema-validator.js
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const standaloneCode = require('ajv/dist/standalone').default;

function generateSchemaValidator() {
  const schemaPath = path.resolve(__dirname, '../schema/planner-plan.schema.json');
  const outputPath = path.resolve(__dirname, './schema-validator.js');

  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
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
  const moduleCode = standaloneCode(ajv, validate);

  fs.writeFileSync(outputPath, moduleCode, 'utf8');
  console.log(`✓ Standalone schema validator successfully compiled to: ${outputPath}`);
}

if (require.main === module) {
  generateSchemaValidator();
}

module.exports = { generateSchemaValidator };
