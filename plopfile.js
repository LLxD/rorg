const fs = require("fs");
const { atomicDesignGenerator } = require("./generators/atomic-design");
const { pagesComponentsGenerator } = require("./generators/pages-components");
const { featureFirstGenerator } = require("./generators/feature-first");

const CONFIG_FILE = ".rorg-config.json";

module.exports = function (plop) {
  plop.setHelper("eq", (a, b) => a === b);

  // Check if config exists
  let config = null;
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    } catch (err) {
      console.error("Error reading config file:", err);
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
          validate: (value) => {
            if (/.+/.test(value)) {
              return true;
            }
            return "Base path is required";
          },
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
        // Save config
        fs.writeFileSync(
          CONFIG_FILE,
          JSON.stringify(
            {
              pattern: answers.pattern,
              basePath: answers.basePath,
              includeTests: answers.includeTests,
              separateCss: answers.separateCss,
              initialized: new Date().toISOString(),
            },
            null,
            2
          )
        );

        // Create base directory
        const actions = [
          {
            type: "add",
            path: `${answers.basePath}/.gitkeep`,
            templateFile: "plop-templates/gitkeep.hbs",
          },
        ];

        // Add pattern-specific actions
        switch (answers.pattern) {
          case "atomic":
            actions.push(
              {
                type: "add",
                path: `${answers.basePath}/components/atoms/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/components/molecules/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/components/organisms/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/components/templates/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/components/pages/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              }
            );
            break;
          case "pages-components":
            actions.push(
              {
                type: "add",
                path: `${answers.basePath}/pages/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/components/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              }
            );
            break;
          case "feature-first":
            actions.push(
              {
                type: "add",
                path: `${answers.basePath}/features/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
              },
              {
                type: "add",
                path: `${answers.basePath}/shared/.gitkeep`,
                templateFile: "plop-templates/gitkeep.hbs",
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
        atomicDesignGenerator(plop, config);
        break;
      case "pages-components":
        pagesComponentsGenerator(plop, config);
        break;
      case "feature-first":
        featureFirstGenerator(plop, config);
        break;
    }
  }
};
