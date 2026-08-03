/**
 * Zero-Dependency Pure Node.js Plan Validator for Parallel Subagent Planner (v0.2.0)
 * Uses compiled Ajv standalone schema validator (.tools/schema-validator.js) for 100% schema parity,
 * enforces canonical scope syntax (rejects dot-segments / double slashes / aliases), and enforces 9 safety/contract invariants.
 */

const fs = require('fs');
const path = require('path');
const validateSchema = require('./schema-validator');

// Canonical path normalization (cross-platform case-canonical lower-case for path segment comparison)
function normalizePath(p) {
  if (typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').trim();
}

// Scope Syntax Validator: Only allows exact canonical files or subtree globs (dir/**)
function isValidScopeSyntax(p) {
  if (typeof p !== 'string') return false;
  const norm = normalizePath(p);

  if (norm === '' || norm.startsWith('/') || /^[a-zA-Z]:/.test(norm)) {
    return false; // Reject empty or absolute Linux / Windows paths
  }

  // Split into segments and check canonical path segment rules
  const segments = norm.split('/');
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg === '' || seg === '.' || seg === '..') {
      return false; // Reject empty segments (double slashes //), '.', or '..'
    }
  }

  // Check wildcards: only allowed at the end as /**
  const wildcardIdx = norm.indexOf('*');
  if (wildcardIdx !== -1) {
    if (!norm.endsWith('/**')) return false; // Reject arbitrary * outside /**
    if (norm.slice(0, -3).includes('*')) return false; // Reject multiple wildcards
  }

  return true;
}

// Path Intersection Algorithm (Canonical & Case-Insensitive for Cross-Platform Safety)
function isPathIntersection(patternA, patternB) {
  const normA = normalizePath(patternA).toLowerCase();
  const normB = normalizePath(patternB).toLowerCase();

  if (normA === normB) return true;

  const isSubtreeA = normA.endsWith('/**');
  const isSubtreeB = normB.endsWith('/**');

  const dirA = isSubtreeA ? normA.slice(0, -3) : normA;
  const dirB = isSubtreeB ? normB.slice(0, -3) : normB;

  // Exact file vs Subtree directory
  if (!isSubtreeA && isSubtreeB) {
    if (dirB === '') return true;
    return normA === dirB || normA.startsWith(dirB + '/');
  }

  if (isSubtreeA && !isSubtreeB) {
    if (dirA === '') return true;
    return normB === dirA || normB.startsWith(dirA + '/');
  }

  // Subtree vs Subtree
  if (dirA === '' || dirB === '' || dirA === dirB) return true;
  return dirA.startsWith(dirB + '/') || dirB.startsWith(dirA + '/');
}

function checkScopeCollision(scopeA, scopeB) {
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

function validatePlan(planData) {
  const errors = [];

  // Step 1: Run Compiled Standalone Ajv Schema Validator (100% Schema Parity)
  try {
    const valid = validateSchema(planData);
    if (!valid && validateSchema.errors) {
      validateSchema.errors.forEach(err => {
        errors.push(`[Schema Error] ${err.instancePath || 'root'} ${err.message}`);
      });
      return { valid: false, errors };
    }
  } catch (err) {
    errors.push(`[Schema Engine Failure] ${err.message}`);
    return { valid: false, errors };
  }

  const lanes = planData.lanes || [];
  const contracts = planData.contracts || [];
  const frontier = planData.frontier || [];
  const budget = planData.budget || {};

  // Step 2: Validate Scope Canonical Syntax
  for (const lane of lanes) {
    const allScopes = [...(lane.read_scope || []), ...(lane.write_scope || [])];
    for (const s of allScopes) {
      if (!isValidScopeSyntax(s)) {
        errors.push(`Lane '${lane.id}' has invalid scope syntax '${s}'. Scope must be canonical relative path (no '.', '..', '//', absolute paths, or arbitrary wildcards outside '/**').`);
      }
    }
  }

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

  // Invariant 2: Unique Contract IDs & Owner Assignment
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
    if (!Array.isArray(lane.acceptance) || lane.acceptance.length === 0 || lane.acceptance.some(a => !a || typeof a !== 'string' || a.trim() === '')) {
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

  // Invariant 6: Write-Write AND Write-Read Collision Prevention in Frontier
  const frontierLanes = frontier.map(id => laneMap.get(id)).filter(Boolean);
  for (let i = 0; i < frontierLanes.length; i++) {
    for (let j = i + 1; j < frontierLanes.length; j++) {
      const laneA = frontierLanes[i];
      const laneB = frontierLanes[j];

      // Write vs Write
      const wwOverlap = checkScopeCollision(laneA.write_scope || [], laneB.write_scope || []);
      if (wwOverlap) {
        errors.push(`Parallel write-write collision between '${laneA.id}' and '${laneB.id}' on scope '${wwOverlap.fileA}' / '${wwOverlap.fileB}'`);
      }

      // Write(A) vs Read(B)
      const wrOverlap1 = checkScopeCollision(laneA.write_scope || [], laneB.read_scope || []);
      if (wrOverlap1) {
        errors.push(`Parallel write-read race condition: lane '${laneA.id}' writes to '${wrOverlap1.fileA}' which lane '${laneB.id}' reads`);
      }

      // Write(B) vs Read(A)
      const wrOverlap2 = checkScopeCollision(laneB.write_scope || [], laneA.read_scope || []);
      if (wrOverlap2) {
        errors.push(`Parallel write-read race condition: lane '${laneB.id}' writes to '${wrOverlap2.fileA}' which lane '${laneA.id}' reads`);
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

module.exports = { validatePlan, checkScopeCollision, isPathIntersection, isValidScopeSyntax };
