# rorg

A flexible CLI tool for organizing React projects with different architectural patterns.

## Installation

You can run this tool directly using npx:

```bash
npx rorg
```

On first run, you'll be prompted to:
1. Choose your preferred architectural pattern
2. Specify the base path for components (e.g., src, app)
3. Decide if you want test files for each component
4. Choose whether to use separate CSS files

These preferences will be saved in `.rorg-config.json`. After initialization, rerun the command to start generating components.

## Available Generators

### Atomic Design
```bash
npx rorg atom
npx rorg molecule
npx rorg organism
npx rorg template
npx rorg page
```

### Pages & Components
```bash
npx rorg component
npx rorg page
```

### Feature First
```bash
npx rorg feature
npx rorg shared
```

## Structure

Depending on your chosen pattern, the tool will create one of these structures (under your specified base path):

### Atomic Design
```
<basePath>/
  components/
    atoms/
    molecules/
    organisms/
    templates/
    pages/
```

### Pages & Components
```
<basePath>/
  components/
  pages/
```

### Feature First
```
<basePath>/
  features/
    feature-name/
      components/
      hooks/
      utils/
  shared/
```

## Configuration

The tool creates a `.rorg-config.json` file in your project root after initialization. This file stores:
- Your chosen architectural pattern
- The base path for components
- Whether to include test files
- Whether to use separate CSS files

Example configuration:
```json
{
  "pattern": "atomic",
  "basePath": "src",
  "includeTests": true,
  "separateCss": true,
  "initialized": "2023-09-20T12:34:56.789Z"
}
```
