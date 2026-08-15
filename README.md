# RGIPT Placement Tracker

A Next.js/Vercel-ready placement dashboard inspired by the supplied reference screenshots. It includes:

- Dashboard KPI cards
- Searchable/filterable placement database
- Branch + CGPA eligibility finder
- Placement insights/charts
- Latest updates
- CSV import/export admin workspace
- Supabase schema for persistent multi-user data

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Framework: Next.js (auto-detected).
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if using Supabase.
5. Deploy.

## Production data setup

Run `supabase/schema.sql` in Supabase SQL Editor. Then add the two environment variables from `.env.example` to Vercel.

The current UI uses `lib/data.ts` demo data so it works immediately without a database. The next integration step is replacing the demo data provider with Supabase queries and adding Supabase Auth/RLS for the admin panel.

## Data model

Each placement opportunity is an `offers` row. A company can therefore have multiple roles / offer types / eligibility conditions without duplicating unrelated company metadata.

## Important

All numbers in the included dataset are illustrative demo records, not official RGIPT placement statistics. Replace them with verified placement-office data before public launch.
