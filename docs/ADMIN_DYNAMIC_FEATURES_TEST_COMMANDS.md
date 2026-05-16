# API Test Commands for Admin Dynamic Features

## Authentication
First, obtain a JWT token by logging in as admin:
```bash
curl -X POST http://localhost:10000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@themillions.com",
    "password": "adminpassword123"
  }'
```

Save the returned JWT token for use in the following commands (replace YOUR_JWT_TOKEN with the actual token).

## Admin Sidebar API Tests
```bash
# GET /api/admin/sidebar (Fetch admin sidebar configuration)
curl -X GET http://localhost:10000/api/admin/sidebar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: 200 OK with array of sidebar items
```

## Admin Dashboard API Tests
```bash
# GET /api/admin/dashboard (Fetch admin dashboard widgets)
curl -X GET http://localhost:10000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: 200 OK with array of dashboard widgets
```

## Admin Settings API Tests
```bash
# GET /api/admin/settings (Fetch all admin settings grouped by category)
curl -X GET http://localhost:10000/api/admin/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: 200 OK with object where keys are setting groups and values are arrays of settings

# PUT /api/admin/settings/:key (Update a specific setting)
# Example: Update site title
curl -X PUT http://localhost:10000/api/admin/settings/site.title \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "The Millions CMS",
    "type": "string"
  }'
# Expected: 200 OK with the updated setting object

# Example: Update a boolean setting
curl -X PUT http://localhost:10000/api/admin/settings/site.maintenanceMode \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": false,
    "type": "boolean"
  }'
# Expected: 200 OK with the updated setting object
```

## Swagger UI Test
```bash
# Access Swagger UI
# Open in browser: http://localhost:10000/api-docs
# Or fetch the JSON spec:
curl -X GET http://localhost:10000/api-docs/json
# Expected: 200 OK with Swagger JSON specification
```

## Error Cases to Test
```bash
# Invalid JWT token for sidebar
curl -X GET http://localhost:10000/api/admin/sidebar \
  -H "Authorization: Bearer invalid_token_here"
# Expected: 401 Unauthorized

# Non-existent setting key
curl -X PUT http://localhost:10000/api/admin/settings/non.existent.key \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "test",
    "type": "string"
  }'
# Expected: 404 Not Found

# Invalid setting type
curl -X PUT http://localhost:10000/api/admin/settings/site.title \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "The Millions",
    "type": "invalid_type"
  }'
# Expected: 400 Bad Request
```