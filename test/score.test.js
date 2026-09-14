import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAnswer,
  scoreCopy,
  passesThreshold,
  generateDrill,
  kochChars,
  mulberry32,
} from '../src/index.js';

describe('normalizeAnswer / scoreCopy', () => {
  it('strips spaces and lowercases via upper normalize', () => {
    assert.equal(normalizeAnswer('ab c-1'), 'ABC1');
  });

  it('scores perfect copy at 100%', () => {
    const r = scoreCopy('HELLO', 'hello');
    assert.equal(r.correct, 5);
    assert.equal(r.total, 5);
    assert.equal(r.accuracy, 1);
    assert.equal(r.mismatches.length, 0);
    assert.equal(passesThreshold(r), true);
  });

  it('counts mismatches and partial accuracy', () => {
    const r = scoreCopy('ABCD', 'ABXD');
    assert.equal(r.correct, 3);
    assert.equal(r.total, 4);
    assert.equal(r.accuracy, 0.75);
    assert.equal(passesThreshold(r, 0.9), false);
    assert.equal(passesThreshold(r, 0.7), true);
  });

  it('treats missing chars as mismatches', () => {
    const r = scoreCopy('ABC', 'A');
    assert.equal(r.correct, 1);
    assert.equal(r.mismatches.length, 2);
  });
});

describe('generateDrill', () => {
  it('is reproducible with seed', () => {
    const a = generateDrill({ length: 10, seed: 123, groupSize: 5 });
    const b = generateDrill({ length: 10, seed: 123, groupSize: 5 });
    assert.equal(a.text, b.text);
    assert.equal(a.chars.length, 10);
    assert.match(a.text, /^[A-Z]{5} [A-Z]{5}$/);
  });

  it('respects numbers charset', () => {
    const d = generateDrill({ charset: 'numbers', length: 8, groupSize: 0, seed: 1 });
    assert.match(d.text, /^[0-9]{8}$/);
  });

  it('kochChars returns prefix of Koch order', () => {
    const set = kochChars(5);
    assert.deepEqual(set, ['K', 'M', 'R', 'S', 'U']);
  });

  it('mulberry32 is deterministic', () => {
    const a = mulberry32(99);
    const b = mulberry32(99);
    assert.equal(a(), b());
  });
});
