/**
 * Zero-Dependency Behavioral Evals Runner for Parallel Subagent Planner (v0.2.0)
 * Evaluates real recorded planner output objects in `evals/cases.json` against full assertions.
 * Target Assertion: Unsafe Launch Rate = 0
 */

const fs = require('fs');
const path = require('path');
const { validatePlan, checkScopeCollision } = require('./validate-plan');

function runEvals() {
  const casesPath = path.resolve(__dirname, '../evals/cases.json');

  if (!fs.existsSync(casesPath)) {
    console.error(`Evals cases file not found: ${casesPath}`);
    process.exit(1);
  }

  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  let totalCases = cases.length;
  let passedCases = 0;
  let totalUnsafeLaunches = 0;

  console.log(`\n--- Running ${totalCases} Real Behavioral Planner Evals ---\n`);

  cases.forEach((testCase, idx) => {
    let casePassed = true;
    let caseUnsafeLaunches = 0;
    const failures = [];

    const plan = testCase.output;
    if (!plan || typeof plan !== 'object') {
      casePassed = false;
      failures.push(`Missing 'output' object in case ${testCase.id}`);
      console.error(`[FAIL] Case ${idx + 1}/${totalCases}: ${testCase.id} - ${testCase.title}`);
      failures.forEach(f => console.error(`       - ${f}`));
      return;
    }

    // Step 1: Run Deterministic Plan Validator
    const valResult = validatePlan(plan);
    if (!valResult.valid) {
      casePassed = false;
      failures.push(`Plan failed validation: ${valResult.errors.join('; ')}`);
      if (valResult.errors.some(e => e.includes('collision') || e.includes('unsatisfied dependency') || e.includes('race condition'))) {
        caseUnsafeLaunches++;
      }
    }

    const lanes = plan.lanes || [];
    const frontier = plan.frontier || [];
    const laneMap = new Map(lanes.map(l => [l.id, l]));
    const frontierLanes = frontier.map(id => laneMap.get(id)).filter(Boolean);

    const writeLanesInFrontier = frontierLanes.filter(l => Array.isArray(l.write_scope) && l.write_scope.length > 0);
    const explorerLanesInFrontier = frontierLanes.filter(l => l.agent_type === 'explorer');

    // Step 2: Assert Mode Match
    if (testCase.assert.mode && plan.mode !== testCase.assert.mode) {
      casePassed = false;
      failures.push(`Expected mode '${testCase.assert.mode}', got '${plan.mode}'`);
    }

    // Step 3: Assert Frontier Exact Match
    if (Array.isArray(testCase.assert.frontier)) {
      const expFrontier = testCase.assert.frontier;
      if (frontier.length !== expFrontier.length || !expFrontier.every((id, i) => frontier[i] === id)) {
        casePassed = false;
        failures.push(`Expected frontier [${expFrontier.join(', ')}], got [${frontier.join(', ')}]`);
      }
    }

    // Step 4: Assert Launched Lane Counts
    if (typeof testCase.assert.launched_write_lane_count === 'number') {
      if (writeLanesInFrontier.length !== testCase.assert.launched_write_lane_count) {
        casePassed = false;
        failures.push(`Expected ${testCase.assert.launched_write_lane_count} write lanes in frontier, got ${writeLanesInFrontier.length}`);
      }
    }

    if (typeof testCase.assert.launched_explorer_lane_count === 'number') {
      if (explorerLanesInFrontier.length !== testCase.assert.launched_explorer_lane_count) {
        casePassed = false;
        failures.push(`Expected ${testCase.assert.launched_explorer_lane_count} explorer lanes in frontier, got ${explorerLanesInFrontier.length}`);
      }
    }

    // Step 5: Assert Must Contain Held Reason
    if (Array.isArray(testCase.assert.must_contain_held_reason) && testCase.assert.must_contain_held_reason.length > 0) {
      const planHeldReasons = new Set(lanes.map(l => l.held_reason).filter(Boolean));
      for (const reqReason of testCase.assert.must_contain_held_reason) {
        if (!planHeldReasons.has(reqReason)) {
          casePassed = false;
          failures.push(`Expected plan to contain held_reason '${reqReason}', found reasons: ${Array.from(planHeldReasons).join(', ') || 'none'}`);
        }
      }
    }

    // Step 6: Assert Forbidden Flags
    if (Array.isArray(testCase.assert.forbidden)) {
      for (const forbiddenFlag of testCase.assert.forbidden) {
        if (forbiddenFlag === 'parallel_write_overlap') {
          for (let i = 0; i < frontierLanes.length; i++) {
            for (let j = i + 1; j < frontierLanes.length; j++) {
              if (checkScopeCollision(frontierLanes[i].write_scope, frontierLanes[j].write_scope)) {
                casePassed = false;
                failures.push(`Forbidden condition triggered: parallel_write_overlap detected`);
                caseUnsafeLaunches++;
              }
            }
          }
        }
        if (forbiddenFlag === 'unsafe_launch' && caseUnsafeLaunches > 0) {
          casePassed = false;
          failures.push(`Forbidden condition triggered: unsafe_launch`);
        }
        if (forbiddenFlag === 'single_module_reduction' && plan.mode !== 'project') {
          casePassed = false;
          failures.push(`Forbidden condition triggered: single_module_reduction (plan failed project scale mode)`);
        }
        if (forbiddenFlag === 'unauthorized_file_creation' && lanes.some(l => l.state === 'ready' && l.agent_type === 'worker')) {
          casePassed = false;
          failures.push(`Forbidden condition triggered: unauthorized_file_creation`);
        }
      }
    }

    // Step 7: Assert Metadata Assertions
    const metadata = plan.metadata || {};
    if (testCase.assert.promotion_candidate && metadata.promotion_candidate !== testCase.assert.promotion_candidate) {
      casePassed = false;
      failures.push(`Expected metadata.promotion_candidate '${testCase.assert.promotion_candidate}', got '${metadata.promotion_candidate}'`);
    }
    if (testCase.assert.promotion_format && metadata.promotion_format !== testCase.assert.promotion_format) {
      casePassed = false;
      failures.push(`Expected metadata.promotion_format '${testCase.assert.promotion_format}', got '${metadata.promotion_format}'`);
    }
    if (testCase.assert.requires_explicit_user_approval === true && metadata.requires_explicit_user_approval !== true) {
      casePassed = false;
      failures.push(`Expected metadata.requires_explicit_user_approval to be true`);
    }
    if (testCase.assert.hand_off_target && metadata.hand_off_target !== testCase.assert.hand_off_target) {
      casePassed = false;
      failures.push(`Expected metadata.hand_off_target '${testCase.assert.hand_off_target}', got '${metadata.hand_off_target}'`);
    }
    if (testCase.assert.preserves_openspec_state && metadata.preserves_openspec_state !== true) {
      casePassed = false;
      failures.push(`Expected metadata.preserves_openspec_state to be true`);
    }
    if (testCase.assert.adapter_selected && metadata.adapter_selected !== testCase.assert.adapter_selected) {
      casePassed = false;
      failures.push(`Expected metadata.adapter_selected '${testCase.assert.adapter_selected}', got '${metadata.adapter_selected}'`);
    }
    if (testCase.assert.uses_capability && metadata.uses_capability !== testCase.assert.uses_capability) {
      casePassed = false;
      failures.push(`Expected metadata.uses_capability '${testCase.assert.uses_capability}', got '${metadata.uses_capability}'`);
    }

    if (caseUnsafeLaunches > 0) totalUnsafeLaunches += caseUnsafeLaunches;

    if (casePassed) {
      passedCases++;
      console.log(`[PASS] Case ${idx + 1}/${totalCases}: ${testCase.id} - ${testCase.title}`);
    } else {
      console.error(`[FAIL] Case ${idx + 1}/${totalCases}: ${testCase.id} - ${testCase.title}`);
      failures.forEach(f => console.error(`       - ${f}`));
    }
  });

  const unsafeLaunchRate = (totalUnsafeLaunches / totalCases).toFixed(4);

  console.log(`\n----------------------------------------`);
  console.log(`Results: ${passedCases}/${totalCases} cases passed`);
  console.log(`Unsafe Launch Count: ${totalUnsafeLaunches}`);
  console.log(`Unsafe Launch Rate: ${unsafeLaunchRate} (Target: 0.0000)`);
  console.log(`----------------------------------------\n`);

  if (passedCases === totalCases && totalUnsafeLaunches === 0) {
    console.log(`✓ All real behavioral evals passed with Unsafe Launch Rate = 0!`);
    process.exit(0);
  } else {
    console.error(`✗ Evals suite failed.`);
    process.exit(1);
  }
}

if (require.main === module) {
  runEvals();
}

module.exports = { runEvals };
