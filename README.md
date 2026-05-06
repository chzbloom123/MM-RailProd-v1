# Mutants × Monsters (MMC)

Browser-based, AI-assisted post-apocalyptic tabletop session platform. Mono-service: Fastify API + Vite/React frontend served from one Railway service, Postgres for persistence, Volume-backed storage for exported storybook PDFs.

## Local development

Prereqs: Node 20+, a Postgres instance.

```bash
cp .env.example .env
# edit DATABASE_URL and JWT_SECRET

npm install
npm run db:dev          # apply migrations to local DB
npm run dev             # web on :3000, api on :8080
```

The Vite dev server proxies `/api/*` to the Fastify server, so the frontend talks to the API at the same origin in both dev and prod.

## Deploying to Railway

1. **Create a Railway project** and add the **Postgres** plugin. Railway injects `DATABASE_URL` automatically.
2. **Add a Volume** to the web service, mounted at `/data`. This is where uploaded storybook PDFs live.
3. **Set service variables**:
   - `JWT_SECRET` — long random string
   - `NODE_ENV=production`
   - `STORAGE_DIR=/data`
4. **Push to the connected branch.** Railway runs:
   - Install: `npm ci`
   - Build: `npm run build` (compiles server + Vite build)
   - Release: `npm run db:push` (applies the Prisma schema directly — see note)
   - Start: `npm run start` (serves API at `/api/*`, frontend everywhere else)
5. Open the generated public URL.

### Migration story

The release step uses `prisma db push --skip-generate --accept-data-loss`, which syncs the database to whatever `schema.prisma` looks like — fast, no migration files required. Fine for early development.

Once the data model is stable and you care about migration history, run `npx prisma migrate dev --name <change>` locally, commit `server/prisma/migrations/`, and switch the `startCommand` in `railway.json` (and `[start]` in `nixpacks.toml`) from `npm run db:push` to `npm run db:migrate`.

## Layout

```
/
├── app/        # Vite + React + TS + styled-components frontend
├── server/     # Fastify + Prisma + Postgres backend
├── package.json (npm workspace orchestrator)
└── railway.json + nixpacks.toml
```

## API surface (v1)

| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/auth/register` | `{ email, password }` → sets cookie |
| `POST` | `/api/auth/login` | `{ email, password }` → sets cookie |
| `POST` | `/api/auth/logout` | clears cookie |
| `GET` | `/api/auth/me` | returns current user |
| `GET` | `/api/campaigns` | list current user's campaigns |
| `POST` | `/api/campaigns` | create |
| `GET` | `/api/campaigns/:id` | one campaign + storybooks list |
| `PUT` | `/api/campaigns/:id` | update name + game-state blob |
| `DELETE` | `/api/campaigns/:id` | delete |
| `POST` | `/api/campaigns/:id/storybooks` | multipart PDF upload |
| `GET` | `/api/storybooks/:id` | download (auth-checked) |
| `DELETE` | `/api/storybooks/:id` | delete |
| `GET` | `/api/health` | liveness probe |

The campaign `data` column is a free-form `Json` blob until the game schema is formalized.
