# Deployment Verification Checklist for The Millions CMS

## 1. Build Verification
- [ ] Run `npm run build` (zero errors)
- [ ] Check dist/ directory contains compiled files

## 2. Database Seeding
- [ ] Run `npm run seed` (success)
- [ ] Verify footer record exists in database
- [ ] Verify home page record exists in database

## 3. API Endpoint Tests
Run these curl commands against localhost:10000:

### Footer API Tests
```bash
# GET /api/footer (should return default footer JSON, not 404/500)
curl -X GET http://localhost:10000/api/footer
# Expected: 200 OK with footer JSON

# PUT /api/footer (should update footer)
curl -X PUT http://localhost:10000/api/footer \
  -H "Content-Type: application/json" \
  -d '{"contact":{"label":"Test","title":"Test","subTitle":"Test","phones":[],"email":"test@test.com","website":"test.com","address":[],"whatsapp":"","buttonText":"Test"},"footer":{"logo":"/logo.svg","copyright":"Test Copyright","location":"Test Location"},"showContactBlock":true}'
# Expected: 200 OK with updated footer JSON

# GET /api/footer/:slug (should return global footer, slug ignored)
curl -X GET http://localhost:10000/api/footer/home
# Expected: 200 OK with footer JSON

# PUT /api/footer/:slug (should update global footer, slug ignored)
curl -X PUT http://localhost:10000/api/footer/about \
  -H "Content-Type: application/json" \
  -d '{"contact":{"label":"Test2","title":"Test2","subTitle":"Test2","phones":[],"email":"test2@test.com","website":"test2.com","address":[],"whatsapp":"","buttonText":"Test2"},"footer":{"logo":"/logo.svg","copyright":"Test2 Copyright","location":"Test2 Location"},"showContactBlock":false}'
# Expected: 200 OK with updated footer JSON
```

### Admin Pages API Tests
```bash
# POST /api/admin/pages (should create page)
curl -X POST http://localhost:10000/admin/pages \
  -H "Content-Type: application/json" \
  -d '{"slug":"home","title":"Home Page","sections":[{"type":"hero","order":1,"content":{"title":"Welcome","description":"Test"}}]}'
# Expected: 201 Created with page JSON (save ID for next test)

# GET /api/pages/home (should return sections + footer)
curl -X GET http://localhost:10000/pages/home
# Expected: 200 OK with page sections and footer

# PUT /api/admin/pages/:id (should update page sections without ID conflicts)
# Replace ACTUAL_ID with ID from POST response above
curl -X PUT http://localhost:10000/admin/pages/ACTUAL_ID \
  -H "Content-Type: application/json" \
  -d '{"slug":"home","title":"Updated Home","sections":[{"type":"hero","order":1,"content":{"title":"Welcome Updated","description":"Test Updated"}},{"type":"about","order":2,"content":{"title":"About","description":"Test About"}}]}'
# Expected: 200 OK with updated page JSON
```

## 4. Deployment Requirements Verification
- [ ] Server binds to process.env.PORT || 10000 (check src/server.ts)
- [ ] Host is 0.0.0.0 (check src/server.ts)
- [ ] Health endpoint doesn't query DB (check src/modules/health/health.routes.ts)
- [ ] NODE_ENV=production hides stack traces (ensure no console.error in production responses)

## 5. Git Status Verification
- [ ] Run `git status` (should be clean or show only expected changes)
- [ ] Run `git diff` to verify changes

## 6. Final Push Commands
If all checks pass:
```bash
git add .
git commit -m "fix: footer 500 + admin CRUD"
git push origin dev
```