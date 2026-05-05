// ─── js/world.js ─────────────────────────────────────────────────────────────
// World object spawning and despawning.

'use strict';

import { CFG }                         from './config.js';
import { state }                       from './state.js';
import { dist2 }                       from './utils.js';
import { pickWorldItem }               from './data.js';

/** Spawn world objects around the snake until the target count is reached. */
export function spawnWorld(initial) {
  const target = Math.min(CFG.maxObjs, CFG.minObjs + Math.floor(state.snake.len * 0.4));
  let tries = 0;

  if (state.legendaryMode) {
    const GS = CFG.gridSize;
    // Build a set of occupied grid cells (existing world objects + snake head).
    const occupied = new Set();
    for (const o of state.world) occupied.add(o.gx + ',' + o.gy);
    // Also mark the snake's head cell.
    const hx = Math.round(state.snake.x / GS);
    const hy = Math.round(state.snake.y / GS);
    occupied.add(hx + ',' + hy);

    while (state.world.length < target && tries++ < 600) {
      const ang = Math.random() * Math.PI * 2;
      const r   = (0.25 + Math.random() * 0.75) * CFG.spawnR;
      const wx  = state.snake.x + Math.cos(ang) * r;
      const wy  = state.snake.y + Math.sin(ang) * r;
      if (dist2(wx, wy, state.snake.x, state.snake.y) < 70 * 70) continue;

      // Snap to nearest grid cell.
      const gx = Math.round(wx / GS);
      const gy = Math.round(wy / GS);
      const key = gx + ',' + gy;
      if (occupied.has(key)) continue;

      occupied.add(key);
      const item = pickWorldItem();
      state.world.push({
        gx,
        gy,
        x     : gx * GS,
        y     : gy * GS,
        e     : item.e,
        rarity: item.rarity,
        alpha : initial ? Math.random() * 0.5 + 0.1 : 0,
        scale : initial ? Math.random() * 0.7 + 0.3 : 0.01,
        bob   : 0,
        bobSpd: 1,
      });
    }
  } else {
    while (state.world.length < target && tries++ < 350) {
      const ang = Math.random() * Math.PI * 2;
      const r   = (0.25 + Math.random() * 0.75) * CFG.spawnR;
      const wx  = state.snake.x + Math.cos(ang) * r;
      const wy  = state.snake.y + Math.sin(ang) * r;
      if (dist2(wx, wy, state.snake.x, state.snake.y) < 70 * 70) continue;
      let ok = true;
      for (const o of state.world) {
        if (dist2(wx, wy, o.x, o.y) < 30 * 30) { ok = false; break; }
      }
      if (!ok) continue;
      const item = pickWorldItem();
      state.world.push({
        x     : wx,
        y     : wy,
        e     : item.e,
        rarity: item.rarity,
        alpha : initial ? Math.random() * 0.5 + 0.1 : 0,
        scale : initial ? Math.random() * 0.7 + 0.3 : 0.01,
        bob   : Math.random() * Math.PI * 2,
        bobSpd: 0.45 + Math.random() * 0.55,
      });
    }
  }
}

/** Remove world objects that have drifted beyond the despawn radius. */
export function despawnWorld() {
  const r2 = CFG.despawnR * CFG.despawnR;
  const sx = state.snake.x, sy = state.snake.y;
  for (let i = state.world.length - 1; i >= 0; i--) {
    if (dist2(state.world[i].x, state.world[i].y, sx, sy) > r2) {
      state.world.splice(i, 1);
    }
  }
}
