"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  CheckCircle2,
  FileSearch,
  List,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LedgerRecord } from "@/lib/records";
import { RecordCard } from "@/components/record-card";

interface RecordExplorerProps {
  records: LedgerRecord[];
}

const all = "All";
const managedParams = ["q", "status", "theme", "institution", "year", "record", "order"];
type Order = "ledger" | "chronology";

function safeParam(value: string | null, options: readonly string[]) {
  return value && options.includes(value) ? value : all;
}

export function RecordExplorer({ records }: RecordExplorerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(all);
  const [theme, setTheme] = useState(all);
  const [institution, setInstitution] = useState(all);
  const [year, setYear] = useState(all);
  const [order, setOrder] = useState<Order>("ledger");
  const [selectedSlug, setSelectedSlug] = useState(records[0]?.slug ?? "");
  const [urlReady, setUrlReady] = useState(false);

  const options = useMemo(
    () => ({
      statuses: Array.from(new Set(records.map((record) => record.status))).sort(),
      themes: Array.from(new Set(records.map((record) => record.theme))).sort(),
      institutions: Array.from(new Set(records.map((record) => record.institution))).sort(),
      years: Array.from(new Set(records.map((record) => record.year))).sort((a, b) => b - a),
      slugs: records.map((record) => record.slug),
    }),
    [records],
  );

  useEffect(() => {
    function readUrlState() {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setStatus(safeParam(params.get("status"), options.statuses));
      setTheme(safeParam(params.get("theme"), options.themes));
      setInstitution(safeParam(params.get("institution"), options.institutions));
      setYear(safeParam(params.get("year"), options.years.map(String)));
      setOrder(params.get("order") === "chronology" ? "chronology" : "ledger");
      const recordParam = params.get("record");
      setSelectedSlug(recordParam && options.slugs.includes(recordParam) ? recordParam : records[0]?.slug ?? "");
      setUrlReady(true);
    }

    readUrlState();
    window.addEventListener("popstate", readUrlState);
    return () => window.removeEventListener("popstate", readUrlState);
  }, [options, records]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matching = records.filter((record) => {
      const searchable = [
        record.title,
        record.summary,
        record.institution,
        record.place,
        record.officialType,
        record.theme,
        ...record.people,
        ...record.tags,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalized || searchable.includes(normalized)) &&
        (status === all || record.status === status) &&
        (theme === all || record.theme === theme) &&
        (institution === all || record.institution === institution) &&
        (year === all || record.year === Number(year))
      );
    });

    return order === "chronology"
      ? [...matching].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
      : matching;
  }, [institution, order, query, records, status, theme, year]);

  const selectedIndex = Math.max(0, filtered.findIndex((record) => record.slug === selectedSlug));
  const selectedRecord = filtered[selectedIndex];

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    managedParams.forEach((param) => url.searchParams.delete(param));
    if (query.trim()) url.searchParams.set("q", query.trim());
    if (status !== all) url.searchParams.set("status", status);
    if (theme !== all) url.searchParams.set("theme", theme);
    if (institution !== all) url.searchParams.set("institution", institution);
    if (year !== all) url.searchParams.set("year", year);
    if (selectedRecord?.slug) url.searchParams.set("record", selectedRecord.slug);
    if (order === "chronology") url.searchParams.set("order", order);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [institution, order, query, selectedRecord?.slug, status, theme, urlReady, year]);
  const hasFilters = Boolean(query) || status !== all || theme !== all || institution !== all || year !== all;
  const docketRefreshCount = records.filter((record) => record.publicationState === "Current docket needed").length;

  const activeFilters = [
    query ? { key: "query", label: `Search: ${query}` } : null,
    status !== all ? { key: "status", label: status } : null,
    theme !== all ? { key: "theme", label: theme } : null,
    institution !== all ? { key: "institution", label: institution } : null,
    year !== all ? { key: "year", label: year } : null,
  ].filter((item): item is { key: string; label: string } => Boolean(item));

  function clearFilter(key: string) {
    if (key === "query") setQuery("");
    if (key === "status") setStatus(all);
    if (key === "theme") setTheme(all);
    if (key === "institution") setInstitution(all);
    if (key === "year") setYear(all);
  }

  function clearFilters() {
    setQuery("");
    setStatus(all);
    setTheme(all);
    setInstitution(all);
    setYear(all);
  }

  function moveSelection(direction: -1 | 1) {
    if (!filtered.length) return;
    const current = selectedIndex >= 0 ? selectedIndex : 0;
    const next = Math.min(filtered.length - 1, Math.max(0, current + direction));
    setSelectedSlug(filtered[next].slug);
    document.querySelector(".workbench-dossier")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="explorer">
      <div className="workbench-toolbar" aria-label="Filter public-record ledger">
        <div className="filter-panel">
          <label className="search-field">
            <span>Search the ledger</span>
            <div>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Agency, person, topic, or case"
              />
            </div>
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>{all}</option>
              {options.statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Topic</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option>{all}</option>
              {options.themes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Institution grouping</span>
            <select value={institution} onChange={(event) => setInstitution(event.target.value)}>
              <option>{all}</option>
              {options.institutions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option>{all}</option>
              {options.years.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="workbench-toolbar-foot">
          <div className="active-filter-row" aria-label="Active filters">
            {activeFilters.length ? activeFilters.map((filter) => (
              <button type="button" key={filter.key} onClick={() => clearFilter(filter.key)} title={`Remove ${filter.label} filter`}>
                <span>{filter.label}</span><X size={14} aria-hidden="true" />
              </button>
            )) : <span className="no-active-filters">No filters applied</span>}
          </div>
          <div className="order-toggle" aria-label="Ledger order">
            <button type="button" aria-pressed={order === "ledger"} onClick={() => setOrder("ledger")}>
              <List size={16} aria-hidden="true" /> Ledger
            </button>
            <button type="button" aria-pressed={order === "chronology"} onClick={() => setOrder("chronology")}>
              <CalendarRange size={16} aria-hidden="true" /> Newest
            </button>
          </div>
        </div>
      </div>

      <div className="results-bar">
        <p role="status" aria-live="polite" aria-atomic="true">
          <SlidersHorizontal size={16} aria-hidden="true" /> Showing <strong>{filtered.length}</strong> of {records.length} ledger entries
          <span className="docket-refresh-count"><RefreshCw size={13} aria-hidden="true" /> {docketRefreshCount} need docket refresh</span>
        </p>
        {hasFilters && (
          <button type="button" onClick={clearFilters}>
            <X size={15} aria-hidden="true" /> Clear all filters
          </button>
        )}
      </div>

      {filtered.length > 0 && selectedRecord ? (
        <div className="ledger-workbench">
          <aside className="record-index" aria-label="Matching ledger entries">
            <div className="record-index-heading">
              <div>
                <p className="eyebrow">Compact index</p>
                <h3>Choose a record</h3>
              </div>
              <span>{filtered.length}</span>
            </div>
            <ol>
              {filtered.map((record, index) => {
                const selected = record.slug === selectedRecord.slug;
                return (
                  <li key={record.id} className={selected ? "is-selected" : undefined}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(record.slug)}
                      aria-pressed={selected}
                      aria-label={`Select ${record.title}`}
                    >
                      <span className="index-sequence">{String(index + 1).padStart(2, "0")}</span>
                      <span className="index-copy">
                        <span className="index-date">{record.year} · {record.status}</span>
                        <strong>{record.title}</strong>
                        <span>{record.institution}</span>
                      </span>
                      {record.publicationState === "Current docket needed" ? (
                        <RefreshCw className="index-state needs-refresh" size={15} aria-label="Current docket needed" />
                      ) : (
                        <CheckCircle2 className="index-state" size={15} aria-label="Source reviewed" />
                      )}
                    </button>
                    <Link href={`/records/${record.slug}`} aria-label={`Open permanent record for ${record.title}`}>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>

          <section className="workbench-dossier" aria-label={`Selected record: ${selectedRecord.title}`}>
            <div className="dossier-toolbar">
              <div>
                <p className="eyebrow">Selected dossier</p>
                <p>{selectedIndex + 1} of {filtered.length}</p>
              </div>
              <div className="dossier-navigation" aria-label="Move through filtered records">
                <button type="button" onClick={() => moveSelection(-1)} disabled={selectedIndex <= 0}>
                  <ArrowLeft size={16} aria-hidden="true" /> Previous
                </button>
                <button type="button" onClick={() => moveSelection(1)} disabled={selectedIndex >= filtered.length - 1}>
                  Next <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <RecordCard key={selectedRecord.id} record={selectedRecord} />
          </section>
        </div>
      ) : (
        <div className="empty-state">
          <FileSearch size={30} aria-hidden="true" />
          <h3>No ledger entries match those filters</h3>
          <p>Try a broader search. An empty result is not evidence that no record exists.</p>
          <button type="button" onClick={clearFilters}>Reset filters</button>
        </div>
      )}
    </div>
  );
}
