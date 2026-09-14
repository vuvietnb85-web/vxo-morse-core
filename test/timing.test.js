import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  unitMsFromWpm,
  wpmFromUnitMs,
  createTimingProfile,
  patternDurationMs,
  textToEvents,
  encodeChar,
  encodeText,
} from '../src/index.js';

describe('unitMsFromWpm / wpmFromUnitMs', () => {
  it('uses PARIS 50-unit standard (20 WPM → 60 ms)', () => {
    assert.equal(unitMsFromWpm(20), 60);
    assert.equal(wpmFromUnitMs(60), 20);
  });

  it('round-trips', () => {
    for (const wpm of [5, 12, 18, 25, 40]) {
      assert.ok(Math.abs(wpmFromUnitMs(unitMsFromWpm(wpm)) - wpm) < 1e-9);
    }
  });

  it('rejects non-positive input', () => {
    assert.throws(() => unitMsFromWpm(0), RangeError);
    assert.throws(() => wpmFromUnitMs(-1), RangeError);
  });
});

describe('createTimingProfile', () => {
  it('standard gaps when effective == char speed', () => {
    const t = createTimingProfile(20);
    assert.equal(t.unitMs, 60);
    assert.equal(t.ditMs, 60);
    assert.equal(t.dahMs, 180);
    assert.equal(t.elementGapMs, 60);
    assert.equal(t.charGapMs, 180);
    assert.equal(t.wordGapMs, 420);
    assert.equal(t.effectiveWpm, 20);
  });

  it('Farnsworth stretches char/word gaps when effective < char', () => {
    const std = createTimingProfile(18);
    const fw = createTimingProfile(18, 12);
    assert.equal(fw.ditMs, std.ditMs);
    assert.equal(fw.dahMs, std.dahMs);
    assert.ok(fw.charGapMs > std.charGapMs);
    assert.ok(fw.wordGapMs > std.wordGapMs);
    assert.equal(fw.effectiveWpm, 12);
  });
});

describe('patternDurationMs / textToEvents', () => {
  it('E is one dit', () => {
    const t = createTimingProfile(20);
    assert.equal(patternDurationMs(encodeChar('E'), t), 60);
  });

  it('T is one dah', () => {
    const t = createTimingProfile(20);
    assert.equal(patternDurationMs('-', t), 180);
  });

  it('schedules tones and silences for SOS', () => {
    const t = createTimingProfile(20);
    const events = textToEvents('SOS', t);
    const tones = events.filter((e) => e.type === 'tone');
    assert.equal(tones.length, 9); // S=3, O=3, S=3
    assert.ok(events.some((e) => e.type === 'silence'));
  });
});

describe('encodeText', () => {
  it('encodes SOS', () => {
    assert.equal(encodeText('SOS'), '... --- ...');
  });
});
