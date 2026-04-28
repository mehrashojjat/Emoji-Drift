// ─── js/utils.js ─────────────────────────────────────────────────────────────
// Small, dependency-free utility functions.

'use strict';

/** Squared Euclidean distance between (ax, ay) and (bx, by). */
export function dist2(ax, ay, bx, by) {
  const dx = ax - bx, dy = ay - by;
  return dx * dx + dy * dy;
}

/**
 * Extract the first grapheme cluster from an arbitrary string.
 * Falls back to the first Unicode code point when Intl.Segmenter is unavailable.
 */
export function firstGrapheme(str) {
  if (!str) return '';
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter();
    for (const { segment } of seg.segment(str)) return segment;
  }
  const cp = str.codePointAt(0);
  return cp !== undefined ? String.fromCodePoint(cp) : str[0];
}
