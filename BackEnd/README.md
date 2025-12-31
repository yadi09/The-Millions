# BackEnd — Local setup

This folder contains a minimal Node.js backend that uses Prisma for database access.

Prerequisites

- Node.js (v16+ recommended)
- npm (or pnpm/yarn)

Quick start

1. Install dependencies:

```bash
npm install
```

2. Provide environment variables:

- Create a `.env` file at the project root (`BackEnd/.env`) containing your `DATABASE_URL` and any other secrets. Do NOT commit secrets to git.

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Apply migrations (development):

```bash
npx prisma migrate dev
```

Or, in production / CI, deploy migrations:

```bash
npx prisma migrate deploy
```

5. Start the server:

If a start script is configured in `package.json`:

```bash
npm start
```

Otherwise run the entry file directly:

```bash
node index.js
```

Notes and recommendations

- The repository currently includes a generated Prisma client under `generated/prisma`. These are platform-specific binaries and can bloat the repo. Consider removing `generated/prisma` from source control and adding a `postinstall` script that runs `npx prisma generate`.
- Verify `.gitignore` excludes `.env` and `generated/prisma` to avoid committing secrets and large binaries.
- If you see runtime errors about the query engine binary, run `npx prisma generate` on the target machine to download the correct engine for that platform.

Troubleshooting

- If `npx prisma generate` fails, confirm your Node.js version and network access. Remove any committed engine binaries if they conflict with your OS.
