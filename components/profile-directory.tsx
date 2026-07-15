"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Filter,
  Landmark,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { EvidenceProfile, ProfileKind, ProfileRole } from "@/lib/profiles";
import type { RecordStatus } from "@/lib/records";

interface ProfileDirectoryProps {
  profiles: EvidenceProfile[];
  roles: ProfileRole[];
  statuses: RecordStatus[];
}
const kinds: Array<"All" | ProfileKind> = ["All", "Person", "Institution"];

function postureClass(posture: EvidenceProfile["posture"]) {
  return posture.toLowerCase().replaceAll(" ", "-");
}

export function ProfileDirectory({ profiles, roles, statuses }: ProfileDirectoryProps) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"All" | ProfileKind>("All");
  const [role, setRole] = useState<"All" | ProfileRole>("All");
  const [status, setStatus] = useState<"All" | RecordStatus>("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return profiles.filter((profile) => {
      if (kind !== "All" && profile.kind !== kind) return false;
      if (role !== "All" && profile.role !== role) return false;
      if (status !== "All" && !profile.statuses.includes(status)) return false;
      if (!normalized) return true;
      return [profile.name, profile.role, profile.jurisdiction, profile.descriptor]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized);
    });
  }, [kind, profiles, query, role, status]);

  const activeFilterCount = Number(kind !== "All") + Number(role !== "All") + Number(status !== "All") + Number(Boolean(query));
  const clearFilters = () => {
    setQuery("");
    setKind("All");
    setRole("All");
    setStatus("All");
  };

  return (
    <div className="profile-directory">
      <section className="profile-atlas" aria-labelledby="profile-atlas-heading">
        <div className="profile-atlas-copy">
          <p className="eyebrow"><Landmark size={14} /> Public-record index</p>
          <h2 id="profile-atlas-heading">Who appears where—and what the record actually says.</h2>
          <p>
            Every node opens a profile assembled from the reviewed ledger. Connections show shared records only;
            they do not imply coordination, guilt, employment today, or a continuing relationship.
          </p>
        </div>
        <div className="profile-atlas-readout" aria-label="Profile directory summary">
          <div><strong>{profiles.length}</strong><span>profiles</span></div>
          <div><strong>{profiles.filter((profile) => profile.kind === "Person").length}</strong><span>people</span></div>
          <div><strong>{profiles.filter((profile) => profile.kind === "Institution").length}</strong><span>institutions</span></div>
          <div><strong>{roles.length}</strong><span>role groups</span></div>
        </div>
        <div className="profile-role-map" aria-label="Profile roles">
          {roles.map((item, index) => {
            const count = profiles.filter((profile) => profile.role === item).length;
            return (
              <button
                type="button"
                key={item}
                onClick={() => setRole(role === item ? "All" : item)}
                className={role === item ? "active" : ""}
                aria-pressed={role === item}
                style={{ "--role-index": index } as React.CSSProperties}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <small>{count} profile{count === 1 ? "" : "s"}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="profile-controls" aria-label="Filter profiles">
        <div className="profile-search">
          <Search size={17} aria-hidden="true" />
          <label htmlFor="profile-search">Search profiles</label>
          <input
            id="profile-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, office, place, or role"
          />
        </div>
        <fieldset className="profile-kind-filter">
          <legend>Entity type</legend>
          <div>
            {kinds.map((item) => (
              <button type="button" key={item} onClick={() => setKind(item)} className={kind === item ? "active" : ""} aria-pressed={kind === item}>
                {item === "Person" && <UserRound size={14} />}
                {item === "Institution" && <Building2 size={14} />}
                {item === "All" && <Filter size={14} />}
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="profile-select">
          <span>Role or institution type</span>
          <select value={role} onChange={(event) => setRole(event.target.value as "All" | ProfileRole)}>
            <option value="All">All roles</option>
            {roles.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="profile-select">
          <span>Record status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as "All" | RecordStatus)}>
            <option value="All">All statuses</option>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <div className="profile-results-bar">
        <p aria-live="polite"><strong>{filtered.length}</strong> of {profiles.length} profiles shown</p>
        {activeFilterCount > 0 && (
          <button type="button" onClick={clearFilters}><X size={14} /> Clear {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}</button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="profile-card-grid">
          {filtered.map((profile) => (
            <article className="profile-card" key={profile.slug}>
              <div className="profile-card-topline">
                <span className="profile-kind-badge">
                  {profile.kind === "Person" ? <UserRound size={13} /> : <Building2 size={13} />}
                  {profile.kind}
                </span>
                <span className={`profile-posture ${postureClass(profile.posture)}`}><ShieldCheck size={12} /> {profile.posture}</span>
              </div>
              <div className="profile-card-heading">
                <p>{profile.role}</p>
                <h3><Link href={`/profiles/${profile.slug}`}>{profile.name}</Link></h3>
                <span>{profile.jurisdiction}</span>
              </div>
              <p className="profile-card-summary">{profile.descriptor}</p>
              <dl className="profile-card-metrics">
                <div><dt>Linked records</dt><dd>{profile.records.length}</dd></div>
                <div><dt>Timeline</dt><dd>{profile.firstYear === profile.lastYear ? profile.firstYear : `${profile.firstYear}–${profile.lastYear}`}</dd></div>
                <div><dt>Statuses</dt><dd>{profile.statuses.length}</dd></div>
              </dl>
              <div className="profile-status-list" aria-label="Record statuses">
                {profile.statuses.slice(0, 3).map((item) => <span key={item}><BadgeCheck size={11} /> {item}</span>)}
                {profile.statuses.length > 3 && <span>+{profile.statuses.length - 3} more</span>}
              </div>
              <Link className="profile-open-link" href={`/profiles/${profile.slug}`}>
                Open evidence profile <ArrowUpRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="profile-empty-state">
          <Search size={24} />
          <h3>No profiles match those filters.</h3>
          <p>Clear a filter or try a broader search term.</p>
          <button type="button" onClick={clearFilters}>Reset directory</button>
        </div>
      )}
    </div>
  );
}
