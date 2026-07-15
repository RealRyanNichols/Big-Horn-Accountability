create extension if not exists pgcrypto;

create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  narrative text not null check (char_length(narrative) between 1 and 50000),
  incident_date date,
  location text,
  institution text,
  official_roles text[] not null default '{}',
  evidence_urls text[] not null default '{}',
  contact_name text,
  contact_email text,
  contact_permission boolean not null default false,
  publish_name_interest boolean not null default false,
  safety_concerns text,
  terms_version text not null,
  status text not null default 'new' check (status in ('new', 'triage', 'verification', 'hold', 'closed', 'publication_candidate')),
  assigned_to uuid references auth.users(id) on delete set null,
  retention_review_at timestamptz not null default (now() + interval '180 days'),
  deletion_requested_at timestamptz,
  legal_hold boolean not null default false,
  deleted_at timestamptz
);

create table if not exists public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.intake_submissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  note text,
  previous_status text,
  new_status text
);

create table if not exists public.published_stories (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid unique references public.intake_submissions(id) on delete set null,
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  source_notes text not null,
  response_notes text,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'legal_review', 'published', 'corrected', 'withdrawn')),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.intake_submissions enable row level security;
alter table public.moderation_events enable row level security;
alter table public.published_stories enable row level security;

revoke all on public.intake_submissions from anon, authenticated;
revoke all on public.moderation_events from anon, authenticated;
revoke all on public.published_stories from anon, authenticated;

grant select on public.published_stories to anon, authenticated;

create policy "published stories are public only after review"
on public.published_stories
for select
to anon, authenticated
using (publication_status in ('published', 'corrected'));

comment on table public.intake_submissions is
  'Private community leads. No anon/authenticated access. Server-side service role inserts only.';
comment on table public.published_stories is
  'Separately edited and reviewed public derivatives. Never expose raw submissions through this table.';
