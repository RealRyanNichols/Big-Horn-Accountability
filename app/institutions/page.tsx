import type { Metadata } from "next";
import { ArrowUpRight, Building2, FileSearch, Landmark, Scale } from "lucide-react";
import { institutionGuides, oversightRoutes } from "@/lib/institutions";

export const metadata: Metadata = { title: "Institutions & record paths" };

export default function InstitutionsPage() {
  return (
    <>
      <section className="page-hero institutions-hero">
        <div className="shell narrow">
          <p className="eyebrow"><Building2 size={15} /> Institution map</p>
          <h1>Send each request<br /><span>to the right record holder.</span></h1>
          <p>
            City police, county dispatch, detention, prosecutors, courts, state oversight, federal courts,
            and tribal sovereigns are not one interchangeable system. This guide keeps roles and record paths separate.
          </p>
        </div>
      </section>
      <section className="shell directory-section">
        <div className="directory-note">
          <FileSearch size={20} />
          <p><strong>This is a routing guide, not an accusation list.</strong> Inclusion means the institution can create, maintain, adjudicate, or oversee relevant public records.</p>
        </div>
        <div className="institution-grid">
          {institutionGuides.map((institution) => (
            <article className="institution-card" key={institution.name}>
              <div className="institution-topline">
                <span><Landmark size={15} /> {institution.jurisdiction}</span>
                <a href={institution.officialUrl} target="_blank" rel="noreferrer" aria-label={`Open ${institution.sourceLabel}`}>
                  Official source <ArrowUpRight size={14} />
                </a>
              </div>
              <h2>{institution.name}</h2>
              <p>{institution.role}</p>
              <h3>Likely record families</h3>
              <ul>
                {institution.likelyRecords.map((record) => <li key={record}>{record}</li>)}
              </ul>
              <div className="request-note">
                <Scale size={16} />
                <p>{institution.requestNote}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="oversight-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Complaint and oversight routing</p>
              <h2>Match the issue to the authority</h2>
            </div>
            <p>These links explain jurisdiction. Sending a report is not proof that an investigation opened or a violation occurred.</p>
          </div>
          <div className="oversight-grid">
            {oversightRoutes.map((route) => (
              <article key={route.topic}>
                <p className="route-topic">{route.topic}</p>
                <h3>{route.authority}</h3>
                <dl>
                  <div><dt>Can address</dt><dd>{route.canHandle}</dd></div>
                  <div><dt>Important limit</dt><dd>{route.limit}</dd></div>
                </dl>
                <a href={route.url} target="_blank" rel="noreferrer">Open official guidance <ArrowUpRight size={14} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
