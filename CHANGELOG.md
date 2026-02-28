# Changelog

All notable changes to **rorg** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **AI Directions generator** (`npx rorg ai`) — generates AI assistant config files
  pre-populated with the project's architectural pattern and coding conventions.
  Supports Cursor (`.cursorrules`), GitHub Copilot (`.github/copilot-instructions.md`),
  Windsurf (`.windsurfrules`), AGENTS.md, and Continue.dev (`.continuerules`).
- **Test infrastructure** — Jest with 107 tests across 4 suites
  (`npm test`, `npm run test:coverage`).
- **Utility modules** — `utils/validation.js` and `utils/fileSystem.js` with
  comprehensive input validation, path-traversal protection, and safe JSON I/O.
- **CI workflows** — GitHub Actions matrix across Node 18/20/22 × Ubuntu/Windows/macOS.
- **Release workflow** — tag-triggered or manual-dispatch npm publish + GitHub Release.
- Cross-platform path normalization (forward slashes on all OS).

### Fixed
- `pages-components` generator now correctly respects the `separateCss` config flag
  (previously always created CSS files).
- Template data (`separateCss`, `includeTests`) now properly passed to Handlebars
  templates, enabling conditional imports in generated component files.
- All path construction uses `path.join()` for cross-platform compatibility.

### Security
- Fixed 5 npm audit vulnerabilities (`brace-expansion`, `lodash`, `tmp`).
- Added path-traversal prevention on all user inputs.

---

## [1.0.5] — 2024-01-01

### Fixed
- Pass `projectDir` to generators in `plopfile.js` for correct path resolution.

---

## [1.0.0] — 2023-09-20

### Added
- Initial release.
- `init` generator: choose Atomic Design, Pages & Components, or Feature First pattern.
- Atomic Design generators: `atom`, `molecule`, `organism`, `template`, `page`.
- Pages & Components generators: `component`, `page`.
- Feature First generators: `feature`, `shared`.
- Config stored in `.rorg-config.json`.

[Unreleased]: https://github.com/LLxD/rorg/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/LLxD/rorg/compare/v1.0.0...v1.0.5
[1.0.0]: https://github.com/LLxD/rorg/releases/tag/v1.0.0
