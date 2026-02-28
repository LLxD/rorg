const path = require("path");
const { validateTemplateFiles } = require("../utils/fileSystem");

const AI_TOOLS = [
  {
    name: "Cursor (.cursorrules)",
    value: "cursor",
    outputPath: ".cursorrules",
    templateFile: "plop-templates/cursorrules.hbs",
  },
  {
    name: "GitHub Copilot (.github/copilot-instructions.md)",
    value: "copilot",
    outputPath: ".github/copilot-instructions.md",
    templateFile: "plop-templates/copilot-instructions.hbs",
  },
  {
    name: "Windsurf (.windsurfrules)",
    value: "windsurf",
    outputPath: ".windsurfrules",
    templateFile: "plop-templates/windsurfrules.hbs",
  },
  {
    name: "AGENTS.md (OpenAI / general purpose)",
    value: "agents",
    outputPath: "AGENTS.md",
    templateFile: "plop-templates/agents-md.hbs",
  },
  {
    name: "Continue.dev (.continuerules)",
    value: "continue",
    outputPath: ".continuerules",
    templateFile: "plop-templates/continuerules.hbs",
  },
];

exports.AI_TOOLS = AI_TOOLS;

exports.aiDirectionsGenerator = function (plop, config = {}) {
  const projectDir = config.projectDir || process.cwd();

  // Validate all AI template files exist
  const templateFiles = AI_TOOLS.map((t) => path.basename(t.templateFile));
  const templateValidation = validateTemplateFiles("plop-templates", templateFiles);
  if (!templateValidation.valid) {
    console.error(
      "⚠️  Missing AI directions template files:",
      templateValidation.missing.join(", ")
    );
    console.error("Please reinstall the package.");
  }

  plop.setGenerator("ai", {
    description: "Generate AI assistant configuration files (Cursor, Copilot, Windsurf, etc.)",
    prompts: [
      {
        type: "checkbox",
        name: "tools",
        message: "Which AI tools would you like to configure?",
        choices: AI_TOOLS.map((t) => ({ name: t.name, value: t.value })),
        validate: (value) =>
          value.length > 0 ? true : "Please select at least one AI tool",
      },
    ],
    actions: (answers) => {
      const actions = [];

      for (const tool of AI_TOOLS) {
        if (!answers.tools.includes(tool.value)) continue;

        actions.push({
          type: "add",
          path: path.join(projectDir, tool.outputPath),
          templateFile: tool.templateFile,
          data: {
            pattern: config.pattern,
            basePath: config.basePath || "src",
            separateCss: config.separateCss,
            includeTests: config.includeTests,
            projectName: path.basename(projectDir),
          },
        });
      }

      return actions;
    },
  });
};
