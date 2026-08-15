create table if not exists public.branches (code text primary key, name text not null);
create table if not exists public.offers (
 id uuid primary key default gen_random_uuid(), session text not null, notification_date date not null,
 company text not null, sector text, offer_type text not null, branches text[] not null default '{}',
 min_cgpa numeric, role text not null, ctc bigint, stipend bigint, location text, students_selected integer not null default 0, notes text,
 created_at timestamptz not null default now()
);
alter table public.offers enable row level security;
alter table public.branches enable row level security;
create policy "public read offers" on public.offers for select using (true);
create policy "public read branches" on public.branches for select using (true);
-- For admin writes, create an authenticated role policy after configuring Supabase Auth.
-- Example: create policy "admin write offers" on public.offers for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
