const validatePackageName = require('validate-npm-package-name');

function validateProjectName(name) {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Project name is required' };
  }
  const result = validatePackageName(name);
  if (!result.validForNewPackages) {
    return {
      valid: false,
      message: result.errors ? result.errors[0] : 'Invalid package name',
    };
  }
  return { valid: true };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { validateProjectName, capitalize };
