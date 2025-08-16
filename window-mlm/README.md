# Window Sales & MLM Platform

Full-stack Next.js + Supabase app for dealer–installer window sales with MLM commissions.

## Tech
- Next.js App Router + Tailwind
- Supabase (Postgres, Auth, Storage)
- Razorpay (payments)
- Resend (emails)

## Local Setup
1. Copy env and fill values:
```
cp .env.example .env.local
```
Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `SUPABASE_SERVICE_ROLE_KEY`.
Set Razorpay keys and webhook secret.
Set Resend keys or leave empty to skip emails.

2. Create DB schema in Supabase SQL editor:
- Paste `supabase_schema.sql` contents and run.

3. Run dev server:
```
npm i
npm run dev
```

## Deploy
- Push to GitHub
- Vercel: import repo, set env vars (same as `.env.local`).
- Supabase: create project, set URL/Anon key in Vercel.
- Razorpay: set webhook to `https://YOUR_DOMAIN/api/razorpay/webhook` with the same webhook secret.

## Roles & Flows
- Dealers/Installers create an account, admin assigns role by setting `profiles.role` and creating a row in `dealers` or `installers` (with optional `referrer_id`).
- Dealer creates Quote → Admin sets price → Customer pays via Razorpay (checkout link out of scope; webhook handles post-payment).
- On payment webhook: creates `orders`, inserts MLM `commissions`, creates `projects` (OPEN).
- Installer claims a project via `POST /api/projects/claim`.

## Endpoints
- POST `/api/razorpay/webhook`: handle Razorpay webhooks (expects `notes.quote_id`).
- POST `/api/projects/claim`: installers claim open projects.

## Notes
- This is a minimal reference. Harden RLS policies for production.
- Add email templates under `src/lib/email.ts` usage as needed.
