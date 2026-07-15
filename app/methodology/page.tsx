import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, FileWarning, Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Methodology & publication standards" };

const labels = [
  ["Filed allegation", "A complaint or charge was filed. The assertion is not treated as proven."],
  ["Administrative settlement", "An agency matter ended by agreement; scope and admission language must be reported."],
  ["Dismissed", "The matter ended without an adverse merits judgment; the reason and prejudice language matter."],
  ["Procedural ruling", "A court resolved a threshold or interim issue, not necessarily the ultimate claim."],
  ["Finding / final judgment", "A tribunal reached a merits determination; appeal status and later history still matter."],
];

const authorities = [
  ["New York Times Co. v. Sullivan, 376 U.S. 254 (1964)", "https://tile.loc.gov/storage-services/service/ll/usrep/usrep376/usrep376254/usrep376254.pdf"],
  ["Milkovich v. Lorain Journal Co., 497 U.S. 1 (1990)", "https://tile.loc.gov/storage-services/service/ll/usrep/usrep497/usrep497001/usrep497001.pdf"],
  ["Cox Broadcasting Corp. v. Cohn, 420 U.S. 469 (1975)", "https://tile.loc.gov/storage-services/service/ll/usrep/usrep420/usrep420469/usrep420469.pdf"],
  ["Santa Clara Pueblo v. Martinez, 436 U.S. 49 (1978)", "https://tile.loc.gov/storage-services/service/ll/usrep/usrep436/usrep436049/usrep436049.pdf"],
  ["Montana fair-report privilege — MCA § 27-1-804", "https://mca.legmt.gov/bills/mca/title_0270/chapter_0010/part_0080/section_0040/0270-0010-0080-0040.html"],
  ["Montana public criminal-justice information — MCA § 44-5-103", "https://mca.legmt.gov/bills/mca/title_0440/chapter_0050/part_0010/section_0030/0440-0050-0010-0030.html"],
];

export default function MethodologyPage() {
  return (
    <>
      <section className="page-hero methodology-hero">
        <div className="shell narrow">
          <p className="eyebrow"><Scale size={15} /> Publication standards</p>
          <h1>Evidence before adjectives.<br /><span>Disposition before conclusions.</span></h1>
          <p>
            The ledger documents official acts and public proceedings without turning allegations into verdicts.
            It is a research and reporting tool—not a blacklist, court, legal service, or emergency line.
          </p>
        </div>
      </section>
      <section className="shell methodology-layout">
        <aside className="methodology-nav">
          <a href="#labels">Status labels</a>
          <a href="#profiles">Profile inclusion</a>
          <a href="#workflow">Publication workflow</a>
          <a href="#privacy">Privacy and intake</a>
          <a href="#tribal">Tribal sovereignty</a>
          <a href="#corrections">Corrections and fair response</a>
          <a href="#authorities">Authorities</a>
        </aside>
        <div className="methodology-content">
          <section id="labels">
            <p className="eyebrow">01 · Status labels</p>
            <h2>What each label means</h2>
            <div className="label-table">
              {labels.map(([label, meaning]) => (
                <div key={label}><strong>{label}</strong><p>{meaning}</p></div>
              ))}
            </div>
            <div className="method-alert"><FileWarning size={19} /><p>A lawsuit, complaint, arrest, or news report is not proof of misconduct. Later dismissals, reversals, acquittals, exonerations, and corrections must be displayed with comparable prominence.</p></div>
          </section>

          <section id="profiles">
            <p className="eyebrow">02 · Profile inclusion</p>
            <h2>A profile is an index of records—not a guilt label</h2>
            <div className="principle-grid">
              <article><ShieldCheck size={20} /><h3>Named in a reviewed source</h3><p>A person or institution must be explicitly connected to at least one published ledger record. Similar names and rumor are not enough.</p></article>
              <article><ShieldCheck size={20} /><h3>Public role is relevant</h3><p>Priority goes to elected officials, public employees, law-enforcement personnel, courts, agencies, tribal offices, contractors exercising public authority, and oversight bodies.</p></article>
              <article><ShieldCheck size={20} /><h3>Every posture travels with it</h3><p>Dismissals, government victories, neutral leadership records, denials, and limits receive the same profile visibility as allegations, findings, settlements, and convictions.</p></article>
              <article><ShieldCheck size={20} /><h3>No clean-record inference</h3><p>Absence from the directory only means no profile has been published from this reviewed set. It is not a certification about any person or office.</p></article>
            </div>
          </section>

          <section id="workflow">
            <p className="eyebrow">03 · Publication workflow</p>
            <h2>A lead does not become a public record card by itself</h2>
            <ol className="workflow-list">
              <li><span>1</span><div><strong>Receive privately</strong><p>Preserve the source’s original words and permissions. A tip is labeled unverified.</p></div></li>
              <li><span>2</span><div><strong>Locate primary records</strong><p>Confirm identity, agency, dates, docket, source custodian, and procedural posture.</p></div></li>
              <li><span>3</span><div><strong>Test the claim</strong><p>Look for contradictory records, missing context, later history, and reasons to doubt the account.</p></div></li>
              <li><span>4</span><div><strong>Redact and seek fair response</strong><p>Remove unnecessary private information and contact named subjects where appropriate and safe.</p></div></li>
              <li><span>5</span><div><strong>Publish a separate derivative</strong><p>Editors write a sourced card with limits; raw submissions never publish automatically.</p></div></li>
            </ol>
          </section>

          <section id="privacy">
            <p className="eyebrow">04 · Privacy and intake</p>
            <h2>Minimize harm while preserving useful evidence</h2>
            <div className="principle-grid">
              <article><ShieldCheck size={20} /><h3>Private by default</h3><p>Contact details and raw narratives remain in a restricted queue. Public pages use separately reviewed copies.</p></article>
              <article><ShieldCheck size={20} /><h3>Collect less</h3><p>No home addresses, dates of birth, account credentials, minors’ identities, or unrelated medical details.</p></article>
              <article><ShieldCheck size={20} /><h3>No secret recording tool</h3><p>Live speech is for the submitter’s own statement. The site does not store audio; browser speech services may process it.</p></article>
              <article><ShieldCheck size={20} /><h3>No automatic accusations</h3><p>AI and editors may organize a lead but may not invent intent, crimes, names, quotations, or facts.</p></article>
            </div>
            <div className="method-alert privacy-conditions">
              <FileWarning size={19} />
              <div>
                <strong>Intake remains closed until these controls are operational.</strong>
                <p>A designated privacy contact and deletion-request route must be published; reviewer access must be logged; sensitive fields must be restricted; and each submission must receive a 180-day retention review unless a documented legal hold or verification need applies. A request to delete is not a promise that material subject to a lawful preservation duty can be destroyed.</p>
              </div>
            </div>
          </section>

          <section id="tribal">
            <p className="eyebrow">05 · Tribal sovereignty</p>
            <h2>Tribal government is not a county department</h2>
            <p>
              Tribal, federal, state, county, city, and joint authority remain distinct in the data model.
              Jurisdiction can depend on land status, the official’s employer and commission, cross-deputization,
              forum, and other legally material facts. Montana records law does not automatically govern a tribal sovereign.
            </p>
          </section>

          <section id="corrections">
            <p className="eyebrow">06 · Corrections and fair response</p>
            <h2>Corrections are part of the record</h2>
            <ul className="method-list">
              <li><CheckCircle2 size={16} /> Time-stamp material corrections and explain what changed.</li>
              <li><CheckCircle2 size={16} /> Link dismissals, reversals, acquittals, and exonerations to the original entry.</li>
              <li><CheckCircle2 size={16} /> Preserve a subject’s relevant denial or documentary response.</li>
              <li><CheckCircle2 size={16} /> Remove misidentified people and unnecessary private facts promptly.</li>
              <li><CheckCircle2 size={16} /> Use the private story builder for a correction lead; begin the narrative with “Correction request.”</li>
            </ul>
          </section>

          <section id="authorities">
            <p className="eyebrow">07 · Core authorities</p>
            <h2>Primary-law guardrails</h2>
            <p>These sources inform the editorial design. They are not a substitute for advice from Montana media, privacy, tribal, or litigation counsel.</p>
            <div className="authority-list">
              {authorities.map(([label, url]) => (
                <a href={url} target="_blank" rel="noreferrer" key={url}>{label} <ArrowUpRight size={14} /></a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
