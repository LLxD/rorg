const fs = require("fs");
const path = require("path");
const { atomicDesignGenerator } = require("./generators/atomic-design");
const { pagesComponentsGenerator } = require("./generators/pages-components");
const { featureFirstGenerator } = require("./generators/feature-first");
const { 
  validateBasePath, 
  createPromptValidator 
} = require("./utils/validation");
const { 
  safeReadJSON, 
  safeWriteJSON,
  validateTemplateFiles 
} = require("./utils/fileSystem");

module.exports = function (plop) {
  const packageDir = __dirname;
  const projectDir = process.cwd();

  plop.setHelper("eq", (a, b) => a === b);

  const CONFIG_FILE = path.join(projectDir, ".rorg-config.json");

  let config = null;
  if (fs.existsSync(CONFIG_FILE)) {
    const readResult = safeReadJSON(CONFIG_FILE);
    if (readResult.success) {
      config = readResult.data;
    } else {
      console.error("⚠️  Error reading config file:", readResult.error);
      console.error("Please fix or delete .rorg-config.json and run the command again.");
      process.exit(1);
    }
  }

  // Only show init generator if no config exists
  if (!config) {
    plop.setGenerator("init", {
      description: "Initialize React project structure",
      prompts: [
        {
          type: "list",
          name: "pattern",
          message: "Which architectural pattern would you like to use?",
          choices: [
            {
              name: "Atomic Design (atoms, molecules, organisms, etc)",
              value: "atomic",
            },
            { name: "Pages & Components", value: "pages-components" },
            { name: "Feature First", value: "feature-first" },
          ],
        },
        {
          type: "input",
          name: "basePath",
          message: "Where should components be created? (e.g., src, app)",
          default: "src",
          validate: createPromptValidator(
            validateBasePath,
            "Base path is required and must be valid"
          ),
        },
        {
          type: "confirm",
          name: "includeTests",
          message: "Would you like to include test files for each component?",
          default: true,
        },
        {
          type: "confirm",
          name: "separateCss",
          message: "Would you like to use separate CSS files for styling?",
          default: true,
        },
      ],
      actions: (answers) => {
        // Normalize base path
        const basePathResult = validateBasePath(answers.basePath);
        if (!basePathResult.valid) {
          console.error("⚠️  Invalid base path:", basePathResult.error);
          process.exit(1);
        }
        const normalizedBasePath = basePathResult.normalized;

        // Save config with error handling
        const configData = {
          pattern: answers.pattern,
          basePath: normalizedBasePath,
          includeTests: answers.includeTests,
          separateCss: answers.separateCss,
          initialized: new Date().toISOString(),
        };

        const writeResult = safeWriteJSON(CONFIG_FILE, configData);
        if (!writeResult.success) {
          console.error("⚠️  Failed to save configuration:", writeResult.error);
          process.exit(1);
        }

        const baseDir = path.join(projectDir, normalizedBasePath);
        const templateDir = path.join(packageDir, "plop-templates");

        // Validate template files exist
        const templateValidation = validateTemplateFiles(templateDir, [
          "gitkeep.hbs"
        ]);
        if (!templateValidation.valid) {
          console.error(
            "⚠️  Missing template files:",
            templateValidation.missing.join(", ")
          );
          console.error("Please reinstall the package.");
          process.exit(1);
        }

        const actions = [
          {
            type: "add",
            path: `${baseDir}/.gitkeep`,
            templateFile: path.join(templateDir, "gitkeep.hbs"),
          },
        ];

        // Add pattern-specific actions
        switch (answers.pattern) {
          case "atomic":
            actions.push(
              {
                type: "add",
                path: `${baseDir}/components/atoms/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/components/molecules/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/components/organisms/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/components/templates/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/components/pages/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              }
            );
            break;
          case "pages-components":
            actions.push(
              {
                type: "add",
                path: `${baseDir}/pages/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/components/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              }
            );
            break;
          case "feature-first":
            actions.push(
              {
                type: "add",
                path: `${baseDir}/features/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              },
              {
                type: "add",
                path: `${baseDir}/shared/.gitkeep`,
                templateFile: path.join(templateDir, "gitkeep.hbs"),
              }
            );
            break;
        }

        console.log(
          "Project structure initialized! Please rerun the command to generate components."
        );
        return actions;
      },
    });
  }

  // Load pattern-specific generators based on config
  if (config) {
    switch (config.pattern) {
      case "atomic":
        atomicDesignGenerator(plop, { ...config, projectDir });
        break;
      case "pages-components":
        pagesComponentsGenerator(plop, { ...config, projectDir });
        break;
      case "feature-first":
        featureFirstGenerator(plop, { ...config, projectDir });
        break;
    }
  }
};
