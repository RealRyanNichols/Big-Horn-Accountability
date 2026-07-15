import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, Building2, ShieldCheck, UserRound } from "lucide-react";
import { RecordCard } from "@/components/record-card";
import { RecordVisitCounter } from "@/components/visit-counter";
import { getProfilesForRecord } from "@/lib/profiles";
import { records } from "@/lib/records";

interface RecordDetailPageProps {
  params: Promise<{ slug: string }>;
}

function recordForSlug(slug: string) {
  return records.find((record) => record.slug === slug);
}

export function generateStaticParams() {
  return records.map((record) => ({ slug: record.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: RecordDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = recordForSlug(slug);
  if (!record) return {};

  return {
    title: record.title,
    description: record.summary,
    alternates: { canonical: `/records/${record.slug}` },
    openGraph: {
      title: record.title,
      description: record.summary,
      type: "article",
      url: `/records/${record.slug}`,
    },
  };
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { slug } = await params;
  const record = recordForSlug(slug);
  if (!record) notFound();
  const relatedProfiles = getProfilesForRecord(record.id);

  return (
    <section className="record-detail-page">
      <div className="shell record-detail-shell">
        <div className="record-detail-toolbar">
          <Link href={`/#${record.id}`}>
            <ArrowLeft size={15} /> Back to the public-record ledger
          </Link>
          <RecordVisitCounter slug={record.slug} />
        </div>

        <div className="record-detail-kicker">
          <BookOpenCheck size={16} /> Public-record detail
        </div>
        <RecordCard record={record} detail />

        <div className="record-counter-privacy-note">
          <ShieldCheck size={17} aria-hidden="true" />
          <p>
            Story views count a random browser once for this record. They do not identify a
            person, and the counter stores no IP address or user-agent string.
          </p>
        </div>

        {relatedProfiles.length > 0 && (
          <section className="record-related-profiles" aria-labelledby="record-related-profiles-heading">
            <div className="record-related-profiles-heading">
              <div>
                <p className="eyebrow">Accountability index</p>
                <h2 id="record-related-profiles-heading">Profiles linked to this record</h2>
              </div>
              <p>Connections mean the profile is explicitly tied to this ledger entry. They do not imply guilt, coordination, or current employment.</p>
            </div>
            <div className="record-related-profile-grid">
              {relatedProfiles.map((profile) => (
                <Link href={`/profiles/${profile.slug}`} key={profile.slug}>
                  <span>{profile.kind === "Person" ? <UserRound size={15} /> : <Building2 size={15} />}{profile.kind}</span>
                  <strong>{profile.name}</strong>
                  <small>{profile.role} · {profile.posture}</small>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
