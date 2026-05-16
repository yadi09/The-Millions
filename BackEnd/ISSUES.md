# Backend Issues — Critical & High Priority

Status legend: ☐ open, ☑ done after dev verifies fix in code.
Severity legend: 🔴 Critical (security / data exposure / unauthorized writes), 🟠 High (broken error paths, fragility, missing essentials).

Each issue has a **Where**, **Problem**, **Why it matters**, **Repro**, and **Suggested fix** so you can verify and patch each one in isolation.

---

## 🔴 Critical

### C1 — Hardcoded JWT fallback secret
- **Where:** [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts) — `process.env.JWT_SECRET || "supersecretkey"`
- **Problem:** If `JWT_SECRET` env var is missing or misnamed, the app silently signs and verifies tokens with the literal string `"supersecretkey"` — visible in source.
- **Why it matters:** Anyone reading the repo (or any leaked snapshot of it) can forge a valid admin token and call every protected endpoint.
- **Repro:** Unset `JWT_SECRET`, restart server, sign a token externally with `"supersecretkey"`, hit `POST /api/admin/pages` — accepted.
- **Fix:** Remove the `|| "supersecretkey"` fallback. Validate env at boot (see H10) so the server refuses to start without `JWT_SECRET`. Require min length (≥32 chars).

### C2 — `/api/services` mutations are unauthenticated
- **Where:** [src/modules/services/services.routes.ts](src/modules/services/services.routes.ts) — `POST /`, `PUT /:id`, `DELETE /:id` have no `authenticate` middleware.
- **Problem:** Any unauthenticated client can create, update, or delete services.
- **Why it matters:** Public services list (which feeds the website) can be vandalized or spammed by anyone on the internet.
- **Repro:** `curl -X POST http://localhost:4000/api/services -H "Content-Type: application/json" -d '{"name":"x","description":"y"}'` → returns 201 with no auth header.
- **Fix:** Add `router.use(authenticate)` before mutation routes (mirror the pattern in [src/modules/admin/admin.routes.ts:12](src/modules/admin/admin.routes.ts#L12)). Keep `GET /` public.

### C3 — `GET /api/services` leaks contact-message PII
- **Where:** [src/modules/services/services.service.ts](src/modules/services/services.service.ts) — `getAllServices()` does `include: { messages: true }`.
- **Problem:** Response to a public GET includes every `ContactMessage` row attached to each service (full name, email, phone, message body).
- **Why it matters:** Anyone scraping `/api/services` harvests every contact submission. Real privacy + possible legal exposure.
- **Repro:** `curl http://localhost:4000/api/services` — see `messages` array with PII for every service.
- **Fix:** Drop the `include` from the public list. Return only `{id, name, description}`. If admins need messages, add a separate authenticated endpoint (see H19).

### C4 — `POST /api/contact` accepts XSS payloads
- **Where:** [src/modules/contact/contact.controller.ts](src/modules/contact/contact.controller.ts) and [src/modules/contact/contact.service.ts](src/modules/contact/contact.service.ts) — no sanitization before insert.
- **Problem:** `fullName`, `email`, `message` are stored raw. `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>` are persisted unchanged.
- **Why it matters:** When admins read messages in a future panel that renders these fields as HTML, the XSS fires on the admin's browser.
- **Repro:** POST a contact body with `"fullName":"<script>alert(1)</script>"`. Read the row back from DB — script tag intact.
- **Fix:** Add a Zod schema for the body (mirror [src/modules/admin/admin.validation.ts](src/modules/admin/admin.validation.ts)). Run text fields through `sanitizeHtmlContent` from [src/utils/sanitize.ts](src/utils/sanitize.ts), or strip HTML entirely (these are plain-text fields, not rich content). Always escape on the rendering side too.

### C5 — `Page.Section.content` is unvalidated and unsanitized
- **Where:** [src/modules/admin/admin.validation.ts:6](src/modules/admin/admin.validation.ts#L6) — `content: z.any()`. [src/modules/admin/admin.service.ts](src/modules/admin/admin.service.ts) — passes through to Prisma.
- **Problem:** Admin can store arbitrary JSON, including HTML strings with `<script>`, into section content. The public `GET /api/pages/:slug` returns it as-is.
- **Why it matters:** XSS surface for the public website if any section content is rendered as HTML on the frontend. Also: no size limit means a 50MB JSON blob can be inserted.
- **Fix:** Replace `z.any()` with a typed schema per section type (`hero`, `cta`, `team`, etc.). For free-form text fields inside content, sanitize with `sanitizeHtmlContent`. Add an overall body size limit at the express layer (`express.json({ limit: '1mb' })`).

### C6 — CORS is wide open
- **Where:** [src/app.ts](src/app.ts) — `app.use(cors())` with no config.
- **Problem:** Allows any origin with credentials. Browser-based attacks from a malicious site can call your API on a victim's behalf.
- **Why it matters:** Coupled with C1/C2/C4 above, an attacker can build a single-page exploit that hits multiple unprotected endpoints.
- **Fix:** Pin `origin` to your frontend domain(s) via env var, e.g. `cors({ origin: env.CORS_ORIGINS.split(','), credentials: true })`. Add `CORS_ORIGINS` to env validation.

### C7 — No rate limiting on auth or contact endpoints
- **Where:** [src/modules/auth/auth.routes.ts](src/modules/auth/auth.routes.ts), [src/modules/contact/contact.routes.ts](src/modules/contact/contact.routes.ts).
- **Problem:** Unlimited requests to `POST /api/auth/login` (brute-force passwords) and `POST /api/contact` (spam).
- **Why it matters:** With one admin user and a hash that can be tested at thousands/sec, the login endpoint is a real target. Contact form will fill DB with junk.
- **Fix:** Add `express-rate-limit`. Tighter limit on `/auth/login` (e.g. 5/min/ip), looser on `/contact` (e.g. 10/hour/ip). Consider `express-slow-down` to soft-throttle before hard-blocking.

### C8 — Contact form accepts invalid email format
- **Where:** [src/modules/contact/contact.controller.ts](src/modules/contact/contact.controller.ts) — only checks presence, not format.
- **Problem:** `"email": "not-an-email"` is accepted (verified — exists in current DB).
- **Why it matters:** Garbage data accumulates. Any future "send confirmation email" feature will silently fail or bounce.
- **Fix:** Same Zod schema as C4: `email: z.string().email()`. Reject before insert.

---

## 🟠 High

### H9 — Multiple `new PrismaClient()` instances
- **Where:** Each module instantiates its own client:
  - [src/modules/auth/auth.service.ts](src/modules/auth/auth.service.ts)
  - [src/modules/pages/pages.service.ts](src/modules/pages/pages.service.ts)
  - [src/modules/contact/contact.service.ts](src/modules/contact/contact.service.ts)
  - [src/modules/admin/admin.service.ts](src/modules/admin/admin.service.ts)
  - [src/modules/blog/blog.service.ts](src/modules/blog/blog.service.ts)
  - [src/modules/blog/admin.blog.service.ts](src/modules/blog/admin.blog.service.ts)
  - [src/modules/services/services.service.ts](src/modules/services/services.service.ts)
  - [src/modules/footer/footer.service.ts](src/modules/footer/footer.service.ts)
- **Problem:** Each `new PrismaClient()` opens its own Postgres connection pool (~10 connections). 8 modules × 10 = ~80 connections held by one app process. Worse during `tsx watch` reloads — old clients leak before GC.
- **Why it matters:** Postgres connection limit is finite (typically 100). Hits "too many connections" errors at random.
- **Fix:** Create `src/lib/prisma.ts` exporting one shared client (cache on `globalThis` for hot reload). Replace each `new PrismaClient()` with `import { prisma } from "../../lib/prisma.js"`.

### H10 — No environment validation at boot
- **Where:** [src/config/env.ts](src/config/env.ts) is empty. `process.env.X` read scattered across [server.ts](src/server.ts), [auth.middleware.ts](src/middlewares/auth.middleware.ts), [auth.service.ts](src/modules/auth/auth.service.ts), [upload.service.ts](src/modules/upload/upload.service.ts).
- **Problem:** Same variable handled differently in different files (one `throws`, one falls back to `"supersecretkey"`, one passes `undefined` to Cloudinary). Missing vars surface as confusing runtime errors.
- **Why it matters:** Deploy with a misconfigured `.env`, server starts cleanly, then breaks on first user request hours later.
- **Fix:** Implement `src/config/env.ts` with a Zod schema covering `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `CORS_ORIGINS`. Parse `process.env`; on failure log all issues and `process.exit(1)`. Replace every `process.env.X` with `env.X`.

### H11 — No global error handler
- **Where:** [src/middlewares/error.middleware.ts](src/middlewares/error.middleware.ts) is empty. [src/app.ts](src/app.ts) never registers an error handler.
- **Problem:** Every controller has its own `try/catch` with `console.error` + ad-hoc 500 response. ~30 duplicated blocks across the codebase. Some controllers translate Prisma `P2002`/`P2025`, some don't — same condition returns different status codes in different modules.
- **Why it matters:** Inconsistent error UX. Frontend has to handle multiple shapes. New endpoints inevitably forget the try/catch.
- **Fix:** Define error classes (`ApiError`, `NotFoundError`, `BadRequestError`, `ConflictError`, `UnauthorizedError`) in `src/utils/errors.ts`. Implement a global handler that maps `ApiError` → its status, `ZodError` → 400 with details, Prisma `P2002` → 409, `P2025` → 404, anything else → 500. Register it as the **last** middleware in [app.ts](src/app.ts).

### H12 — No 404 handler
- **Where:** [src/middlewares/notFound.middleware.ts](src/middlewares/notFound.middleware.ts) is empty. Not registered in [src/app.ts](src/app.ts).
- **Problem:** Unmatched routes (e.g. `GET /api/typo`) return Express's default HTML error page, not JSON.
- **Why it matters:** Frontend expects JSON for every response. JSON.parse on HTML throws and surfaces as a generic error to the user.
- **Fix:** Implement a 404 handler returning `{ error: "Route not found: METHOD /path" }` with status 404. Register it just before the global error handler in [app.ts](src/app.ts).

### H13 — Inconsistent error response shape
- **Where:** Every controller. Examples:
  - [auth.controller.ts](src/modules/auth/auth.controller.ts) → `{ message: "Invalid credentials" }`
  - [blog.controller.ts](src/modules/blog/blog.controller.ts) → `{ error: "Failed to fetch blogs" }`
  - [admin.blog.controller.ts](src/modules/blog/admin.blog.controller.ts) → `{ message: "Validation error", errors: {...zod-format...} }`
- **Problem:** Some endpoints return `{message}`, some `{error}`, some both, validation errors use a different shape per controller.
- **Why it matters:** Frontend has to handle every variant. Unifies once H11 lands and controllers are migrated to throw.
- **Fix:** After H11, convert each controller to throw typed errors (drop try/catch, drop manual responses for known cases). Standard shape: `{ error: string, details?: unknown }`.

### H14 — Empty request body returns 500
- **Where:** Multiple controllers destructure `req.body` without guarding:
  - [auth.controller.ts:5](src/modules/auth/auth.controller.ts#L5) — `const { email, password } = req.body;`
  - [services.controller.ts](src/modules/services/services.controller.ts) — same pattern.
  - [contact.controller.ts](src/modules/contact/contact.controller.ts) — same.
- **Problem:** `POST /api/auth/login` with no body / no `Content-Type` → `req.body` is `undefined` → destructuring throws → 500. A bad-request input should never produce a 500.
- **Why it matters:** 500s show up in error monitoring as bugs; 400s are expected client errors. Buries real signal in noise.
- **Repro:** `curl -X POST http://localhost:4000/api/auth/login` (no `-d`, no `-H`) → 500.
- **Fix:** Either (a) Zod-validate every body and let H11 produce a 400, or (b) guard with `req.body ?? {}` before destructuring. (a) is preferred.

### H15 — Multer file-filter rejection becomes 500
- **Where:** [src/modules/upload/upload.routes.ts:16](src/modules/upload/upload.routes.ts#L16) — `cb(new Error('Only image files are allowed'))`. [src/modules/upload/upload.controller.ts:19](src/modules/upload/upload.controller.ts#L19) — catch-all returns 500.
- **Problem:** Uploading a `.txt` file is a client error (400), not a server error (500).
- **Why it matters:** Same as H14 — pollutes error logs, misleading status to frontend.
- **Repro:** `curl -X POST -H "Authorization: Bearer $TOKEN" -F "image=@notes.txt" http://localhost:4000/api/admin/upload` → 500 with "Internal server error".
- **Fix:** Use a multer error-handling middleware that maps `MulterError` and the custom "Only image files are allowed" to a 400 via `next(new BadRequestError(err.message))`. Once the global error handler (H11) is in, controller try/catch can be removed entirely.

### H16 — Blog title/excerpt/author are not sanitized
- **Where:** [src/modules/blog/admin.blog.service.ts](src/modules/blog/admin.blog.service.ts) — only `data.content` is run through `sanitizeHtmlContent`; `title`, `excerpt`, and `author` are spread in raw.
- **Problem:** `<script>alert(1)</script>` is accepted as a blog title (verified). When the admin panel or public blog page renders title/excerpt/author as HTML, XSS fires.
- **Why it matters:** Attacker with admin access (or stolen token — see C1) can plant a stored XSS that fires on every visitor.
- **Fix:** Either sanitize all four fields, or constrain title/excerpt/author to plain text via Zod (`z.string().regex(/^[^<>]+$/)`) and reject anything containing HTML markup.

### H17 — No RBAC; one role for all authenticated users
- **Where:** [prisma/schema.prisma](prisma/schema.prisma) — `User` has no `role` field. [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts) — only authenticates, doesn't authorize.
- **Problem:** Any authenticated user can perform every admin action. There's no concept of a "viewer" or "editor" or "super admin."
- **Why it matters:** Adding a second user (when that day comes) means giving them root-level access to everything. No way to scope a junior editor to drafts only, etc.
- **Fix:** Add `role` enum to `User` model (`ADMIN | EDITOR | VIEWER`). Add `requireRole(...roles)` middleware that runs after `authenticate` and checks the JWT payload. Update token generation to embed `role`.

### H18 — No password change / reset flow
- **Where:** [src/modules/auth/auth.routes.ts](src/modules/auth/auth.routes.ts) — only `POST /login`.
- **Problem:** The seed-installed password is the only way in, forever. If the seed value is leaked or guessed, the only recovery is direct DB surgery.
- **Why it matters:** Operational risk. Also: makes it impossible to enforce password rotation.
- **Fix:** Add `POST /api/auth/change-password` (authenticated; takes `currentPassword` + `newPassword`, hashes & updates). Optional: add a token-based reset flow with email.

### H19 — No admin endpoint for contact messages
- **Where:** [src/modules/contact/contact.routes.ts](src/modules/contact/contact.routes.ts) — only `POST /` exposed.
- **Problem:** Contact messages are written to DB but there's no API to list, view, mark-read, or delete them.
- **Why it matters:** Submissions are essentially write-only — admins can't action them through the API. Currently the only way to read them is the public PII leak (C3).
- **Fix:** Add authenticated routes:
  - `GET /api/admin/contact-messages` — list (paginated, optional `?serviceId=`, `?unread=true`)
  - `GET /api/admin/contact-messages/:id` — single
  - `PATCH /api/admin/contact-messages/:id` — mark read / add notes
  - `DELETE /api/admin/contact-messages/:id` — delete
  - Add `read: Boolean @default(false)` and `readAt: DateTime?` to `ContactMessage` model.

### H20 — Untyped `any` across the auth + admin paths
- **Where:**
  - [src/middlewares/auth.middleware.ts:8](src/middlewares/auth.middleware.ts#L8) — `user?: any` on `AuthRequest`
  - [src/modules/blog/admin.blog.service.ts:6](src/modules/blog/admin.blog.service.ts#L6) and [:21](src/modules/blog/admin.blog.service.ts#L21) — `data: any`
  - Many `catch (error: any)` blocks (e.g. [admin.controller.ts:15](src/modules/admin/admin.controller.ts#L15))
  - [admin.validation.ts:6](src/modules/admin/admin.validation.ts#L6) — `content: z.any()` (also covered by C5)
- **Problem:** Loses TypeScript's safety net at the most security-sensitive points. Easy to access nonexistent fields on `req.user` and have it silently `undefined` instead of erroring at compile time.
- **Why it matters:** Type errors at compile time prevent whole categories of bugs. `any` defeats this.
- **Fix:** Define a proper JWT payload type (`{ userId: string; email: string; role: Role }`) and reuse it on `AuthRequest.user`. Replace `data: any` in blog services with the inferred Zod type (`z.infer<typeof createBlogSchema>`). For catch blocks, use `error: unknown` and narrow with `instanceof`.

---

## How to work through this list

1. C1 → C8 first. These are real security exposure that any pen-test or scraper finds in minutes. C1, C2, C3 are the most urgent.
2. H9, H10 are foundational for the rest. Land them before touching anything else — they make subsequent fixes shorter.
3. H11, H12 next. Once they're in, H13–H15 collapse into deleting code rather than writing it.
4. H16–H20 can land in any order; they're independent.

Each fix should ship with at least one curl test demonstrating the new behavior (request + expected response), since there's no test suite yet.
