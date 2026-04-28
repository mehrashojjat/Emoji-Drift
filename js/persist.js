// ─── js/persist.js ───────────────────────────────────────────────────────────
// localStorage persistence with a dirty-flag debounce.
//
// Performance note: the original code called savePersist() synchronously on
// every emoji collection (which triggers JSON.stringify + two localStorage
// writes).  We now set a dirty flag and flush at most once per 400 ms.

'use strict';

import { state }        from './state.js';
import { FACE_POOL }    from './data.js';
import { firstGrapheme } from './utils.js';

const LS_HEAD = 'emojiDrift_head';
const LS_COLL = 'emojiDrift_collection';

let   _dirty    = false;
let   _flushId  = 0;

/** Load savedHead and globalCollection from localStorage. */
export function loadPersist() {
  try {
    const h = localStorage.getItem(LS_HEAD);
    state.savedHead = (h && firstGrapheme(h)) ? h : null;
  } catch { state.savedHead = null; }

  if (!state.savedHead) {
    state.savedHead = FACE_POOL[Math.floor(Math.random() * FACE_POOL.length)];
    try { localStorage.setItem(LS_HEAD, state.savedHead); } catch {}
  }

  try {
    const raw = localStorage.getItem(LS_COLL);
    state.globalCollection = raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { state.globalCollection = new Set(); }
}

/** Mark data as changed and schedule a flush within 400 ms. */
export function savePersist() {
  _dirty = true;
  if (_flushId) return;          // already scheduled
  _flushId = setTimeout(_flush, 400);
}

function _flush() {
  _flushId = 0;
  if (!_dirty) return;
  _dirty = false;
  try {
    localStorage.setItem(LS_HEAD, state.savedHead);
    localStorage.setItem(LS_COLL, JSON.stringify([...state.globalCollection]));
  } catch {}
}

/** Force an immediate flush (called on quit / game-over). */
export function flushPersist() {
  clearTimeout(_flushId);
  _flushId = 0;
  _flush();
}
