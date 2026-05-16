# Fix Verification — `fix/security-foundation`

Reproducible curl commands proving each ISSUES.md fix in this branch. Run with the dev server up: `cd BackEnd && npm run dev` on port 4000.

Set up once:
```bash
export BASE=http://localhost:4000
# Get a fresh admin token for the auth-gated tests
export TOKEN=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@themillions.com","password":"adminpassword123"}' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])')
echo "TOKEN=$TOKEN"
```

---

## H10 — Boot-time env validation

**Before:** server started with missing vars, broke at first request.
**After:** server exits with itemized errors on misconfiguration.

```bash
# Temporarily blank a required var → server refuses to boot
( cd BackEnd && JWT_SECRET="" npm run dev )
# Expected:
# ❌ Invalid environment configuration:
#   • JWT_SECRET: JWT_SECRET must be at least 32 characters
# (process exits 1)
```

---

## H9 — Singleton Prisma client

**Before:** 10 modules each instantiated `new PrismaClient()` → ~100 pooled connections.
**After:** All modules import `prisma` from [src/lib/prisma.ts](../BackEnd/src/lib/prisma.ts).

```bash
# Should print one line: the singleton itself.
grep -rn "new PrismaClient" BackEnd/src/ --include="*.ts"
# Expected: src/lib/prisma.ts:7:export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

---

## C1 — JWT fallback removed

**Before:** `JWT_SECRET || "supersecretkey"` accepted forged tokens.
**After:** Boot fails without `JWT_SECRET`; forged tokens rejected.

```bash
# A token signed with the old hardcoded secret must be rejected
FORGED=$(python3 -c "
import jwt
print(jwt.encode({'userId':'fake','email':'fake@x.com'}, 'supersecretkey', algorithm='HS256'))
")
curl -i -X POST "$BASE/api/admin/pages" \
  -H "Authorization: Bearer $FORGED" \
  -H "Content-Type: application/json" \
  -d '{"slug":"hack","title":"hack"}'
# Expected: 401 {"error":"Invalid or expired token"}
```

---

## C2 — `/services` mutations require auth

```bash
# Unauthenticated mutation must be rejected
curl -i -X POST "$BASE/api/services" \
  -H "Content-Type: application/json" \
  -d '{"name":"unauthorized","description":"bad"}'
# Expected: 401 {"error":"Authorization header missing"}

# Authenticated mutation succeeds
curl -i -X POST "$BASE/api/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Verification Test Service"}'
# Expected: 201 with service body (note: description optional now)
```

---

## C3 — PII no longer leaks via `/services/:id`

**Before:** Unauthenticated GET on `/services/:id` returned every ContactMessage attached.
**After:** Endpoint requires auth AND returns only `{id, name, description, createdAt, updatedAt}` — never messages.

```bash
SVC_ID=$(curl -s "$BASE/api/services" | python3 -c 'import sys,json; print(json.load(sys.stdin)[0]["id"])')

# Unauthenticated → 401
curl -i "$BASE/api/services/$SVC_ID"
# Expected: 401

# Authenticated → 200, no "messages" field present
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/api/services/$SVC_ID" | python3 -m json.tool
# Expected: response has id/name/description/createdAt/updatedAt — no "messages" key
```

---

## C5 (partial) — Body size limit

```bash
# A 2MB body must be rejected with 413
python3 -c 'import sys; sys.stdout.write("{\"x\":\"" + "A"*(2*1024*1024) + "\"}")' > /tmp/big.json
curl -i -X POST "$BASE/api/contact" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/big.json
# Expected: 413 Payload Too Large
```

---

## C6 — CORS pinned

```bash
# Allowed origin → request proceeds
curl -i -H "Origin: http://localhost:5173" "$BASE/api/health"
# Expected: 200 OK with Access-Control-Allow-Origin: http://localhost:5173

# Disallowed origin → 403
curl -i -H "Origin: http://evil.example.com" "$BASE/api/health"
# Expected: 403 {"error":"CORS: origin http://evil.example.com not allowed"}
```

---

## C7 — Rate limiting

```bash
# Login: 6 rapid attempts → 6th returns 429
for i in $(seq 1 6); do
  echo "attempt $i:"
  curl -s -o /dev/null -w "  status=%{http_code}\n" \
    -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@x.com","password":"x"}'
done
# Expected: first 5 are 401, 6th is 429 with body {"error":"Too many login attempts..."}

# Inspect rate-limit headers
curl -i -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@x.com","password":"x"}' | grep -i ratelimit
# Expected: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset headers present
```

---

## Bonus — Upload folder sanitization

**Before:** `?folder=../../etc/passwd` passed straight to Cloudinary.
**After:** Folder name validated against `^[a-zA-Z0-9_\-/]+$`; `..` and oddities fall back to `"uploads"`.

```bash
# Pass an evil folder; upload still works but lands in "uploads"
curl -i -X POST "$BASE/api/admin/upload?folder=../../etc/passwd" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/any.png"
# Expected: 200 with Cloudinary URL containing /uploads/ — NOT /../../etc/passwd/
```

---

## What this branch does NOT fix (next slice)

- **C4** — Contact already has Zod validation; sanitization step deferred (plain-text fields, frontend escapes).
- **C5** (full) — `Section.content` still `z.any()`. Needs per-type discriminated union.
- **H11/H13/H14/H15** — Global error handler accepts ApiError but controllers haven't been migrated off per-route try/catch.
- **H16** — Blog `title`/`excerpt`/`author` still unsanitized.
- **H17/H18/H19/H20** — RBAC, password change, missing admin contact endpoints, `any` cleanup.
