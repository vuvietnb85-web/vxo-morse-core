/**
 * International Morse (ITU-R M.1677-ish) letter/digit map for hobby/edu use.
 * Not an official certification reference — see docs/protocol.md.
 */

/** @type {Readonly<Record<string, string>>} */
export const MORSE_TABLE = Object.freeze({
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
});

/** Letters A–Z */
export const LETTERS = Object.freeze(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
);

/** Digits 0–9 */
export const DIGITS = Object.freeze('0123456789'.split(''));

/** Letters + digits */
export const ALPHANUM = Object.freeze([...LETTERS, ...DIGITS]);

/**
 * Encode a single character to Morse dots/dashes, or null if unknown.
 * @param {string} ch
 * @returns {string | null}
 */
export function encodeChar(ch) {
  if (!ch || ch.length === 0) return null;
  const key = ch.toUpperCase();
  return MORSE_TABLE[key] ?? null;
}

/**
 * Encode text to Morse groups separated by spaces (char gap) and `/` (word gap).
 * Unknown chars are skipped.
 * @param {string} text
 * @returns {string}
 */
export function encodeText(text) {
  const words = String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words
    .map((word) =>
      [...word]
        .map((c) => encodeChar(c))
        .filter(Boolean)
        .join(' '),
    )
    .filter((w) => w.length > 0)
    .join(' / ');
}

/**
 * Decode a Morse pattern (dots/dashes only) to a character, or null.
 * @param {string} pattern
 * @returns {string | null}
 */
export function decodePattern(pattern) {
  const p = String(pattern).trim();
  for (const [ch, code] of Object.entries(MORSE_TABLE)) {
    if (code === p) return ch;
  }
  return null;
}
