import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Mic2,
  Scale,
  ShieldCheck,
  Sparkles,
  Waypoints,
  PlayCircle,
  FileText,
  Gavel,
  ExternalLink,
} from "lucide-react";
import { RecordExplorer } from "@/components/record-explorer";
import { ShareSiteButton } from "@/components/share-site-button";
import { EvidenceNetwork } from "@/components/evidence-network";
import { SiteVisitCounter } from "@/components/visit-counter";
import { investigationThreads, recordsForThread } from "@/lib/investigation-threads";
import { lastEditorialReview, records } from "@/lib/records";

export default function HomePage() {
  const reviewed = records.filter((record) => record.publicationState === "Reviewed").length;
  const docketRefreshes = records.length - reviewed;

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="eyebrow"><BadgeCheck size={15} /> A public-interest investigation, built from records</p>
            <h1>The pattern is in<br /><span>the paper trail.</span></h1>
            <p className="hero-copy">
              Across decades and institutions, courts, audits, agency actions, and community reporting
              document separate breakdowns worth examining together. We connect what the evidence supports—and
              refuse to invent what it does not.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/investigations">Follow the investigation <ArrowRight size={17} /></Link>
              <Link className="button secondary" href="#ledger">Search the ledger</Link>
              <Link className="button secondary" href="/submit"><Mic2 size={17} /> Draft your story</Link>
              <ShareSiteButton />
            </div>
            <div className="hero-trust-row">
              <p className="hero-note"><ShieldCheck size={15} /> Raw community stories remain private unless separately reviewed and approved.</p>
              <SiteVisitCounter />
            </div>
          </div>
          <aside className="hero-panel" aria-label="Editorial standard">
            <div className="panel-kicker"><Waypoints size={18} /> A record across time</div>
            <div className="hero-spine">
              <div><strong>1986</strong><span>Voting-rights violation</span></div>
              <div><strong>2008</strong><span>$27M detention project</span></div>
              <div><strong>2016</strong><span>Courts and federal audits</span></div>
              <div><strong>2023</strong><span>Oversight and certification</span></div>
              <div><strong>Now</strong><span>Open dockets and new leads</span></div>
            </div>
            <p className="spine-note"><Scale size={14} /> A timeline shows recurrence. It does not prove coordination.</p>
          </aside>
        </div>
      </section>

      <section className="media-shelf-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Watch · read · inspect</p>
              <h2>Enter through the original reporting.</h2>
            </div>
            <p>News video provides context. Official records control the legal label. Both belong in a transparent investigation.</p>
          </div>
          <div className="media-shelf">
            <a className="media-card media-video" href="https://www.ktvq.com/news/local-news/hardin-mayor-hopeful-a-liability-agreement-will-restore-city-police-dispatch-service-with-big-horn-county-sheriff" target="_blank" rel="noreferrer">
              <div className="media-art"><PlayCircle size={38} /></div>
              <div className="media-card-copy">
                <span>Watch / local reporting</span>
                <h3>When county dispatch stopped sending Hardin police calls</h3>
                <p>KTVQ reporting · 2022</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a className="media-card media-document" href="https://archive.legmt.gov/content/Committees/Interim/2007_2008/law_justice/staff_reports/Hardin%20Det%20Facility.pdf" target="_blank" rel="noreferrer">
              <div className="media-art"><FileText size={36} /></div>
              <div className="media-card-copy">
                <span>Read / legislative briefing</span>
                <h3>The paper trail behind Hardin’s $27 million detention project</h3>
                <p>Montana Legislative Services · 2008</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a className="media-card media-opinion" href="https://law.justia.com/cases/federal/district-courts/FSupp/647/1002/2359821/" target="_blank" rel="noreferrer">
              <div className="media-art"><Gavel size={36} /></div>
              <div className="media-card-copy">
                <span>Inspect / final merits finding</span>
                <h3>The voting-rights judgment that still frames public trust</h3>
                <p>Windy Boy v. Big Horn County · 1986</p>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="pattern-section">
        <div className="shell pattern-grid">
          <div className="pattern-statement">
            <p className="eyebrow"><Sparkles size={15} /> What makes this worth following</p>
            <h2>Not one allegation.<br />Not one institution.<br /><span>A recurring demand for proof.</span></h2>
          </div>
          <div className="pattern-points">
            <article>
              <span>01</span>
              <div><strong>Events repeat across time.</strong><p>Voting, detention, policing, public money, and death investigations appear in records spanning four decades.</p></div>
            </article>
            <article>
              <span>02</span>
              <div><strong>Outcomes are mixed—and that matters.</strong><p>Convictions, audit findings, dismissals, government victories, settlements, and open allegations never collapse into one label.</p></div>
            </article>
            <article>
              <span>03</span>
              <div><strong>The strongest story is the sourced one.</strong><p>The ledger makes every reader one click away from the court, agency, audit, or report behind the card.</p></div>
            </article>
          </div>
        </div>
      </section>

      <EvidenceNetwork records={records} />

      <section className="evidence-bridge-section" aria-labelledby="evidence-bridge-title">
        <div className="shell evidence-bridge-shell">
          <header className="evidence-bridge-copy">
            <div>
              <p className="eyebrow">Six authored paths · one public ledger</p>
              <h2 id="evidence-bridge-title">Follow a thread without losing the record around it.</h2>
            </div>
            <div className="evidence-bridge-readout" aria-label="Ledger publication snapshot">
              <div><strong>{records.length}</strong><span>ledger records</span></div>
              <div><strong>{reviewed}</strong><span>source reviewed</span></div>
              <div className="warning"><strong>{docketRefreshes}</strong><span>need docket checks</span></div>
              <small>Editorial review · {lastEditorialReview}</small>
            </div>
          </header>

          <nav className="evidence-path-rail" aria-label="Investigation threads">
            {investigationThreads.map((thread) => {
              const count = recordsForThread(thread).length;
              return (
                <Link href={`/investigations#${thread.id}`} key={thread.id}>
                  <span className="path-node">{thread.number}</span>
                  <span className="path-copy">
                    <small>{thread.dateRange} · {count} {count === 1 ? "record" : "records"}</small>
                    <strong>{thread.title}</strong>
                  </span>
                  <ArrowRight size={17} />
                </Link>
              );
            })}
          </nav>

          <footer className="evidence-bridge-footer">
            <p><Scale size={15} /> Thread membership is editorial navigation. Recurrence and proximity do not establish coordination, intent, or guilt.</p>
            <Link className="button light" href="/investigations">Open the 47-year chronology <ArrowRight size={17} /></Link>
          </footer>
        </div>
      </section>

      <section className="ledger-section" id="ledger">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Public-record ledger</p>
              <h2>Search the record, not the rumor</h2>
            </div>
            <p>
              This is an expanding index, not a claim that every relevant record has been found.
              Empty search results are not a clean-record finding.
            </p>
          </div>
          <RecordExplorer records={records} />
        </div>
      </section>

      <section className="shell contribution-section">
        <div className="contribution-card">
          <div className="contribution-icon"><Mic2 size={27} /></div>
          <div>
            <p className="eyebrow">Community intake preview</p>
            <h2>Tell the story in your own words</h2>
            <p>
              Type or speak while the transcript appears live. Add public links, preserve a local draft,
              and choose how—or whether—you may be contacted. Nothing publishes automatically.
            </p>
          </div>
          <Link className="button light" href="/submit">Open story builder <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
