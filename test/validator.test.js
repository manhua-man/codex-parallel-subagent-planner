/**
 * Validator Unit Test Suite for Parallel Subagent Planner (v0.2.0)
 * Tests positive and negative validation cases for JSON Schema structural validation, canonical scope syntax, and business invariants.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { validatePlan, isPathIntersection, isValidScopeSyntax } = require('../.tools/validate-plan');
const { forbiddenHandlers } = require('../.tools/run-evals');

function runValidatorTests() {
  console.log('\n--- Running Validator Unit Tests ---\n');

  // Test 1: Scope Syntax & Alias Rejection Tests
  assert.strictEqual(isValidScopeSyntax('src/a.ts'), true, 'src/a.ts should be valid');
  assert.strictEqual(isValidScopeSyntax('src/api/**'), true, 'src/api/** should be valid');
  assert.strictEqual(isValidScopeSyntax('src/./a.ts'), false, 'src/./a.ts must be rejected (dot segment)');
  assert.strictEqual(isValidScopeSyntax('././src/a.ts'), false, '././src/a.ts must be rejected (dot segment)');
  assert.strictEqual(isValidScopeSyntax('src/a/../b.ts'), false, 'src/a/../b.ts must be rejected (parent segment)');
  assert.strictEqual(isValidScopeSyntax('src//a.ts'), false, 'src//a.ts must be rejected (empty segment)');
  assert.strictEqual(isValidScopeSyntax('src/a*.ts'), false, 'src/a*.ts must be rejected (wildcard outside /**)');
  assert.strictEqual(isValidScopeSyntax('/src/a.ts'), false, '/src/a.ts must be rejected (absolute path)');
  console.log('✓ Canonical Scope Syntax & Alias Rejection tests passed');

  // Test 2: Path Intersection Tests (Case-Insensitive Cross-Platform Safety)
  assert.strictEqual(isPathIntersection('src/a/**', 'src/ab/file.ts'), false, 'src/a/** must not intersect src/ab/file.ts');
  assert.strictEqual(isPathIntersection('src/api/**', 'src/api/index.ts'), true, 'src/api/** must intersect src/api/index.ts');
  assert.strictEqual(isPathIntersection('SRC/API/INDEX.TS', 'src/api/index.ts'), true, 'case variations must intersect');
  assert.strictEqual(isPathIntersection('src/runtime/session.ts', 'src/runtime/session.ts'), true, 'identical file paths must intersect');
  assert.strictEqual(isPathIntersection('src/cli/help.ts', 'docs/usage.md'), false, 'disjoint files must not intersect');
  console.log('✓ Path Intersection Algorithm tests passed');

  // Test 3: Valid Task Mode Plan
  const validTaskPlan = {
    schema_version: 1,
    mode: "task",
    budget: { max_concurrency: 2, max_write_lanes: 2, cost_profile: "balanced" },
    contracts: [],
    lanes: [
      {
        id: "lane-1",
        agent_type: "worker",
        model_profile: "deep",
        reasoning_profile: "medium",
        depends_on: [],
        read_scope: ["src/a.ts"],
        write_scope: ["src/a.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      }
    ],
    frontier: ["lane-1"]
  };
  const res1 = validatePlan(validTaskPlan);
  assert.strictEqual(res1.valid, true, `Valid task plan failed validation: ${res1.errors.join(', ')}`);
  console.log('✓ Valid task plan test passed');

  // Test 4: Non-existent Dependency Error
  const invalidDepPlan = JSON.parse(JSON.stringify(validTaskPlan));
  invalidDepPlan.lanes[0].depends_on = ["non-existent-lane"];
  const res2 = validatePlan(invalidDepPlan);
  assert.strictEqual(res2.valid, false, 'Non-existent dependency should fail validation');
  assert.ok(res2.errors.some(e => e.includes('non-existent-lane')), 'Should mention non-existent lane');
  console.log('✓ Non-existent dependency error test passed');

  // Test 5: Cyclic Dependency Error
  const cyclicPlan = {
    schema_version: 1,
    mode: "task",
    budget: { max_concurrency: 2, max_write_lanes: 2, cost_profile: "balanced" },
    contracts: [],
    lanes: [
      {
        id: "lane-1",
        agent_type: "worker",
        model_profile: "deep",
        reasoning_profile: "medium",
        depends_on: ["lane-2"],
        read_scope: ["src/a.ts"],
        write_scope: ["src/a.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      },
      {
        id: "lane-2",
        agent_type: "worker",
        model_profile: "deep",
        reasoning_profile: "medium",
        depends_on: ["lane-1"],
        read_scope: ["src/b.ts"],
        write_scope: ["src/b.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      }
    ],
    frontier: []
  };
  const res3 = validatePlan(cyclicPlan);
  assert.strictEqual(res3.valid, false, 'Cyclic dependency should fail validation');
  assert.ok(res3.errors.some(e => e.includes('Cyclic dependency')), 'Should detect cyclic dependency');
  console.log('✓ Cyclic dependency error test passed');

  // Test 6: Contract Owner Validation
  const contractPlan = {
    schema_version: 1,
    mode: "project",
    budget: { max_concurrency: 2, max_write_lanes: 2, cost_profile: "balanced" },
    contracts: [{ id: "c1", owner: "owner-lane", state: "pending" }],
    lanes: [
      {
        id: "owner-lane",
        agent_type: "worker",
        model_profile: "deep",
        reasoning_profile: "medium",
        depends_on: [],
        read_scope: ["src/contract.ts"],
        write_scope: ["src/contract.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      }
    ],
    frontier: ["owner-lane"]
  };
  const res4 = validatePlan(contractPlan);
  assert.strictEqual(res4.valid, true, `Valid contract plan failed: ${res4.errors.join(', ')}`);

  const noOwnerPlan = JSON.parse(JSON.stringify(contractPlan));
  noOwnerPlan.contracts[0].owner = null;
  const res5 = validatePlan(noOwnerPlan);
  assert.strictEqual(res5.valid, false, 'Pending contract without owner must fail validation');
  console.log('✓ Contract owner validation test passed');

  // Test 7: Write-Read Race Condition Prevention in Frontier
  const racePlan = {
    schema_version: 1,
    mode: "task",
    budget: { max_concurrency: 2, max_write_lanes: 2, cost_profile: "balanced" },
    contracts: [],
    lanes: [
      {
        id: "lane-writer",
        agent_type: "worker",
        model_profile: "deep",
        reasoning_profile: "medium",
        depends_on: [],
        read_scope: ["src/shared.ts"],
        write_scope: ["src/shared.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      },
      {
        id: "lane-reader",
        agent_type: "worker",
        model_profile: "balanced",
        reasoning_profile: "low",
        depends_on: [],
        read_scope: ["src/shared.ts"],
        write_scope: ["src/reader-output.ts"],
        acceptance: ["npm test"],
        state: "ready",
        held_reason: null
      }
    ],
    frontier: ["lane-writer", "lane-reader"]
  };
  const res6 = validatePlan(racePlan);
  assert.strictEqual(res6.valid, false, 'Write-read race condition in frontier must fail validation');
  assert.ok(res6.errors.some(e => e.includes('race condition')), 'Should mention write-read race condition');
  console.log('✓ Write-Read race condition test passed');

  // Test 8: Evals Forbidden Assertion Registry Completeness
  const casesPath = path.resolve(__dirname, '../evals/cases.json');
  if (fs.existsSync(casesPath)) {
    const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
    cases.forEach(testCase => {
      const forbiddenList = testCase.assert.forbidden || [];
      forbiddenList.forEach(flag => {
        assert.ok(forbiddenHandlers[flag], `Forbidden assertion flag '${flag}' in case '${testCase.id}' must be registered in forbiddenHandlers`);
      });
    });
    console.log('✓ Forbidden Assertion Registry Completeness test passed');
  }

  console.log('\n✓ All Validator Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
  runValidatorTests();
}

module.exports = { runValidatorTests };
