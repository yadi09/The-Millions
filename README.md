# The Millions – Web Application

This repository contains the frontend and backend for **The Millions Chartered Certified Accountants** website.

The backend provides dynamic content (pages, sections) via REST APIs that the frontend consumes.

---

## 🧱 Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma ORM (v6)
- PostgreSQL

### Frontend
- Frontend consumes backend APIs and handles UI, icons, and images.

---

## 📁 Project Structure

```txt
root/
├── frontend/
├── backend/
|    ├── prisma/
|    │   ├── schema.prisma
|    │   └── seed.ts
|    │
|    ├── src/
|    │   ├── app.ts
|    │   ├── server.ts
|    │
|    │   ├── config/
|    │   │   ├── env.ts
|    │   │   └── db.ts
|    │
|    │   ├── modules/
|    │   │   ├── pages/
|    │   │   │   ├── pages.routes.ts
|    │   │   │   ├── pages.controller.ts
|    │   │   │   ├── pages.service.ts
|    │   │   │   └── pages.types.ts
|    │   │   │
|    │   │   ├── admin/              👈 FUTURE (not now)
|    │   │   │   ├── admin.routes.ts
|    │   │   │   ├── admin.controller.ts
|    │   │   │   └── admin.service.ts
|    │   │   │
|    │   │   └── health/
|    │   │       └── health.routes.ts
|    │
|    │   ├── middlewares/
|    │   │   ├── error.middleware.ts
|    │   │   └── notFound.middleware.ts
|    │
|    │   ├── utils/
|    │   │   └── apiResponse.ts
|    │
|    │   └── index.ts
|    │
|    ├── package.json
|    ├── tsconfig.json
|    └── .env
└── README.md
```

---

## 🚀 Backend Setup Guide

### 1️⃣ Install dependencies
```bash
cd backend
npm install
```

### 2️⃣ Environment variables
Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=5000
```

> ⚠️ `.env` is ignored by git.

---

### 3️⃣ Prisma setup
```bash
npx prisma generate
npx prisma migrate dev
```

(Optional)
```bash
npx prisma db seed
```

---

### 4️⃣ Run the backend
```bash
npm run dev
```

Server runs at:
```
http://localhost:4000
```

---

## 🩺 Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok"
}
```

Useful for monitoring and deployment platforms like Render.

---

## 📄 Pages API (Frontend Usage)

```http
GET /api/pages/:slug
```

Example:
```http
GET /api/pages/home
```

Returns:
- Page metadata
- Ordered sections
- JSON content used to render the UI dynamically

---

## 🎨 Icons & Images Handling

- Backend sends identifiers only (e.g. `icon`, `id`)
- Frontend maps these IDs to actual icons/images

Example:
```json
{
  "icon": "vat",
  "id": "year_end_accounts"
}
```

This keeps backend clean and flexible.

---

## 🔮 Future Improvements
- Admin panel (CRUD for pages & sections)
- Authentication & roles
- Deployment documentation
