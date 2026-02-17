const path = require("path");
const {
  validateComponentName,
  createPromptValidator
} = require("../utils/validation");
const { validateTemplateFiles } = require("../utils/fileSystem");

exports.featureFirstGenerator = function (plop, config = {}) {
  const basePath = config.projectDir
    ? path.join(config.projectDir, config.basePath || "src")
    : "src";

  // Validate template files for feature
  const featureTemplates = ["gitkeep.hbs", "feature-index.ts.hbs"];
  const featureValidation = validateTemplateFiles("plop-templates", featureTemplates);
  if (!featureValidation.valid) {
    console.error(
      "⚠️  Missing template files for feature:",
      featureValidation.missing.join(", ")
    );
    console.error("Please reinstall the package.");
  }

  // Validate template files for shared component
  const sharedTemplates = [
    "component.tsx.hbs",
    "index.ts.hbs"
  ];
  
  if (config.separateCss) {
    sharedTemplates.push("styles.css.hbs");
  }
  
  if (config.includeTests) {
    sharedTemplates.push("component.test.tsx.hbs");
  }

  const sharedValidation = validateTemplateFiles("plop-templates", sharedTemplates);
  if (!sharedValidation.valid) {
    console.error(
      "⚠️  Missing template files for shared:",
      sharedValidation.missing.join(", ")
    );
    console.error("Please reinstall the package.");
  }

  plop.setGenerator("feature", {
    description: "Create a new feature",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the feature?",
        validate: createPromptValidator(
          validateComponentName,
          "Feature name is required"
        ),
      },
    ],
    actions: [
      {
        type: "add",
        path: `${basePath}/features/{{camelCase name}}/components/.gitkeep`,
        templateFile: "plop-templates/gitkeep.hbs",
      },
      {
        type: "add",
        path: `${basePath}/features/{{camelCase name}}/hooks/.gitkeep`,
        templateFile: "plop-templates/gitkeep.hbs",
      },
      {
        type: "add",
        path: `${basePath}/features/{{camelCase name}}/utils/.gitkeep`,
        templateFile: "plop-templates/gitkeep.hbs",
      },
      {
        type: "add",
        path: `${basePath}/features/{{camelCase name}}/index.ts`,
        templateFile: "plop-templates/feature-index.ts.hbs",
      },
    ],
  });

  const sharedActions = [
    {
      type: "add",
      path: `${basePath}/shared/{{pascalCase name}}/{{pascalCase name}}.tsx`,
      templateFile: "plop-templates/component.tsx.hbs",
      data: { separateCss: config.separateCss }
    },
    {
      type: "add",
      path: `${basePath}/shared/{{pascalCase name}}/index.ts`,
      templateFile: "plop-templates/index.ts.hbs",
    },
  ];

  if (config.separateCss) {
    sharedActions.push({
      type: "add",
      path: `${basePath}/shared/{{pascalCase name}}/{{pascalCase name}}.module.css`,
      templateFile: "plop-templates/styles.css.hbs",
    });
  }

  if (config.includeTests) {
    sharedActions.push({
      type: "add",
      path: `${basePath}/shared/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: "plop-templates/component.test.tsx.hbs",
    });
  }

  plop.setGenerator("shared", {
    description: "Create a new shared component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the shared component?",
        validate: createPromptValidator(
          validateComponentName,
          "Component name is required"
        ),
      },
    ],
    actions: sharedActions,
  });
};
