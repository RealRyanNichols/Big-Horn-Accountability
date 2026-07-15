# Big Horn Accountability Ledger

A standalone, source-backed public-record dashboard for Hardin, Big Horn County,
nearby communities, and relevant tribal-government institutions. It is not linked
to any individual criminal defense matter.

## Editorial posture

- Records are labeled by procedural posture: allegation, filed case, dismissal,
  settlement, administrative action, finding, conviction, or unresolved.
- A complaint or lawsuit is not proof.
- Raw community submissions are private by default and never become public
  automatically.
- Personal addresses, birth dates, medical details, minors, access credentials,
  and unverified accusations are excluded from the public ledger.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Intake backend

The public dashboard runs without Supabase. Actual submissions require a private
Supabase project, the included migration, server-only environment variables, and
`INTAKE_ENABLED=true`. Until then, the form supports local drafts and export but
truthfully reports that secure intake is not yet accepting submissions.

## Privacy-safe visit counters

Site and record-detail counters remain unavailable unless all three server-only
values are configured:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
VIEW_COUNTER_HASH_SECRET=... # at least 32 random characters
```

Apply `supabase/migrations/20260714010000_privacy_safe_view_counters.sql` to the
chosen Supabase project before enabling the counters. The route uses an HttpOnly,
first-party random cookie and stores only a subject-scoped HMAC digest. The
database receives no raw cookie identifier, IP address, or user-agent string.
Counts represent unique browser visits for the lifetime of that cookie, not
verified people; clearing cookies or changing browsers can increment them again.
The shared header counter records a site visit on every route. Visible counters
then read the aggregate about every 15 seconds while the tab is active; polling
pauses when the document is hidden.
Keep `VIEW_COUNTER_HASH_SECRET` stable across deployments: rotating it intentionally
starts a new deduplication identity and may count returning browsers again.

The service-role key and hash secret must never use a `NEXT_PUBLIC_` prefix.

## Publication checklist

1. Retrieve and cite the current primary record.
2. Confirm names, agency, dates, docket number, and disposition.
3. Give named subjects a fair-response path where appropriate.
4. Remove protected and unnecessary personal information.
5. Record moderator, review date, corrections, and source archive/hash.
6. Remove `noindex` only after counsel/editorial review.
