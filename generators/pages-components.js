const path = require("path");
const {
  validateComponentName,
  createPromptValidator
} = require("../utils/validation");
const { validateTemplateFiles } = require("../utils/fileSystem");

exports.pagesComponentsGenerator = function (plop, config = {}) {
  const basePath = config.projectDir
    ? path.join(config.projectDir, config.basePath || "src")
    : "src";

  // Validate template files
  const requiredTemplates = [
    "component.tsx.hbs",
    "index.ts.hbs"
  ];
  
  if (config.separateCss) {
    requiredTemplates.push("styles.css.hbs");
  }
  
  if (config.includeTests) {
    requiredTemplates.push("component.test.tsx.hbs");
  }

  const templateValidation = validateTemplateFiles("plop-templates", requiredTemplates);
  if (!templateValidation.valid) {
    console.error(
      "⚠️  Missing template files:",
      templateValidation.missing.join(", ")
    );
    console.error("Please reinstall the package.");
  }

  // Component generator
  const componentActions = [
    {
      type: "add",
      path: `${basePath}/components/{{pascalCase name}}/{{pascalCase name}}.tsx`,
      templateFile: "plop-templates/component.tsx.hbs",
      data: { separateCss: config.separateCss }
    },
    {
      type: "add",
      path: `${basePath}/components/{{pascalCase name}}/index.ts`,
      templateFile: "plop-templates/index.ts.hbs",
    },
  ];

  if (config.separateCss) {
    componentActions.push({
      type: "add",
      path: `${basePath}/components/{{pascalCase name}}/{{pascalCase name}}.module.css`,
      templateFile: "plop-templates/styles.css.hbs",
    });
  }

  if (config.includeTests) {
    componentActions.push({
      type: "add",
      path: `${basePath}/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: "plop-templates/component.test.tsx.hbs",
    });
  }

  plop.setGenerator("component", {
    description: "Create a new reusable component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
        validate: createPromptValidator(
          validateComponentName,
          "Component name is required"
        ),
      },
    ],
    actions: componentActions,
  });

  // Page generator
  const pageActions = [
    {
      type: "add",
      path: `${basePath}/pages/{{pascalCase name}}/{{pascalCase name}}.tsx`,
      templateFile: "plop-templates/component.tsx.hbs",
      data: { separateCss: config.separateCss }
    },
    {
      type: "add",
      path: `${basePath}/pages/{{pascalCase name}}/index.ts`,
      templateFile: "plop-templates/index.ts.hbs",
    },
  ];

  if (config.separateCss) {
    pageActions.push({
      type: "add",
      path: `${basePath}/pages/{{pascalCase name}}/{{pascalCase name}}.module.css`,
      templateFile: "plop-templates/styles.css.hbs",
    });
  }

  if (config.includeTests) {
    pageActions.push({
      type: "add",
      path: `${basePath}/pages/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: "plop-templates/component.test.tsx.hbs",
    });
  }

  plop.setGenerator("page", {
    description: "Create a new page",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the page?",
        validate: createPromptValidator(
          validateComponentName,
          "Page name is required"
        ),
      },
    ],
    actions: pageActions,
  });
};
