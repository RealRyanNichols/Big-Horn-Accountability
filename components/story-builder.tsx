"use client";

import { AlertCircle, CheckCircle2, Download, Mic, MicOff, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

interface StoryBuilderProps {
  intakeEnabled: boolean;
}

interface Draft {
  narrative: string;
  incidentDate: string;
  location: string;
  institution: string;
  officialRoles: string;
  evidenceUrls: string;
  contactName: string;
  contactEmail: string;
  contactPermission: boolean;
  publishName: boolean;
  safetyConcerns: string;
}

interface SpeechResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechEventLike extends Event {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechResultLike };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechConstructor = new () => SpeechRecognitionLike;

const emptyDraft: Draft = {
  narrative: "",
  incidentDate: "",
  location: "",
  institution: "",
  officialRoles: "",
  evidenceUrls: "",
  contactName: "",
  contactEmail: "",
  contactPermission: false,
  publishName: false,
  safetyConcerns: "",
};

export function StoryBuilder({ intakeEnabled }: StoryBuilderProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [interimText, setInterimText] = useState("");
  const [listening, setListening] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(true);
  const [speechError, setSpeechError] = useState("");
  const [certified, setCertified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechConstructor;
      webkitSpeechRecognition?: SpeechConstructor;
    };
    const supportsSpeech = Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);
    const hydrationTimer = window.setTimeout(() => setSpeechAvailable(supportsSpeech), 0);

    return () => {
      window.clearTimeout(hydrationTimer);
      recognitionRef.current?.abort();
    };
  }, []);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function startListening() {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechConstructor;
      webkitSpeechRecognition?: SpeechConstructor;
    };
    const Constructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Constructor) {
      setSpeechAvailable(false);
      return;
    }

    const recognition = new Constructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalChunk += result[0].transcript;
        else interimChunk += result[0].transcript;
      }

      if (finalChunk.trim()) {
        setDraft((current) => ({
          ...current,
          narrative: `${current.narrative}${current.narrative.trim() ? " " : ""}${finalChunk.trim()}`,
        }));
      }
      setInterimText(interimChunk.trim());
    };
    recognition.onerror = (event) => {
      setSpeechError(event.error === "not-allowed" ? "Microphone permission was denied." : `Speech recognition stopped: ${event.error}.`);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };
    recognitionRef.current = recognition;
    setSpeechError("");
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
    setInterimText("");
  }

  function clearDraft() {
    stopListening();
    setDraft(emptyDraft);
    setCertified(false);
    setTermsAccepted(false);
    setFormMessage("");
  }

  function exportDraft() {
    const payload = {
      exportedAt: new Date().toISOString(),
      notice: "Private working draft. Not submitted or published.",
      ...draft,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `accountability-story-draft-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function submitStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!intakeEnabled) {
      setFormMessage("Secure intake is not accepting submissions in this preview. Nothing was sent. Export your draft before leaving if you want to keep it.");
      return;
    }
    if (!draft.narrative.trim() || !certified || !termsAccepted) {
      setFormMessage("Add your story and complete both confirmations before submitting.");
      return;
    }

    setSubmitting(true);
    setFormMessage("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          officialRoles: draft.officialRoles.split(",").map((item) => item.trim()).filter(Boolean),
          evidenceUrls: draft.evidenceUrls.split("\n").map((item) => item.trim()).filter(Boolean),
          certified,
          termsAccepted,
          website: "",
        }),
      });
      const result = (await response.json()) as { message?: string; reference?: string };
      if (!response.ok) throw new Error(result.message || "Submission could not be saved.");

      setFormMessage(`Saved privately. Reference: ${result.reference}. This is not a public post.`);
      setDraft(emptyDraft);
      setCertified(false);
      setTermsAccepted(false);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Submission could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="story-builder" onSubmit={submitStory}>
      <div className="intake-status" data-enabled={intakeEnabled}>
        {intakeEnabled ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <div>
          <strong>{intakeEnabled ? "Private intake is accepting submissions" : "Preview mode — secure intake is not yet open"}</strong>
          <p>{intakeEnabled ? "Submissions enter a private moderation queue." : "You can dictate, edit, and export a draft without sending it anywhere. The page does not autosave."}</p>
        </div>
      </div>

      <section className="form-section">
        <div className="form-section-heading">
          <span>01</span>
          <div>
            <h2>What happened?</h2>
            <p>Write what you personally saw, heard, or experienced. Separate firsthand facts from what someone else told you.</p>
          </div>
        </div>
        <div className="dictation-toolbar">
          {speechAvailable ? (
            <button className={listening ? "recording" : ""} type="button" onClick={listening ? stopListening : startListening}>
              {listening ? <MicOff size={17} /> : <Mic size={17} />}
              {listening ? "Stop listening" : "Speak your story"}
            </button>
          ) : (
            <p><AlertCircle size={15} /> Live speech recognition is not supported in this browser. Typing still works.</p>
          )}
          <span><ShieldCheck size={14} /> Not saved or sent unless you choose export or submit</span>
        </div>
        {speechError && <p className="field-error">{speechError}</p>}
        {listening && (
          <div className="live-transcript" aria-live="polite">
            <span className="pulse-dot" />
            <strong>Listening</strong>
            <p>{interimText || "Start speaking—the current phrase will appear here."}</p>
          </div>
        )}
        <label className="full-field">
          <span>Your account <em>required to submit</em></span>
          <textarea
            rows={10}
            value={draft.narrative}
            onChange={(event) => update("narrative", event.target.value)}
            placeholder="Begin with the date, place, and who was present. Describe events in order…"
            required
            maxLength={50_000}
            aria-describedby="narrative-help"
          />
          <small id="narrative-help">{draft.narrative.length.toLocaleString()} / 50,000 characters · audio is not saved by this site</small>
        </label>
        <div className="privacy-callout">
          <ShieldCheck size={18} />
          <p><strong>Privacy:</strong> this page does not record or upload audio and does not autosave your text. Browser speech recognition may use your browser provider’s speech service. On a shared device, close the tab or clear the draft when finished. For the most private option, type instead.</p>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading">
          <span>02</span>
          <div>
            <h2>Help us locate the record</h2>
            <p>These details help reviewers find court dockets, reports, minutes, recordings, and oversight files.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            <span>Incident date</span>
            <input type="date" value={draft.incidentDate} onChange={(event) => update("incidentDate", event.target.value)} />
          </label>
          <label>
            <span>Town or location</span>
            <input value={draft.location} onChange={(event) => update("location", event.target.value)} maxLength={300} placeholder="Hardin, Lodge Grass, Crow Agency…" />
          </label>
          <label>
            <span>Agency or institution</span>
            <input value={draft.institution} onChange={(event) => update("institution", event.target.value)} maxLength={300} placeholder="Police, sheriff, court, clerk, tribal agency…" />
          </label>
          <label>
            <span>Official roles</span>
            <input value={draft.officialRoles} onChange={(event) => update("officialRoles", event.target.value)} maxLength={2_000} placeholder="Officer, deputy, judge, clerk…" />
          </label>
          <label className="full-field">
            <span>Public evidence links <em>one URL per line</em></span>
            <textarea rows={4} value={draft.evidenceUrls} onChange={(event) => update("evidenceUrls", event.target.value)} maxLength={25_000} placeholder="https://court-or-agency.example/record" />
            <small>Do not paste passwords, private medical portals, home addresses, minors’ details, or confidential discovery.</small>
          </label>
          <label className="full-field">
            <span>Safety or retaliation concerns</span>
            <textarea rows={3} value={draft.safetyConcerns} onChange={(event) => update("safetyConcerns", event.target.value)} maxLength={5_000} placeholder="Optional. This stays in the private review queue." />
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading">
          <span>03</span>
          <div>
            <h2>Contact and publication choices</h2>
            <p>Contact information is optional. Providing it does not authorize publication of your name.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            <span>Name or preferred name</span>
            <input value={draft.contactName} onChange={(event) => update("contactName", event.target.value)} maxLength={200} autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={draft.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} maxLength={320} autoComplete="email" />
          </label>
        </div>
        <div className="check-list">
          <label>
            <input type="checkbox" checked={draft.contactPermission} onChange={(event) => update("contactPermission", event.target.checked)} />
            <span>Reviewers may contact me about verification. This does not authorize public identification.</span>
          </label>
          <label>
            <input type="checkbox" checked={draft.publishName} onChange={(event) => update("publishName", event.target.checked)} />
            <span>If a separate edited story is proposed, reviewers may ask me about publishing my name. Checking this is not final consent.</span>
          </label>
          <label>
            <input type="checkbox" checked={certified} onChange={(event) => setCertified(event.target.checked)} required />
            <span>I certify that this account is truthful to the best of my knowledge and clearly identifies secondhand information.</span>
          </label>
          <label>
            <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} required />
            <span>I understand this is not emergency service, legal representation, a police report, or automatic publication.</span>
          </label>
        </div>
        <p className="intake-policy-link">Before intake opens, review the <Link href="/methodology#privacy">privacy, retention, and deletion safeguards</Link>.</p>
      </section>

      {formMessage && <div className="form-message" aria-live="polite">{formMessage}</div>}
      <div className="form-actions">
        <button className="button primary" type="submit" disabled={!intakeEnabled || submitting}>
          <ShieldCheck size={17} />
          {submitting ? "Saving privately…" : intakeEnabled ? "Submit to private review" : "Secure intake not yet open"}
        </button>
        <button className="button secondary" type="button" onClick={exportDraft} disabled={!draft.narrative.trim()}>
          <Download size={17} /> Export my draft
        </button>
        <button className="clear-button" type="button" onClick={clearDraft}>
          <Trash2 size={16} /> Clear this draft
        </button>
      </div>
    </form>
  );
}
