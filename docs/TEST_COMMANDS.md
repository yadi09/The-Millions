# API Test Commands for The Millions CMS

## Footer API Tests
```bash
# GET /api/footer (should return default footer JSON)
curl -X GET http://localhost:10000/api/footer

# PUT /api/footer (should update footer)
curl -X PUT http://localhost:10000/api/footer \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "label": "Ready to Start Your Journey?",
      "title": "Let\'s Build Something Great Together",
      "subTitle": "Our expert team is here to provide the professional advisory and learning services you need to succeed in global markets.",
      "phones": ["+1234567890"],
      "email": "info@themillions.com",
      "website": "www.themillions.com",
      "address": ["London", "UK"],
      "whatsapp": "+1234567890",
      "buttonText": "WhatsApp Us"
    },
    "footer": {
      "logo": "/logo.svg",
      "copyright": "© 2026 The Millions. All rights reserved.",
      "location": "London / Global"
    },
    "showContactBlock": true
  }'

# GET /api/footer/:slug (should return global footer, slug ignored)
curl -X GET http://localhost:10000/api/footer/home

# PUT /api/footer/:slug (should update global footer, slug ignored)
curl -X PUT http://localhost:10000/api/footer/about \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "label": "Contact Us",
      "title": "Get in Touch",
      "subTitle": "We\'d love to hear from you",
      "phones": ["+1987654321"],
      "email": "contact@themillions.com",
      "website": "www.themillions.com",
      "address": ["New York", "USA"],
      "whatsapp": "+1987654321",
      "buttonText": "WhatsApp Us"
    },
    "footer": {
      "logo": "/logo.svg",
      "copyright": "© 2026 The Millions. All rights reserved.",
      "location": "New York / Global"
    },
    "showContactBlock": true
  }'
```

## Admin Pages API Tests
```bash
# POST /api/admin/pages (should create page)
curl -X POST http://localhost:10000/api/admin/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "home",
    "title": "Home Page",
    "sections": [
      {
        "type": "hero",
        "order": 1,
        "content": {
          "title": "Welcome to The Millions",
          "description": "Your journey to financial success starts here"
        }
      }
    ]
  }'

# GET /api/pages/home (should return sections + footer)
curl -X GET http://localhost:10000/api/pages/home

# PUT /api/admin/pages/:id (should update page sections without ID conflicts)
# First get the ID from the POST response, then use it here:
curl -X PUT http://localhost:10000/api/admin/pages/REPLACE_WITH_ACTUAL_ID \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "home",
    "title": "Updated Home Page",
    "sections": [
      {
        "type": "hero",
        "order": 1,
        "content": {
          "title": "Welcome to The Millions - Updated",
          "description": "Your journey to financial success starts here - Updated"
        }
      },
      {
        "type": "about",
        "order": 2,
        "content": {
          "title": "About Us",
          "description": "We are a leading financial advisory firm"
        }
      }
    ]
  }'
```