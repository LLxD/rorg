function createComponentGenerator(type, config) {
  const actions = [
    {
      type: 'add',
      path: `${config.basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
      templateFile: 'plop-templates/component.tsx.hbs'
    },
    {
      type: 'add',
      path: `${config.basePath}/components/${type}/{{pascalCase name}}/index.ts`,
      templateFile: 'plop-templates/index.ts.hbs'
    }
  ];

  if (config.separateCss) {
    actions.push({
      type: 'add',
      path: `${config.basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.module.css`,
      templateFile: 'plop-templates/styles.css.hbs'
    });
  }

  if (config.includeTests) {
    actions.push({
      type: 'add',
      path: `${config.basePath}/components/${type}/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: 'plop-templates/component.test.tsx.hbs'
    });
  }

  return {
    description: `Create a new ${type.slice(0, -1)} component`,
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: `What is the name of the ${type.slice(0, -1)}?`,
        validate: (value) => {
          if (/.+/.test(value)) {
            return true;
          }
          return `${type.slice(0, -1)} name is required`;
        }
      }
    ],
    actions
  };
}

exports.atomicDesignGenerator = function(plop, config) {
  plop.setGenerator('atom', createComponentGenerator('atoms', config));
  plop.setGenerator('molecule', createComponentGenerator('molecules', config));
  plop.setGenerator('organism', createComponentGenerator('organisms', config));
  plop.setGenerator('template', createComponentGenerator('templates', config));
  plop.setGenerator('page', createComponentGenerator('pages', config));
};