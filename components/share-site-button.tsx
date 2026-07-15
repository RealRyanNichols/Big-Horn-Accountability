"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareSiteButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const payload = {
      title: "Big Horn Accountability",
      text: "Follow the source-backed public record across Hardin and Big Horn County.",
      url: window.location.origin,
    };

    if (navigator.share) {
      await navigator.share(payload).catch(() => undefined);
      return;
    }

    await navigator.clipboard.writeText(payload.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="button secondary" type="button" onClick={share}>
      {copied ? <Check size={17} /> : <Share2 size={17} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}

