const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { validateProjectName, capitalize } = require('../src/utils');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\nvalidateProjectName');

test('returns invalid for empty string', () => {
  const result = validateProjectName('');
  assert.strictEqual(result.valid, false);
});

test('returns invalid for undefined', () => {
  const result = validateProjectName(undefined);
  assert.strictEqual(result.valid, false);
});

test('returns invalid for name with spaces', () => {
  const result = validateProjectName('my app');
  assert.strictEqual(result.valid, false);
});

test('returns invalid for name starting with dot', () => {
  const result = validateProjectName('.my-app');
  assert.strictEqual(result.valid, false);
});

test('returns invalid for name starting with underscore', () => {
  const result = validateProjectName('_my-app');
  assert.strictEqual(result.valid, false);
});

test('returns valid for a proper name', () => {
  const result = validateProjectName('my-app');
  assert.strictEqual(result.valid, true);
});

test('returns valid for scoped package name', () => {
  const result = validateProjectName('@scope/my-app');
  assert.strictEqual(result.valid, true);
});

console.log('\ncapitalize');

test('capitalizes first letter', () => {
  assert.strictEqual(capitalize('hello'), 'Hello');
});

test('handles single character', () => {
  assert.strictEqual(capitalize('a'), 'A');
});

test('handles already capitalized', () => {
  assert.strictEqual(capitalize('Hello'), 'Hello');
});

test('handles empty string', () => {
  assert.strictEqual(capitalize(''), '');
});

console.log('\nproject structure');

test('package.json exists and has required fields', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert.ok(pkg.name, 'name is missing');
  assert.ok(pkg.version, 'version is missing');
  assert.ok(pkg.description, 'description is missing');
  assert.ok(pkg.bin, 'bin is missing');
  assert.ok(pkg.author, 'author is missing');
  assert.ok(pkg.repository, 'repository is missing');
  assert.ok(pkg.homepage, 'homepage is missing');
  assert.ok(pkg.bugs, 'bugs is missing');
  assert.ok(Array.isArray(pkg.files), 'files is not an array');
});

test('bin entry points to existing file', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const binPath = path.join(__dirname, '..', pkg.bin['create-express']);
  assert.ok(fs.existsSync(binPath), `bin file not found: ${pkg.bin['create-express']}`);
});

test('bin file has shebang', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const binPath = path.join(__dirname, '..', pkg.bin['create-express']);
  const content = fs.readFileSync(binPath, 'utf8');
  assert.ok(content.startsWith('#!/usr/bin/env node'), 'missing shebang line');
});

test('LICENSE file exists', () => {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'LICENSE')), 'LICENSE missing');
});

test('README.md exists', () => {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'README.md')), 'README.md missing');
});

test('src directory has all expected files', () => {
  const srcDir = path.join(__dirname, '..', 'src');
  const expected = ['cli.js', 'generator.js', 'installer.js', 'prompts.js', 'utils.js'];
  for (const file of expected) {
    assert.ok(fs.existsSync(path.join(srcDir, file)), `src/${file} missing`);
  }
});

test('templates directory has subdirectories', () => {
  const tmplDir = path.join(__dirname, '..', 'templates');
  const expected = ['auth', 'base', 'databases', 'docker', 'javascript', 'typescript'];
  for (const dir of expected) {
    assert.ok(fs.existsSync(path.join(tmplDir, dir)), `templates/${dir} missing`);
  }
});

test('files field does not include test or node_modules', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert.ok(!pkg.files.includes('test'), 'files should not include test');
  assert.ok(!pkg.files.includes('node_modules'), 'files should not include node_modules');
});

console.log(`\n\x1b[36m${passed} passing\x1b[0m`);
if (failed > 0) {
  console.log(`\x1b[31m${failed} failing\x1b[0m`);
  process.exit(1);
}
