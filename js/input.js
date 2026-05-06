// ─── js/input.js ─────────────────────────────────────────────────────────────
// Virtual joystick logic and raw event listeners.

'use strict';

import { CFG }                          from './config.js';
import { state, joystick, gridState }   from './state.js';

// ── Joystick helpers ─────────────────────────────────────────────────────────

export function joystickStart(cx, cy) {
  joystick.active = true;
  joystick.cx  = cx; joystick.cy  = cy;
  joystick.curX = cx; joystick.curY = cy;
  joystick.dx  = 0;  joystick.dy  = 0;
  joystick.factor = 0;
}

export function joystickMove(x, y) {
  if (!joystick.active) return;
  let dx  = x - joystick.cx;
  let dy  = y - joystick.cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  joystick.factor = Math.min(d / CFG.joystickR, 1);
  if (d > CFG.joystickR) { dx = (dx / d) * CFG.joystickR; dy = (dy / d) * CFG.joystickR; }
  joystick.dx   = dx; joystick.dy = dy;
  joystick.curX = joystick.cx + dx;
  joystick.curY = joystick.cy + dy;
  if (d > 8 && state.phase === 'playing') {
    state.snake.tx = (x - joystick.cx) / d;
    state.snake.ty = (y - joystick.cy) / d;
    document.getElementById('hint').classList.remove('visible');
  }
}

export function joystickEnd() {
  joystick.active = false;
  joystick.factor = 0;
}

// ── Legendary-mode directional input helpers ─────────────────────────────────

/** Queue a grid direction, ignoring 180° reversals. */
function queueGridDir(ndx, ndy) {
  // Disallow reversing directly into the snake's body.
  if (ndx === -gridState.dx && ndy === -gridState.dy) return;
  gridState.ndx = ndx;
  gridState.ndy = ndy;
  document.getElementById('hint').classList.remove('visible');
}

// ── Event registration ───────────────────────────────────────────────────────
// Called once from game.js after the canvas exists.

export function registerInputEvents(canvas) {

  // ── Swipe state for legendary mode ─────────────────────────────────────────
  let swipeStartX = 0, swipeStartY = 0, swipeLocked = false;

  // Touch ─────────────────────────────────────────────────────────────────────
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (state.phase !== 'playing') return;
    const t = e.changedTouches[0];
    if (state.legendaryMode) {
      swipeStartX = t.clientX;
      swipeStartY = t.clientY;
      swipeLocked = false;
    } else {
      joystickStart(t.clientX, t.clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (state.phase !== 'playing') return;
    const t = e.changedTouches[0];
    if (state.legendaryMode) {
      if (swipeLocked) return;
      const dx = t.clientX - swipeStartX;
      const dy = t.clientY - swipeStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) return;          // wait for a meaningful swipe
      swipeLocked = true;             // one direction per touch
      if (Math.abs(dx) >= Math.abs(dy)) {
        queueGridDir(dx > 0 ? 1 : -1, 0);
      } else {
        queueGridDir(0, dy > 0 ? 1 : -1);
      }
    } else {
      if (!joystick.active) return;
      joystickMove(t.clientX, t.clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchend',    e => {
    e.preventDefault();
    if (!state.legendaryMode) joystickEnd();
  }, { passive: false });
  canvas.addEventListener('touchcancel', e => {
    e.preventDefault();
    if (!state.legendaryMode) joystickEnd();
  }, { passive: false });

  // Mouse ─────────────────────────────────────────────────────────────────────
  let mouseSwipeLocked = false;
  let mouseSwipeStartX = 0, mouseSwipeStartY = 0;

  canvas.addEventListener('mousedown', e => {
    if (state.phase !== 'playing') return;
    if (state.legendaryMode) {
      mouseSwipeStartX = e.clientX;
      mouseSwipeStartY = e.clientY;
      mouseSwipeLocked = false;
    } else {
      joystickStart(e.clientX, e.clientY);
    }
  });
  canvas.addEventListener('mousemove', e => {
    if (state.phase !== 'playing') return;
    if (state.legendaryMode) {
      if (mouseSwipeLocked) return;
      // Only register swipe while mouse button is held (buttons bitmask)
      if (!(e.buttons & 1)) return;
      const dx = e.clientX - mouseSwipeStartX;
      const dy = e.clientY - mouseSwipeStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) return;
      mouseSwipeLocked = true;
      if (Math.abs(dx) >= Math.abs(dy)) {
        queueGridDir(dx > 0 ? 1 : -1, 0);
      } else {
        queueGridDir(0, dy > 0 ? 1 : -1);
      }
    } else {
      if (!joystick.active) return;
      joystickMove(e.clientX, e.clientY);
    }
  });
  canvas.addEventListener('mouseup',     () => { if (!state.legendaryMode) joystickEnd(); });
  canvas.addEventListener('mouseleave',  () => { if (!state.legendaryMode) joystickEnd(); });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // Keyboard (legendary mode — arrow keys and WASD) ───────────────────────────
  document.addEventListener('keydown', e => {
    if (state.phase !== 'playing' || !state.legendaryMode) return;
    switch (e.key) {
      case 'ArrowUp':    case 'w': case 'W': e.preventDefault(); queueGridDir( 0, -1); break;
      case 'ArrowDown':  case 's': case 'S': e.preventDefault(); queueGridDir( 0,  1); break;
      case 'ArrowLeft':  case 'a': case 'A': e.preventDefault(); queueGridDir(-1,  0); break;
      case 'ArrowRight': case 'd': case 'D': e.preventDefault(); queueGridDir( 1,  0); break;
    }
  });

  // Block document scroll / zoom, but allow scrolling inside collection grid ──
  document.addEventListener('touchmove', e => {
    if (e.target.closest('.emoji-scroll')) return;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchstart', e => {
    if (e.target.closest('.panel') || e.target === document.getElementById('btn-pause')) return;
    e.preventDefault();
  }, { passive: false });
}
