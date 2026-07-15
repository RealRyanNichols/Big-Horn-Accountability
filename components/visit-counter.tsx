"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type CounterSubject =
  | { kind: "site" }
  | { kind: "record"; slug: string };

type CounterResult = {
  available: boolean;
  count: number | null;
};

interface UniqueBrowserVisitCounterProps {
  subject: CounterSubject;
  label?: string;
  className?: string;
}

type CounterListener = (result: CounterResult) => void;

interface CounterChannel {
  subject: CounterSubject;
  result: CounterResult | null;
  subscribers: Set<CounterListener>;
  active: boolean;
  pollReady: boolean;
  timerId: number | null;
  visibilityHandler: (() => void) | null;
  refreshPromise: Promise<void> | null;
  generation: number;
  incrementComplete: boolean;
}

const pollIntervalMs = 15_000;
const counterRequests = new Map<string, Promise<CounterResult>>();
const counterReadRequests = new Map<string, Promise<CounterResult>>();
const counterChannels = new Map<string, CounterChannel>();
let counterRequestQueue: Promise<unknown> = Promise.resolve();
const countFormatter = new Intl.NumberFormat("en-US");

function subjectKey(subject: CounterSubject) {
  return subject.kind === "site" ? "site:all" : `record:${subject.slug}`;
}

function parseCounterResponse(response: Response, result: Partial<CounterResult>) {
  if (
    !response.ok ||
    result.available !== true ||
    typeof result.count !== "number" ||
    !Number.isSafeInteger(result.count) ||
    result.count < 0
  ) {
    return { available: false, count: null } satisfies CounterResult;
  }

  return { available: true, count: result.count } satisfies CounterResult;
}

function requestCounter(subject: CounterSubject) {
  const key = subjectKey(subject);
  const existing = counterRequests.get(key);
  if (existing) return existing;

  const rawRequest = counterRequestQueue.then(async (): Promise<CounterResult> => {
    try {
      const response = await fetch("/api/views", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject),
      });
      const result = (await response.json()) as Partial<CounterResult>;
      return parseCounterResponse(response, result);
    } catch {
      return { available: false, count: null };
    }
  });

  const request = rawRequest;
  void request.then((result) => {
    if (!result.available && counterRequests.get(key) === request) {
      counterRequests.delete(key);
    }
  });

  counterRequests.set(key, request);
  counterRequestQueue = request.then(
    () => undefined,
    () => undefined,
  );
  return request;
}

function readCounter(subject: CounterSubject) {
  const key = subjectKey(subject);
  const existing = counterReadRequests.get(key);
  if (existing) return existing;

  const parameters = new URLSearchParams({ kind: subject.kind });
  if (subject.kind === "record") parameters.set("slug", subject.slug);

  const request = (async (): Promise<CounterResult> => {
    try {
      const response = await fetch(`/api/views?${parameters.toString()}`, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });
      const result = (await response.json()) as Partial<CounterResult>;
      return parseCounterResponse(response, result);
    } catch {
      return { available: false, count: null };
    }
  })();

  counterReadRequests.set(key, request);
  void request.finally(() => {
    if (counterReadRequests.get(key) === request) counterReadRequests.delete(key);
  });
  return request;
}

function getCounterChannel(subject: CounterSubject) {
  const key = subjectKey(subject);
  const existing = counterChannels.get(key);
  if (existing) return existing;

  const channel: CounterChannel = {
    subject: subject.kind === "site" ? { kind: "site" } : { kind: "record", slug: subject.slug },
    result: null,
    subscribers: new Set(),
    active: false,
    pollReady: false,
    timerId: null,
    visibilityHandler: null,
    refreshPromise: null,
    generation: 0,
    incrementComplete: false,
  };
  counterChannels.set(key, channel);
  return channel;
}

function publishCounterResult(channel: CounterChannel, result: CounterResult) {
  if (!result.available && channel.result?.available) return;
  if (
    channel.result?.available === result.available &&
    channel.result?.count === result.count
  ) {
    return;
  }

  channel.result = result;
  channel.subscribers.forEach((subscriber) => subscriber(result));
}

function stopPollingTimer(channel: CounterChannel) {
  if (channel.timerId === null) return;
  window.clearInterval(channel.timerId);
  channel.timerId = null;
}

function refreshCounterChannel(channel: CounterChannel) {
  if (
    !channel.active ||
    !channel.pollReady ||
    document.visibilityState !== "visible" ||
    channel.refreshPromise
  ) {
    return;
  }

  const generation = channel.generation;
  const refresh = readCounter(channel.subject).then((result) => {
    if (channel.active && channel.generation === generation) {
      publishCounterResult(channel, result);
    }
  });

  channel.refreshPromise = refresh;
  void refresh.then(() => {
    if (channel.refreshPromise === refresh) channel.refreshPromise = null;
  });
}

function schedulePolling(channel: CounterChannel) {
  if (
    !channel.active ||
    !channel.pollReady ||
    document.visibilityState !== "visible" ||
    channel.timerId !== null
  ) {
    return;
  }

  channel.timerId = window.setInterval(() => {
    refreshCounterChannel(channel);
  }, pollIntervalMs);
}

function activateCounterChannel(channel: CounterChannel) {
  if (channel.active) return;

  channel.active = true;
  channel.pollReady = false;
  const generation = ++channel.generation;

  channel.visibilityHandler = () => {
    if (document.visibilityState === "hidden") {
      stopPollingTimer(channel);
      return;
    }
    refreshCounterChannel(channel);
    schedulePolling(channel);
  };
  document.addEventListener("visibilitychange", channel.visibilityHandler);

  const initialRequest = channel.incrementComplete
    ? readCounter(channel.subject)
    : requestCounter(channel.subject);

  void initialRequest.then((result) => {
    if (!channel.active || channel.generation !== generation) return;
    if (result.available) channel.incrementComplete = true;
    publishCounterResult(channel, result);
    channel.pollReady = true;
    schedulePolling(channel);
  });
}

function deactivateCounterChannel(channel: CounterChannel) {
  channel.active = false;
  channel.pollReady = false;
  channel.generation += 1;
  stopPollingTimer(channel);
  if (channel.visibilityHandler) {
    document.removeEventListener("visibilitychange", channel.visibilityHandler);
    channel.visibilityHandler = null;
  }
}

function subscribeToCounter(channel: CounterChannel, listener: CounterListener) {
  channel.subscribers.add(listener);
  if (channel.result) listener(channel.result);
  if (channel.subscribers.size === 1) activateCounterChannel(channel);

  return () => {
    channel.subscribers.delete(listener);
    if (channel.subscribers.size === 0) deactivateCounterChannel(channel);
  };
}

export function UniqueBrowserVisitCounter({
  subject,
  label = "unique browser visits",
  className = "",
}: UniqueBrowserVisitCounterProps) {
  const channel = getCounterChannel(subject);
  const [result, setResult] = useState<CounterResult | null>(channel.result);

  useEffect(() => {
    return subscribeToCounter(channel, setResult);
  }, [channel]);

  const classes = ["visit-counter", className].filter(Boolean).join(" ");

  if (!result) {
    return (
      <span className={`${classes} loading`} role="status" aria-live="polite">
        <Eye size={15} aria-hidden="true" /> Counting {label}…
      </span>
    );
  }

  if (!result.available || result.count === null) {
    return (
      <span className={`${classes} unavailable`} role="status" aria-live="polite">
        <Eye size={15} aria-hidden="true" /> View count unavailable
      </span>
    );
  }

  return (
    <span className={classes} role="status" aria-live="polite" aria-atomic="true">
      <Eye size={15} aria-hidden="true" />
      <strong>{countFormatter.format(result.count)}</strong>
      <span className="visit-counter-label">{label}</span>
      <span
        className="visit-counter-live"
        aria-label="Live aggregate, refreshed about every 15 seconds"
        title="Live aggregate · refreshes about every 15 seconds"
      >
        <span className="visit-counter-live-dot" aria-hidden="true" />
        Live
      </span>
    </span>
  );
}

export function SiteVisitCounter({ className }: { className?: string }) {
  return (
    <UniqueBrowserVisitCounter
      subject={{ kind: "site" }}
      label="unique browser visits"
      className={className}
    />
  );
}

export function RecordVisitCounter({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <UniqueBrowserVisitCounter
      subject={{ kind: "record", slug }}
      label="unique browser story views"
      className={className}
    />
  );
}
