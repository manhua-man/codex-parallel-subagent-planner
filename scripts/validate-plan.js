/**
 * Deterministic Plan Validator for Parallel Subagent Planner (v0.2.0)
 * Validates plan JSON files against schema and enforces 8 safety & contract invariants.
 */

const fs = require('fs');
const path = require('path');

function isGlobMatch(pattern, testPath) {
  const normPattern = pattern.replace(/\\/g, '/');
  const normPath = testPath.replace(/\\/g, '/');
  if (normPattern === normPath) return true;
  if (normPattern.endsWith('/**')) {
    const prefix = normPattern.slice(0, -3);
    return normPath.startsWith(prefix);
  }
  if (normPattern.endsWith('/*')) {
    const prefix = normPattern.slice(0, -2);
    return normPath.startsWith(prefix);
  }
  return normPattern.includes(normPath) || normPath.includes(normPattern);
}

function checkWriteOverlap(scopeA, scopeB) {
  for (const a of scopeA) {
    for (const b of scopeB) {
      if (isGlobMatch(a, b) || isGlobMatch(b, a)) {
        return { fileA: a, fileB: b };
      }
    }
  }
  return null;
}

function validatePlan(planData) {
  const errors = [];

  // Invariant 1: Basic Structure & Required Fields
  if (!planData || typeof planData !== 'object') {
    return { valid: false, errors: ['Plan data must be an object'] };
  }
  if (planData.schema_version !== 1) {
    errors.push('schema_version must be 1');
  }
  if (!['task', 'project'].includes(planData.mode)) {
    errors.push('mode must be "task" or "project"');
  }
  if (!planData.budget || typeof planData.budget.max_concurrency !== 'number') {
    errors.push('budget.max_concurrency is required and must be a number');
  }

  const lanes = planData.lanes || [];
  const contracts = planData.contracts || [];
  const frontier = planData.frontier || [];
  const budget = planData.budget || {};

  const laneMap = new Map();
  lanes.forEach(l => laneMap.set(l.id, l));

  // Invariant 2: Acyclic Dependency Graph
  const visited = new Set();
  const recStack = new Set();
  function hasCycle(laneId) {
    if (recStack.has(laneId)) return true;
    if (visited.has(laneId)) return false;
    visited.add(laneId);
    recStack.add(laneId);
    const lane = laneMap.get(laneId);
    if (lane && Array.isArray(lane.depends_on)) {
      for (const depId of lane.depends_on) {
        if (hasCycle(depId)) return true;
      }
    }
    recStack.delete(laneId);
    return false;
  }
  for (const lane of lanes) {
    if (hasCycle(lane.id)) {
      errors.push(`Cyclic dependency detected involving lane '${lane.id}'`);
      break;
    }
  }

  // Invariant 3: Unique Contract Owners
  for (const contract of contracts) {
    if (!contract.id) {
      errors.push('Contract missing id');
      continue;
    }
    const owners = lanes.filter(l => contract.owner === l.id);
    if (contract.owner && owners.length !== 1) {
      errors.push(`Contract '${contract.id}' must have exactly one owner lane, found ${owners.length}`);
    }
  }

  // Invariant 4: Satisfied Dependencies for Frontier / Ready Lanes
  for (const frontierId of frontier) {
    const lane = laneMap.get(frontierId);
    if (!lane) {
      errors.push(`Frontier contains unknown lane '${frontierId}'`);
      continue;
    }
    if (lane.depends_on && Array.isArray(lane.depends_on)) {
      for (const depId of lane.depends_on) {
        const depLane = laneMap.get(depId);
        if (depLane && !['done', 'integrated'].includes(depLane.state)) {
          errors.push(`Frontier lane '${lane.id}' has unsatisfied dependency '${depId}' (state: ${depLane.state})`);
        }
      }
    }
  }

  // Invariant 5: Disjoint Write Scopes in Ready Frontier
  const frontierLanes = frontier.map(id => laneMap.get(id)).filter(Boolean);
  for (let i = 0; i < frontierLanes.length; i++) {
    for (let j = i + 1; j < frontierLanes.length; j++) {
      const laneA = frontierLanes[i];
      const laneB = frontierLanes[j];
      const overlap = checkWriteOverlap(laneA.write_scope || [], laneB.write_scope || []);
      if (overlap) {
        errors.push(`Parallel write collision between '${laneA.id}' and '${laneB.id}' on scope '${overlap.fileA}' / '${overlap.fileB}'`);
      }
    }
  }

  // Invariant 6: Non-Empty Acceptance Criteria for Launchable Lanes
  for (const lane of frontierLanes) {
    if (!Array.isArray(lane.acceptance) || lane.acceptance.length === 0) {
      errors.push(`Launchable lane '${lane.id}' must have non-empty acceptance checks`);
    }
  }

  // Invariant 7: Read-Only Lanes Scope Enforcement
  for (const lane of lanes) {
    if (['explorer'].includes(lane.agent_type)) {
      if (Array.isArray(lane.write_scope) && lane.write_scope.length > 0) {
        errors.push(`Read-only explorer lane '${lane.id}' must have empty write_scope`);
      }
    }
  }

  // Invariant 8: Budget & Concurrency Constraints
  if (frontierLanes.length > budget.max_concurrency) {
    errors.push(`Frontier lane count (${frontierLanes.length}) exceeds max_concurrency budget (${budget.max_concurrency})`);
  }
  const writeLanesInFrontier = frontierLanes.filter(l => Array.isArray(l.write_scope) && l.write_scope.length > 0);
  if (typeof budget.max_write_lanes === 'number' && writeLanesInFrontier.length > budget.max_write_lanes) {
    errors.push(`Write lanes in frontier (${writeLanesInFrontier.length}) exceed max_write_lanes budget (${budget.max_write_lanes})`);
  }

  // Invariant 9: Held Reason Consistency
  for (const lane of lanes) {
    if (lane.state === 'ready' && lane.held_reason !== null && lane.held_reason !== 'safe') {
      errors.push(`Lane '${lane.id}' state is 'ready' but held_reason is '${lane.held_reason}'`);
    }
    if (lane.state === 'blocked' && (!lane.held_reason || lane.held_reason === 'safe')) {
      errors.push(`Lane '${lane.id}' state is 'blocked' but held_reason is '${lane.held_reason}'`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// CLI Execution Support
if (require.main === module) {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.log('Usage: node scripts/validate-plan.js <path-to-plan.json>');
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const plan = JSON.parse(content);
    const res = validatePlan(plan);
    if (res.valid) {
      console.log(`✓ Plan '${path.basename(filePath)}' passed all schema & invariant checks.`);
      process.exit(0);
    } else {
      console.error(`✗ Plan '${path.basename(filePath)}' failed validation:`);
      res.errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error reading/parsing plan: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { validatePlan, checkWriteOverlap };
