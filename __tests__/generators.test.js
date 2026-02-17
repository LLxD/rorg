const { atomicDesignGenerator } = require('../generators/atomic-design');
const { pagesComponentsGenerator } = require('../generators/pages-components');
const { featureFirstGenerator } = require('../generators/feature-first');

describe('Generator Registration', () => {
  describe('atomicDesignGenerator', () => {
    it('should register all atomic design generators', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      atomicDesignGenerator(mockPlop, config);

      expect(mockPlop.setGenerator).toHaveBeenCalledTimes(5);
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('atom', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('molecule', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('organism', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('template', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('page', expect.any(Object));
    });

    it('should handle config with separateCss disabled', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: false,
        includeTests: false,
      };

      atomicDesignGenerator(mockPlop, config);

      // Verify generator is called (validates config processing)
      expect(mockPlop.setGenerator).toHaveBeenCalled();
    });

    it('should use default basePath when not provided', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {};

      atomicDesignGenerator(mockPlop, config);

      // Should still register generators with defaults
      expect(mockPlop.setGenerator).toHaveBeenCalledTimes(5);
    });

    it('should create generators with validation', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      atomicDesignGenerator(mockPlop, config);

      // Get the atom generator config
      const atomGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'atom'
      );
      const atomGenerator = atomGeneratorCall[1];

      expect(atomGenerator).toHaveProperty('description');
      expect(atomGenerator).toHaveProperty('prompts');
      expect(atomGenerator).toHaveProperty('actions');
      expect(atomGenerator.prompts).toHaveLength(1);
      expect(atomGenerator.prompts[0]).toHaveProperty('validate');
    });
  });

  describe('pagesComponentsGenerator', () => {
    it('should register component and page generators', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      pagesComponentsGenerator(mockPlop, config);

      expect(mockPlop.setGenerator).toHaveBeenCalledTimes(2);
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('component', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('page', expect.any(Object));
    });

    it('should respect separateCss config when disabled', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: false,
        includeTests: false,
      };

      pagesComponentsGenerator(mockPlop, config);

      // Get the component generator config
      const componentGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'component'
      );
      const componentGenerator = componentGeneratorCall[1];

      // Check that CSS action is not included
      const hasCssAction = componentGenerator.actions.some(
        action => action.path && action.path.includes('.css')
      );
      expect(hasCssAction).toBe(false);
    });

    it('should respect includeTests config when disabled', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: false,
      };

      pagesComponentsGenerator(mockPlop, config);

      // Get the component generator config
      const componentGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'component'
      );
      const componentGenerator = componentGeneratorCall[1];

      // Check that test action is not included
      const hasTestAction = componentGenerator.actions.some(
        action => action.path && action.path.includes('.test.')
      );
      expect(hasTestAction).toBe(false);
    });

    it('should include CSS and test files when config enables them', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      pagesComponentsGenerator(mockPlop, config);

      // Get the component generator config
      const componentGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'component'
      );
      const componentGenerator = componentGeneratorCall[1];

      // Check that CSS action is included
      const hasCssAction = componentGenerator.actions.some(
        action => action.path && action.path.includes('.css')
      );
      expect(hasCssAction).toBe(true);

      // Check that test action is included
      const hasTestAction = componentGenerator.actions.some(
        action => action.path && action.path.includes('.test.')
      );
      expect(hasTestAction).toBe(true);
    });
  });

  describe('featureFirstGenerator', () => {
    it('should register feature and shared generators', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      featureFirstGenerator(mockPlop, config);

      expect(mockPlop.setGenerator).toHaveBeenCalledTimes(2);
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('feature', expect.any(Object));
      expect(mockPlop.setGenerator).toHaveBeenCalledWith('shared', expect.any(Object));
    });

    it('should create feature structure with multiple directories', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      featureFirstGenerator(mockPlop, config);

      // Get the feature generator config
      const featureGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'feature'
      );
      const featureGenerator = featureGeneratorCall[1];

      expect(featureGenerator.actions).toHaveLength(4);
      expect(featureGenerator.actions.some(
        action => action.path && action.path.includes('/components/')
      )).toBe(true);
      expect(featureGenerator.actions.some(
        action => action.path && action.path.includes('/hooks/')
      )).toBe(true);
      expect(featureGenerator.actions.some(
        action => action.path && action.path.includes('/utils/')
      )).toBe(true);
    });

    it('should respect separateCss config in shared components', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: false,
        includeTests: false,
      };

      featureFirstGenerator(mockPlop, config);

      // Get the shared generator config
      const sharedGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'shared'
      );
      const sharedGenerator = sharedGeneratorCall[1];

      // Check that CSS action is not included
      const hasCssAction = sharedGenerator.actions.some(
        action => action.path && action.path.includes('.css')
      );
      expect(hasCssAction).toBe(false);
    });

    it('should include test files when configured', () => {
      const mockPlop = {
        setGenerator: jest.fn(),
      };
      
      const config = {
        projectDir: '/test',
        basePath: 'src',
        separateCss: true,
        includeTests: true,
      };

      featureFirstGenerator(mockPlop, config);

      // Get the shared generator config
      const sharedGeneratorCall = mockPlop.setGenerator.mock.calls.find(
        call => call[0] === 'shared'
      );
      const sharedGenerator = sharedGeneratorCall[1];

      // Check that test action is included
      const hasTestAction = sharedGenerator.actions.some(
        action => action.path && action.path.includes('.test.')
      );
      expect(hasTestAction).toBe(true);
    });
  });
});
