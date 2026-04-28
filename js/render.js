// ─── js/render.js ────────────────────────────────────────────────────────────
// Canvas setup and per-frame rendering.
//
// Performance notes
// ─────────────────
// • devicePixelRatio is capped at CFG.dprCap (2) to avoid huge off-screen
//   buffers on 3× retina panels where the extra sharpness is imperceptible.
// • World objects are culled to CFG.renderR world-space pixels around the
//   snake.  This gives a consistent "field of view" regardless of screen size
//   and prevents large-monitor performance degradation.
// • Snake body segments (glow and emoji) are skipped when off-screen, avoiding
//   O(n) draw calls for very long snakes that extend beyond the viewport.
// • ctx.filter='blur(...)' has been removed (expensive GPU blit on every call).
//   A subtle per-object shadow is used instead for the blurry world-object look.

'use strict';

import { CFG }                         from './config.js';
import { state, joystick }             from './state.js';
import { RARITY_COLORS }               from './data.js';

export const canvas = document.getElementById('canvas');
export const ctx    = canvas.getContext('2d');

// Current logical viewport dimensions and precomputed render-radius squared.
export const screen = { W: 0, H: 0, renderR2: 0 };

export function resize() {
  screen.W = window.innerWidth;
  screen.H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
  canvas.width        = Math.round(screen.W * dpr);
  canvas.height       = Math.round(screen.H * dpr);
  canvas.style.width  = screen.W + 'px';
  canvas.style.height = screen.H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Pre-compute the effective render radius squared once per resize.
  // We use the smaller of:
  //   • CFG.renderR  — fixed world-space fog-of-view radius
  //   • screen diagonal / 2 + margin — never clip visible pixels
  const diagHalf = Math.sqrt(screen.W * screen.W + screen.H * screen.H) * 0.5 + 60;
  const effR     = Math.min(CFG.renderR, diagHalf);
  screen.renderR2 = effR * effR;
}

resize();
window.addEventListener('resize', resize);

// ── Main render function ─────────────────────────────────────────────────────

export function render(now) {
  const { W, H, renderR2 } = screen;
  const t  = now * 0.001;

  const sx = state.snake.x;
  const sy = state.snake.y;

  // Camera offset so the snake is always at screen centre.
  const cx = W * 0.5 - sx;
  const cy = H * 0.5 - sy;

  // ── Background ─────────────────────────────────────────────────────────────
  ctx.fillStyle = '#07071a';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(cx, cy);

  // ── Rare+ aura circles under world objects ──────────────────────────────────
  for (const o of state.world) {
    if (o.rarity === 'common' || o.rarity === 'uncommon') continue;
    if ((o.x - sx) * (o.x - sx) + (o.y - sy) * (o.y - sy) > renderR2) continue;
    const bob   = Math.sin(t * o.bobSpd + o.bob) * 3.5;
    const pulse = o.rarity === 'legendary'
      ? 0.45 + 0.45 * Math.abs(Math.sin(t * 3.5))
      : 0.28;
    ctx.globalAlpha = o.alpha * pulse;
    ctx.fillStyle   = RARITY_COLORS[o.rarity];
    ctx.beginPath();
    ctx.arc(o.x, o.y + bob, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── World objects — semi-transparent, soft shadow ──────────────────────────
  // (ctx.filter blur removed; per-object shadowBlur gives a similar soft look
  //  at much lower GPU cost, especially on mobile.)
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = CFG.fontSize + 'px sans-serif';
  ctx.shadowColor  = 'rgba(255,255,255,0.18)';
  ctx.shadowBlur   = 6;

  for (const o of state.world) {
    if ((o.x - sx) * (o.x - sx) + (o.y - sy) * (o.y - sy) > renderR2) continue;
    const bob = Math.sin(t * o.bobSpd + o.bob) * 3.5;
    ctx.globalAlpha = o.alpha * o.scale;
    if (o.scale < 0.999) {
      ctx.save();
      ctx.translate(o.x, o.y + bob);
      ctx.scale(o.scale, o.scale);
      ctx.fillText(o.e, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(o.e, o.x, o.y + bob);
    }
  }

  ctx.shadowBlur  = 0;
  ctx.shadowColor = 'transparent';

  // ── Snake — only during play / death ───────────────────────────────────────
  if (state.phase !== 'start') {
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha  = 1;

    const nSegs   = state.snake.segs.length;
    const headBob = Math.sin(t * 4.5) * 2.2;

    // Screen-space clip bounds (world coordinates) for body cull.
    const clipL = sx - W * 0.5 - CFG.bodySize;
    const clipR = sx + W * 0.5 + CFG.bodySize;
    const clipT = sy - H * 0.5 - CFG.bodySize;
    const clipB = sy + H * 0.5 + CFG.bodySize;

    // Head glow
    ctx.globalAlpha = 0.50;
    ctx.fillStyle   = state.snake.face === '👺' ? '#facc15' : 'hsl(270, 100%, 72%)';
    ctx.beginPath();
    ctx.arc(sx, sy + headBob, 28, 0, Math.PI * 2);
    ctx.fill();

    // Body glow (back-to-front; skip off-screen segments)
    for (let i = nSegs - 1; i >= 0; i--) {
      const s = state.snake.segs[i];
      if (s.x < clipL || s.x > clipR || s.y < clipT || s.y > clipB) continue;
      const wobble = Math.sin(t * 3.5 + i * 0.45) * 1.8;
      const fade   = 1 - (i / Math.max(1, nSegs)) * 0.55;
      const hue    = (40 + i * 20) % 360;
      ctx.globalAlpha = 0.22 * fade;
      ctx.fillStyle   = 'hsl(' + hue + ', 100%, 65%)';
      ctx.beginPath();
      ctx.arc(s.x, s.y + wobble, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Body emojis (back-to-front; skip off-screen segments)
    ctx.shadowBlur = 12;
    for (let i = nSegs - 1; i >= 0; i--) {
      const s = state.snake.segs[i];
      if (s.x < clipL || s.x > clipR || s.y < clipT || s.y > clipB) continue;
      const wobble = Math.sin(t * 3.5 + i * 0.45) * 1.8;
      const frac   = 1 - i / Math.max(1, nSegs);
      const hue    = (40 + i * 20) % 360;
      ctx.shadowColor = 'hsl(' + hue + ', 100%, 70%)';
      ctx.globalAlpha = 0.75 + 0.25 * frac;
      ctx.font        = Math.round(CFG.bodySize * (0.75 + 0.25 * frac)) + 'px sans-serif';
      ctx.fillText(s.e, s.x, s.y + wobble);
    }
    ctx.shadowBlur = 0;

    // Head emoji
    const isGoblin = state.snake.face === '👺';
    ctx.shadowColor = isGoblin ? 'rgba(250,204,21,0.95)' : 'rgba(255,220,120,0.95)';
    ctx.shadowBlur  = isGoblin ? 38 : 24;
    ctx.globalAlpha = 1.0;
    ctx.font        = CFG.headSize + 'px sans-serif';
    ctx.fillText(state.snake.face, sx, sy + headBob);
    ctx.shadowBlur  = 0;
    ctx.shadowColor = 'transparent';
  }

  ctx.restore(); // end camera transform

  // ── Render-radius vignette ─────────────────────────────────────────────────
  // Draws a subtle dark ring that fades out at the edge of CFG.renderR,
  // reinforcing the "field of view" feel.
  if (state.phase !== 'start') {
    const scrCx = W * 0.5;
    const scrCy = H * 0.5;
    const innerR = Math.min(CFG.renderR * 0.7, Math.min(W, H) * 0.38);
    const outerR = Math.sqrt(W * W + H * H) * 0.5 + 2;
    const grad = ctx.createRadialGradient(scrCx, scrCy, innerR, scrCx, scrCy, outerR);
    grad.addColorStop(0,   'rgba(7,7,26,0)');
    grad.addColorStop(1,   'rgba(7,7,26,0.82)');
    ctx.globalAlpha = 1;
    ctx.fillStyle   = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Death vignette ─────────────────────────────────────────────────────────
  if (state.phase === 'dead') {
    state.deathA = Math.min(0.40, state.deathA + 0.015);
    ctx.globalAlpha = state.deathA;
    ctx.fillStyle = '#dc1414';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // ── Virtual joystick ───────────────────────────────────────────────────────
  if (joystick.active && state.phase === 'playing') {
    ctx.save();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(joystick.cx, joystick.cy, CFG.joystickR, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(joystick.cx, joystick.cy);
    ctx.lineTo(joystick.curX, joystick.curY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(joystick.curX, joystick.curY, CFG.joystickKnob, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(255, 255, 255, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
