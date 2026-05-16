# The Millions — Backend Journey

A running log of setup, fixes, and progress on the backend.

---

## 2026-04-26 — Initial Setup & First Run

### Step 1 — Database created & migrations applied

```sql
CREATE DATABASE "The-Millions";
```

Then `npx prisma migrate dev` succeeded — all 4 migrations applied:
- `20260104060501_init`
- `20260110113009_add_user_model`
- `20260119091004_add_service_and_contact`
- `20260131214147_blog`

Prisma Client v6.19.2 generated.

### Step 2 — `prisma db seed` ran silently — no data inserted

DB query confirmed `User` and `Page` tables were empty after seed.

**Root cause:** [package.json](package.json) had an npm script `"seed": "tsx prisma/seed.ts"` but no top-level `"prisma": { "seed": "..." }` config — which is what `npx prisma db seed` looks for.

**Fix:** Added to `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

### Step 3 — Seed succeeded

Re-ran `npx prisma db seed`:
```
🌱 Home page seeded
🌱 About page seeded
🌱 Blog page seeded
👤 Admin user seeded
```

Admin credentials: `admin@themillions.com` / `adminpassword123`.

### Step 4 — Migrated seed config to `prisma.config.ts` (deprecation cleanup)

Prisma warned that `package.json#prisma` is deprecated and will be removed in Prisma 7.

**Fix:** Moved the seed config into [prisma.config.ts](prisma.config.ts):
```ts
migrations: {
  path: "prisma/migrations",
  seed: "tsx prisma/seed.ts",
},
```
And removed the `"prisma"` block from [package.json](package.json).

### Step 5 — Switched from `main` to `dev-hussoo`

Stashed in-progress edits (`-u` to include untracked `JOURNEY.md`), checked out `dev-hussoo`, popped the stash. Auto-merge succeeded — turns out `dev-hussoo` already had the same `prisma.config.ts` shape we converged on (using `env("DATABASE_URL")` and the seed entry).

**`dev-hussoo` brings additional backend work vs main:**
- New **Footer module** ([src/modules/footer/](src/modules/footer/))
- New **Footer DB model** (migration `20260224110833_add_footer_model`)
- New **`description` field on Service** (migration `20260419085405_add_description_to_service`)
- Expanded seed data (~99 net new lines)
- Cloudinary upload improvements
- Enhanced services module logic
- New dependency: `dotenv-cli`

---

### Step 6 — Server running on port 4000

`npm run dev` succeeded. Health check available at http://localhost:4000/api/health.

> ⚠️ Noticed `[dotenv@17.2.3] injecting env (0)` in startup log — typically means 0 vars were loaded from `.env`. Need to verify `JWT_SECRET` is actually present in `process.env` at runtime (will be confirmed when we test `/api/auth/login`).

### Step 7 — Deep analysis of `dev-hussoo` codebase

Mapped all modules, routes, validation, and likely failure modes. **35 endpoints across 9 modules.**

**Modules:** auth, admin (pages), pages (public), blog (public + admin), services, contact, upload, footer (new), health.

**Seeded data:**
- Admin: `admin@themillions.com` / `adminpassword123`
- Pages: `home`, `about` (with sections + footers)
- Footer copy seeded for both pages
- ⚠️ **No services seeded** — must `POST /api/services` before contact form testing

**Critical issues confirmed for fix list:**

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | 🔴 HIGH | `POST/PUT/DELETE /api/services` have **no auth** — anyone can mutate | [services.routes.ts](src/modules/services/services.routes.ts) |
| 2 | 🔴 HIGH | `POST /api/contact` doesn't validate `serviceId` exists → 500 on FK violation | [contact.controller.ts](src/modules/contact/contact.controller.ts) |
| 3 | 🔴 HIGH | `POST /api/contact` doesn't validate email format | [contact.controller.ts](src/modules/contact/contact.controller.ts) |
| 4 | 🔴 HIGH | `JWT_SECRET` falls back to `"supersecretkey"` | [auth.middleware.ts:4](src/middlewares/auth.middleware.ts#L4) |
| 5 | 🟡 MED | No global error handler — empty `error.middleware.ts` / `notFound.middleware.ts` | [src/middlewares/](src/middlewares/) |
| 6 | 🟡 MED | Upload `folder` query param not sanitized | [upload.controller.ts](src/modules/upload/upload.controller.ts) |
| 7 | 🟡 MED | No env validation at startup (Cloudinary vars not checked) | [src/server.ts](src/server.ts) |
| 8 | 🟡 MED | Multiple `new PrismaClient()` instances instead of singleton | various services |
| 9 | 🟡 MED | Pagination params not validated (negative/huge values pass through) | [blog.service.ts](src/modules/blog/blog.service.ts) |
| 10 | 🟢 LOW | `PUT /api/services/:id` accepts undefined values, sets fields to null | [services.controller.ts](src/modules/services/services.controller.ts) |
| 11 | 🟢 LOW | `Footer` PUT has no Zod validation for `socialMedia` JSON shape | [footer.controller.ts](src/modules/footer/footer.controller.ts) |
| 12 | 🟢 LOW | Blog `sections[].content` validated as `z.any()` — no shape check | [admin.validation.ts](src/modules/admin/admin.validation.ts) |

---

## Current State

- ✅ On branch `dev-hussoo`
- ✅ Postgres + DB + migrations + seed all good
- ✅ Server running on `http://localhost:4000`
- ✅ Full codebase analysis complete (35 endpoints mapped)
- 📋 Test plan ready (see Phase 1–8 below)
- ⏳ Begin endpoint smoke tests

## Step 8 — Endpoint smoke tests (all 8 phases)

Ran 36 tests across all modules. Notable findings:

### ✅ Working as expected
- **Auth** — login valid (200 + token), wrong password (401), empty body (400)
- **Public pages** — `/api/pages/home` returns 6 sections, `/api/pages/about` returns 6 sections, footers separate
- **Admin pages** — auth-gated, Zod validation on body, 409 on duplicate slug, cascade delete
- **Blog admin** — create draft/published, HTML sanitization strips `<script>` tags, auto-`publishedAt` on PUBLISHED
- **Blog public** — only PUBLISHED posts visible, drafts return 404
- **Footer** — public GET works, PUT auth-gated, 404 on missing page
- **Upload** — auth-gated, 400 on missing file
- **Health** — 200 OK
- **Contact happy path** — 201 with valid data

### 🔴 Bugs confirmed (added to fix queue)

| # | Test | Bug | Severity |
|---|------|-----|----------|
| 1 | T6, T12, T13 | `POST/PUT/DELETE /api/services` accept requests without auth | 🔴 HIGH |
| 2 | T29 | `POST /api/contact` accepts `email: "not-an-email"` (no email validation) | 🔴 HIGH |
| 3 | T30 | `POST /api/contact` returns **500** when `serviceId` doesn't exist (FK violation uncaught) | 🔴 HIGH |
| 4 | (analysis) | `JWT_SECRET` falls back to hardcoded `"supersecretkey"` | 🔴 HIGH |
| 5 | observed | Inconsistent error shape: most endpoints use `{"message": ...}`, Contact + Footer use `{"error": ...}` | 🟡 MED |
| 6 | (analysis) | No global error/notFound middleware ([error.middleware.ts](src/middlewares/error.middleware.ts), [notFound.middleware.ts](src/middlewares/notFound.middleware.ts) are empty) | 🟡 MED |
| 7 | (analysis) | Upload `folder` query param not sanitized (path injection possible) | 🟡 MED |
| 8 | (analysis) | No env validation at startup (Cloudinary vars not checked) | 🟡 MED |
| 9 | (analysis) | Multiple `new PrismaClient()` instances (should be singleton) | 🟡 MED |
| 10 | (analysis) | `PUT /api/services/:id` accepts undefined values, sets fields to null | 🟢 LOW |
| 11 | (analysis) | Footer PUT has no Zod validation (any JSON accepted in `socialMedia`) | 🟢 LOW |
| 12 | (analysis) | Pagination params (`page`, `limit`) not validated | 🟢 LOW |
| 13 | (analysis) | Sections `content` field validated as `z.any()` | 🟢 LOW |

---

## Current State

- ✅ All 36 smoke tests run, results captured
- 📋 Fix queue prioritized (13 issues across HIGH/MED/LOW)
- ⏳ Begin fixing — start with HIGH severity items (1-4)

## Next Steps (Fix Order)

**Sprint 1 — HIGH severity (security & data integrity):**
1. Add `authenticate` middleware to `POST/PUT/DELETE /api/services`
2. Add Zod validation to `/api/contact` (email format, required fields, length limits)
3. Catch Prisma `P2003` (FK violation) in contact controller → return 400 with clear message
4. Remove `JWT_SECRET` hardcoded fallback; fail fast if missing

**Sprint 2 — MED severity (consistency & observability):**
5. Implement global error middleware + 404 handler
6. Standardize error response shape (`{"message": ...}` everywhere)
7. Sanitize upload `folder` param
8. Validate required env vars at startup
9. Convert Prisma client to singleton

**Sprint 3 — LOW severity (polish):**
10-13. Footer Zod schema, pagination validation, services PUT undefined handling, sections content shape
