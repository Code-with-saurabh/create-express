const inquirer = require('inquirer');
const validatePackageName = require('validate-npm-package-name');

async function promptUser(projectName, options) {
  const prompts = [];

  if (!projectName) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      validate: (input) => {
        if (!input.trim()) return 'Project name is required';
        const result = validatePackageName(input);
        if (!result.validForNewPackages) {
          return result.errors ? result.errors[0] : 'Invalid package name';
        }
        return true;
      },
    });
  }

  if (!options.typescript && !options.javascript) {
    prompts.push({
      type: 'list',
      name: 'language',
      message: 'Language:',
      choices: [
        { name: 'TypeScript (Recommended)', value: 'typescript' },
        { name: 'JavaScript', value: 'javascript' },
      ],
    });
  }

  if (!options.yes) {
    prompts.push({
      type: 'list',
      name: 'moduleFormat',
      message: 'Module format:',
      choices: [
        { name: 'ES Modules (import/export)', value: 'esm' },
        { name: 'CommonJS (require)', value: 'cjs' },
      ],
    });
  }

  if (!options.db) {
    prompts.push({
      type: 'list',
      name: 'database',
      message: 'Database:',
      choices: [
        { name: 'MongoDB (Mongoose)', value: 'mongodb' },
        { name: 'PostgreSQL (Prisma)', value: 'postgresql' },
        { name: 'MySQL (Prisma)', value: 'mysql' },
        { name: 'SQLite', value: 'sqlite' },
        { name: 'None', value: 'none' },
      ],
    });
  }

  if (!options.auth) {
    prompts.push({
      type: 'list',
      name: 'auth',
      message: 'Authentication:',
      choices: [
        { name: 'JWT (JSON Web Tokens)', value: 'jwt' },
        { name: 'Session (express-session)', value: 'session' },
        { name: 'OAuth2 (Google, GitHub)', value: 'oauth2' },
        { name: 'None', value: 'none' },
      ],
    });
  }

  if (options.docker === undefined && !options.yes) {
    prompts.push({
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker support?',
      default: false,
    });
  }

  if (!options.yes) {
    prompts.push({
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: [{ name: 'npm', value: 'npm' }],
    });
  }

  const answers = prompts.length > 0 ? await inquirer.prompt(prompts) : {};

  return {
    projectName: projectName || answers.projectName,
    language: options.typescript ? 'typescript' : options.javascript ? 'javascript' : answers.language || 'typescript',
    moduleFormat: answers.moduleFormat || 'esm',
    database: options.db || answers.database || 'none',
    auth: options.auth || answers.auth || 'none',
    docker: options.docker !== undefined ? options.docker : (answers.docker || false),
    packageManager: answers.packageManager || 'npm',
  };
}

module.exports = { promptUser };
