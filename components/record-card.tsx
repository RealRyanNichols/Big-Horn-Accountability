import { AlertTriangle, ArrowUpRight, CheckCircle2, CircleHelp, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { LedgerRecord } from "@/lib/records";
import { ShareRecordButton } from "@/components/share-record-button";

interface RecordCardProps {
  record: LedgerRecord;
  detail?: boolean;
}

function statusClass(status: LedgerRecord["status"]) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export function RecordCard({ record, detail = false }: RecordCardProps) {
  const Heading = detail ? "h1" : "h3";

  return (
    <article className={`record-card${detail ? " record-card-detail" : ""}`} id={record.id}>
      <div className="record-topline">
        <div className="record-badges">
          <span className={`status-badge ${statusClass(record.status)}`}>{record.status}</span>
          <span className="theme-badge">{record.theme}</span>
          {record.publicationState === "Current docket needed" ? (
            <span className="review-badge needs-review">
              <RefreshCw size={13} /> Current docket needed
            </span>
          ) : (
            <span className="review-badge">
              <CheckCircle2 size={13} /> Source reviewed
            </span>
          )}
        </div>
        <ShareRecordButton recordId={record.id} recordSlug={record.slug} title={record.title} />
      </div>

      <p className="record-id">{record.id} · {record.date}</p>
      <Heading>
        {detail ? record.title : <Link href={`/records/${record.slug}`}>{record.title}</Link>}
      </Heading>
      <p className="record-summary">{record.summary}</p>

      <dl className="record-meta">
        <div>
          <dt>Institution</dt>
          <dd>{record.institution}</dd>
        </div>
        <div>
          <dt>Place</dt>
          <dd>{record.place}</dd>
        </div>
        <div>
          <dt>Record type</dt>
          <dd>{record.officialType}</dd>
        </div>
        {record.people.length > 0 && (
          <div>
            <dt>People named in the public record</dt>
            <dd>{record.people.join(", ")}</dd>
          </div>
        )}
      </dl>

      <div className="proof-grid">
        <div>
          <p className="proof-label establishes">
            <CheckCircle2 size={15} /> What this establishes
          </p>
          <p>{record.whatItEstablishes}</p>
        </div>
        <div>
          <p className="proof-label limits">
            <AlertTriangle size={15} /> What it does not establish
          </p>
          <p>{record.whatItDoesNotEstablish}</p>
        </div>
      </div>

      {record.nextVerification && (
        <div className="verification-note">
          <CircleHelp size={17} />
          <p><strong>Next verification:</strong> {record.nextVerification}</p>
        </div>
      )}

      <details className="source-drawer">
        <summary>{record.sources.length} source{record.sources.length === 1 ? "" : "s"}</summary>
        <div className="source-list">
          {record.sources.map((source) => (
            <div className="source-item" key={source.url}>
              <div>
                <p className="source-kind">{source.kind} · checked {source.checkedOn}</p>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label} <ArrowUpRight size={14} />
                </a>
                {source.note && <p>{source.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}
