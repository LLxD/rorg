const path = require('path');

/**
 * Validates and sanitizes a component name
 * @param {string} name - The component name to validate
 * @returns {{valid: boolean, error?: string, sanitized?: string}}
 */
function validateComponentName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Component name is required' };
  }

  // Trim whitespace
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Component name cannot be empty or whitespace only' };
  }

  // Check for path traversal attempts first (before checking for slashes)
  if (trimmed.includes('..') || trimmed.startsWith('.')) {
    return { 
      valid: false, 
      error: 'Component name cannot contain path traversal patterns' 
    };
  }

  // Check for invalid filesystem characters
  const invalidChars = /[<>:"|?*\/\\]/;
  if (invalidChars.test(trimmed)) {
    return { 
      valid: false, 
      error: 'Component name contains invalid characters (< > : " | ? * / \\)' 
    };
  }

  // Check length
  if (trimmed.length > 255) {
    return { 
      valid: false, 
      error: 'Component name is too long (max 255 characters)' 
    };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Validates and normalizes a base path
 * @param {string} basePath - The base path to validate
 * @returns {{valid: boolean, error?: string, normalized?: string}}
 */
function validateBasePath(basePath) {
  if (!basePath || typeof basePath !== 'string') {
    return { valid: false, error: 'Base path is required' };
  }

  // Trim whitespace
  const trimmed = basePath.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Base path cannot be empty or whitespace only' };
  }

  // Check for absolute path attempts (both Unix and Windows style)
  const isWindowsAbsolute = /^[a-zA-Z]:[\/\\]/.test(trimmed);
  const isUnixAbsolute = path.isAbsolute(trimmed);
  
  if (isWindowsAbsolute || isUnixAbsolute) {
    return { 
      valid: false, 
      error: 'Base path must be a relative path' 
    };
  }

  // Check for invalid characters (more permissive for paths, but still safe)
  const invalidChars = /[<>:"|?*]/;
  if (invalidChars.test(trimmed)) {
    return { 
      valid: false, 
      error: 'Base path contains invalid characters (< > : " | ? *)' 
    };
  }

  // Normalize the path to prevent path traversal; use forward slashes for
  // cross-platform consistency (important for web/frontend tooling on Windows)
  const normalized = path.normalize(trimmed).replace(/\\/g, '/');

  // Check for parent directory traversal beyond project root
  if (normalized.startsWith('..')) {
    return { 
      valid: false, 
      error: 'Base path cannot navigate outside the project directory' 
    };
  }

  return { valid: true, normalized };
}

/**
 * Creates a safe validation function for prompts
 * @param {Function} validationFn - The validation function to use
 * @param {string} defaultError - Default error message
 * @returns {Function}
 */
function createPromptValidator(validationFn, defaultError = 'Invalid input') {
  return (value) => {
    const result = validationFn(value);
    if (result.valid) {
      return true;
    }
    return result.error || defaultError;
  };
}

module.exports = {
  validateComponentName,
  validateBasePath,
  createPromptValidator
};
