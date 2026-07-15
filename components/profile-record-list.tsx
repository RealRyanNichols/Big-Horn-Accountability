import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileText, RefreshCw } from "lucide-react";
import type { LedgerRecord } from "@/lib/records";

export function ProfileRecordList({ records }: { records: LedgerRecord[] }) {
  return (
    <div className="profile-record-list">
      {records.map((record, index) => (
        <article key={record.id} className="profile-record-item">
          <div className="profile-record-rail" aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="profile-record-body">
            <div className="profile-record-topline">
              <div>
                <span>{record.status}</span>
                <span>{record.theme}</span>
                {record.publicationState === "Current docket needed" && <span className="needs-refresh"><RefreshCw size={11} /> Current docket needed</span>}
              </div>
              <time dateTime={record.date}>{record.date}{record.dateQualifier ? ` · ${record.dateQualifier}` : ""}</time>
            </div>
            <p className="profile-record-id">{record.id}</p>
            <h3><Link href={`/records/${record.slug}`}>{record.title}</Link></h3>
            <p className="profile-record-summary">{record.summary}</p>
            <div className="profile-proof-pair">
              <div><strong><CheckCircle2 size={14} /> Establishes</strong><p>{record.whatItEstablishes}</p></div>
              <div><strong><AlertTriangle size={14} /> Does not establish</strong><p>{record.whatItDoesNotEstablish}</p></div>
            </div>
            <div className="profile-source-row">
              <span><FileText size={14} /> {record.sources.length} reviewed source{record.sources.length === 1 ? "" : "s"}</span>
              <Link href={`/records/${record.slug}`}>Read full record <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
