#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');

program
  .name('create-express')
  .description('Scaffold a production-ready Express.js backend project')
  .version(pkg.version)
  .argument('[project-name]', 'Project name')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--ts, --typescript', 'Use TypeScript')
  .option('--js, --javascript', 'Use JavaScript')
  .option('--db <database>', 'Database (mongodb|postgresql|mysql|sqlite|none)')
  .option('--auth <auth>', 'Authentication (jwt|session|oauth2|none)')
  .option('--docker', 'Include Docker support')
  .action(async (projectName, options) => {
    try {
      const { run } = require('../src/cli');
      await run(projectName, options);
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse();
