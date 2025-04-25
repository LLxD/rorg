# Contributing to RORG

Thank you for considering contributing to RORG (React Organizer)! This document outlines the process for contributing to the project.

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rorg.git
   cd rorg
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes locally:
   ```bash
   npm link
   # Then in another project
   npx rorg
   ```

4. Commit your changes using conventional commit messages:
   ```bash
   git commit -m "feat: add new component type"
   ```

5. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a pull request

## Project Structure

- `/generators`: Contains the generators for different architectural patterns
- `/plop-templates`: Contains the templates used by the generators
- `plopfile.js`: Main configuration file for plop

## Adding a New Generator

1. Create a new file in the `/generators` directory
2. Add any necessary templates to `/plop-templates`
3. Register your generator in `plopfile.js`

## Pull Request Process

1. Update the README.md with details of your changes if necessary
2. Ensure your code follows the project's coding standards
3. Make sure all tests pass
4. Link to any relevant issues in your PR description
5. Wait for code review and address any feedback

## License

By contributing to RORG, you agree that your contributions will be licensed under the project's MIT license.
