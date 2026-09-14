/**
 * Simple scoring helpers for Morse drill copy-back (edu).
 */

/**
 * Normalize answer text for comparison: uppercase, strip non-alphanumeric.
 * @param {string} text
 * @returns {string}
 */
export function normalizeAnswer(text) {
  return String(text)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Character-level accuracy between expected and actual copy.
 * @param {string} expected
 * @param {string} actual
 * @returns {{
 *   expectedNorm: string,
 *   actualNorm: string,
 *   correct: number,
 *   total: number,
 *   accuracy: number,
 *   mismatches: Array<{ index: number, expected: string, actual: string }>
 * }}
 */
export function scoreCopy(expected, actual) {
  const expectedNorm = normalizeAnswer(expected);
  const actualNorm = normalizeAnswer(actual);
  const total = expectedNorm.length;
  let correct = 0;
  /** @type {Array<{ index: number, expected: string, actual: string }>} */
  const mismatches = [];

  for (let i = 0; i < total; i++) {
    const e = expectedNorm[i];
    const a = actualNorm[i] ?? '';
    if (a === e) {
      correct += 1;
    } else {
      mismatches.push({ index: i, expected: e, actual: a || '∅' });
    }
  }

  const accuracy = total === 0 ? 1 : correct / total;
  return {
    expectedNorm,
    actualNorm,
    correct,
    total,
    accuracy,
    mismatches,
  };
}

/**
 * Whether a score meets a pass threshold (default 90%).
 * @param {{ accuracy: number }} result
 * @param {number} [threshold=0.9]
 * @returns {boolean}
 */
export function passesThreshold(result, threshold = 0.9) {
  if (!(threshold >= 0 && threshold <= 1)) {
    throw new RangeError('threshold must be between 0 and 1');
  }
  return result.accuracy >= threshold;
}
