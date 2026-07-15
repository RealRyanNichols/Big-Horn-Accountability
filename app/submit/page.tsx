import type { Metadata } from "next";
import { LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { StoryBuilder } from "@/components/story-builder";

export const metadata: Metadata = { title: "Share a story" };

export default function SubmitPage() {
  const intakeEnabled = process.env.INTAKE_ENABLED === "true";

  return (
    <>
      <section className="page-hero">
        <div className="shell narrow">
          <p className="eyebrow"><MessageSquareText size={15} /> Community story builder</p>
          <h1>Your words first.<br /><span>Verification before publication.</span></h1>
          <p>
            Build a clear account by typing or speaking. The live transcript is editable.
            Saving a private submission does not make it public, and no story appears in the ledger without human review.
          </p>
          <div className="trust-row">
            <span><LockKeyhole size={15} /> Private by default</span>
            <span><ShieldCheck size={15} /> No automatic publication</span>
          </div>
        </div>
      </section>
      <div className="shell form-shell">
        <StoryBuilder intakeEnabled={intakeEnabled} />
      </div>
    </>
  );
}
