# Morse timing notes (hobby / education)

> **UNCLASSIFIED — educational material only.**  
> This document summarizes common amateur-radio practice for learning International Morse.  
> It is **not** an official ITU, FCC, or licensing authority reference, and it is **not** a certification guide.

## What Morse is (for learners)

International Morse encodes letters and digits as sequences of short tones (**dits**, written `.`) and long tones (**dahs**, written `-`). Spacing between elements, characters, and words carries meaning just as much as the tones themselves.

This package maps A–Z and 0–9 using the familiar International Morse patterns used in amateur radio education.

## Timing units (PARIS standard)

Amateurs conventionally measure speed in **words per minute (WPM)** using the word **PARIS** as a timing standard:

- **PARIS** plus a word space ≈ **50 dit-units**.
- Therefore: `unitMs = 1200 / WPM` (milliseconds per dit unit).

### Element lengths (at character speed)

| Element            | Length        |
|--------------------|---------------|
| Dit (`.`)          | 1 unit        |
| Dah (`-`)          | 3 units       |
| Gap inside a char  | 1 unit        |
| Gap between chars  | 3 units       |
| Gap between words  | 7 units       |

Example at **20 WPM**: unit ≈ 60 ms → dit 60 ms, dah 180 ms.

## Koch method (character introduction)

**Koch** training introduces characters gradually (often starting near full character speed) so the learner hears complete patterns rather than counting dits and dahs. This repo exposes a simplified `KOCH_ORDER` and `kochChars(n)` helper for drills — sequences vary between trainers; treat ours as a convenience default.

## Farnsworth timing

**Farnsworth** keeps character *elements* at a higher **character WPM** while slowing the overall **effective WPM** by stretching gaps between characters (and words). Learners hear crisp character shapes early, without needing to copy at full overall speed yet.

In `vxo-morse-core`:

```js
import { createTimingProfile } from 'vxo-morse-core';

// Elements at 18 WPM, overall ~12 WPM via stretched gaps
const timing = createTimingProfile(18, 12);
```

## Encoding examples

| Char | Morse  |
|------|--------|
| E    | `.`    |
| T    | `-`    |
| A    | `.-`   |
| N    | `-.`   |
| 5    | `.....`|
| 0    | `-----`|

## What this project is not

- Not military, cryptographic, or classified signaling material.
- Not a substitute for licensed instructor materials or exam syllabi.
- Commercial lesson packs / storefront products are **out of scope** for this FOSS core (see README).

## Further reading (external)

Learners may consult freely available amateur-radio education resources from national societies (e.g. ARRL, DARC, RSGB) and ITU-R recommendations on International Morse for historical context. Always prefer primary sources when preparing for a license exam.
