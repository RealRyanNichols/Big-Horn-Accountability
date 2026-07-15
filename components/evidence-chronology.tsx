"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  ExternalLink,
  FileWarning,
  Layers3,
} from "lucide-react";
import {
  investigationThreads,
  recordsForThread,
  type InvestigationThread,
} from "@/lib/investigation-threads";
import { records, type LedgerRecord } from "@/lib/records";

type ChronologyItem = {
  record: LedgerRecord;
  thread: InvestigationThread;
  collisionIndex: number;
  collisionCount: number;
};

const YEAR_START = 1979;
const YEAR_END = 2026;
const YEAR_TICKS = [1979, 1986, 1995, 2005, 2015, 2026];

const assignedRecordIds = new Set(investigationThreads.flatMap(({ recordIds }) => recordIds));
const neutralThread: InvestigationThread = {
  id: "other-reviewed-ledger-records",
  number: "07",
  eyebrow: "Other reviewed ledger records",
  title: "Records outside the six authored chapters",
  dateRange: "2016–2025",
  dek: "Reviewed records that have not been assigned to one of the six narrative chapters.",
  thesis: "These records remain visible without forcing them into a storyline they may not support.",
  limit: "Their presence in the same ledger does not imply a relationship to another event.",
  theme: "Government operations",
  recordIds: records.filter(({ id }) => !assignedRecordIds.has(id)).map(({ id }) => id),
  prompt: "Keep unassigned evidence visible without manufacturing a connection.",
};
const chronologyThreads = [...investigationThreads, neutralThread];

function percentForYear(year: number) {
  return ((year - YEAR_START) / (YEAR_END - YEAR_START)) * 100;
}

function statusClass(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function formatRecordDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function buildItems(): ChronologyItem[] {
  const base = chronologyThreads.flatMap((thread) =>
    recordsForThread(thread).map((record) => ({ record, thread })),
  );
  const collisionGroups = new Map<string, typeof base>();

  for (const item of base) {
    const key = `${item.thread.id}-${item.record.year}`;
    collisionGroups.set(key, [...(collisionGroups.get(key) ?? []), item]);
  }

  return base
    .map((item) => {
      const group = collisionGroups.get(`${item.thread.id}-${item.record.year}`) ?? [item];
      return {
        ...item,
        collisionIndex: group.findIndex(({ record }) => record.id === item.record.id),
        collisionCount: group.length,
      };
    })
    .sort((a, b) => a.record.date.localeCompare(b.record.date));
}

const chronologyItems = buildItems();

export function EvidenceChronology() {
  const [activeThread, setActiveThread] = useState("all");
  const [selectedId, setSelectedId] = useState(chronologyItems[0]?.record.id ?? "");
  const detailRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () =>
      activeThread === "all"
        ? chronologyItems
        : chronologyItems.filter(({ thread }) => thread.id === activeThread),
    [activeThread],
  );

  const selected =
    visibleItems.find(({ record }) => record.id === selectedId) ?? visibleItems[0];
  const selectedIndex = selected
    ? visibleItems.findIndex(({ record }) => record.id === selected.record.id)
    : -1;
  const reviewedCount = visibleItems.filter(
    ({ record }) => record.publicationState === "Reviewed",
  ).length;

  function selectThread(threadId: string) {
    const nextItems =
      threadId === "all"
        ? chronologyItems
        : chronologyItems.filter(({ thread }) => thread.id === threadId);
    setActiveThread(threadId);
    if (nextItems.length) setSelectedId(nextItems[0].record.id);
  }

  function moveSelection(direction: -1 | 1) {
    if (!visibleItems.length) return;
    const nextIndex =
      selectedIndex < 0
        ? 0
        : (selectedIndex + direction + visibleItems.length) % visibleItems.length;
    setSelectedId(visibleItems[nextIndex].record.id);
    detailRef.current?.focus({ preventScroll: true });
  }

  return (
    <section className="chronology-section" aria-labelledby="chronology-title">
      <div className="shell">
        <header className="chronology-heading">
          <div>
            <p className="eyebrow">
              <CalendarRange size={15} /> Evidence chronology
            </p>
            <h2 id="chronology-title">Forty-seven years of public record, in one view.</h2>
          </div>
          <p>
            Move across time, isolate a thread, and inspect the legal posture behind each event.
            Proximity on this line is context—not proof of coordination.
          </p>
        </header>

        <div className="chronology-console">
          <div className="chronology-toolbar">
            <div className="chronology-tabs" role="group" aria-label="Filter chronology by investigation thread">
              <button
                type="button"
                aria-pressed={activeThread === "all"}
                className={activeThread === "all" ? "active" : ""}
                onClick={() => selectThread("all")}
              >
                <Layers3 size={14} /> All threads <span>{chronologyItems.length}</span>
              </button>
              {chronologyThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  aria-pressed={activeThread === thread.id}
                  className={activeThread === thread.id ? "active" : ""}
                  onClick={() => selectThread(thread.id)}
                >
                  <i aria-hidden="true">{thread.number}</i> {thread.title}
                </button>
              ))}
            </div>

            <div className="chronology-stats" aria-live="polite">
              <span><strong>{visibleItems.length}</strong> records visible</span>
              <span><strong>{reviewedCount}</strong> source reviewed</span>
              <span><strong>{visibleItems.length - reviewedCount}</strong> need docket checks</span>
            </div>
          </div>

          <div className="chronology-stage" aria-label="Interactive evidence timeline">
            <div className="chronology-years" aria-hidden="true">
              <div />
              <div className="chronology-year-track">
                {YEAR_TICKS.map((year) => (
                  <span key={year} style={{ left: `${percentForYear(year)}%` }}>{year}</span>
                ))}
              </div>
            </div>

            <div className="chronology-plot">
              <div className="chronology-grid" aria-hidden="true">
                {YEAR_TICKS.map((year) => (
                  <div
                    className="chronology-gridline"
                    key={year}
                    style={{ left: `${percentForYear(year)}%` }}
                  />
                ))}
              </div>

              {chronologyThreads.map((thread) => {
                const isMuted = activeThread !== "all" && activeThread !== thread.id;
                return (
                  <div className={`chronology-lane${isMuted ? " muted" : ""}`} key={thread.id}>
                    <a
                      className="chronology-lane-label"
                      href={thread.id === neutralThread.id ? "/#ledger" : `/investigations#${thread.id}`}
                    >
                      <span>{thread.number}</span>
                      <strong>{thread.eyebrow}</strong>
                    </a>
                    <div className="chronology-track">
                      <div className="chronology-lane-line" aria-hidden="true" />
                      {chronologyItems
                        .filter(({ thread: itemThread }) => itemThread.id === thread.id)
                        .map((item) => {
                          const isSelected = selected?.record.id === item.record.id;
                          const collisionOffset =
                            (item.collisionIndex - (item.collisionCount - 1) / 2) * 19;
                          return (
                            <button
                              className={`chronology-node${isSelected ? " selected" : ""}${item.record.publicationState === "Current docket needed" ? " needs-review" : ""}`}
                              key={item.record.id}
                              type="button"
                              disabled={isMuted}
                              aria-pressed={isSelected}
                              aria-label={`${formatRecordDate(item.record.date)}: ${item.record.title}. ${item.record.status}. ${item.record.sources.length} source${item.record.sources.length === 1 ? "" : "s"}.`}
                              title={`${item.record.year} · ${item.record.status}`}
                              style={{
                                left: `${percentForYear(item.record.year)}%`,
                                transform: `translate(-50%, ${collisionOffset}px)`,
                              }}
                              onClick={() => setSelectedId(item.record.id)}
                            >
                              <span />
                              <em aria-hidden="true">{item.record.sources.length}</em>
                              <b>{item.record.year}</b>
                              <small>{item.record.title}</small>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selected ? (
            <div
              className="chronology-detail"
              ref={detailRef}
              tabIndex={-1}
              aria-live="polite"
            >
              <div className="chronology-detail-spine">
                <span>{selected.thread.number}</span>
                <div aria-hidden="true" />
                <strong>{selected.record.year}</strong>
              </div>

              <div className="chronology-detail-copy">
                <div className="chronology-detail-topline">
                  <span className={`status-badge ${statusClass(selected.record.status)}`}>
                    {selected.record.status}
                  </span>
                  <span className="chronology-record-position">
                    {String(selectedIndex + 1).padStart(2, "0")} / {String(visibleItems.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="chronology-date">{formatRecordDate(selected.record.date)} · {selected.record.institution}</p>
                <h3>{selected.record.title}</h3>
                <p>{selected.record.summary}</p>

                <div className="chronology-proof">
                  <div>
                    <CheckCircle2 size={16} />
                    <span><strong>Established</strong>{selected.record.whatItEstablishes}</span>
                  </div>
                  <div>
                    <FileWarning size={16} />
                    <span><strong>Not established</strong>{selected.record.whatItDoesNotEstablish}</span>
                  </div>
                </div>

                <div className="chronology-detail-actions">
                  <Link href={`/#${selected.record.id}`}>Open ledger record <ArrowRight size={14} /></Link>
                  <a href={selected.record.sources[0].url} target="_blank" rel="noreferrer">
                    Inspect source <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="chronology-stepper" aria-label="Move between visible records">
                <button type="button" onClick={() => moveSelection(-1)} aria-label="Previous record">
                  <ArrowLeft size={17} />
                </button>
                <button type="button" onClick={() => moveSelection(1)} aria-label="Next record">
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <p className="chronology-footnote">
          <span aria-hidden="true" /> A bright point is a reviewed record, not a measure of severity. Select any point to inspect its status and limits.
        </p>
      </div>
    </section>
  );
}
