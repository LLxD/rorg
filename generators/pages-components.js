exports.pagesComponentsGenerator = function(plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Create a new reusable component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
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
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile: 'plop-templates/styles.css.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/index.ts.hbs'
      }
    ]
  });

  // Page generator
  plop.setGenerator('page', {
    description: 'Create a new page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the page?',
        validate: (value) => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Page name is required';
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'src/pages/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile: 'plop-templates/styles.css.hbs'
      },
      {
        type: 'add',
        path: 'src/pages/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/index.ts.hbs'
      }
    ]
  });
};