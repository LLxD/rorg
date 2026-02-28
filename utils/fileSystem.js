const fs = require('fs');
const path = require('path');

/**
 * Safely reads a JSON file with error handling
 * @param {string} filePath - Path to the JSON file
 * @returns {{success: boolean, data?: any, error?: string}}
 */
function safeReadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { 
        success: false, 
        error: `File not found: ${filePath}` 
      };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const data = JSON.parse(content);
      return { success: true, data };
    } catch (parseError) {
      return { 
        success: false, 
        error: `Invalid JSON in ${filePath}: ${parseError.message}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to read ${filePath}: ${error.message}` 
    };
  }
}

/**
 * Safely writes a JSON file with error handling
 * @param {string} filePath - Path to write the JSON file
 * @param {any} data - Data to write
 * @returns {{success: boolean, error?: string}}
 */
function safeWriteJSON(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to write ${filePath}: ${error.message}` 
    };
  }
}

/**
 * Checks if a file exists at the given path
 * @param {string} filePath - Path to check
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Validates that template files exist
 * @param {string} templateDir - Directory containing templates
 * @param {string[]} templateNames - Array of template file names to check
 * @returns {{valid: boolean, missing?: string[]}}
 */
function validateTemplateFiles(templateDir, templateNames) {
  const missing = [];
  
  for (const name of templateNames) {
    const templatePath = path.join(templateDir, name);
    if (!fileExists(templatePath)) {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Safely creates a directory with error handling
 * @param {string} dirPath - Directory path to create
 * @returns {{success: boolean, error?: string}}
 */
function safeCreateDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to create directory ${dirPath}: ${error.message}` 
    };
  }
}

module.exports = {
  safeReadJSON,
  safeWriteJSON,
  fileExists,
  validateTemplateFiles,
  safeCreateDirectory
};
