const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { promptUser } = require('./prompts');
const { generateProject } = require('./generator');
const { installDependencies, initGit } = require('./installer');

async function run(projectName, options) {
  console.log('');
  console.log(chalk.bold.cyan('  ╔══════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('  ║     create-express-code v1.0.0     ║'));
  console.log(chalk.bold.cyan('  ║  Production-ready Express.js API     ║'));
  console.log(chalk.bold.cyan('  ╚══════════════════════════════════════╝'));
  console.log('');

  const config = await promptUser(projectName, options);

  const targetDir = path.join(process.cwd(), config.projectName);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`\nError: Directory "${config.projectName}" already exists.`));
    process.exit(1);
  }

  const spinner = ora('Scaffolding project...').start();

  try {
    await generateProject(config, targetDir);
    spinner.succeed(chalk.green('Project files created successfully'));

    const installSpinner = ora('Installing dependencies...').start();
    await installDependencies(targetDir, config.packageManager);
    installSpinner.succeed(chalk.green('Dependencies installed'));

    const gitSpinner = ora('Initializing git repository...').start();
    await initGit(targetDir);
    gitSpinner.succeed(chalk.green('Git repository initialized'));

    console.log('');
    console.log(chalk.bold.green(`  Success! Created ${config.projectName} at ./${config.projectName}`));
    console.log('');
    console.log(chalk.white('  cd ') + chalk.cyan(config.projectName));
    console.log(chalk.white('  npm run dev'));
    console.log('');
    console.log(chalk.bold('  Available scripts:'));
    console.log(chalk.gray('    npm run dev     - Start with hot reload (nodemon)'));
    console.log(chalk.gray('    npm start       - Start production server'));
    console.log(chalk.gray('    npm run lint    - Run ESLint'));
    console.log(chalk.gray('    npm test        - Run tests'));
    console.log('');

    if (config.database === 'mongodb') {
      console.log(chalk.yellow('  Note: Make sure MongoDB is running before starting the server.'));
    } else if (config.database === 'postgresql' || config.database === 'mysql') {
      console.log(chalk.yellow('  Note: Update DATABASE_URL in .env with your database credentials.'));
    }
    console.log('');

  } catch (err) {
    spinner.fail(chalk.red('Failed to scaffold project'));
    await fs.remove(targetDir).catch(() => {});
    throw err;
  }
}

module.exports = { run };
