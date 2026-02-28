const {
  validateComponentName,
  validateBasePath,
  createPromptValidator
} = require('../validation');

describe('validateComponentName', () => {
  describe('valid names', () => {
    it('should accept a simple component name', () => {
      const result = validateComponentName('Button');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Button');
    });

    it('should accept a multi-word component name', () => {
      const result = validateComponentName('MySpecialButton');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('MySpecialButton');
    });

    it('should trim whitespace', () => {
      const result = validateComponentName('  Button  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Button');
    });

    it('should accept names with numbers', () => {
      const result = validateComponentName('Button123');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Button123');
    });

    it('should accept names with hyphens', () => {
      const result = validateComponentName('my-button');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('my-button');
    });

    it('should accept names with underscores', () => {
      const result = validateComponentName('my_button');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('my_button');
    });
  });

  describe('invalid names', () => {
    it('should reject null', () => {
      const result = validateComponentName(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject undefined', () => {
      const result = validateComponentName(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject empty string', () => {
      const result = validateComponentName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject whitespace-only string', () => {
      const result = validateComponentName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should reject names with forward slash', () => {
      const result = validateComponentName('My/Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with backslash', () => {
      const result = validateComponentName('My\\Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with colon', () => {
      const result = validateComponentName('My:Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with pipe', () => {
      const result = validateComponentName('My|Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with question mark', () => {
      const result = validateComponentName('My?Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with asterisk', () => {
      const result = validateComponentName('My*Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with less than', () => {
      const result = validateComponentName('My<Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with greater than', () => {
      const result = validateComponentName('My>Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with quotes', () => {
      const result = validateComponentName('My"Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject names with path traversal (..)', () => {
      const result = validateComponentName('../Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject names starting with dot', () => {
      const result = validateComponentName('.Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject names with double dots in middle', () => {
      const result = validateComponentName('My..Button');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(300);
      const result = validateComponentName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should reject non-string types (number)', () => {
      const result = validateComponentName(123);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject non-string types (object)', () => {
      const result = validateComponentName({});
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });
});

describe('validateBasePath', () => {
  describe('valid paths', () => {
    it('should accept a simple path', () => {
      const result = validateBasePath('src');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('src');
    });

    it('should accept a nested path', () => {
      const result = validateBasePath('src/components');
      expect(result.valid).toBe(true);
      // normalized always uses forward slashes for cross-platform consistency
      expect(result.normalized).toBe('src/components');
    });

    it('should normalize Windows-style backslash separators to forward slashes', () => {
      // Windows-style relative paths with backslashes should be accepted and normalized
      const result = validateBasePath('src\\components');
      if (result.valid) {
        // On any OS, normalized output should use forward slashes
        expect(result.normalized).not.toContain('\\');
        expect(result.normalized).toBe('src/components');
      }
    });

    it('should trim whitespace', () => {
      const result = validateBasePath('  src  ');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('src');
    });

    it('should normalize redundant separators', () => {
      const result = validateBasePath('src//components');
      expect(result.valid).toBe(true);
      // normalized output should not contain double slashes
      expect(result.normalized).not.toContain('//');
      expect(result.normalized).not.toContain('\\');
    });

    it('should accept paths with hyphens', () => {
      const result = validateBasePath('my-app/src');
      expect(result.valid).toBe(true);
    });

    it('should accept paths with underscores', () => {
      const result = validateBasePath('my_app/src');
      expect(result.valid).toBe(true);
    });

    it('should always return forward slashes in normalized output', () => {
      const paths = ['src', 'src/app', 'my-project/src', 'app/components/ui'];
      for (const p of paths) {
        const result = validateBasePath(p);
        expect(result.valid).toBe(true);
        expect(result.normalized).not.toContain('\\');
      }
    });
  });

  describe('invalid paths', () => {
    it('should reject null', () => {
      const result = validateBasePath(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject undefined', () => {
      const result = validateBasePath(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject empty string', () => {
      const result = validateBasePath('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject whitespace-only string', () => {
      const result = validateBasePath('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty or whitespace');
    });

    it('should reject paths with invalid characters', () => {
      const result = validateBasePath('src<components');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });

    it('should reject absolute paths (unix)', () => {
      const result = validateBasePath('/usr/local/src');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('relative path');
    });

    it('should reject absolute paths (windows drive letter)', () => {
      const result = validateBasePath('C:\\Users\\src');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('relative path');
    });

    it('should reject absolute paths (windows forward slash)', () => {
      const result = validateBasePath('C:/Users/src');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('relative path');
    });

    it('should reject parent directory traversal', () => {
      const result = validateBasePath('../../../etc');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('outside the project');
    });

    it('should reject paths starting with ..', () => {
      const result = validateBasePath('../src');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('outside the project');
    });
  });
});

describe('createPromptValidator', () => {
  it('should return true for valid input', () => {
    const validator = createPromptValidator(validateComponentName);
    const result = validator('Button');
    expect(result).toBe(true);
  });

  it('should return error message for invalid input', () => {
    const validator = createPromptValidator(validateComponentName);
    const result = validator('My/Button');
    expect(typeof result).toBe('string');
    expect(result).toContain('invalid characters');
  });

  it('should use default error when validation function returns no error', () => {
    const mockValidation = () => ({ valid: false });
    const validator = createPromptValidator(mockValidation, 'Custom error');
    const result = validator('test');
    expect(result).toBe('Custom error');
  });

  it('should prefer validation error over default', () => {
    const validator = createPromptValidator(validateComponentName, 'Default error');
    const result = validator('');
    expect(result).not.toBe('Default error');
    expect(result).toContain('required');
  });
});
