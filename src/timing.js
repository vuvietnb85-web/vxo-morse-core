/**
 * Koch / Farnsworth-style Morse timing helpers (hobby/edu).
 *
 * Standard model (common amateur practice):
 * - 1 dit unit = unitMs
 * - dah = 3 units
 * - element gap (intra-char) = 1 unit
 * - character gap = 3 units
 * - word gap = 7 units
 *
 * Farnsworth: character elements at a higher “character speed” (charWpm),
 * with stretched inter-character / inter-word gaps so overall “effective”
 * speed is effectiveWpm < charWpm.
 */

import { encodeChar } from './alphabet.js';

/**
 * Unit length in milliseconds for a given WPM (PARIS standard: 50 units/word).
 * @param {number} wpm
 * @returns {number}
 */
export function unitMsFromWpm(wpm) {
  if (!(wpm > 0)) {
    throw new RangeError('wpm must be a positive number');
  }
  // 60_000 ms/min / (50 units/word * wpm) = 1200 / wpm
  return 1200 / wpm;
}

/**
 * WPM from unit length in ms.
 * @param {number} unitMs
 * @returns {number}
 */
export function wpmFromUnitMs(unitMs) {
  if (!(unitMs > 0)) {
    throw new RangeError('unitMs must be a positive number');
  }
  return 1200 / unitMs;
}

/**
 * @typedef {object} TimingProfile
 * @property {number} charWpm           Character (element) speed
 * @property {number} effectiveWpm      Overall / Farnsworth effective speed
 * @property {number} unitMs            Dit unit at charWpm
 * @property {number} ditMs
 * @property {number} dahMs
 * @property {number} elementGapMs      Gap between elements inside a char
 * @property {number} charGapMs         Gap between characters (Farnsworth-adjusted)
 * @property {number} wordGapMs         Gap between words (Farnsworth-adjusted)
 */

/**
 * Build a timing profile. If effectiveWpm is omitted or >= charWpm, gaps
 * use standard 3/7 unit spacing (no Farnsworth stretch).
 *
 * @param {number} charWpm
 * @param {number} [effectiveWpm]
 * @returns {TimingProfile}
 */
export function createTimingProfile(charWpm, effectiveWpm) {
  if (!(charWpm > 0)) {
    throw new RangeError('charWpm must be a positive number');
  }
  const eff =
    effectiveWpm == null || effectiveWpm >= charWpm
      ? charWpm
      : effectiveWpm;
  if (!(eff > 0)) {
    throw new RangeError('effectiveWpm must be a positive number');
  }

  const unitMs = unitMsFromWpm(charWpm);
  const ditMs = unitMs;
  const dahMs = 3 * unitMs;
  const elementGapMs = unitMs;

  const stdCharGap = 3 * unitMs;
  const stdWordGap = 7 * unitMs;

  let charGapMs = stdCharGap;
  let wordGapMs = stdWordGap;

  if (eff < charWpm) {
    // Farnsworth stretch: extra delay into char/word gaps so that a
    // PARIS-length word matches effectiveWpm overall duration.
    const baseWordMs = 50 * unitMs;
    const targetWordMs = 50 * unitMsFromWpm(eff);
    const extraMs = Math.max(0, targetWordMs - baseWordMs);
    // ~75% across 4 inter-character gaps in PARIS, ~25% on word gap
    const extraPerCharGap = (extraMs * 0.75) / 4;
    const extraWordGap = extraMs * 0.25;
    charGapMs = stdCharGap + extraPerCharGap;
    wordGapMs = stdWordGap + extraWordGap;
  }

  return Object.freeze({
    charWpm,
    effectiveWpm: eff,
    unitMs,
    ditMs,
    dahMs,
    elementGapMs,
    charGapMs,
    wordGapMs,
  });
}

/**
 * Duration in ms to play one Morse character pattern (elements + intra gaps),
 * excluding following char/word gap.
 * @param {string} pattern  e.g. "-..."
 * @param {TimingProfile} timing
 * @returns {number}
 */
export function patternDurationMs(pattern, timing) {
  const elems = [...String(pattern)].filter((c) => c === '.' || c === '-');
  if (elems.length === 0) return 0;
  let ms = 0;
  elems.forEach((el, i) => {
    ms += el === '.' ? timing.ditMs : timing.dahMs;
    if (i < elems.length - 1) ms += timing.elementGapMs;
  });
  return ms;
}

/**
 * Expand text into a sequence of timed tone/silence events for playback.
 * @param {string} text
 * @param {TimingProfile} timing
 * @returns {Array<{ type: 'tone' | 'silence', ms: number, char?: string }>}
 */
export function textToEvents(text, timing) {
  /** @type {Array<{ type: 'tone' | 'silence', ms: number, char?: string }>} */
  const events = [];
  const words = String(text).trim().split(/\s+/).filter(Boolean);

  words.forEach((word, wi) => {
    const chars = [...word];
    let emittedInWord = 0;
    chars.forEach((raw) => {
      const pattern = encodeChar(raw);
      if (!pattern) return;
      if (emittedInWord > 0) {
        events.push({ type: 'silence', ms: timing.charGapMs });
      }
      const elems = [...pattern].filter((c) => c === '.' || c === '-');
      elems.forEach((el, ei) => {
        events.push({
          type: 'tone',
          ms: el === '.' ? timing.ditMs : timing.dahMs,
          char: raw.toUpperCase(),
        });
        if (ei < elems.length - 1) {
          events.push({ type: 'silence', ms: timing.elementGapMs });
        }
      });
      emittedInWord += 1;
    });
    if (wi < words.length - 1 && emittedInWord > 0) {
      events.push({ type: 'silence', ms: timing.wordGapMs });
    }
  });

  return events;
}
