exports.featureFirstGenerator = function(plop) {
  plop.setGenerator('feature', {
    description: 'Create a new feature',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the feature?',
        validate: (value) => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Feature name is required';
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/components/.gitkeep',
        templateFile: 'plop-templates/gitkeep.hbs'
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/hooks/.gitkeep',
        templateFile: 'plop-templates/gitkeep.hbs'
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/utils/.gitkeep',
        templateFile: 'plop-templates/gitkeep.hbs'
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/index.ts',
        templateFile: 'plop-templates/feature-index.ts.hbs'
      }
    ]
  });

  plop.setGenerator('shared', {
    description: 'Create a new shared component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the shared component?',
        validate: (value) => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Component name is required';
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/shared/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'src/shared/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile: 'plop-templates/styles.css.hbs'
      },
      {
        type: 'add',
        path: 'src/shared/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/index.ts.hbs'
      }
    ]
  });
};