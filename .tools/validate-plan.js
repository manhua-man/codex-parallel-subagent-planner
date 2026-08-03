/**
 * Zero-Dependency Pure Node.js Plan Validator for Parallel Subagent Planner (v0.2.0)
 * Validates plan JSON files against schema structural rules and enforces 9 strict safety & contract invariants.
 */

const fs = require('fs');
const path = require('path');

// Path normalization helper
function normalizePath(p) {
  let norm = p.replace(/\\/g, '/').trim();
  if (norm.startsWith('./')) norm = norm.slice(2);
  return norm;
}

// Strict Path Boundary Intersection Algorithm (Zero External Dependencies)
function isPathIntersection(patternA, patternB) {
  const normA = normalizePath(patternA);
  const normB = normalizePath(patternB);

  if (normA === normB) return true;

  const isSubtreeA = normA.endsWith('/**');
  const isSubtreeB = normB.endsWith('/**');
  const isWildcardA = normA.endsWith('/*') || normA.includes('*');
  const isWildcardB = normB.endsWith('/*') || normB.includes('*');

  // Exact file paths
  if (!isSubtreeA && !isWildcardA && !isSubtreeB && !isWildcardB) {
    return normA === normB;
  }

  // Extract root directory prefix before wildcards
  function getDirPrefix(p) {
    const idx = p.indexOf('*');
    if (idx === -1) return p;
    const prefix = p.slice(0, idx);
    return prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
  }

  const dirA = getDirPrefix(normA);
  const dirB = getDirPrefix(normB);

  // Exact file vs Subtree directory
  if (!isSubtreeA && !isWildcardA && isSubtreeB) {
    if (dirB === '') return true;
    return normA === dirB || normA.startsWith(dirB + '/');
  }

  if (isSubtreeA && !isSubtreeB && !isWildcardB) {
    if (dirA === '') return true;
    return normB === dirA || normB.startsWith(dirA + '/');
  }

  // Subtree vs Subtree or Wildcard vs Subtree
  if (dirA === '' || dirB === '' || dirA === dirB) return true;
  return dirA.startsWith(dirB + '/') || dirB.startsWith(dirA + '/');
}

function checkWriteOverlap(scopeA, scopeB) {
  if (!Array.isArray(scopeA) || !Array.isArray(scopeB)) return null;
  for (const a of scopeA) {
    for (const b of scopeB) {
      if (isPathIntersection(a, b)) {
        return { fileA: a, fileB: b };
      }
    }
  }
  return null;
}

// Pure JS Schema Structural Validator
function validateSchemaStructure(plan) {
  const errors = [];
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    return ['Plan data must be an object'];
  }

  const allowedTopKeys = new Set(['schema_version', 'mode', 'budget', 'contracts', 'lanes', 'frontier', 'metadata']);
  Object.keys(plan).forEach(k => {
    if (!allowedTopKeys.has(k)) {
      errors.push(`[Schema Error] Unknown top-level property '${k}' (additionalProperties: false)`);
    }
  });

  if (plan.schema_version !== 1) {
    errors.push('[Schema Error] schema_version must be 1');
  }
  if (!['task', 'project'].includes(plan.mode)) {
    errors.push(`[Schema Error] mode must be 'task' or 'project', got '${plan.mode}'`);
  }

  // Validate budget
  if (!plan.budget || typeof plan.budget !== 'object') {
    errors.push('[Schema Error] budget object is required');
  } else {
    const b = plan.budget;
    const allowedBudgetKeys = new Set(['max_concurrency', 'max_write_lanes', 'max_explorer_lanes', 'cost_profile', 'write_policy']);
    Object.keys(b).forEach(k => {
      if (!allowedBudgetKeys.has(k)) errors.push(`[Schema Error] budget has unknown property '${k}'`);
    });

    if (typeof b.max_concurrency !== 'number' || b.max_concurrency < 1) {
      errors.push('[Schema Error] budget.max_concurrency must be an integer >= 1');
    }
    if (typeof b.max_write_lanes !== 'number' || b.max_write_lanes < 0) {
      errors.push('[Schema Error] budget.max_write_lanes must be an integer >= 0');
    }
    if (!['cheap', 'balanced', 'quality'].includes(b.cost_profile)) {
      errors.push(`[Schema Error] budget.cost_profile invalid: '${b.cost_profile}'`);
    }
    if (b.write_policy && !['single_writer', 'disjoint_only'].includes(b.write_policy)) {
      errors.push(`[Schema Error] budget.write_policy invalid: '${b.write_policy}'`);
    }
  }

  // Validate contracts
  if (!Array.isArray(plan.contracts)) {
    errors.push('[Schema Error] contracts must be an array');
  } else {
    plan.contracts.forEach((c, idx) => {
      if (typeof c !== 'object') errors.push(`[Schema Error] contracts[${idx}] must be an object`);
      else {
        if (!c.id || typeof c.id !== 'string' || c.id.trim() === '') {
          errors.push(`[Schema Error] contracts[${idx}].id must be a non-empty string`);
        }
        if (!['pending', 'active', 'integrated', 'done'].includes(c.state)) {
          errors.push(`[Schema Error] contracts[${idx}].state invalid: '${c.state}'`);
        }
      }
    });
  }

  // Validate lanes
  if (!Array.isArray(plan.lanes)) {
    errors.push('[Schema Error] lanes must be an array');
  } else {
    plan.lanes.forEach((l, idx) => {
      if (typeof l !== 'object') errors.push(`[Schema Error] lanes[${idx}] must be an object`);
      else {
        if (!l.id || typeof l.id !== 'string' || l.id.trim() === '') {
          errors.push(`[Schema Error] lanes[${idx}].id must be a non-empty string`);
        }
        if (!['explorer', 'worker', 'verification', 'cleanup', 'default'].includes(l.agent_type)) {
          errors.push(`[Schema Error] lanes[${idx}].agent_type invalid: '${l.agent_type}'`);
        }
        if (!['deep', 'balanced', 'fast'].includes(l.model_profile)) {
          errors.push(`[Schema Error] lanes[${idx}].model_profile invalid: '${l.model_profile}'`);
        }
        if (!['auto', 'low', 'medium', 'high'].includes(l.reasoning_profile)) {
          errors.push(`[Schema Error] lanes[${idx}].reasoning_profile invalid: '${l.reasoning_profile}'`);
        }
        if (!Array.isArray(l.depends_on)) errors.push(`[Schema Error] lanes[${idx}].depends_on must be an array`);
        if (!Array.isArray(l.read_scope)) errors.push(`[Schema Error] lanes[${idx}].read_scope must be an array`);
        if (!Array.isArray(l.write_scope)) errors.push(`[Schema Error] lanes[${idx}].write_scope must be an array`);
        if (!Array.isArray(l.acceptance)) errors.push(`[Schema Error] lanes[${idx}].acceptance must be an array`);
        if (!['ready', 'running', 'blocked', 'integrated', 'done', 'held'].includes(l.state)) {
          errors.push(`[Schema Error] lanes[${idx}].state invalid: '${l.state}'`);
        }
        const validHeldReasons = [null, 'safe', 'overlap', 'blocked', 'dependency', 'contract', 'unclear_scope', 'unclear_acceptance', 'verification_failed', 'cost'];
        if (!validHeldReasons.includes(l.held_reason)) {
          errors.push(`[Schema Error] lanes[${idx}].held_reason invalid: '${l.held_reason}'`);
        }
      }
    });
  }

  // Validate frontier
  if (!Array.isArray(plan.frontier)) {
    errors.push('[Schema Error] frontier must be an array');
  }

  return errors;
}

function validatePlan(planData) {
  // Step 1: Structural Schema Validation
  const schemaErrors = validateSchemaStructure(planData);
  if (schemaErrors.length > 0) {
    return { valid: false, errors: schemaErrors };
  }

  const errors = [];
  const lanes = planData.lanes || [];
  const contracts = planData.contracts || [];
  const frontier = planData.frontier || [];
  const budget = planData.budget || {};

  // Invariant 1: Unique Lane IDs
  const laneMap = new Map();
  const duplicateLanes = new Set();
  for (const lane of lanes) {
    if (laneMap.has(lane.id)) {
      duplicateLanes.add(lane.id);
    }
    laneMap.set(lane.id, lane);
  }
  if (duplicateLanes.size > 0) {
    errors.push(`Duplicate lane IDs found: ${Array.from(duplicateLanes).join(', ')}`);
  }

  // Invariant 2: Unique Contract IDs & Valid Owner Assignment
  const contractIds = new Set();
  for (const contract of contracts) {
    if (contractIds.has(contract.id)) {
      errors.push(`Duplicate contract ID found: '${contract.id}'`);
    }
    contractIds.add(contract.id);

    if (['pending', 'active'].includes(contract.state) && (!contract.owner || contract.owner.trim() === '')) {
      errors.push(`Contract '${contract.id}' in state '${contract.state}' must have a valid non-empty owner`);
    }
    if (contract.owner) {
      const ownerLane = laneMap.get(contract.owner);
      if (!ownerLane) {
        errors.push(`Contract '${contract.id}' owner points to non-existent lane '${contract.owner}'`);
      }
    }
  }

  // Invariant 3: Valid Dependency References (depends_on must point to existing lanes)
  for (const lane of lanes) {
    if (Array.isArray(lane.depends_on)) {
      for (const depId of lane.depends_on) {
        if (!laneMap.has(depId)) {
          errors.push(`Lane '${lane.id}' depends_on non-existent lane '${depId}'`);
        }
      }
    }
  }

  // Invariant 4: Acyclic Dependency Graph (DAG)
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
        if (laneMap.has(depId) && hasCycle(depId)) return true;
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

  // Invariant 5: Frontier Validity (Lanes exist, state ready, unique, non-empty acceptance, satisfied dependencies)
  const frontierSet = new Set();
  for (const frontierId of frontier) {
    if (frontierSet.has(frontierId)) {
      errors.push(`Duplicate lane '${frontierId}' in frontier`);
    }
    frontierSet.add(frontierId);

    const lane = laneMap.get(frontierId);
    if (!lane) {
      errors.push(`Frontier contains non-existent lane '${frontierId}'`);
      continue;
    }
    if (lane.state !== 'ready') {
      errors.push(`Frontier lane '${lane.id}' must be in state 'ready', but is '${lane.state}'`);
    }
    if (!Array.isArray(lane.acceptance) || lane.acceptance.length === 0 || lane.acceptance.some(a => !a || a.trim() === '')) {
      errors.push(`Frontier lane '${lane.id}' must have non-empty acceptance criteria`);
    }
    if (Array.isArray(lane.depends_on)) {
      for (const depId of lane.depends_on) {
        const depLane = laneMap.get(depId);
        if (depLane && !['done', 'integrated'].includes(depLane.state)) {
          errors.push(`Frontier lane '${lane.id}' has unsatisfied dependency '${depId}' (state: ${depLane.state})`);
        }
      }
    }
  }

  // Invariant 6: Path-Boundary Safe Scope Intersection in Frontier
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

  // Invariant 7: Read-Only Agent Scope Enforcement
  for (const lane of lanes) {
    if (lane.agent_type === 'explorer') {
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
  const explorerLanesInFrontier = frontierLanes.filter(l => l.agent_type === 'explorer');
  if (typeof budget.max_explorer_lanes === 'number' && explorerLanesInFrontier.length > budget.max_explorer_lanes) {
    errors.push(`Explorer lanes in frontier (${explorerLanesInFrontier.length}) exceed max_explorer_lanes budget (${budget.max_explorer_lanes})`);
  }
  if (budget.write_policy === 'single_writer' && writeLanesInFrontier.length > 1) {
    errors.push(`Write lanes in frontier (${writeLanesInFrontier.length}) violate write_policy 'single_writer'`);
  }

  // Invariant 9: State & Held Reason Consistency
  for (const lane of lanes) {
    if (lane.state === 'ready' && lane.held_reason !== null && lane.held_reason !== 'safe') {
      errors.push(`Lane '${lane.id}' state is 'ready' but held_reason is '${lane.held_reason}'`);
    }
    if (lane.state === 'blocked' && (!lane.held_reason || lane.held_reason === 'safe')) {
      errors.push(`Lane '${lane.id}' state is 'blocked' but held_reason is '${lane.held_reason}'`);
    }
    if (['held', 'running', 'done', 'integrated'].includes(lane.state) && lane.held_reason === 'safe' && lane.state === 'held') {
      errors.push(`Lane '${lane.id}' state is 'held' but held_reason is 'safe'`);
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
    console.log('Usage: node .tools/validate-plan.js <path-to-plan.json>');
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

module.exports = { validatePlan, checkWriteOverlap, isPathIntersection };
