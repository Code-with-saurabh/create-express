# create-express

CLI tool to scaffold production-ready Express.js backend projects with best practices built in.

## Usage

```bash
npx create-express my-app
```

## Features

- **TypeScript or JavaScript** — choose your preferred language
- **ES Modules or CommonJS** — pick your module format
- **Database support** — MongoDB (Mongoose), PostgreSQL, MySQL (Prisma), SQLite
- **Authentication** — JWT, Session, OAuth2 (Google, GitHub)
- **Docker** — optional Dockerfile and docker-compose setup
- **Production-ready** — rate limiting, error handling, logging, CORS, Helmet

## Options

```
create-express [project-name] [options]

Options:
  -V, --version         output the version number
  -y, --yes             Skip prompts and use defaults
  --ts, --typescript    Use TypeScript
  --js, --javascript    Use JavaScript
  --db <database>       Database (mongodb|postgresql|mysql|sqlite|none)
  --auth <auth>         Authentication (jwt|session|oauth2|none)
  --docker              Include Docker support
  -h, --help            display help for command
```

## Examples

```bash
# Interactive mode
npx create-express my-api

# TypeScript with MongoDB and JWT
npx create-express my-api --ts --db mongodb --auth jwt

# Skip all prompts with defaults
npx create-express my-api -y
```

## Generated Project Structure

```
my-api/
├── src/
│   ├── config/
│   ├── errors/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload (nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## License

MIT
