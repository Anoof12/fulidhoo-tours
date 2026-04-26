# Fulidhoo Tours Website

V. Fulidhoo excursion booking website built with Next.js, Prisma, NextAuth, and Supabase Postgres.

## Tech Stack

- Next.js (App Router, TypeScript, Tailwind)
- Prisma ORM
- Supabase Postgres
- NextAuth credentials auth
- Zustand state management

## Supabase Database Setup

1. Create a project at [Supabase](https://supabase.com/).
2. In Supabase dashboard go to:
   - `Project Settings` -> `Database` -> `Connection string` -> `URI`
3. Copy both:
   - Transaction pooler URI (port 6543) for app runtime
   - Direct URI (port 5432) for Prisma migrations

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL=postgresql://...pooler...:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://...direct...:5432/postgres
NEXTAUTH_SECRET=your_long_random_secret
NEXTAUTH_URL=http://localhost:3000
```

Generate a strong auth secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Install and Run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Troubleshooting

- **P1000 authentication failed**: wrong Supabase DB password in URI.
- **Nonempty URL / DATABASE_URL errors**: `.env` has placeholders instead of real URIs.
- **Register/login fails**: ensure migrations ran successfully and `NEXTAUTH_SECRET` is set.
