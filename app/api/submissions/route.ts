import { NextResponse } from "next/server";

const maxNarrativeLength = 50_000;
const maxEvidenceLinks = 25;
const maxRequestBytes = 120_000;
const submissionAttempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = submissionAttempts.get(key);
  if (!current || current.resetAt <= now) {
    submissionAttempts.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

async function readJsonWithinLimit(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return {} as Record<string, unknown>;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxRequestBytes) {
      await reader.cancel();
      throw new Error("too_large");
    }
    chunks.push(value);
  }
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(combined)) as Record<string, unknown>;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function validDate(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? undefined : value;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (process.env.INTAKE_ENABLED !== "true") {
    return NextResponse.json(
      { message: "Secure intake is not enabled. Save or export your local draft instead." },
      { status: 503 },
    );
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return NextResponse.json({ message: "Private intake storage is not configured." }, { status: 503 });
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ message: "Content-Type must be application/json." }, { status: 415 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: "Cross-site submission rejected." }, { status: 403 });
  }
  const key = clientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { message: "Submission limit reached. Try again later." },
      { status: 429, headers: { "Retry-After": "3600", "Cache-Control": "no-store" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonWithinLimit(request);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "too_large";
    return NextResponse.json(
      { message: tooLarge ? "Submission is too large." : "The submission was not valid JSON." },
      { status: tooLarge ? 413 : 400 },
    );
  }

  if (body.website) return NextResponse.json({ message: "Submission rejected." }, { status: 400 });

  const narrative = typeof body.narrative === "string" ? body.narrative.trim() : "";
  const evidenceUrls = Array.isArray(body.evidenceUrls)
    ? body.evidenceUrls.filter((item): item is string => typeof item === "string").map((item) => item.trim())
    : [];
  const officialRoles = Array.isArray(body.officialRoles)
    ? body.officialRoles.filter((item): item is string => typeof item === "string").map((item) => item.trim())
    : [];
  const incidentDate = validDate(body.incidentDate);

  if (!narrative || narrative.length > maxNarrativeLength) {
    return NextResponse.json({ message: "Story text is required and must be under 50,000 characters." }, { status: 400 });
  }
  if (body.certified !== true || body.termsAccepted !== true) {
    return NextResponse.json({ message: "Both confirmations are required." }, { status: 400 });
  }
  if (evidenceUrls.length > maxEvidenceLinks || evidenceUrls.some((item) => !isHttpUrl(item))) {
    return NextResponse.json({ message: "Evidence links must be valid HTTP(S) URLs, with no more than 25 links." }, { status: 400 });
  }
  if (evidenceUrls.some((item) => item.length > 2_000)) {
    return NextResponse.json({ message: "Each evidence link must be under 2,000 characters." }, { status: 400 });
  }
  if (officialRoles.length > 20 || officialRoles.some((item) => !item || item.length > 120)) {
    return NextResponse.json({ message: "Use no more than 20 official roles, each under 120 characters." }, { status: 400 });
  }
  if (incidentDate === undefined) {
    return NextResponse.json({ message: "Incident date must be a valid calendar date." }, { status: 400 });
  }
  const contactEmail = typeof body.contactEmail === "string" ? body.contactEmail.trim() : "";
  if (contactEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || contactEmail.length > 320)) {
    return NextResponse.json({ message: "Contact email is not valid." }, { status: 400 });
  }

  const reference = `BHA-LEAD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("intake_submissions").insert({
    reference,
    narrative,
    incident_date: incidentDate,
    location: typeof body.location === "string" ? body.location.slice(0, 300) : null,
    institution: typeof body.institution === "string" ? body.institution.slice(0, 300) : null,
    official_roles: officialRoles,
    evidence_urls: evidenceUrls,
    contact_name: typeof body.contactName === "string" ? body.contactName.slice(0, 200) : null,
    contact_email: contactEmail || null,
    contact_permission: body.contactPermission === true,
    publish_name_interest: body.publishName === true,
    safety_concerns: typeof body.safetyConcerns === "string" ? body.safetyConcerns.slice(0, 5_000) : null,
    terms_version: "2026-07-14-v1",
    status: "new",
  });

  if (error) {
    console.error("intake_insert_failed", { code: error.code });
    return NextResponse.json({ message: "The private queue could not save this submission." }, { status: 500 });
  }

  return NextResponse.json({ message: "Saved privately.", reference }, { status: 201 });
}
