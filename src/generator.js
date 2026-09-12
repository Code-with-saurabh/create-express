const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', (a, b) => a === b);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function renderTemplate(templatePath, data) {
  const content = fs.readFileSync(templatePath, 'utf8');
  const compiled = Handlebars.compile(content);
  return compiled(data);
}

function getExt(config) {
  return config.language === 'typescript' ? 'ts' : 'js';
}

async function generateProject(config, targetDir) {
  const ext = getExt(config);
  const langDir = config.language === 'typescript' ? 'typescript' : 'javascript';

  await fs.ensureDir(targetDir);

  await generateBaseFiles(config, targetDir);
  await generateCoreFiles(config, targetDir, langDir, ext);

  if (config.database !== 'none') {
    await generateDatabaseFiles(config, targetDir, langDir, ext);
  }

  if (config.auth !== 'none') {
    await generateAuthFiles(config, targetDir, langDir, ext);
  }

  if (config.docker) {
    await generateDockerFiles(config, targetDir);
  }

  await generatePackageJson(config, targetDir, ext);
}

async function generateBaseFiles(config, targetDir) {
  const templateDir = path.join(TEMPLATES_DIR, 'base');

  const gitignore = fs.readFileSync(path.join(templateDir, 'gitignore'), 'utf8');
  await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);

  const envExample = fs.readFileSync(path.join(templateDir, 'env.example'), 'utf8');
  await fs.writeFile(path.join(targetDir, '.env.example'), envExample);

  await fs.writeFile(path.join(targetDir, '.env'), fs.readFileSync(path.join(templateDir, 'env'), 'utf8'));

  const readme = renderTemplate(path.join(templateDir, 'README.md.hbs'), config);
  await fs.writeFile(path.join(targetDir, 'README.md'), readme);
}

async function generateCoreFiles(config, targetDir, langDir, ext) {
  const templateDir = path.join(TEMPLATES_DIR, langDir, 'src');

  const files = [
    { src: `app.${ext}`, dest: `src/app.${ext}` },
    { src: `server.${ext}`, dest: `src/server.${ext}` },
    { src: `config/index.${ext}`, dest: `src/config/index.${ext}` },
    { src: `config/logger.${ext}`, dest: `src/config/logger.${ext}` },
    { src: `middleware/errorHandler.${ext}`, dest: `src/middleware/errorHandler.${ext}` },
    { src: `middleware/asyncHandler.${ext}`, dest: `src/middleware/asyncHandler.${ext}` },
    { src: `middleware/rateLimiter.${ext}`, dest: `src/middleware/rateLimiter.${ext}` },
    { src: `middleware/requestLogger.${ext}`, dest: `src/middleware/requestLogger.${ext}` },
    { src: `routes/health.${ext}`, dest: `src/routes/health.${ext}` },
    { src: `routes/index.${ext}`, dest: `src/routes/index.${ext}` },
    { src: `errors/AppError.${ext}`, dest: `src/errors/AppError.${ext}` },
    { src: `errors/notFoundHandler.${ext}`, dest: `src/errors/notFoundHandler.${ext}` },
    { src: `utils/asyncHandler.${ext}`, dest: `src/utils/asyncHandler.${ext}` },
  ];

  for (const file of files) {
    const srcPath = path.join(templateDir, file.src);
    const destPath = path.join(targetDir, file.dest);
    await fs.ensureDir(path.dirname(destPath));
    if (fs.existsSync(srcPath)) {
      await fs.copy(srcPath, destPath);
    }
  }

  if (config.language === 'typescript') {
    const tsFiles = [
      { src: 'types/index.d.ts', dest: 'src/types/index.d.ts' },
    ];
    for (const file of tsFiles) {
      const srcPath = path.join(templateDir, file.src);
      const destPath = path.join(targetDir, file.dest);
      await fs.ensureDir(path.dirname(destPath));
      if (fs.existsSync(srcPath)) {
        await fs.copy(srcPath, destPath);
      }
    }
  }
}

async function generateDatabaseFiles(config, targetDir, langDir, ext) {
  const dbDir = path.join(TEMPLATES_DIR, 'databases');

  if (config.database === 'mongodb') {
    const srcPath = path.join(dbDir, 'mongoose', `database.${ext}`);
    const destPath = path.join(targetDir, `src/config/database.${ext}`);
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(srcPath, destPath);

    const modelSrc = path.join(TEMPLATES_DIR, langDir, 'src', 'models', `User.${ext}`);
    const modelDest = path.join(targetDir, `src/models/User.${ext}`);
    await fs.ensureDir(path.dirname(modelDest));
    if (fs.existsSync(modelSrc)) {
      await fs.copy(modelSrc, modelDest);
    }
  } else if (config.database === 'postgresql' || config.database === 'mysql') {
    const prismaDir = path.join(dbDir, 'prisma');
    const schemaTemplate = config.database === 'postgresql' ? 'schema.postgresql.prisma' : 'schema.mysql.prisma';
    const schemaSrc = path.join(prismaDir, schemaTemplate);
    const schemaDest = path.join(targetDir, 'prisma/schema.prisma');
    await fs.ensureDir(path.dirname(schemaDest));
    await fs.copy(schemaSrc, schemaDest);

    const srcPath = path.join(prismaDir, `database.${ext}`);
    const destPath = path.join(targetDir, `src/config/database.${ext}`);
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(srcPath, destPath);
  } else if (config.database === 'sqlite') {
    const srcPath = path.join(dbDir, 'sqlite', `database.${ext}`);
    const destPath = path.join(targetDir, `src/config/database.${ext}`);
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(srcPath, destPath);
  }
}

async function generateAuthFiles(config, targetDir, langDir, ext) {
  const authDir = path.join(TEMPLATES_DIR, 'auth', config.auth);

  const files = [
    { src: `auth.${ext}`, dest: `src/middleware/auth.${ext}` },
    { src: `routes.${ext}`, dest: `src/routes/auth.${ext}` },
  ];

  for (const file of files) {
    const srcPath = path.join(authDir, file.src);
    const destPath = path.join(targetDir, file.dest);
    await fs.ensureDir(path.dirname(destPath));
    if (fs.existsSync(srcPath)) {
      await fs.copy(srcPath, destPath);
    }
  }

  if (config.auth === 'jwt') {
    const tokenSrc = path.join(authDir, `tokenUtils.${ext}`);
    const tokenDest = path.join(targetDir, `src/utils/tokenUtils.${ext}`);
    await fs.ensureDir(path.dirname(tokenDest));
    if (fs.existsSync(tokenSrc)) {
      await fs.copy(tokenSrc, tokenDest);
    }
  }

  if (config.auth === 'oauth2') {
    const passportSrc = path.join(authDir, `passport.${ext}`);
    const passportDest = path.join(targetDir, `src/config/passport.${ext}`);
    await fs.ensureDir(path.dirname(passportDest));
    if (fs.existsSync(passportSrc)) {
      await fs.copy(passportSrc, passportDest);
    }
  }

  if (config.auth === 'session') {
    const sessionSrc = path.join(authDir, `session.${ext}`);
    const sessionDest = path.join(targetDir, `src/config/session.${ext}`);
    await fs.ensureDir(path.dirname(sessionDest));
    if (fs.existsSync(sessionSrc)) {
      await fs.copy(sessionSrc, sessionDest);
    }
  }
}

async function generateDockerFiles(config, targetDir) {
  const dockerDir = path.join(TEMPLATES_DIR, 'docker');

  const dockerfileSrc = path.join(dockerDir, 'Dockerfile');
  const dockerfileDest = path.join(targetDir, 'Dockerfile');
  await fs.copy(dockerfileSrc, dockerfileDest);

  const composeSrc = path.join(dockerDir, 'docker-compose.yml');
  const composeDest = path.join(targetDir, 'docker-compose.yml');
  const composeContent = renderTemplate(composeSrc, config);
  await fs.writeFile(composeDest, composeContent);
}

async function generatePackageJson(config, targetDir, ext) {
  const pkg = {
    name: config.projectName,
    version: '1.0.0',
    description: 'Production-ready Express.js API',
    main: `src/server.${ext}`,
    scripts: {
      dev: config.language === 'typescript' ? 'ts-node-dev --respawn --transpile-only src/server.ts' : 'nodemon src/server.js',
      start: config.language === 'typescript' ? 'ts-node src/server.js' : 'node src/server.js',
      lint: 'eslint src/',
      test: 'jest',
    },
    keywords: ['express', 'api', 'backend'],
    license: 'MIT',
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5',
      helmet: '^7.1.0',
      compression: '^1.7.4',
      'express-rate-limit': '^7.1.5',
      pino: '^8.17.2',
      'pino-http': '^9.0.0',
      dotenv: '^16.3.1',
    },
    devDependencies: {
      nodemon: '^3.0.2',
      eslint: '^8.56.0',
      'pino-pretty': '^10.3.1',
    },
  };

  if (config.moduleFormat === 'esm') {
    pkg.type = 'module';
  }

  if (config.language === 'typescript') {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      typescript: '^5.3.3',
      'ts-node': '^10.9.2',
      'ts-node-dev': '^2.0.0',
      '@types/express': '^4.17.21',
      '@types/cors': '^2.8.17',
      '@types/compression': '^1.7.5',
      '@types/node': '^20.10.8',
      '@types/pino': '^7.0.0',
      '@types/pino-http': '^5.8.4',
    };
  }

  if (config.database === 'mongodb') {
    pkg.dependencies.mongoose = '^8.0.3';
  } else if (config.database === 'postgresql') {
    pkg.dependencies['@prisma/client'] = '^5.8.1';
    pkg.devDependencies.prisma = '^5.8.1';
    pkg.scripts['db:generate'] = 'prisma generate';
    pkg.scripts['db:push'] = 'prisma db push';
    pkg.scripts['db:migrate'] = 'prisma migrate dev';
    pkg.scripts['db:studio'] = 'prisma studio';
  } else if (config.database === 'mysql') {
    pkg.dependencies['@prisma/client'] = '^5.8.1';
    pkg.devDependencies.prisma = '^5.8.1';
    pkg.scripts['db:generate'] = 'prisma generate';
    pkg.scripts['db:push'] = 'prisma db push';
    pkg.scripts['db:migrate'] = 'prisma migrate dev';
    pkg.scripts['db:studio'] = 'prisma studio';
  } else if (config.database === 'sqlite') {
    pkg.dependencies['better-sqlite3'] = '^9.4.3';
    if (config.language === 'typescript') {
      pkg.devDependencies['@types/better-sqlite3'] = '^7.6.8';
    }
  }

  if (config.auth === 'jwt') {
    pkg.dependencies.jsonwebtoken = '^9.0.2';
    pkg.dependencies.bcryptjs = '^2.4.3';
    if (config.language === 'typescript') {
      pkg.devDependencies['@types/jsonwebtoken'] = '^9.0.5';
      pkg.devDependencies['@types/bcryptjs'] = '^2.4.6';
    }
  } else if (config.auth === 'session') {
    pkg.dependencies['express-session'] = '^1.17.3';
    if (config.database === 'mongodb') {
      pkg.dependencies['connect-mongo'] = '^4.6.0';
    }
    if (config.language === 'typescript') {
      pkg.devDependencies['@types/express-session'] = '^1.17.10';
    }
  } else if (config.auth === 'oauth2') {
    pkg.dependencies.passport = '^0.7.0';
    pkg.dependencies['passport-google-oauth20'] = '^2.0.0';
    pkg.dependencies['passport-github2'] = '^0.1.12';
    pkg.dependencies['express-session'] = '^1.17.3';
    if (config.language === 'typescript') {
      pkg.devDependencies['@types/passport'] = '^1.0.16';
      pkg.devDependencies['@types/passport-google-oauth20'] = '^2.0.16';
      pkg.devDependencies['@types/express-session'] = '^1.17.10';
    }
  }

  if (config.database === 'postgresql' || config.database === 'mysql') {
    pkg.scripts['db:seed'] = 'node prisma/seed.js';
  }

  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkg, null, 2)
  );
}

module.exports = { generateProject };
