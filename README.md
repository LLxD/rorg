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

## Error Handling & Input Validation

This tool includes comprehensive error handling and input validation to ensure robust operation:

### Component Name Validation
- Component names are automatically validated and sanitized
- Invalid filesystem characters are rejected (e.g., `< > : " | ? * / \`)
- Path traversal attempts (e.g., `../`, `.`) are blocked
- Names are trimmed of leading/trailing whitespace
- Maximum length is enforced (255 characters)

### Base Path Validation
- Base paths must be relative (absolute paths are rejected)
- Path traversal outside the project directory is prevented
- Invalid characters are detected and rejected
- Paths are normalized to prevent security issues

### Configuration File Safety
- JSON parsing errors are caught and reported with clear messages
- File write operations include error handling for permission issues
- Template file existence is validated before generation
- Corrupted config files are detected and reported

### Error Messages
The tool provides clear, actionable error messages:

```bash
# Example: Invalid component name
⚠️  Component name contains invalid characters (< > : " | ? * / \)

# Example: Configuration file error
⚠️  Error reading config file: Invalid JSON in .rorg-config.json: Unexpected token
Please fix or delete .rorg-config.json and run the command again.

# Example: Missing template files
⚠️  Missing template files: component.tsx.hbs, index.ts.hbs
Please reinstall the package.
```

## Troubleshooting

### Issue: Configuration file is corrupted

**Symptoms:** Error message about invalid JSON or config file errors

**Solution:** 
1. Delete the `.rorg-config.json` file: `rm .rorg-config.json`
2. Run `npx rorg` again to reinitialize

### Issue: Component generation fails

**Symptoms:** Error messages about missing template files

**Solution:**
1. Try reinstalling the package: `npm install rorg`
2. If using npx, clear the cache: `npx clear-npx-cache`
3. Run the command again

### Issue: Permission denied errors

**Symptoms:** Errors about being unable to create files or directories

**Solution:**
1. Check that you have write permissions in the target directory
2. On Unix systems, use `ls -la` to check permissions
3. If needed, adjust permissions: `chmod u+w <directory>`

### Issue: Path traversal or security warnings

**Symptoms:** Errors about invalid paths or path traversal

**Solution:**
1. Ensure you're using relative paths (e.g., `src`, `app/src`)
2. Don't use absolute paths (e.g., `/usr/local/src`)
3. Avoid parent directory references (e.g., `../other-project`)

### Issue: Invalid component names

**Symptoms:** Error about invalid characters in component name

**Solution:**
1. Use alphanumeric characters, hyphens, and underscores only
2. Avoid special characters: `< > : " | ? * / \`
3. Don't use path separators or dots in names

## Development

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Test Coverage
The project includes comprehensive test coverage:
- Utility function tests (validation, file system operations)
- Generator registration tests
- Configuration handling tests
- Edge case and error condition tests

All tests use Jest and follow best practices for Node.js testing.
