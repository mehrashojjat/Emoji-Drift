// ─── js/config.js ────────────────────────────────────────────────────────────
// Centralised game configuration constants.

'use strict';

export const CFG = {
  fontSize    : 30,
  headSize    : 38,
  bodySize    : 22,
  segSpacing  : 30,
  spawnR      : 620,
  despawnR    : 840,
  minObjs     : 28,
  maxObjs     : 65,
  collectDist : 28,
  collideDist : 12,
  skipSegs    : 7,
  minSpeed    : 60,
  baseSpeed   : 300,
  turnSpeed   : 6.0,
  driftFactor : 0,
  joystickR   : 80,
  joystickKnob: 22,
  blurAlpha   : 0.62,

  // Maximum world-space radius around the snake that receives rendering.
  // Objects beyond this distance are invisible even if on-screen (gives a
  // "field of view" / fog effect and prevents heavy rendering on large monitors).
  renderR     : 680,

  // Cap the device pixel ratio so very high-DPR screens don't fill enormous
  // off-screen buffers. 2 is enough quality; 3 is rarely perceptible and costs
  // ~2.25× the fill-rate of 2.
  dprCap      : 2,
};
