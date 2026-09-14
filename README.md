# vxo-morse-core

**UNCLASSIFIED** hobby / education Morse learning **core** for [SPONSOR HUNT](https://github.com/vxo-digital-labs) / **VxO Digital Labs**.

Honest, minimal, MIT-licensed JavaScript modules: Koch/Farnsworth-style timing, character↔WPM helpers, drill generation, simple scoring, and a browser Web Audio tone helper.

> Commercial lesson packs and the storefront are **separate** and **out of scope** for this FOSS package:  
> **Store:** <https://8nm-edu-store.pages.dev>

## What it is

| Module        | Role |
|---------------|------|
| `alphabet`    | International Morse map for A–Z / 0–9, encode/decode |
| `timing`      | Unit/WPM conversion, Koch/Farnsworth timing profiles, event schedule |
| `drill`       | Random letter/number drills, optional Koch subset + seed |
| `score`       | Normalize + character-level copy accuracy |
| `audio`       | Optional `AudioContext` Morse player (browser) |

**Not included:** military/crypto/classified content, exam certification, or paid pack content.

## Install

```bash
npm install vxo-morse-core
```

Requires **Node ≥ 18** (ESM). Zero runtime dependencies.

Or copy `src/` into your project — it is plain ESM JavaScript.

## Usage

```js
import {
  encodeText,
  createTimingProfile,
  generateDrill,
  scoreCopy,
  createTonePlayer,
} from 'vxo-morse-core';

// Encode
console.log(encodeText('SOS')); // "... --- ..."

// Farnsworth-style timing: elements @ 18 WPM, effective ~12 WPM
const timing = createTimingProfile(18, 12);
console.log(timing.ditMs, timing.charGapMs);

// Reproducible drill
const drill = generateDrill({
  charset: 'letters',
  length: 20,
  groupSize: 5,
  seed: 42,
});
console.log(drill.text);

// Score a learner's copy-back
const result = scoreCopy(drill.text, '.....'); // example
console.log(result.accuracy, result.correct, result.total);

// Browser only — Web Audio playback
// const player = createTonePlayer({ charWpm: 18, effectiveWpm: 12, frequency: 600 });
// await player.play(drill.text);
```

### Browser demo

Open [`examples/browser-demo.html`](./examples/browser-demo.html) in a modern browser (or serve the repo root with any static server so ES modules resolve).

### Protocol notes

See [`docs/protocol.md`](./docs/protocol.md) for ITU-ish timing notes for learners (educational, not official certification).

## Scripts

```bash
npm test           # node:test — timing + scoring + drills
npm run demo:check # smoke-import the package entry
```

## Roadmap

- [x] Core timing / alphabet / drill / score / Web Audio helper
- [x] Docs + Secure OSS hygiene (`SECURITY.md`, Dependabot skeleton)
- [ ] Optional TypeScript types (`.d.ts`) without forcing a build
- [ ] Koch lesson progression UI sample (still FOSS, no store coupling)
- [ ] CI workflow (GitHub Actions) once the remote is connected
- [ ] Publish to npm under `vxo-morse-core` when ready

## License

[MIT](./LICENSE) © 2026 **Việt Vũ / VxO Digital Labs**

## Related (commercial, out of scope)

Paid / packaged learning products live outside this repository:

- Store: <https://8nm-edu-store.pages.dev>
