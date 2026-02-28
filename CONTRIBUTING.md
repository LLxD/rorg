# Contributing to rorg

Thank you for considering contributing to **rorg** (React Organizer)!

## Quick start

### Prerequisites

- Node.js **18 or later** (`node --version` should print `v18.x` or higher)
- npm (bundled with Node.js)

### Setup

```bash
git clone https://github.com/LLxD/rorg.git
cd rorg
npm install
```

## Development workflow

1. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-name
   ```

2. **Make your changes.**

3. **Run the tests** (covers all platforms and Node versions in CI):
   ```bash
   npm test              # run once
   npm run test:watch    # re-run on file changes
   npm run test:coverage # run with coverage report
   ```

4. **Link the package locally** to test the CLI end-to-end:
   ```bash
   npm link
   # Then in another project directory:
   rorg
   ```

5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new component type"
   git commit -m "fix: handle missing config file"
   git commit -m "docs: update README examples"
   git commit -m "chore: bump dev deps"
   ```

6. **Push** your branch and open a pull request targeting `main`.

## Project structure

```
rorg/
├── bin/
│   └── cli.js              Entry point — wires plop to the CLI
├── generators/
│   ├── atomic-design.js    Atom / molecule / organism / template / page
│   ├── pages-components.js Component / page
│   ├── feature-first.js    Feature / shared
│   └── ai-directions.js    Cursor / Copilot / Windsurf / AGENTS.md / Continue.dev
├── plop-templates/         Handlebars templates (.hbs)
├── utils/
│   ├── validation.js       Input validation helpers
│   └── fileSystem.js       Safe file-system helpers
├── plopfile.js             Plop entry: reads config, registers generators
├── __tests__/              Integration tests
└── utils/__tests__/        Unit tests for utilities
```

## Adding a new generator

1. Create `generators/your-generator.js` and export a `yourGenerator(plop, config)` function.
2. Add any required templates to `plop-templates/`.
3. Import and register your generator in `plopfile.js`.
4. Add tests in `__tests__/your-generator.test.js`.

## Adding a new AI tool to `npx rorg ai`

Open `generators/ai-directions.js` and add an entry to the `AI_TOOLS` array:

```js
{
  name: 'Your AI Tool (output-file-name)',
  value: 'yourtool',
  outputPath: '.yourtoolrules',
  templateFile: 'plop-templates/yourtoolrules.hbs',
},
```

Then create `plop-templates/yourtoolrules.hbs` and add tests in `__tests__/ai-directions.test.js`.

## CI

Every pull request runs the full test matrix automatically via GitHub Actions:

- **Node versions**: 18, 20, 22
- **Operating systems**: Ubuntu, Windows, macOS

All checks must pass before merging.

## Releasing a new version

Releases are managed via GitHub Actions. There are two ways to cut a release:

### Option A — Push a tag (preferred)

```bash
# Make sure you are on main and the working tree is clean
git checkout main && git pull

# Bump the version in package.json
npm version patch   # or minor / major
# This creates a commit + tag automatically

# Push the commit and the new tag
git push --follow-tags
```

The **Release** workflow will:
1. Run tests
2. Publish the new version to npm as `rorg`
3. Create a GitHub Release with auto-generated release notes

### Option B — Manual workflow dispatch

Go to **Actions → Release → Run workflow** in the GitHub UI and enter `patch`, `minor`, `major`, or an exact version string.

> **Note:** Publishing requires the `NPM_TOKEN` secret to be set in the repository settings (Settings → Secrets → Actions).

## Pull request checklist

- [ ] Tests added / updated and all passing (`npm test`)
- [ ] README updated if user-facing behaviour changed
- [ ] Conventional commit messages used
- [ ] No new `npm audit` vulnerabilities introduced

## License

By contributing to rorg you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
