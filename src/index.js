/**
 * vxo-morse-core — UNCLASSIFIED hobby/edu Morse learning modules
 * © 2026 Việt Vũ / VxO Digital Labs — MIT License
 */

export {
  MORSE_TABLE,
  LETTERS,
  DIGITS,
  ALPHANUM,
  encodeChar,
  encodeText,
  decodePattern,
} from './alphabet.js';

export {
  unitMsFromWpm,
  wpmFromUnitMs,
  createTimingProfile,
  patternDurationMs,
  textToEvents,
} from './timing.js';

export {
  mulberry32,
  generateDrill,
  KOCH_ORDER,
  kochChars,
} from './drill.js';

export { normalizeAnswer, scoreCopy, passesThreshold } from './score.js';

export { createTonePlayer } from './audio.js';
