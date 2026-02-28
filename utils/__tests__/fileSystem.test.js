const fs = require('fs');
const path = require('path');
const {
  safeReadJSON,
  safeWriteJSON,
  fileExists,
  validateTemplateFiles,
  safeCreateDirectory
} = require('../fileSystem');

// Use /tmp for test files
const TEST_DIR = '/tmp/rorg-test-files';
const TEST_JSON_FILE = path.join(TEST_DIR, 'test.json');
const INVALID_JSON_FILE = path.join(TEST_DIR, 'invalid.json');
const NON_EXISTENT_FILE = path.join(TEST_DIR, 'does-not-exist.json');

describe('fileSystem utilities', () => {
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('safeReadJSON', () => {
    it('should successfully read valid JSON file', () => {
      const testData = { name: 'test', value: 123 };
      fs.writeFileSync(TEST_JSON_FILE, JSON.stringify(testData));

      const result = safeReadJSON(TEST_JSON_FILE);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(result.error).toBeUndefined();
    });

    it('should handle file not found', () => {
      const result = safeReadJSON(NON_EXISTENT_FILE);
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
      expect(result.data).toBeUndefined();
    });

    it('should handle invalid JSON', () => {
      fs.writeFileSync(INVALID_JSON_FILE, '{ invalid json }');

      const result = safeReadJSON(INVALID_JSON_FILE);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
      expect(result.data).toBeUndefined();
    });

    it('should handle empty file', () => {
      fs.writeFileSync(INVALID_JSON_FILE, '');

      const result = safeReadJSON(INVALID_JSON_FILE);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    it('should handle read permission errors', () => {
      // Create file with no read permissions (unix only)
      if (process.platform !== 'win32') {
        fs.writeFileSync(TEST_JSON_FILE, '{}');
        fs.chmodSync(TEST_JSON_FILE, 0o000);

        const result = safeReadJSON(TEST_JSON_FILE);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();

        // Restore permissions for cleanup
        fs.chmodSync(TEST_JSON_FILE, 0o644);
      }
    });
  });

  describe('safeWriteJSON', () => {
    it('should successfully write JSON file', () => {
      const testData = { name: 'test', value: 456 };
      const result = safeWriteJSON(TEST_JSON_FILE, testData);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      // Verify file was written correctly
      const content = fs.readFileSync(TEST_JSON_FILE, 'utf8');
      expect(JSON.parse(content)).toEqual(testData);
    });

    it('should handle nested objects', () => {
      const testData = {
        level1: {
          level2: {
            level3: 'value'
          }
        }
      };
      const result = safeWriteJSON(TEST_JSON_FILE, testData);

      expect(result.success).toBe(true);
      const content = fs.readFileSync(TEST_JSON_FILE, 'utf8');
      expect(JSON.parse(content)).toEqual(testData);
    });

    it('should handle arrays', () => {
      const testData = [1, 2, 3, 'test', { key: 'value' }];
      const result = safeWriteJSON(TEST_JSON_FILE, testData);

      expect(result.success).toBe(true);
      const content = fs.readFileSync(TEST_JSON_FILE, 'utf8');
      expect(JSON.parse(content)).toEqual(testData);
    });

    it('should format JSON with indentation', () => {
      const testData = { key: 'value' };
      safeWriteJSON(TEST_JSON_FILE, testData);

      const content = fs.readFileSync(TEST_JSON_FILE, 'utf8');
      expect(content).toContain('\n');
      expect(content).toContain('  ');
    });

    it('should handle write permission errors', () => {
      // Create directory with no write permissions (unix only)
      if (process.platform !== 'win32') {
        const readOnlyDir = path.join(TEST_DIR, 'readonly');
        fs.mkdirSync(readOnlyDir);
        fs.chmodSync(readOnlyDir, 0o444);

        const result = safeWriteJSON(path.join(readOnlyDir, 'test.json'), {});
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();

        // Restore permissions for cleanup
        fs.chmodSync(readOnlyDir, 0o755);
      }
    });

    it('should handle circular references gracefully', () => {
      const circular = { name: 'test' };
      circular.self = circular;

      const result = safeWriteJSON(TEST_JSON_FILE, circular);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to write');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', () => {
      fs.writeFileSync(TEST_JSON_FILE, '{}');
      expect(fileExists(TEST_JSON_FILE)).toBe(true);
    });

    it('should return false for non-existent file', () => {
      expect(fileExists(NON_EXISTENT_FILE)).toBe(false);
    });

    it('should return true for existing directory', () => {
      expect(fileExists(TEST_DIR)).toBe(true);
    });

    it('should handle invalid paths gracefully', () => {
      expect(fileExists(null)).toBe(false);
      expect(fileExists(undefined)).toBe(false);
    });
  });

  describe('validateTemplateFiles', () => {
    const TEMPLATE_DIR = path.join(TEST_DIR, 'templates');

    beforeEach(() => {
      fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
    });

    it('should return valid when all templates exist', () => {
      fs.writeFileSync(path.join(TEMPLATE_DIR, 'template1.hbs'), '');
      fs.writeFileSync(path.join(TEMPLATE_DIR, 'template2.hbs'), '');

      const result = validateTemplateFiles(TEMPLATE_DIR, [
        'template1.hbs',
        'template2.hbs'
      ]);

      expect(result.valid).toBe(true);
      expect(result.missing).toBeUndefined();
    });

    it('should return invalid with missing templates', () => {
      fs.writeFileSync(path.join(TEMPLATE_DIR, 'template1.hbs'), '');

      const result = validateTemplateFiles(TEMPLATE_DIR, [
        'template1.hbs',
        'template2.hbs',
        'template3.hbs'
      ]);

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['template2.hbs', 'template3.hbs']);
    });

    it('should handle empty template list', () => {
      const result = validateTemplateFiles(TEMPLATE_DIR, []);
      expect(result.valid).toBe(true);
    });

    it('should handle non-existent template directory', () => {
      const result = validateTemplateFiles(
        path.join(TEST_DIR, 'non-existent'),
        ['template1.hbs']
      );

      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['template1.hbs']);
    });
  });

  describe('safeCreateDirectory', () => {
    it('should create a new directory', () => {
      const newDir = path.join(TEST_DIR, 'new-directory');
      const result = safeCreateDirectory(newDir);

      expect(result.success).toBe(true);
      expect(fs.existsSync(newDir)).toBe(true);
    });

    it('should create nested directories', () => {
      const nestedDir = path.join(TEST_DIR, 'level1/level2/level3');
      const result = safeCreateDirectory(nestedDir);

      expect(result.success).toBe(true);
      expect(fs.existsSync(nestedDir)).toBe(true);
    });

    it('should succeed if directory already exists', () => {
      const result1 = safeCreateDirectory(TEST_DIR);
      expect(result1.success).toBe(true);

      const result2 = safeCreateDirectory(TEST_DIR);
      expect(result2.success).toBe(true);
    });

    it('should handle permission errors', () => {
      if (process.platform !== 'win32') {
        const restrictedDir = path.join(TEST_DIR, 'restricted');
        fs.mkdirSync(restrictedDir);
        fs.chmodSync(restrictedDir, 0o444);

        const result = safeCreateDirectory(path.join(restrictedDir, 'subdir'));
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();

        // Restore permissions for cleanup
        fs.chmodSync(restrictedDir, 0o755);
      }
    });

    it('should handle invalid path characters', () => {
      // This test may behave differently on different OS
      const invalidPath = path.join(TEST_DIR, 'invalid\x00name');
      const result = safeCreateDirectory(invalidPath);
      
      // On most systems, null bytes in paths should fail
      expect(result.success).toBe(false);
    });
  });
});
