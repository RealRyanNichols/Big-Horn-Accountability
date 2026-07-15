import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  ExternalLink,
  FileCheck2,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { investigationThreads, recordsForThread } from "@/lib/investigation-threads";
import { EvidenceChronology } from "@/components/evidence-chronology";

export const metadata: Metadata = {
  title: "Investigation threads",
  description: "Six source-backed paths through the Big Horn County public record.",
};

export default function InvestigationsPage() {
  return (
    <>
      <section className="story-hero">
        <div className="shell story-hero-grid">
          <div>
            <p className="eyebrow"><BookOpenCheck size={15} /> Six paths through the paper trail</p>
            <h1>The pattern is not one headline.<br /><span>It is what repeats.</span></h1>
            <p>
              Court rulings, audit findings, agency records, dismissals, and unresolved leads tell different kinds of truth.
              These chapters put them in sequence without turning proximity into proof.
            </p>
            <Link className="button light" href="#chapters">Begin the record <ArrowDown size={17} /></Link>
          </div>
          <aside className="story-manifesto">
            <span className="manifesto-mark">“</span>
            <blockquote>Power is easiest to examine when every claim keeps its source, date, posture, and limit.</blockquote>
            <div>
              <span><FileCheck2 size={16} /> Source first</span>
              <span><Scale size={16} /> Outcome labeled</span>
              <span><ShieldAlert size={16} /> No guilt by association</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="chapter-index" id="chapters">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Investigation index</p>
              <h2>Choose a thread. Keep the context.</h2>
            </div>
            <p>Each chapter joins related records for navigation. It does not claim the events share a mastermind, motive, or legal cause.</p>
          </div>
          <nav className="chapter-index-grid" aria-label="Investigation chapters">
            {investigationThreads.map((thread) => (
              <a href={`#${thread.id}`} key={thread.id}>
                <span>{thread.number}</span>
                <div>
                  <small>{thread.dateRange}</small>
                  <strong>{thread.title}</strong>
                </div>
                <ArrowDown size={16} />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <EvidenceChronology />

      <nav className="story-progress-rail" aria-label="Investigation progress">
        <div className="shell">
          <span className="progress-rail-label">Follow a thread</span>
          <div>
            {investigationThreads.map((thread) => (
              <a href={`#${thread.id}`} key={thread.id} title={thread.title}>
                <span>{thread.number}</span>
                <strong>{thread.title}</strong>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="story-chapters">
        {investigationThreads.map((thread) => {
          const chapterRecords = recordsForThread(thread);
          return (
            <section className="story-chapter" id={thread.id} key={thread.id}>
              <div className="shell story-chapter-grid">
                <header className="chapter-lead">
                  <div className="chapter-number">{thread.number}</div>
                  <p className="eyebrow">{thread.eyebrow}</p>
                  <h2>{thread.title}</h2>
                  <p className="chapter-dek">{thread.dek}</p>
                  <div className="chapter-rule establishes">
                    <strong>What the sequence supports</strong>
                    <p>{thread.thesis}</p>
                  </div>
                  <div className="chapter-rule limit">
                    <strong>The line we do not cross</strong>
                    <p>{thread.limit}</p>
                  </div>
                </header>

                <div className="chapter-timeline">
                  <div className="timeline-caption">
                    <span>{thread.dateRange}</span>
                    <p>{thread.prompt}</p>
                  </div>
                  {chapterRecords.map((record) => (
                    <article className="timeline-record" key={record.id}>
                      <div className="timeline-dot" aria-hidden="true" />
                      <div className="timeline-date">
                        <strong>{new Date(`${record.date}T00:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</strong>
                        <span>{record.status}</span>
                      </div>
                      <h3>{record.title}</h3>
                      <p>{record.summary}</p>
                      <div className="timeline-links">
                        <Link href={`/#${record.id}`}>Ledger card <ArrowRight size={14} /></Link>
                        <a href={record.sources[0].url} target="_blank" rel="noreferrer">
                          Open source <ExternalLink size={13} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="story-closing">
        <div className="shell story-closing-grid">
          <div>
            <p className="eyebrow">The investigation remains open</p>
            <h2>A record can change when the missing document arrives.</h2>
          </div>
          <div>
            <p>Have a docket, video, meeting minute, audit, or firsthand account that belongs in the review queue?</p>
            <div className="hero-actions">
              <Link className="button light" href="/submit">Build a private story <ArrowRight size={17} /></Link>
              <Link className="button outline-light" href="/methodology">See the evidence rules</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
