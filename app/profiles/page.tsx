import type { Metadata } from "next";
import { Building2, FileCheck2, Scale } from "lucide-react";
import { ProfileDirectory } from "@/components/profile-directory";
import { profiles, profileRoles, profileStatuses } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Public-record profiles",
  description: "Evidence-bounded profiles of people and public institutions appearing in the reviewed Big Horn-area record ledger.",
};

export default function ProfilesPage() {
  return (
    <>
      <section className="page-hero profiles-hero">
        <div className="shell narrow">
          <p className="eyebrow"><Building2 size={15} /> Profile directory</p>
          <h1>Public roles.<br /><span>Record-bounded profiles.</span></h1>
          <p>
            Browse people, offices, agencies, courts, and public institutions named in the reviewed ledger.
            Every profile separates allegations, procedural rulings, dismissals, official findings, convictions, and neutral context.
          </p>
          <div className="trust-row">
            <span><FileCheck2 size={14} /> Built only from linked ledger records</span>
            <span><Scale size={14} /> No guilt inferred from inclusion</span>
          </div>
        </div>
      </section>
      <main className="shell profiles-shell">
        <div className="directory-note profile-directory-note">
          <Scale size={20} />
          <p>
            <strong>This is an evidence index, not a blacklist.</strong> A profile can include a dismissal, a defense judgment,
            a neutral leadership record, a pending allegation, or an official adverse outcome. Read each status and limitation before drawing a conclusion.
          </p>
        </div>
        <ProfileDirectory profiles={profiles} roles={profileRoles} statuses={profileStatuses} />
      </main>
    </>
  );
}
