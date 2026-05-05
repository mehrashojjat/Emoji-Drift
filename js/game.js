// ─── js/game.js ──────────────────────────────────────────────────────────────
// Game loop, state transitions and boot.
//
// Performance notes — trail ring buffer & pre-allocated scratch
// ─────────────────────────────────────────────────────────────
// • Trail insertion is O(1) via the ring buffer in state.js.
// • The cumulative-distance array (cumulBuf) is pre-allocated once here and
//   reused every frame, eliminating per-frame GC pressure from Array.push().
// • A minimum-movement threshold (2 px) prevents adding trail points when the
//   snake is nearly stationary, keeping the active trail shorter.

'use strict';

import { CFG }                        from './config.js';
import { state, joystick,
         trailPush, trailReset,
         trailGetX, trailGetY,
         trailLen, TRAIL_SIZE,
         gridState, gridReset }       from './state.js';
import { dist2 }                      from './utils.js';
import { loadPersist, savePersist,
         flushPersist }               from './persist.js';
import { spawnWorld, despawnWorld }   from './world.js';
import { registerInputEvents }        from './input.js';
import { canvas, render }             from './render.js';
import { FACE_POOL }                  from './data.js';
import {
  hudEl, hudHead, hudLen,
  goIcon, goStat, hintEl, btnPause,
  showPanel, hideOverlay,
  initHeadInput, initLegendaryToggle, initIdleSnake, initIdleWorld,
  bindButtons,
  panelStart, panelOver, panelPause,
  startFace,
}                                     from './ui.js';

// ── Pre-allocated scratch buffer for cumulative trail distances ───────────────
// Reused every frame to avoid allocating a new Array each tick.
const cumulBuf = new Float64Array(TRAIL_SIZE);

// ── Update ────────────────────────────────────────────────────────────────────

function update(dt) {
  // World objects animate (fade / scale in) in all phases.
  for (const o of state.world) {
    if (o.alpha < CFG.blurAlpha) o.alpha = Math.min(CFG.blurAlpha, o.alpha + dt * 1.6);
    if (o.scale < 1)             o.scale = Math.min(1,             o.scale + dt * 2.8);
  }

  if (state.phase !== 'playing') return;

  if (state.legendaryMode) {
    updateLegendary(dt);
  } else {
    updateSmooth(dt);
  }
}

// ── Smooth (normal) update ────────────────────────────────────────────────────

function updateSmooth(dt) {
  // ── Direction interpolation ──────────────────────────────────────────────
  const sn = state.snake;
  sn.vx += (sn.tx - sn.vx) * CFG.turnSpeed * dt;
  sn.vy += (sn.ty - sn.vy) * CFG.turnSpeed * dt;
  const vLen = Math.sqrt(sn.vx * sn.vx + sn.vy * sn.vy);
  if (vLen > 0.0001) { sn.vx /= vLen; sn.vy /= vLen; }

  // ── Speed ────────────────────────────────────────────────────────────────
  const elapsed    = (performance.now() - state.startTime - state.pausedMs) / 1000;
  const dynamicMax = CFG.baseSpeed + (sn.len - 1) * 1.8 + elapsed * 0.5;
  const factor     = joystick.active ? joystick.factor : CFG.driftFactor;
  const speed      = CFG.minSpeed + factor * (dynamicMax - CFG.minSpeed);

  // ── Move head ────────────────────────────────────────────────────────────
  sn.x += sn.vx * speed * dt;
  sn.y += sn.vy * speed * dt;

  // ── Record trail point (skip if barely moved) ─────────────────────────────
  const tLen = trailLen();
  if (tLen === 0 ||
      (sn.x - trailGetX(0)) * (sn.x - trailGetX(0)) +
      (sn.y - trailGetY(0)) * (sn.y - trailGetY(0)) >= 4) {
    trailPush(sn.x, sn.y);
  }

  // ── Distance-interpolated body placement ─────────────────────────────────
  const maxRead    = Math.min(trailLen(), Math.max(3000, (sn.segs.length + 20) * CFG.segSpacing));
  const neededDist = (sn.segs.length + 1) * CFG.segSpacing;

  cumulBuf[0] = 0;
  let ci = 0;
  while (ci < maxRead - 1 && cumulBuf[ci] < neededDist) {
    const ddx = trailGetX(ci + 1) - trailGetX(ci);
    const ddy = trailGetY(ci + 1) - trailGetY(ci);
    cumulBuf[ci + 1] = cumulBuf[ci] + Math.sqrt(ddx * ddx + ddy * ddy);
    ci++;
  }
  const cLast = ci;

  for (let i = 0; i < sn.segs.length; i++) {
    const d = (i + 1) * CFG.segSpacing;
    if (d >= cumulBuf[cLast]) {
      sn.segs[i].x = trailGetX(cLast);
      sn.segs[i].y = trailGetY(cLast);
      continue;
    }
    let a = 0, b = cLast;
    while (b - a > 1) {
      const m = (a + b) >> 1;
      if (cumulBuf[m] < d) a = m; else b = m;
    }
    const f = (d - cumulBuf[a]) / (cumulBuf[b] - cumulBuf[a] + 1e-9);
    sn.segs[i].x = trailGetX(a) + (trailGetX(b) - trailGetX(a)) * f;
    sn.segs[i].y = trailGetY(a) + (trailGetY(b) - trailGetY(a)) * f;
  }

  // ── Collect objects ───────────────────────────────────────────────────────
  const cd2 = CFG.collectDist * CFG.collectDist;
  for (let i = state.world.length - 1; i >= 0; i--) {
    const o = state.world[i];
    if (dist2(sn.x, sn.y, o.x, o.y) < cd2) {
      state.collectedTypes.add(o.e);
      state.globalCollection.add(o.e);
      savePersist();
      if (o.e === '👺') {
        sn.face = '👺';
        hudHead.textContent = '👺';
      }
      sn.segs.push({ x: o.x, y: o.y, e: o.e, rarity: o.rarity });
      sn.len++;
      state.world.splice(i, 1);
      hudLen.textContent = sn.len;
      break;
    }
  }

  // ── Self-collision ────────────────────────────────────────────────────────
  if (sn.segs.length > CFG.skipSegs) {
    const col2 = CFG.collideDist * CFG.collideDist;
    for (let i = CFG.skipSegs; i < sn.segs.length; i++) {
      if (dist2(sn.x, sn.y, sn.segs[i].x, sn.segs[i].y) < col2) {
        triggerDeath();
        return;
      }
    }
  }

  // ── Periodic spawn / despawn ──────────────────────────────────────────────
  state.spawnTick += dt;
  if (state.spawnTick >= 0.5) {
    state.spawnTick = 0;
    despawnWorld();
    spawnWorld(false);
  }
}

// ── Legendary (grid) update ───────────────────────────────────────────────────

function updateLegendary(dt) {
  const sn = state.snake;
  const gs = gridState;
  const GS = CFG.gridSize;

  // ── Accumulate step timer ─────────────────────────────────────────────────
  gs.timer += dt;
  const interval = Math.max(
    CFG.gridMinInterval,
    CFG.gridInterval - sn.len * 0.001
  );
  if (gs.timer < interval) {
    // Still waiting for the next step — only handle spawn/despawn timer.
    state.spawnTick += dt;
    if (state.spawnTick >= 0.5) {
      state.spawnTick = 0;
      despawnWorld();
      spawnWorld(false);
    }
    return;
  }
  gs.timer -= interval;

  // ── Apply queued direction (reject 180° reversals) ────────────────────────
  if (!(gs.ndx === -gs.dx && gs.ndy === -gs.dy)) {
    gs.dx = gs.ndx;
    gs.dy = gs.ndy;
  }

  // ── Advance head one grid cell ────────────────────────────────────────────
  gs.x += gs.dx;
  gs.y += gs.dy;

  // Update world-space snake position.
  sn.x = gs.x * GS;
  sn.y = gs.y * GS;

  // ── Record position in history ────────────────────────────────────────────
  gs.history.unshift({ x: gs.x, y: gs.y });
  // Keep only as many entries as needed for all body segments.
  const needed = sn.segs.length + 2;
  if (gs.history.length > needed) gs.history.length = needed;

  // ── Update body segment world positions from history ──────────────────────
  for (let i = 0; i < sn.segs.length; i++) {
    const hi = Math.min(i + 1, gs.history.length - 1);
    sn.segs[i].x = gs.history[hi].x * GS;
    sn.segs[i].y = gs.history[hi].y * GS;
  }

  // ── Self-collision ────────────────────────────────────────────────────────
  // Must run BEFORE collection so the newly-added segment (placed at the head
  // position) is not mistakenly compared against the head.
  // Skip the first few segments that are directly adjacent to the head.
  const skipGrid = Math.min(CFG.skipSegs, sn.segs.length);
  for (let i = skipGrid; i < sn.segs.length; i++) {
    if (sn.segs[i].x === sn.x && sn.segs[i].y === sn.y) {
      triggerDeath();
      return;
    }
  }

  // ── Collect objects ───────────────────────────────────────────────────────
  for (let i = state.world.length - 1; i >= 0; i--) {
    const o = state.world[i];
    if (o.gx === gs.x && o.gy === gs.y) {
      state.collectedTypes.add(o.e);
      state.globalCollection.add(o.e);
      savePersist();
      if (o.e === '👺') {
        sn.face = '👺';
        hudHead.textContent = '👺';
      }
      sn.segs.push({ x: o.x, y: o.y, e: o.e, rarity: o.rarity });
      sn.len++;
      state.world.splice(i, 1);
      hudLen.textContent = sn.len;
      // Extend history so the new segment has a valid position immediately.
      if (gs.history.length <= sn.segs.length) {
        gs.history.push(gs.history[gs.history.length - 1]);
      }
      break;
    }
  }

  // ── Periodic spawn / despawn ──────────────────────────────────────────────
  state.spawnTick += dt;
  if (state.spawnTick >= 0.5) {
    state.spawnTick = 0;
    despawnWorld();
    spawnWorld(false);
  }
}

// ── Death ─────────────────────────────────────────────────────────────────────

function triggerDeath() {
  state.phase = 'dead';
  joystick.active = false;
  joystick.factor = 0;
  btnPause.classList.remove('visible');
  flushPersist();
  goIcon.textContent = FACE_POOL[Math.floor(Math.random() * FACE_POOL.length)];
  goStat.textContent = state.collectedTypes.size;
  hudEl.classList.remove('visible');
  setTimeout(() => { showPanel(panelOver); }, 850);
}

// ── Game loop ─────────────────────────────────────────────────────────────────

let prevTime = 0;

function loop(now) {
  if (prevTime === 0) { prevTime = now; requestAnimationFrame(loop); return; }
  const dt = Math.min((now - prevTime) / 1000, 0.05);
  prevTime = now;
  update(dt);
  render(now);
  requestAnimationFrame(loop);
}

// ── State transitions ─────────────────────────────────────────────────────────

function beginGame() {
  state.restartLock = true;
  setTimeout(() => { state.restartLock = false; }, 600);

  state.phase    = 'playing';
  state.deathA   = 0;
  state.spawnTick = 0;
  state.pausedMs  = 0;
  state.collectedTypes = new Set();

  hideOverlay();
  hudEl.classList.add('visible');
  hintEl.classList.add('visible');
  btnPause.classList.add('visible');

  // Update hint text for the active mode.
  hintEl.textContent = state.legendaryMode
    ? '✦ Swipe or arrow keys to steer ✦'
    : '✦ Touch and drag to steer ✦';

  if (state.legendaryMode) {
    // Legendary mode: reset grid state; no trail pre-fill needed.
    gridReset();
    trailReset();
  } else {
    // Dense pre-fill so body segments are placed correctly from frame 1.
    trailReset();
    for (let i = 2999; i >= 0; i--) trailPush(-i, 0);
  }

  state.snake = {
    x: 0, y: 0,
    vx: 1, vy: 0,
    tx: 1, ty: 0,
    face: state.savedHead,
    segs: [],
    len : 1,
  };

  hudHead.textContent = state.snake.face;
  hudLen.textContent  = state.snake.len;
  state.world = [];
  state.startTime = performance.now();
  spawnWorld(true);
}

function pauseGame() {
  if (state.phase !== 'playing') return;
  state.phase      = 'paused';
  state.pauseStart = performance.now();
  joystick.active  = false;
  joystick.factor  = 0;
  showPanel(panelPause);
}

function resumeGame() {
  if (state.phase !== 'paused') return;
  state.pausedMs += performance.now() - state.pauseStart;
  state.phase = 'playing';
  hideOverlay();
}

function quitToMenu() {
  if (state.phase === 'paused') state.pausedMs += performance.now() - state.pauseStart;
  state.phase     = 'start';
  joystick.active = false;
  joystick.factor = 0;
  flushPersist();
  hudEl.classList.remove('visible');
  btnPause.classList.remove('visible');
  hintEl.classList.remove('visible');
  initIdleSnake();
  initIdleWorld();
  startFace.textContent = state.savedHead;
  showPanel(panelStart);
}

// ── Boot ──────────────────────────────────────────────────────────────────────

loadPersist();
startFace.textContent = state.savedHead;
initHeadInput();
initLegendaryToggle();
initIdleSnake();
initIdleWorld();

// Hide all panels, then show start panel.
document.querySelectorAll('.panel').forEach(p => { p.style.display = 'none'; });
document.getElementById('panel-start').style.display = '';
document.getElementById('overlay').classList.add('show');

registerInputEvents(canvas);
bindButtons({ beginGame, pauseGame, resumeGame, quitToMenu });

requestAnimationFrame(loop);
