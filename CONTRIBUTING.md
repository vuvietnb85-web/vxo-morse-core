# Contributing

Thanks for interest in **vxo-morse-core** (VxO Digital Labs / SPONSOR HUNT).

## Scope

This repository is **UNCLASSIFIED hobby/edu** Morse learning modules only:

- Timing (Koch / Farnsworth-style helpers)
- Alphabet encode/decode for letters & digits
- Drill generation and simple scoring
- Optional browser Web Audio helper

**Out of scope:** military/crypto/classified material, commercial lesson packs, storefront integrations, and payment/PII features.

Commercial products remain separate: <https://8nm-edu-store.pages.dev>

## How to contribute

1. Fork and create a feature branch.
2. Keep changes minimal and well-tested (`npm test`).
3. Do not add runtime dependencies without a clear need.
4. Use clear commit messages; follow existing code style (ESM, JSDoc).
5. Open a PR describing *why* the change helps learners or maintainers.

## Development

```bash
npm install   # none required today; reserved for future
npm test
npm run demo:check
```

Open `examples/browser-demo.html` in a browser (or via a static file server).

## License

By contributing, you agree your contributions are licensed under the **MIT License** (copyright 2026 Việt Vũ / VxO Digital Labs).
