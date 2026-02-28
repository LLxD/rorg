const path = require('path');
const { aiDirectionsGenerator, AI_TOOLS } = require('../generators/ai-directions');

describe('aiDirectionsGenerator', () => {
  describe('AI_TOOLS list', () => {
    it('should export a non-empty list of AI tools', () => {
      expect(Array.isArray(AI_TOOLS)).toBe(true);
      expect(AI_TOOLS.length).toBeGreaterThan(0);
    });

    it('should include Cursor', () => {
      const cursor = AI_TOOLS.find((t) => t.value === 'cursor');
      expect(cursor).toBeDefined();
      expect(cursor.outputPath).toBe('.cursorrules');
      expect(cursor.templateFile).toContain('cursorrules.hbs');
    });

    it('should include GitHub Copilot', () => {
      const copilot = AI_TOOLS.find((t) => t.value === 'copilot');
      expect(copilot).toBeDefined();
      expect(copilot.outputPath).toBe('.github/copilot-instructions.md');
      expect(copilot.templateFile).toContain('copilot-instructions.hbs');
    });

    it('should include Windsurf', () => {
      const windsurf = AI_TOOLS.find((t) => t.value === 'windsurf');
      expect(windsurf).toBeDefined();
      expect(windsurf.outputPath).toBe('.windsurfrules');
      expect(windsurf.templateFile).toContain('windsurfrules.hbs');
    });

    it('should include AGENTS.md', () => {
      const agents = AI_TOOLS.find((t) => t.value === 'agents');
      expect(agents).toBeDefined();
      expect(agents.outputPath).toBe('AGENTS.md');
      expect(agents.templateFile).toContain('agents-md.hbs');
    });

    it('should include Continue.dev', () => {
      const cont = AI_TOOLS.find((t) => t.value === 'continue');
      expect(cont).toBeDefined();
      expect(cont.outputPath).toBe('.continuerules');
      expect(cont.templateFile).toContain('continuerules.hbs');
    });

    it('each tool should have name, value, outputPath, and templateFile', () => {
      for (const tool of AI_TOOLS) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('value');
        expect(tool).toHaveProperty('outputPath');
        expect(tool).toHaveProperty('templateFile');
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.value).toBe('string');
        expect(typeof tool.outputPath).toBe('string');
        expect(typeof tool.templateFile).toBe('string');
      }
    });
  });

  describe('generator registration', () => {
    it('should register the "ai" generator', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('ai', expect.any(Object));
    });

    it('should register only one generator', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      expect(mockPlop.setGenerator).toHaveBeenCalledTimes(1);
    });

    it('should have a description', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      const [, generatorConfig] = mockPlop.setGenerator.mock.calls[0];
      expect(generatorConfig.description).toBeDefined();
      expect(typeof generatorConfig.description).toBe('string');
    });

    it('should have a checkbox prompt for tools', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      const [, generatorConfig] = mockPlop.setGenerator.mock.calls[0];
      expect(generatorConfig.prompts).toHaveLength(1);
      expect(generatorConfig.prompts[0].type).toBe('checkbox');
      expect(generatorConfig.prompts[0].name).toBe('tools');
    });

    it('prompt choices should match AI_TOOLS values', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      const [, generatorConfig] = mockPlop.setGenerator.mock.calls[0];
      const choiceValues = generatorConfig.prompts[0].choices.map((c) => c.value);
      const toolValues = AI_TOOLS.map((t) => t.value);
      expect(choiceValues).toEqual(toolValues);
    });

    it('prompt validate should reject empty selection', () => {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/test', pattern: 'atomic', basePath: 'src' });
      const [, generatorConfig] = mockPlop.setGenerator.mock.calls[0];
      const validate = generatorConfig.prompts[0].validate;
      expect(validate([])).not.toBe(true);
      expect(validate(['cursor'])).toBe(true);
    });
  });

  describe('actions generation', () => {
    function getActions(tools, config = {}) {
      const mockPlop = { setGenerator: jest.fn() };
      aiDirectionsGenerator(mockPlop, { projectDir: '/project', pattern: 'atomic', basePath: 'src', ...config });
      const [, generatorConfig] = mockPlop.setGenerator.mock.calls[0];
      return generatorConfig.actions({ tools });
    }

    it('should return one action when one tool is selected', () => {
      const actions = getActions(['cursor']);
      expect(actions).toHaveLength(1);
    });

    it('should return multiple actions when multiple tools are selected', () => {
      const actions = getActions(['cursor', 'copilot', 'agents']);
      expect(actions).toHaveLength(3);
    });

    it('should return no actions when no tools are selected', () => {
      const actions = getActions([]);
      expect(actions).toHaveLength(0);
    });

    it('should produce add-type actions', () => {
      const actions = getActions(['cursor', 'copilot']);
      for (const action of actions) {
        expect(action.type).toBe('add');
      }
    });

    it('cursor action should target .cursorrules in the project root', () => {
      const actions = getActions(['cursor']);
      const cursorAction = actions[0];
      expect(cursorAction.path).toContain('.cursorrules');
      expect(cursorAction.templateFile).toContain('cursorrules.hbs');
    });

    it('copilot action should target .github/copilot-instructions.md', () => {
      const actions = getActions(['copilot']);
      const copilotAction = actions[0];
      // cross-platform path check
      expect(copilotAction.path).toContain('copilot-instructions.md');
      expect(copilotAction.templateFile).toContain('copilot-instructions.hbs');
    });

    it('agents action should target AGENTS.md in the project root', () => {
      const actions = getActions(['agents']);
      const agentsAction = actions[0];
      expect(agentsAction.path).toContain('AGENTS.md');
      expect(agentsAction.templateFile).toContain('agents-md.hbs');
    });

    it('windsurf action should target .windsurfrules', () => {
      const actions = getActions(['windsurf']);
      expect(actions[0].path).toContain('.windsurfrules');
    });

    it('continue action should target .continuerules', () => {
      const actions = getActions(['continue']);
      expect(actions[0].path).toContain('.continuerules');
    });

    it('each action data should include project config', () => {
      const actions = getActions(['cursor'], {
        pattern: 'feature-first',
        basePath: 'app',
        separateCss: false,
        includeTests: true,
      });
      const { data } = actions[0];
      expect(data.pattern).toBe('feature-first');
      expect(data.basePath).toBe('app');
      expect(data.separateCss).toBe(false);
      expect(data.includeTests).toBe(true);
    });

    it('each action data should include projectName derived from projectDir', () => {
      const actions = getActions(['cursor']);
      expect(actions[0].data.projectName).toBe('project');
    });
  });
});
