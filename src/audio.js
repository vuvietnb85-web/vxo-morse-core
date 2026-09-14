/**
 * Browser-friendly Web Audio Morse tone player helper.
 *
 * Works in browsers with AudioContext. In Node, createTonePlayer will throw
 * unless you pass a custom context factory — use the event schedule from
 * timing.textToEvents for offline rendering or tests instead.
 */

import { createTimingProfile, textToEvents } from './timing.js';

/**
 * @typedef {object} TonePlayerOptions
 * @property {number} [frequency=600]     Hz
 * @property {number} [gain=0.2]          0..1 linear gain
 * @property {number} [charWpm=20]
 * @property {number} [effectiveWpm]      Farnsworth effective WPM
 * @property {() => AudioContext} [createContext]
 */

/**
 * @typedef {object} TonePlayer
 * @property {(text: string) => Promise<void>} play
 * @property {() => void} stop
 * @property {boolean} playing
 * @property {AudioContext | null} context
 */

/**
 * Create a simple Morse tone player using Web Audio API.
 * @param {TonePlayerOptions} [options]
 * @returns {TonePlayer}
 */
export function createTonePlayer(options = {}) {
  const {
    frequency = 600,
    gain = 0.2,
    charWpm = 20,
    effectiveWpm,
    createContext,
  } = options;

  /** @type {AudioContext | null} */
  let ctx = null;
  /** @type {OscillatorNode[]} */
  let activeOsc = [];
  let playing = false;
  /** @type {number} */
  let playGen = 0;

  function ensureContext() {
    if (ctx) return ctx;
    const factory =
      createContext ??
      (() => {
        const AC =
          typeof globalThis !== 'undefined' &&
          (globalThis.AudioContext || globalThis.webkitAudioContext);
        if (!AC) {
          throw new Error(
            'Web Audio API not available. Pass createContext or use in a browser.',
          );
        }
        return new AC();
      });
    ctx = factory();
    return ctx;
  }

  function stop() {
    playGen += 1;
    playing = false;
    for (const osc of activeOsc) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    activeOsc = [];
  }

  /**
   * @param {string} text
   * @returns {Promise<void>}
   */
  async function play(text) {
    stop();
    const myGen = playGen;
    const audio = ensureContext();
    if (audio.state === 'suspended') {
      await audio.resume();
    }

    const timing = createTimingProfile(charWpm, effectiveWpm);
    const events = textToEvents(text, timing);
    playing = true;

    const master = audio.createGain();
    master.gain.value = gain;
    master.connect(audio.destination);

    let t = audio.currentTime + 0.02;
    for (const ev of events) {
      if (myGen !== playGen) return;
      if (ev.type === 'tone') {
        const osc = audio.createOscillator();
        const g = audio.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        // Short attack/release to reduce clicks
        const attack = 0.005;
        const release = 0.008;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(1, t + attack);
        g.gain.setValueAtTime(1, t + ev.ms / 1000 - release);
        g.gain.linearRampToValueAtTime(0, t + ev.ms / 1000);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + ev.ms / 1000 + 0.01);
        activeOsc.push(osc);
      }
      t += ev.ms / 1000;
    }

    const waitMs = Math.max(0, (t - audio.currentTime) * 1000);
    await new Promise((r) => setTimeout(r, waitMs));
    if (myGen === playGen) {
      playing = false;
      activeOsc = [];
    }
  }

  return {
    play,
    stop,
    get playing() {
      return playing;
    },
    get context() {
      return ctx;
    },
  };
}
