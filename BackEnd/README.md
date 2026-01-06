# The Millions – Backend API

This folder contains the backend service for **The Millions Chartered Certified Accountants** website.

The backend exposes REST APIs that provide dynamic page content (pages and sections) consumed by the frontend application.


---

## 🧱 Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma ORM (v6)
- PostgreSQL


---

## 📁 Backend Structure

```txt
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── index.ts
│
│   ├── config/
│   │   ├── env.ts
│   │   └── db.ts
│
│   ├── modules/
│   │   ├── pages/
│   │   │   ├── pages.routes.ts
│   │   │   ├── pages.controller.ts
│   │   │   ├── pages.service.ts
│   │   │   └── pages.types.ts
│   │   │
│   │   ├── health/
│   │   │   └── health.routes.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.routes.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── notFound.middleware.ts
│
│   └── utils/
│       └── apiResponse.ts
│
├── package.json
├── tsconfig.json
└── .env

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
PORT=4000
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
