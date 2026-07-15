import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarRange,
  FileCheck2,
  Landmark,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { ProfileRecordList } from "@/components/profile-record-list";
import { ProfileVisitCounter } from "@/components/visit-counter";
import { getProfile, profiles } from "@/lib/profiles";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return profiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.name} — public-record profile`,
    description: profile.descriptor,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  const sourceCount = new Set(profile.records.flatMap((record) => record.sources.map((source) => source.url))).size;
  const dateLabel = profile.firstYear === profile.lastYear ? String(profile.firstYear) : `${profile.firstYear}–${profile.lastYear}`;

  return (
    <>
      <section className="profile-detail-hero">
        <div className="shell">
          <div className="profile-detail-toolbar">
            <Link className="profile-back-link" href="/profiles"><ArrowLeft size={15} /> All profiles</Link>
            <ProfileVisitCounter slug={profile.slug} className="profile-visit-counter" />
          </div>
          <div className="profile-detail-grid">
            <div>
              <p className="eyebrow">
                {profile.kind === "Person" ? <UserRound size={14} /> : <Building2 size={14} />}
                {profile.kind} · {profile.role}
              </p>
              <h1>{profile.name}</h1>
              <p className="profile-detail-descriptor">{profile.descriptor}</p>
            </div>
            <aside className="profile-scope-card" aria-label="Profile boundary">
              <Scale size={21} />
              <p className="eyebrow">Profile boundary</p>
              <p>{profile.scopeNote}</p>
            </aside>
          </div>
          <dl className="profile-stat-rail">
            <div><dt><FileCheck2 size={14} /> Linked records</dt><dd>{profile.records.length}</dd></div>
            <div><dt><CalendarRange size={14} /> Record span</dt><dd>{dateLabel}</dd></div>
            <div><dt><ShieldCheck size={14} /> Record posture</dt><dd>{profile.posture}</dd></div>
            <div><dt><Landmark size={14} /> Jurisdiction</dt><dd>{profile.jurisdiction}</dd></div>
          </dl>
        </div>
      </section>

      <main className="shell profile-detail-shell">
        <section className="profile-status-matrix" aria-labelledby="status-matrix-heading">
          <div>
            <p className="eyebrow">Evidence posture</p>
            <h2 id="status-matrix-heading">Exact labels, not interchangeable conclusions.</h2>
            <p>
              This profile contains {profile.statuses.length} distinct record status{profile.statuses.length === 1 ? "" : "es"} across {sourceCount} reviewed source{sourceCount === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="profile-status-matrix-list">
            {profile.statuses.map((status) => {
              const count = profile.records.filter((record) => record.status === status).length;
              return <div key={status}><span>{status}</span><strong>{count}</strong></div>;
            })}
          </div>
        </section>

        <section className="profile-evidence-section" aria-labelledby="profile-evidence-heading">
          <div className="section-heading profile-evidence-heading">
            <div>
              <p className="eyebrow">Linked public record</p>
              <h2 id="profile-evidence-heading">Evidence ledger</h2>
            </div>
            <p>Newest first. Open any entry for its source links, verification note, and complete editorial limits.</p>
          </div>
          <ProfileRecordList records={profile.records} />
        </section>

        <aside className="profile-editorial-note">
          <Scale size={20} />
          <div>
            <strong>Editorial rule</strong>
            <p>
              Inclusion means the person or institution is explicitly connected to a reviewed record. It does not establish present employment,
              guilt, corruption, coordination, or a pattern beyond what the linked records themselves support.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
