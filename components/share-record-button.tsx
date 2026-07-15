"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareRecordButtonProps {
  recordId: string;
  recordSlug?: string;
  title: string;
}

export function ShareRecordButton({ recordId, recordSlug, title }: ShareRecordButtonProps) {
  const [copied, setCopied] = useState(false);

  async function shareRecord() {
    const url = recordSlug
      ? `${window.location.origin}/records/${recordSlug}`
      : `${window.location.origin}/#${recordId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: "Source-backed public record", url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="icon-button" type="button" onClick={shareRecord} aria-live="polite">
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
