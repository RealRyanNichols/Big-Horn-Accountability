create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists private.unique_browser_visits (
  subject_key text not null
    check (
      char_length(subject_key) between 1 and 127
      and subject_key ~ '^(site:all|record:[a-z0-9][a-z0-9-]{0,119})$'
    ),
  visitor_hash text not null
    check (visitor_hash ~ '^[0-9a-f]{64}$'),
  first_seen_at timestamptz not null default now(),
  primary key (subject_key, visitor_hash)
);

create table if not exists private.unique_browser_visit_totals (
  subject_key text primary key
    check (
      char_length(subject_key) between 1 and 127
      and subject_key ~ '^(site:all|record:[a-z0-9][a-z0-9-]{0,119})$'
    ),
  unique_browser_visits bigint not null default 0
    check (unique_browser_visits >= 0),
  updated_at timestamptz not null default now()
);

alter table private.unique_browser_visits enable row level security;
alter table private.unique_browser_visit_totals enable row level security;

revoke all on table private.unique_browser_visits from public, anon, authenticated, service_role;
revoke all on table private.unique_browser_visit_totals from public, anon, authenticated, service_role;

create or replace function public.record_unique_browser_visit(
  p_subject_key text,
  p_visitor_hash text
)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inserted_rows integer := 0;
  resulting_total bigint := 0;
begin
  if p_subject_key is null
     or char_length(p_subject_key) not between 1 and 127
     or p_subject_key !~ '^(site:all|record:[a-z0-9][a-z0-9-]{0,119})$' then
    raise exception 'invalid counter subject' using errcode = '22023';
  end if;

  if p_visitor_hash is null or p_visitor_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid visitor hash' using errcode = '22023';
  end if;

  insert into private.unique_browser_visits (subject_key, visitor_hash)
  values (p_subject_key, p_visitor_hash)
  on conflict (subject_key, visitor_hash) do nothing;

  get diagnostics inserted_rows = row_count;

  if inserted_rows = 1 then
    insert into private.unique_browser_visit_totals (
      subject_key,
      unique_browser_visits,
      updated_at
    )
    values (p_subject_key, 1, now())
    on conflict (subject_key) do update
      set unique_browser_visits = private.unique_browser_visit_totals.unique_browser_visits + 1,
          updated_at = now()
    returning unique_browser_visits into resulting_total;
  else
    select totals.unique_browser_visits
      into resulting_total
      from private.unique_browser_visit_totals as totals
     where totals.subject_key = p_subject_key;

    if resulting_total is null then
      insert into private.unique_browser_visit_totals (
        subject_key,
        unique_browser_visits,
        updated_at
      )
      select p_subject_key, count(*)::bigint, now()
        from private.unique_browser_visits as visits
       where visits.subject_key = p_subject_key
      on conflict (subject_key) do update
        set unique_browser_visits = excluded.unique_browser_visits,
            updated_at = excluded.updated_at
      returning unique_browser_visits into resulting_total;
    end if;
  end if;

  return coalesce(resulting_total, 0);
end;
$$;

revoke all on function public.record_unique_browser_visit(text, text) from public, anon, authenticated;
grant execute on function public.record_unique_browser_visit(text, text) to service_role;

create or replace function public.read_unique_browser_visit_total(
  p_subject_key text
)
returns bigint
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  resulting_total bigint := 0;
begin
  if p_subject_key is null
     or char_length(p_subject_key) not between 1 and 127
     or p_subject_key !~ '^(site:all|record:[a-z0-9][a-z0-9-]{0,119})$' then
    raise exception 'invalid counter subject' using errcode = '22023';
  end if;

  select totals.unique_browser_visits
    into resulting_total
    from private.unique_browser_visit_totals as totals
   where totals.subject_key = p_subject_key;

  return coalesce(resulting_total, 0);
end;
$$;

revoke all on function public.read_unique_browser_visit_total(text) from public, anon, authenticated;
grant execute on function public.read_unique_browser_visit_total(text) to service_role;

comment on table private.unique_browser_visits is
  'Subject-scoped HMAC digests used only to deduplicate aggregate browser visits. No IP addresses, user agents, or raw cookie identifiers.';

comment on table private.unique_browser_visit_totals is
  'Aggregate unique-browser visit totals. Not directly exposed through the Data API.';

comment on function public.record_unique_browser_visit(text, text) is
  'Atomically deduplicates and increments a subject counter. Server-side service role only.';

comment on function public.read_unique_browser_visit_total(text) is
  'Reads one aggregate unique-browser total without exposing private deduplication rows. Server-side service role only.';
