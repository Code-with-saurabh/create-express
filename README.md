<div align="center">

# create-express-code

**CLI tool to scaffold production-ready Express.js backend projects with best practices built in.**

[![npm version](https://img.shields.io/npm/v/create-express-code.svg)](https://www.npmjs.com/package/create-express-code)
[![npm downloads](https://img.shields.io/npm/dm/create-express-code.svg)](https://www.npmjs.com/package/create-express-code)
[![license](https://img.shields.io/npm/l/create-express-code.svg)](https://github.com/Code-with-saurabh/create-express/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/create-express-code.svg)](https://nodejs.org)

</div>

---

## Quick Start

```bash
npx create-express-code my-api
```

That's it. A production-ready Express.js project will be created in seconds.

## Features

| Feature | Details |
|---------|---------|
| **Language** | TypeScript or JavaScript |
| **Module Format** | ES Modules or CommonJS |
| **Database** | MongoDB, PostgreSQL, MySQL, SQLite or None |
| **Authentication** | JWT, Session, OAuth2 (Google, GitHub) or None |
| **Docker** | Dockerfile + docker-compose with health checks |
| **Security** | Helmet, CORS, Rate Limiting, Input Validation |
| **Logging** | Pino with pretty print in development |
| **Error Handling** | Custom error classes, global error handler |

## Interactive Mode

```bash
npx create-express-code my-api
```

```
? Language: TypeScript (Recommended)
? Module format: ES Modules (import/export)
? Database: MongoDB (Mongoose)
? Authentication: JWT (JSON Web Tokens)
? Include Docker support? Yes
? Install dependencies now? Yes
```

## CLI Options

```bash
npx create-express-code [project-name] [options]
```

| Option | Description |
|--------|-------------|
| `-V, --version` | Output version number |
| `-y, --yes` | Skip all prompts, use defaults |
| `--ts, --typescript` | Use TypeScript |
| `--js, --javascript` | Use JavaScript |
| `--db <database>` | `mongodb` \| `postgresql` \| `mysql` \| `sqlite` \| `none` |
| `--auth <auth>` | `jwt` \| `session` \| `oauth2` \| `none` |
| `--docker` | Include Docker support |
| `-h, --help` | Display help |

## Examples

```bash
# Interactive mode - answer prompts
npx create-express-code my-api

# TypeScript + MongoDB + JWT + Docker
npx create-express-code my-api --ts --db mongodb --auth jwt --docker

# JavaScript + PostgreSQL + OAuth2
npx create-express-code my-api --js --db postgresql --auth oauth2

# Skip all prompts with defaults (TypeScript, no DB, no auth)
npx create-express-code my-api -y

# Quick setup with common stack
npx create-express-code my-api --js --db mongodb --auth jwt
```

## Generated Project Structure

```
my-api/
├── src/
│   ├── config/
│   │   ├── index.js          # Environment config
│   │   └── logger.js         # Pino logger setup
│   ├── errors/
│   │   ├── AppError.js       # Custom error class
│   │   └── notFoundHandler.js # 404 handler
│   ├── middleware/
│   │   ├── asyncHandler.js   # Async error wrapper
│   │   ├── errorHandler.js   # Global error handler
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── requestLogger.js  # Request logging
│   ├── models/               # Database models (if DB selected)
│   ├── routes/
│   │   ├── health.js         # Health check endpoint
│   │   └── index.js          # Route aggregator
│   ├── utils/
│   │   └── asyncHandler.js   # Utility functions
│   ├── app.js                # Express app setup
│   └── server.js             # Server startup
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload (nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

**Database Scripts** (when DB is selected):

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |

## Tech Stack

- **Express.js** - Web framework
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Pino** - Fast JSON logger
- **express-rate-limit** - Rate limiting
- **compression** - Gzip compression
- **dotenv** - Environment variables

**Optional:**
- **Mongoose** - MongoDB ODM
- **Prisma** - PostgreSQL/MySQL ORM
- **better-sqlite3** - SQLite driver
- **jsonwebtoken** - JWT authentication
- **passport** - OAuth2 authentication
- **express-session** - Session management

## Docker Support

When `--docker` is selected:

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

The Dockerfile includes:
- Multi-stage build for smaller image size
- Non-root user for security
- Health check endpoint
- Optimized layer caching

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=info

# Database (if using)
DATABASE_URL=mongodb://localhost:27017/myapp

# JWT (if using)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Session (if using)
SESSION_SECRET=your-session-secret
```

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Saurabh** - [GitHub](https://github.com/Code-with-saurabh)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**If this project helped you, give it a star on GitHub!**

</div>
