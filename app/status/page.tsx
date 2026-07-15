import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, CircleDot, Clock3, Database, FileSearch, Rocket, ShieldCheck } from "lucide-react";
import { profiles } from "@/lib/profiles";
import { records } from "@/lib/records";

export const metadata: Metadata = { title: "Project status" };

const reviewedRecordCount = records.filter((record) => record.publicationState === "Reviewed").length;
const reviewProgress = Math.round((reviewedRecordCount / records.length) * 100);

const tracks = [
  { name: "Dashboard product", progress: 97, detail: `Guided investigations, filters, evidence cards, ${profiles.length} bounded profiles, share tools, and story builder are implemented.` },
  { name: "Source verification", progress: reviewProgress, detail: `${reviewedRecordCount} of ${records.length} records are source-reviewed; live docket and later-history checks remain for the others.` },
  { name: "Privacy and security", progress: 72, detail: "The dashboard is public; intake remains closed pending operational privacy controls." },
  { name: "Design and deployment", progress: 90, detail: "Responsive story design, social preview, and Vercel production deployment are live; Figma refinement continues." },
];

const completed = [
  "Standalone product kept separate from the Ashby case dashboard",
  "Public dashboard access with no site-password prompt",
  "Search, year, institution, and procedural-status filters",
  "Evidence cards distinguish allegations, dismissals, settlements, and rulings",
  "Institution, records-custodian, and oversight-route directory",
  "Live speech-to-text drafting with visible interim transcript",
  "Six source-backed investigation chapters and visual timelines",
  `${records.length} evidence records and ${profiles.length} bounded person or institution profiles`,
  "Watch, read, and inspect media shelf with direct source links",
  "Production Vercel deployment with public sharing and social preview",
  "Build, typecheck, lint, and dependency audit passed",
];

const active = [
  "Confirm live federal and state dockets and later case history",
  "Add publication-safe cases only after disposition and party identity are verified",
  "Complete Figma design review and fold selected refinements into production",
  "Connect a dedicated private Supabase project after organization and cost approval",
];

const blocked = [
  "Community intake cannot open until Supabase is approved and a privacy contact, deletion route, reviewer access, and retention operations exist.",
  "Some public docket mirrors may be stale; those entries stay marked “Current docket needed.”",
  "Search-engine indexing remains intentionally paused until a final editorial and legal-risk review; the direct public link remains available.",
];

export default function StatusPage() {
  return (
    <>
      <section className="page-hero status-hero">
        <div className="shell narrow">
          <p className="eyebrow"><CircleDot size={15} /> Working status</p>
          <h1>What is finished.<br /><span>What still needs proof.</span></h1>
          <p>Updated July 15, 2026. Progress reflects the public research preview, not a claim that every local matter has been located or adjudicated.</p>
        </div>
      </section>

      <section className="shell status-shell">
        <div className="overall-progress">
          <div>
            <p className="eyebrow"><Clock3 size={14} /> Overall estimate</p>
            <strong>88%</strong>
            <span>toward a defensible public research release</span>
          </div>
          <p>The product is farther along than the research. No entry advances merely because it is interesting; source quality and disposition determine publication readiness.</p>
        </div>

        <div className="track-grid">
          {tracks.map((track) => (
            <article key={track.name}>
              <div><strong>{track.name}</strong><span>{track.progress}%</span></div>
              <div className="track-bar" aria-label={`${track.name}: ${track.progress}% complete`}><span style={{ width: `${track.progress}%` }} /></div>
              <p>{track.detail}</p>
            </article>
          ))}
        </div>

        <div className="status-columns">
          <section>
            <p className="eyebrow"><CheckCircle2 size={14} /> Completed</p>
            <h2>Working now</h2>
            <ul>{completed.map((item) => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>
          </section>
          <section>
            <p className="eyebrow"><FileSearch size={14} /> Active queue</p>
            <h2>Under review</h2>
            <ul>{active.map((item) => <li key={item}><CircleDot size={16} /> {item}</li>)}</ul>
          </section>
        </div>

        <section className="status-blockers">
          <p className="eyebrow"><AlertTriangle size={14} /> Publication blockers</p>
          <h2>Deliberately not treated as finished</h2>
          <div>
            {blocked.map((item, index) => (
              <article key={item}>
                {index === 0 ? <Database size={19} /> : index === 1 ? <ShieldCheck size={19} /> : <Rocket size={19} />}
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
