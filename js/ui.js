// ─── js/ui.js ────────────────────────────────────────────────────────────────
// Panel management, collection grid, settings UI and button bindings.

'use strict';

import { state }                              from './state.js';
import { RARITY_COLORS, RARITY_TIERS,
         EMOJI_NAMES, getRarity }             from './data.js';
import { firstGrapheme }                      from './utils.js';
import { savePersist }                        from './persist.js';

// ── DOM references ────────────────────────────────────────────────────────────

export const hudEl       = document.getElementById('hud');
export const hudHead     = document.getElementById('hud-head');
export const hudLen      = document.getElementById('hud-len');
export const goIcon      = document.getElementById('go-icon');
export const goStat      = document.getElementById('go-stat');
export const hintEl      = document.getElementById('hint');
export const btnPause    = document.getElementById('btn-pause');

const overlay     = document.getElementById('overlay');
const panelStart  = document.getElementById('panel-start');
const panelOver   = document.getElementById('panel-over');
const panelPause  = document.getElementById('panel-pause');
const panelColl   = document.getElementById('panel-collection');
const panelSett   = document.getElementById('panel-settings');
const panelDetail = document.getElementById('panel-emoji-detail');
const startFace   = document.getElementById('start-face');
const collCount   = document.getElementById('coll-count');
const collGrid    = document.getElementById('coll-grid');
const headInput   = document.getElementById('head-input');
const detailEmojiChar   = document.getElementById('detail-emoji-char');
const detailEmojiName   = document.getElementById('detail-emoji-name');
const detailRarityBadge = document.getElementById('detail-rarity-badge');

const ALL_PANELS = [panelStart, panelOver, panelPause, panelColl, panelSett, panelDetail];

// ── Panel helpers ─────────────────────────────────────────────────────────────

export function showPanel(panel) {
  ALL_PANELS.forEach(p => { p.style.display = (p === panel) ? '' : 'none'; });
  overlay.classList.add('show');
}

export function hideOverlay() { overlay.classList.remove('show'); }

// ── Settings: head emoji text input ─────────────────────────────────────────

export function initHeadInput() {
  headInput.value = state.savedHead;
  headInput.addEventListener('input', () => {
    const raw   = headInput.value;
    const first = firstGrapheme(raw);
    headInput.value = first;
    if (first && first !== state.savedHead) {
      state.savedHead = first;
      savePersist();
      startFace.textContent = state.savedHead;
    }
  });
  headInput.addEventListener('compositionend', () => {
    headInput.dispatchEvent(new Event('input'));
  });
}

// ── Collection UI ─────────────────────────────────────────────────────────────

function buildRarityLegend() {
  const legend = document.createElement('div');
  legend.className = 'rarity-legend';
  for (const { key, label } of RARITY_TIERS) {
    const item = document.createElement('div');
    item.className = 'rarity-legend-item';
    const dot = document.createElement('span');
    dot.className = 'rarity-legend-dot rl-' + key;
    const text = document.createElement('span');
    text.textContent = label;
    item.appendChild(dot);
    item.appendChild(text);
    legend.appendChild(item);
  }
  return legend;
}

function openEmojiDetail(emoji) {
  const rarity = getRarity(emoji);
  const color  = RARITY_COLORS[rarity];
  const label  = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  detailEmojiChar.textContent  = emoji;
  detailEmojiName.textContent  = EMOJI_NAMES[emoji] || 'Unknown Emoji';
  detailRarityBadge.textContent = label;
  detailRarityBadge.style.color       = color;
  detailRarityBadge.style.borderColor = color + '99';
  detailRarityBadge.style.background  = color + '18';
  showPanel(panelDetail);
}

export function buildCollectionGrid() {
  collGrid.innerHTML = '';
  const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
  const sorted = [...state.globalCollection].sort((a, b) =>
    (RARITY_ORDER[getRarity(a)] || 4) - (RARITY_ORDER[getRarity(b)] || 4)
  );
  const n = sorted.length;
  collCount.textContent = n === 0
    ? 'No emojis collected yet'
    : n + ' unique emoji' + (n !== 1 ? 's' : '') + ' collected';

  collGrid.appendChild(buildRarityLegend());

  if (n === 0) {
    const msg = document.createElement('div');
    msg.style.cssText = 'color:rgba(255,255,255,0.3);font-size:14px;padding:24px 0';
    msg.textContent = 'Start playing to fill your collection!';
    collGrid.appendChild(msg);
    return;
  }
  for (const e of sorted) {
    const rarity = getRarity(e);
    const cell   = document.createElement('div');
    cell.className   = 'emoji-cell';
    cell.textContent = e;
    cell.style.borderColor = RARITY_COLORS[rarity] + '66';
    const dot = document.createElement('span');
    dot.className = 'rarity-dot r-' + rarity;
    cell.appendChild(dot);
    cell.addEventListener('click', () => openEmojiDetail(e));
    collGrid.appendChild(cell);
  }
}

// ── Button bindings ───────────────────────────────────────────────────────────
// Accepts callbacks so ui.js stays decoupled from game logic.

function bind(el, fn) {
  el.addEventListener('click',    e => { e.preventDefault(); fn(); });
  el.addEventListener('touchend', e => { e.preventDefault(); fn(); }, { passive: false });
}

export function bindButtons({ beginGame, pauseGame, resumeGame, quitToMenu }) {
  const btnStart    = document.getElementById('btn-start');
  const btnRestart  = document.getElementById('btn-restart');
  const btnResume   = document.getElementById('btn-resume');
  const btnQuit     = document.getElementById('btn-quit');
  const btnToMenu   = document.getElementById('btn-to-menu');
  const btnColl     = document.getElementById('btn-collection');
  const btnSett     = document.getElementById('btn-settings');
  const btnCollBack = document.getElementById('btn-coll-back');
  const btnSettBack = document.getElementById('btn-settings-back');
  const btnDetailBack = document.getElementById('btn-detail-back');

  bind(btnStart,    () => { if (!state.restartLock) beginGame(); });
  bind(btnRestart,  () => { if (!state.restartLock) beginGame(); });
  bind(btnPause,    () => pauseGame());
  bind(btnResume,   () => resumeGame());
  bind(btnQuit,     () => quitToMenu());
  bind(btnToMenu,   () => quitToMenu());

  bind(btnColl,  () => { buildCollectionGrid(); showPanel(panelColl); });
  bind(btnSett,  () => {
    headInput.value = state.savedHead;
    showPanel(panelSett);
    setTimeout(() => headInput.focus(), 50);
  });
  bind(btnCollBack,   () => showPanel(panelStart));
  bind(btnSettBack,   () => showPanel(panelStart));
  bind(btnDetailBack, () => { buildCollectionGrid(); showPanel(panelColl); });
}

// ── Idle world initialiser (start screen) ─────────────────────────────────────

import { pickWorldItem } from './data.js';

export function initIdleWorld() {
  state.world = [];
  for (let i = 0; i < 42; i++) {
    const ang  = Math.random() * Math.PI * 2;
    const r    = 55 + Math.random() * 500;
    const item = pickWorldItem();
    state.world.push({
      x     : Math.cos(ang) * r,
      y     : Math.sin(ang) * r,
      e     : item.e,
      rarity: item.rarity,
      alpha : Math.random() * 0.4 + 0.08,
      scale : Math.random() * 0.6 + 0.3,
      bob   : Math.random() * Math.PI * 2,
      bobSpd: 0.45 + Math.random() * 0.55,
    });
  }
}

export function initIdleSnake() {
  state.snake = {
    x: 0, y: 0,
    vx: 1, vy: 0,
    tx: 1, ty: 0,
    face: state.savedHead,
    segs: [],
    len : 1,
  };
}

export { panelStart, panelOver, panelPause, panelColl, panelSett, startFace, headInput };
