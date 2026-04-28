// ─── js/state.js ─────────────────────────────────────────────────────────────
// Shared mutable game state and the trail ring-buffer.
//
// Performance note — trail ring buffer
// ──────────────────────────────────────
// The original code used Array.unshift() to prepend a point every frame, which
// is O(n) (shifting every element by one).  With up to 8 000+ points this
// becomes a significant bottleneck.  We replace it with a pre-allocated
// Float32Array ring buffer where insertion is O(1) and index arithmetic is a
// single bitwise AND.

'use strict';

// ── Trail ring buffer ────────────────────────────────────────────────────────

const TRAIL_BITS = 13;                         // 2^13 = 8 192 slots
export const TRAIL_SIZE = 1 << TRAIL_BITS;     // 8 192
const TRAIL_MASK = TRAIL_SIZE - 1;

export const trailX = new Float32Array(TRAIL_SIZE);
export const trailY = new Float32Array(TRAIL_SIZE);

// trailHead: index in trailX/Y of the *newest* (most recent) trail point.
// trailCount: how many valid points are currently stored (capped at TRAIL_SIZE).
let trailHead  = 0;
let trailCount = 0;

/** Prepend a new (x, y) position to the trail.  O(1). */
export function trailPush(x, y) {
  trailHead = (trailHead + 1) & TRAIL_MASK;
  trailX[trailHead] = x;
  trailY[trailHead] = y;
  if (trailCount < TRAIL_SIZE) trailCount++;
}

/** Read trailX[i] where i=0 is the newest point. */
export function trailGetX(i) {
  return trailX[(trailHead - i + TRAIL_SIZE) & TRAIL_MASK];
}

/** Read trailY[i] where i=0 is the newest point. */
export function trailGetY(i) {
  return trailY[(trailHead - i + TRAIL_SIZE) & TRAIL_MASK];
}

/** How many valid trail points are available (up to TRAIL_SIZE). */
export function trailLen() { return trailCount; }

/** Reset the trail (new game). */
export function trailReset() {
  trailHead  = 0;
  trailCount = 0;
}

// ── Shared game state ────────────────────────────────────────────────────────

/**
 * Single object holding all mutable game-state so every module can import one
 * reference and always see the latest values.
 */
export const state = {
  // 'start' | 'playing' | 'paused' | 'dead'
  phase      : 'start',

  snake      : null,   // { x, y, vx, vy, tx, ty, face, segs[], len }
  world      : [],     // array of world-object descriptors

  deathA     : 0,      // death vignette alpha accumulator
  spawnTick  : 0,      // seconds since last spawn/despawn cycle
  startTime  : 0,      // performance.now() when current game began
  pausedMs   : 0,      // cumulative ms spent paused this game
  pauseStart : 0,      // performance.now() when current pause began

  restartLock    : false,
  collectedTypes : new Set(),  // unique emoji types collected this session
  savedHead      : null,       // persisted head emoji
  globalCollection: new Set(), // all emojis ever collected (loaded from localStorage)
};

// ── Virtual joystick state ───────────────────────────────────────────────────
export const joystick = {
  active : false,
  cx: 0, cy: 0,
  curX: 0, curY: 0,
  dx: 0, dy: 0,
  factor: 0,
};
