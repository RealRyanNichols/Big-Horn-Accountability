import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, ShieldCheck } from "lucide-react";
import { RecordCard } from "@/components/record-card";
import { RecordVisitCounter } from "@/components/visit-counter";
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
      </div>
    </section>
  );
}
