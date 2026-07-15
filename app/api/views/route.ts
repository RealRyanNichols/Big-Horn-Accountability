import { createHmac, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { records } from "@/lib/records";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const visitorCookieName = "bha_browser_visit";
const visitorCookiePattern = /^[A-Za-z0-9_-]{43}$/;
const recordSlugs = new Set(records.map((record) => record.slug));
const maxRequestBytes = 512;

type CounterRequest =
  | { kind: "site" }
  | { kind: "record"; slug: string };

class RequestTooLargeError extends Error {}

function json(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function resolveSubject(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const candidate = body as Partial<CounterRequest>;

  if (candidate.kind === "site") return "site:all";
  if (
    candidate.kind === "record" &&
    typeof candidate.slug === "string" &&
    recordSlugs.has(candidate.slug)
  ) {
    return `record:${candidate.slug}`;
  }

  return null;
}

function resolveQuerySubject(request: NextRequest) {
  const parameters = request.nextUrl.searchParams;
  if ([...parameters.keys()].some((key) => key !== "kind" && key !== "slug")) {
    return null;
  }

  const kinds = parameters.getAll("kind");
  const slugs = parameters.getAll("slug");
  if (kinds.length !== 1) return null;

  if (kinds[0] === "site" && slugs.length === 0) {
    return resolveSubject({ kind: "site" });
  }
  if (kinds[0] === "record" && slugs.length === 1) {
    return resolveSubject({ kind: "record", slug: slugs[0] });
  }
  return null;
}

function supabaseConfiguration() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return { url, serviceRoleKey };
}

function counterConfiguration() {
  const supabase = supabaseConfiguration();
  const hashSecret = process.env.VIEW_COUNTER_HASH_SECRET;

  if (!supabase || !hashSecret || hashSecret.length < 32) return null;

  return { ...supabase, hashSecret };
}

function subjectScopedHash(subject: string, visitorId: string, secret: string) {
  return createHmac("sha256", secret)
    .update("big-horn-accountability-counter-v1\0")
    .update(subject)
    .update("\0")
    .update(visitorId)
    .digest("hex");
}

async function readJsonWithinLimit(request: NextRequest) {
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxRequestBytes) {
        throw new RequestTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const payload = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    payload.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(payload)) as unknown;
}

async function createCounterClient(configuration: { url: string; serviceRoleKey: string }) {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(configuration.url, configuration.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function parseCount(data: unknown) {
  const count = typeof data === "number" ? data : Number(data);
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

export async function GET(request: NextRequest) {
  const subject = resolveQuerySubject(request);
  if (!subject) {
    return json({ available: false, message: "Unknown counter subject." }, 400);
  }

  const configuration = counterConfiguration();
  if (!configuration) {
    return json({ available: false, count: null });
  }

  const supabase = await createCounterClient(configuration);
  const { data, error } = await supabase.rpc("read_unique_browser_visit_total", {
    p_subject_key: subject,
  });

  if (error) {
    console.error("view_counter_read_rpc_failed", { code: error.code });
    return json({ available: false, count: null });
  }

  const count = parseCount(data);
  if (count === null) {
    console.error("view_counter_invalid_read_result");
    return json({ available: false, count: null });
  }

  return json({ available: true, count });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return json({ available: false, message: "Cross-site counter request rejected." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ available: false, message: "Content-Type must be application/json." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (!Number.isFinite(contentLength) || contentLength > maxRequestBytes) {
    return json({ available: false, message: "Counter request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = await readJsonWithinLimit(request);
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return json({ available: false, message: "Counter request is too large." }, 413);
    }
    return json({ available: false, message: "Counter request was not valid JSON." }, 400);
  }

  const subject = resolveSubject(body);
  if (!subject) {
    return json({ available: false, message: "Unknown counter subject." }, 400);
  }

  const configuration = counterConfiguration();
  if (!configuration) {
    return json({ available: false, count: null });
  }

  const existingVisitorId = request.cookies.get(visitorCookieName)?.value;
  const hasValidCookie = Boolean(
    existingVisitorId && visitorCookiePattern.test(existingVisitorId),
  );
  const visitorId = hasValidCookie
    ? existingVisitorId!
    : randomBytes(32).toString("base64url");
  const visitorHash = subjectScopedHash(subject, visitorId, configuration.hashSecret);

  const supabase = await createCounterClient(configuration);

  const { data, error } = await supabase.rpc("record_unique_browser_visit", {
    p_subject_key: subject,
    p_visitor_hash: visitorHash,
  });

  if (error) {
    console.error("view_counter_rpc_failed", { code: error.code });
    return json({ available: false, count: null });
  }

  const count = parseCount(data);
  if (count === null) {
    console.error("view_counter_invalid_result");
    return json({ available: false, count: null });
  }

  const response = json({ available: true, count });
  if (!hasValidCookie) {
    response.cookies.set(visitorCookieName, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
