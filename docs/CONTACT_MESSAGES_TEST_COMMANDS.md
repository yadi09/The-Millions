# API Test Commands for Contact Messages Admin Endpoint

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

## Contact Messages Admin API Tests

### GET /api/admin/contact-messages (Fetch contact messages with filtering and pagination)
```bash
# Basic GET request (first page, limit 20)
curl -X GET http://localhost:10000/api/admin/contact-messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With pagination (page 2, limit 10)
curl -X GET http://localhost:10000/api/admin/contact-messages?page=2&limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With status filter (only NEW messages)
curl -X GET http://localhost:10000/api/admin/contact-messages?status=NEW \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With search parameter
curl -X GET http://localhost:10000/api/admin/contact-messages?search=John \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Combined filters
curl -X GET http://localhost:10000/api/admin/contact-messages?page=1&limit=5&status=NEW&search=example \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### PUT /api/admin/contact-messages/:id/status (Update contact message status)
```bash
# Update status to READ
curl -X PUT http://localhost:10000/api/admin/contact-messages/sample-contact-message-1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "READ"
  }'

# Update status to REPLIED
curl -X PUT http://localhost:10000/api/admin/contact-messages/sample-contact-message-1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "REPLIED"
  }'

# Update status back to NEW
curl -X PUT http://localhost:10000/api/admin/contact-messages/sample-contact-message-1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "NEW"
  }'
```

### Error Cases to Test
```bash
# Invalid JWT token
curl -X GET http://localhost:10000/api/admin/contact-messages \
  -H "Authorization: Bearer invalid_token_here"

# Non-existent contact message ID
curl -X PUT http://localhost:10000/api/admin/contact-messages/non-existent-id/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "READ"
  }'

# Invalid status value
curl -X PUT http://localhost:10000/api/admin/contact-messages/sample-contact-message-1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INVALID_STATUS"
  }'
```