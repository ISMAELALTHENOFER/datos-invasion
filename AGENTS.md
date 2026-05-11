# AGENTS.md — Datos de Consolidación CCA

## Project Overview

Node.js + Express app for managing church consolidation data. MySQL backend, vanilla HTML/JS frontend served as static files. No build step.

## Commands

```bash
npm start          # Start production server on PORT (default 3000)
npm run dev        # Start with --watch (auto-restart on changes)
```

No tests, linter, or typechecker are configured. There is no single-test command.

## Project Structure

```
app.js                              # Entry point: mounts middleware, routes, static files
src/
  config/db.js                      # MySQL pool (reads from .env only)
  middleware/errorHandler.js         # Global error handler + 404
  repositories/personaRepository.js # Data access layer (raw SQL via mysql2)
  routes/personas.js               # Express Router (GET/POST /api/personas)
  services/personaService.js       # Business logic + validation
  utils/errors.js                  # AppError, ValidationError, NotFoundError
views/
  index.html                       # SPA with Tailwind CDN + vanilla JS
.env                               # Environment variables (gitignored)
```

## Environment Variables

All in `.env` (never committed — it's in `.gitignore`):

| Variable       | Required | Default | Description         |
|----------------|----------|---------|---------------------|
| `DB_HOST`      | Yes      | —       | MySQL host          |
| `DB_PORT`      | Yes      | 3306    | MySQL port          |
| `DB_USER`      | Yes      | —       | MySQL user          |
| `DB_PASSWORD`  | Yes      | —       | MySQL password      |
| `DB_NAME`      | Yes      | —       | Database name       |
| `PORT`         | No       | 3000    | HTTP server port    |

**Do not hardcode fallback values for secrets** — the pool will fail to connect if any required env var is missing, which is the correct behaviour.

## Code Style Guidelines

### General

- **CommonJS**: `require` / `module.exports` (not ESM).
- **`const`** for all variable/function declarations — no `let` unless rebinding.
- **`async/await`** for all async operations. Use `try/catch` + `next(err)` in route handlers.
- **`snake_case`** for database columns and JSON API response fields (`nombre_completo`, `quiere_visita`).
- **`camelCase`** for all JavaScript identifiers (`personaFromDb`, `findAll`, `loadPersonas`).
- **`PascalCase`** for classes (`AppError`, `ValidationError`, `NotFoundError`).
- **Semicolons**: required.
- **Quotes**: single quotes for strings. Backticks only for template literals that interpolate.

### Imports

```
// Node built-ins first
const path = require('path');

// Third-party next
const express = require('express');
const mysql = require('mysql2/promise');

// Local modules last, grouped by layer
const personasRouter = require('./src/routes/personas');
const { errorHandler } = require('./src/middleware/errorHandler');
const pool = require('../config/db');
const { ValidationError } = require('../utils/errors');
```

Use destructuring for named exports: `const { Router } = require('express')`.

### Naming

| Construct        | Convention        | Example                  |
|------------------|-------------------|--------------------------|
| Files/Dirs       | kebab-case        | `errorHandler.js`        |
| Classes          | PascalCase        | `class AppError`         |
| Functions/vars   | camelCase         | `personaFromDb(row)`     |
| DB columns/API   | snake_case        | `quiere_visita`          |
| Constants        | UPPER_SNAKE       | `process.env.DB_HOST`    |

### Architecture — Layered Pattern

1. **Route** — receives `req`/`res`, delegates to service, catches errors via `next(err)`.
2. **Service** — business logic, input validation, calls repository. Throws `AppError` subclasses.
3. **Repository** — data access only (raw SQL via mysql2 `pool.execute`). Returns plain objects.
4. **Middleware** — cross-cutting concerns (error handler, security headers).

Route handlers must call `next(err)` — do **not** catch errors silently.

### Error Handling

```
utils/errors.js          # Error classes
src/middleware/errorHandler.js  # Global handler
```

- Throw `ValidationError` (400) for bad client input.
- Throw `NotFoundError` (404) for missing resources.
- Throw `AppError` (500 default) for other known failures.
- Unknown errors → 500 "Error interno del servidor" (stack traces logged, never sent to client).
- Route handlers: always `try { ... } catch (err) { next(err); }`.

### Security

- Database credentials live **only** in `.env` (gitignored).
- Use parameterized queries (`pool.execute(query, params)`) — never string concatenation for SQL.
- Security headers set in `app.js`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
- No sensitive data in JSON error responses.

### Frontend (views/index.html)

- **Tailwind CSS** via CDN — custom brand palette defined in `tailwind.config`.
- **Vanilla JS** only (no framework). DOM refs cached via `const $ = id => document.getElementById(id)`.
- **ARIA**: tabs use `role="tablist"`/`tab`/`tabpanel` with `aria-selected`, `aria-controls`, keyboard arrow navigation.
- Toasts use `role="alert"` + `aria-live="assertive"`. Live regions for dynamic content.
- **Phone validation**: `type="tel"`, 7–15 digits, `aria-describedby` error element.
- **Search**: client-side filter that activates after ≥3 characters. Checks nombre_completo, barrio, mentor, invasor, quiere_visita.
- API calls to `/api/personas` via `fetch()`.

### MySQL Table

```sql
CREATE TABLE personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor VARCHAR(255) NOT NULL,
  invasor VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  celular VARCHAR(50),
  barrio VARCHAR(255),
  peticiones TEXT,
  quiere_visita BOOLEAN DEFAULT FALSE,
  se_congrega_iglesia BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Adding Code

1. Create or extend the appropriate layer file under `src/`.
2. Export with `module.exports = { ... }`.
3. Wire routes into `app.js` via `app.use('/api/...', router)`.
4. Run `npm run dev` to test.
