const { execSync } = require('child_process');

async function installDependencies(targetDir, packageManager) {
  try {
    execSync(`${packageManager} install`, {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 120000,
    });
  } catch (err) {
    throw new Error(`Failed to install dependencies: ${err.message}`);
  }
}

async function initGit(targetDir) {
  try {
    execSync('git init', { cwd: targetDir, stdio: 'pipe' });
    execSync('git add .', { cwd: targetDir, stdio: 'pipe' });
    execSync('git commit -m "Initial commit: Express.js project scaffolded by create-express"', {
      cwd: targetDir,
      stdio: 'pipe',
    });
  } catch (err) {
    // Git init failure is non-critical
    console.warn('Warning: Could not initialize git repository');
  }
}

module.exports = { installDependencies, initGit };
