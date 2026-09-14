# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a vulnerability

This package is a small **offline** Morse learning library (timing, drills, optional Web Audio playback). It does not include network services, authentication, or cryptography.

If you discover a security issue (for example in dependency hygiene, prototype pollution via unexpected input handling, or unsafe demo patterns):

1. Open a **private** security advisory on the GitHub repository if available, **or**
2. Email the maintainers via the contact listed on the GitHub org / VxO Digital Labs public pages.

Please include:

- A short description of the issue
- Steps to reproduce
- Affected version / commit
- Any suggested fix (optional)

We aim to acknowledge reports within **7 days** and to publish a fix or mitigation timeline for confirmed issues.

**Do not** include secrets, credentials, or personal data in public issues.

## Supply-chain hygiene

- Dependencies are kept minimal (this core aims for **zero runtime dependencies**).
- Dependabot is configured (see `.github/dependabot.yml`) for weekly npm updates when the repo is on GitHub.
- Review lockfile / CI changes carefully before merging.
