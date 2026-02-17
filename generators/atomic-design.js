const path = require("path");
const {
  validateComponentName,
  createPromptValidator
} = require("../utils/validation");
const { validateTemplateFiles } = require("../utils/fileSystem");

function createComponentGenerator(type, config) {
  const basePath = config.projectDir
    ? path.join(config.projectDir, config.basePath || "src")
    : config.basePath || "src";

  // Validate template files at generator creation time
  const templateDir = "plop-templates";
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

  const templateValidation = validateTemplateFiles(templateDir, requiredTemplates);
  if (!templateValidation.valid) {
    console.error(
      `⚠️  Missing template files for ${type}:`,
      templateValidation.missing.join(", ")
    );
    console.error("Please reinstall the package.");
  }

  const actions = [
    {
      type: "add",
      path: `${basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
      templateFile: "plop-templates/component.tsx.hbs",
    },
    {
      type: "add",
      path: `${basePath}/components/${type}/{{pascalCase name}}/index.ts`,
      templateFile: "plop-templates/index.ts.hbs",
    },
  ];

  if (config.separateCss) {
    actions.push({
      type: "add",
      path: `${basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.module.css`,
      templateFile: "plop-templates/styles.css.hbs",
    });
  }

  if (config.includeTests) {
    actions.push({
      type: "add",
      path: `${basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: "plop-templates/component.test.tsx.hbs",
    });
  }

  return {
    description: `Create a new ${type.slice(0, -1)} component`,
    prompts: [
      {
        type: "input",
        name: "name",
        message: `What is the name of the ${type.slice(0, -1)}?`,
        validate: createPromptValidator(
          validateComponentName,
          `${type.slice(0, -1)} name is required`
        ),
      },
    ],
    actions,
  };
}

exports.atomicDesignGenerator = function (plop, config) {
  plop.setGenerator("atom", createComponentGenerator("atoms", config));
  plop.setGenerator("molecule", createComponentGenerator("molecules", config));
  plop.setGenerator("organism", createComponentGenerator("organisms", config));
  plop.setGenerator("template", createComponentGenerator("templates", config));
  plop.setGenerator("page", createComponentGenerator("pages", config));
};
