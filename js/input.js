// ─── js/input.js ─────────────────────────────────────────────────────────────
// Virtual joystick logic and raw event listeners.

'use strict';

import { CFG }      from './config.js';
import { state, joystick } from './state.js';

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

// ── Event registration ───────────────────────────────────────────────────────
// Called once from game.js after the canvas exists.

export function registerInputEvents(canvas) {
  // Touch ─────────────────────────────────────────────────────────────────────
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (state.phase !== 'playing') return;
    const t = e.changedTouches[0];
    joystickStart(t.clientX, t.clientY);
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!joystick.active) return;
    const t = e.changedTouches[0];
    joystickMove(t.clientX, t.clientY);
  }, { passive: false });

  canvas.addEventListener('touchend',    e => { e.preventDefault(); joystickEnd(); }, { passive: false });
  canvas.addEventListener('touchcancel', e => { e.preventDefault(); joystickEnd(); }, { passive: false });

  // Mouse ─────────────────────────────────────────────────────────────────────
  canvas.addEventListener('mousedown', e => {
    if (state.phase !== 'playing') return;
    joystickStart(e.clientX, e.clientY);
  });
  canvas.addEventListener('mousemove', e => {
    if (!joystick.active) return;
    joystickMove(e.clientX, e.clientY);
  });
  canvas.addEventListener('mouseup',     () => joystickEnd());
  canvas.addEventListener('mouseleave',  () => joystickEnd());
  canvas.addEventListener('contextmenu', e => e.preventDefault());

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
