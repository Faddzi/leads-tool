-- Leads & Stats tool: database setup for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query, then press Run.
-- Safe to run more than once.
-- ---------------------------------------------------------------- team
create table if not exists public.team_members (
  email text primary key,
  name text,
  role text not null default 'member' check (role in ('admin', 'member')),
  added_at timestamptz not null default now()
);

create or replace function public.is_team_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.team_members
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

create or replace function public.is_team_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.team_members
    where lower(email) = lower(auth.jwt() ->> 'email') and role = 'admin'
  );
$$;

-- The first person to sign in becomes the admin. Everyone after that must be
-- added to the team list by an admin before they can see any data.
create or replace function public.claim_first_admin()
returns boolean
language plpgsql security definer
set search_path = public
as $$
declare
  me text := lower(auth.jwt() ->> 'email');
begin
  if me is null or me = '' then
    return false;
  end if;
  if not exists (select 1 from public.team_members) then
    insert into public.team_members (email, role) values (me, 'admin');
    return true;
  end if;
  return exists (select 1 from public.team_members where lower(email) = me);
end;
$$;

-- ---------------------------------------------------------------- leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null default 'New',
  generated_on date,
  name text not null default '',
  email text,
  alt_email text,
  phone text,
  quality text,
  status text,
  status_date date,
  outcome text,
  outcome_date date,
  source text,
  campaign text,
  ad_group text,
  keyword text,
  company_type text,
  company_name text,
  domain text,
  designation text,
  company_size text,
  linkedin_accepted text,
  no_signup_reason text,
  notes text,
  follow_up_count integer not null default 0,
  last_follow_up date,
  next_follow_up date,
  previous_lead_id uuid references public.leads (id) on delete set null,
  sheet_key text unique,
  sheet_hash text,
  edited_in_tool boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_generated_on_idx on public.leads (generated_on);

create index if not exists leads_email_idx on public.leads (lower(email));

create index if not exists leads_next_follow_up_idx on public.leads (next_follow_up);

-- Lead activity, calls, free trials, and paid plans.
-- One row per thing that happened: a follow-up, a note, a status change.
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  kind text not null default 'note',
  happened_on date not null default current_date,
  body text,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists activities_lead_idx on public.activities (lead_id);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  booked_on date,
  scheduled_for date,
  status text not null default 'Scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists calls_lead_idx on public.calls (lead_id);

create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  started_on date,
  outcome text not null default 'Active',
  ended_on date,
  created_at timestamptz not null default now()
);

create index if not exists trials_lead_idx on public.trials (lead_id);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  plan_name text,
  plan_value numeric,
  started_on date,
  churned_on date,
  churn_reason text,
  created_at timestamptz not null default now()
);

create index if not exists plans_lead_idx on public.plans (lead_id);

-- ---------------------------------------------------------------- security
-- Nobody can read or write anything unless they are signed in AND on the team list.
alter table public.team_members enable row level security;

alter table public.leads enable row level security;

alter table public.activities enable row level security;

alter table public.calls enable row level security;

alter table public.trials enable row level security;

alter table public.plans enable row level security;

drop policy if exists team_read on public.team_members;

create policy team_read on public.team_members
  for select to authenticated
  using (public.is_team_member());

drop policy if exists team_admin_write on public.team_members;

create policy team_admin_write on public.team_members
  for all to authenticated
  using (public.is_team_admin())
  with check (public.is_team_admin());

do $$
declare t text;
begin
  foreach t in array array['leads', 'activities', 'calls', 'trials', 'plans'] loop
    execute format('drop policy if exists team_all on public.%I', t);
    execute format(
      'create policy team_all on public.%I for all to authenticated
         using (public.is_team_member()) with check (public.is_team_member())', t);
  end loop;
end $$;

grant usage on schema public to authenticated;

grant select, insert, update, delete
  on public.team_members, public.leads, public.activities,
     public.calls, public.trials, public.plans
  to authenticated;

revoke all
  on public.team_members, public.leads, public.activities,
     public.calls, public.trials, public.plans
  from anon;

revoke execute on function public.claim_first_admin() from public, anon;

grant execute on function public.claim_first_admin() to authenticated;

grant execute on function public.is_team_member() to authenticated;

grant execute on function public.is_team_admin() to authenticated;
