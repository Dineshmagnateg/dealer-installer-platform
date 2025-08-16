-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	role text check (role in ('dealer','installer','admin')),
	name text,
	phone text,
	kyc_json jsonb default '{}'::jsonb,
	created_at timestamptz default now()
);

-- Dealers
create table if not exists public.dealers (
	user_id uuid primary key references public.profiles(id) on delete cascade,
	referrer_id uuid references public.dealers(user_id),
	joined_at timestamptz default now()
);

-- Installers
create table if not exists public.installers (
	user_id uuid primary key references public.profiles(id) on delete cascade,
	service_area text
);

-- Products
create table if not exists public.products (
	id uuid primary key default uuid_generate_v4(),
	sku text unique not null,
	name text not null,
	specs_json jsonb default '{}'::jsonb,
	media_urls text[] default '{}',
	base_price numeric not null,
	is_active boolean default true
);

-- Quotes
create table if not exists public.quotes (
	id uuid primary key default uuid_generate_v4(),
	dealer_id uuid references public.dealers(user_id) on delete set null,
	customer_name text not null,
	phone text not null,
	address text not null,
	measurements_json jsonb not null,
	attachments text[] default '{}',
	status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','PRICED','SENT','PAID','REJECTED')),
	price numeric,
	created_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
	id uuid primary key default uuid_generate_v4(),
	quote_id uuid references public.quotes(id) on delete set null,
	amount numeric not null,
	payment_gateway text not null default 'razorpay',
	payment_ref text,
	paid_at timestamptz,
	status text not null default 'PENDING' check (status in ('PENDING','PAID','FAILED'))
);

-- Projects
create table if not exists public.projects (
	id uuid primary key default uuid_generate_v4(),
	order_id uuid references public.orders(id) on delete set null,
	site_address text not null,
	status text not null default 'OPEN' check (status in ('OPEN','ASSIGNED','DONE')),
	assigned_installer uuid references public.installers(user_id),
	pickup_note text,
	created_at timestamptz default now(),
	done_at timestamptz
);

-- Commission plan
create table if not exists public.commission_plan (
	id uuid primary key default uuid_generate_v4(),
	level int not null,
	pct numeric not null,
	is_active boolean default true
);

-- Commissions
create table if not exists public.commissions (
	id uuid primary key default uuid_generate_v4(),
	order_id uuid references public.orders(id) on delete cascade,
	beneficiary uuid references public.dealers(user_id) on delete set null,
	level int not null,
	pct numeric not null,
	amount numeric not null,
	status text not null default 'UNPAID' check (status in ('UNPAID','PAID')),
	created_at timestamptz default now()
);

-- Security policies
alter table public.profiles enable row level security;
alter table public.dealers enable row level security;
alter table public.installers enable row level security;
alter table public.products enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.projects enable row level security;
alter table public.commissions enable row level security;

-- Basic RLS examples (tighten in production)
create policy "public read products" on public.products for select using (true);
create policy "owner profile" on public.profiles for select using (auth.uid() = id);
create policy "dealer own quotes" on public.quotes for all using (dealer_id = auth.uid());

-- Seed commission plan
insert into public.commission_plan (level, pct, is_active)
values (0, 0.12, true), (1, 0.03, true), (2, 0.02, true)
on conflict do nothing;