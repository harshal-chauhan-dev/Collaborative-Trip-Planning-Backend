# Collaborative Trip Planning — Backend

REST API for trips, collaboration, itinerary, comments, checklists, attachments, reservations, and expenses. **Node.js (ESM)**, **Express**, **PostgreSQL**, **Drizzle ORM**, **Zod** validation, **JWT** in an httpOnly cookie.

## Requirements

- Node.js 20+
- PostgreSQL (local or hosted, e.g. Neon)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` (validated in `src/env.js`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | At least 16 characters |
| `JWT_EXPIRES_IN` | Optional, default `7d` |
| `COOKIE_DOMAIN` | Optional, default `localhost` |
| `CORS_ORIGIN` | **Full URL** of the frontend (e.g. `http://localhost:5173`) |
| `UPLOAD_DIR` | Optional, default `./uploads` |
| `PORT` | Optional, default `3000` |

## Database

```bash
# After schema changes (outputs under ./drizzle — commit this folder)
npm run db:generate

# Apply migrations
npm run db:migrate
```

Optional demo data:

```bash
npm run db:seed
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Watch mode (`node --watch`) |
| `npm start` | Production server |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm run db:studio` | Drizzle Studio |

## Layout

- `src/app.js` — Express app and route mounting  
- `src/modules/*` — Feature modules (`routes.js`, `controller.js`, `service.js`, `schemas.js`)  
- `src/db/` — Drizzle client and schema  
- `src/middleware/` — Auth, trip access, validation, uploads, errors  
- `render.yaml` — Example Render deploy (adjust env in the dashboard)

## Deploy notes

- **CORS**: `CORS_ORIGIN` must match the exact browser origin of your frontend.  
- **Migrations**: The `drizzle/` directory (including `meta/_journal.json`) must be in git so hosts like Render can run `npm run db:migrate`.  
- **Cookies**: Cross-origin browser setups need matching cookie / CORS configuration; adjust `COOKIE_DOMAIN` when you move beyond localhost.

For full-stack context and API tables, see the monorepo `README.md` one level up.
