/**
 * Simple Morse drill generator (letters / numbers) for hobby/edu practice.
 */

import { LETTERS, DIGITS, ALPHANUM } from './alphabet.js';

/**
 * @typedef {'letters' | 'numbers' | 'alphanum'} CharsetName
 */

/**
 * @param {CharsetName | string[]} charset
 * @returns {readonly string[]}
 */
function resolveCharset(charset) {
  if (Array.isArray(charset)) {
    if (charset.length === 0) {
      throw new RangeError('charset array must not be empty');
    }
    return charset.map((c) => String(c).toUpperCase());
  }
  switch (charset) {
    case 'letters':
      return LETTERS;
    case 'numbers':
      return DIGITS;
    case 'alphanum':
      return ALPHANUM;
    default:
      throw new RangeError(
        `unknown charset: ${charset} (use letters|numbers|alphanum or an array)`,
      );
  }
}

/**
 * Mulberry32 PRNG for reproducible drills when seed is provided.
 * @param {number} seed
 * @returns {() => number}  float in [0, 1)
 */
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @typedef {object} DrillOptions
 * @property {CharsetName | string[]} [charset='letters']
 * @property {number} [length=20]           Number of characters
 * @property {number} [groupSize=5]         Spaces every N chars (0 = no grouping)
 * @property {number} [seed]                Optional PRNG seed for reproducibility
 * @property {string[]} [kochSet]           If set, restrict to these chars (Koch order subset)
 */

/**
 * Generate a random drill string.
 * @param {DrillOptions} [options]
 * @returns {{ text: string, chars: string[], charset: readonly string[] }}
 */
export function generateDrill(options = {}) {
  const {
    charset = 'letters',
    length = 20,
    groupSize = 5,
    seed,
    kochSet,
  } = options;

  if (!(length > 0) || !Number.isInteger(length)) {
    throw new RangeError('length must be a positive integer');
  }
  if (groupSize < 0 || !Number.isInteger(groupSize)) {
    throw new RangeError('groupSize must be a non-negative integer');
  }

  let pool = resolveCharset(charset);
  if (kochSet && kochSet.length > 0) {
    const allowed = new Set(kochSet.map((c) => c.toUpperCase()));
    pool = pool.filter((c) => allowed.has(c));
    if (pool.length === 0) {
      throw new RangeError('kochSet filtered charset to empty');
    }
  }

  const rand = seed == null ? Math.random : mulberry32(seed);
  /** @type {string[]} */
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(pool[Math.floor(rand() * pool.length)]);
  }

  let text;
  if (groupSize === 0) {
    text = chars.join('');
  } else {
    const groups = [];
    for (let i = 0; i < chars.length; i += groupSize) {
      groups.push(chars.slice(i, i + groupSize).join(''));
    }
    text = groups.join(' ');
  }

  return { text, chars, charset: pool };
}

/**
 * Simplified Koch-style introduction order (letters + digits only).
 * Hobby/edu convenience — sequences vary by trainer; not a mandate.
 */
export const KOCH_ORDER = Object.freeze([
  'K', 'M', 'R', 'S', 'U', 'A', 'P', 'T', 'L', 'O',
  'W', 'I', 'N', 'J', 'E', 'F', '0', 'Y', 'V', 'G',
  '5', 'Q', '9', 'Z', 'H', '3', '8', 'B', '4', '2',
  '7', 'C', '1', 'D', '6', 'X',
]);

/**
 * First `n` characters of KOCH_ORDER.
 * @param {number} n
 * @returns {string[]}
 */
export function kochChars(n) {
  if (!(n > 0) || !Number.isInteger(n)) {
    throw new RangeError('n must be a positive integer');
  }
  return KOCH_ORDER.slice(0, Math.min(n, KOCH_ORDER.length));
}
