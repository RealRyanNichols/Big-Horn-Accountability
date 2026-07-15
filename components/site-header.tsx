import Link from "next/link";
import { FileSearch, Menu } from "lucide-react";
import { SiteVisitCounter } from "@/components/visit-counter";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <div className="header-brand-group">
          <Link className="brand" href="/" aria-label="Big Horn Accountability home">
            <span className="brand-mark" aria-hidden="true">
              <FileSearch size={20} strokeWidth={2.2} />
            </span>
            <span>
              <strong>Big Horn</strong>
              <small>Accountability Ledger</small>
            </span>
          </Link>
          <SiteVisitCounter className="header-visit-counter" />
        </div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/investigations">Investigations</Link>
          <Link href="/#ledger">Records</Link>
          <Link href="/institutions">Institutions</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/status">Status</Link>
          <Link className="nav-cta" href="/submit">
            Share a story
          </Link>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <Menu size={22} />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/investigations">Investigations</Link>
            <Link href="/#ledger">Records</Link>
            <Link href="/institutions">Institutions</Link>
            <Link href="/methodology">Methodology</Link>
            <Link href="/status">Status</Link>
            <Link href="/submit">Share a story</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
