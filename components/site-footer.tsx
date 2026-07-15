import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-title">Big Horn Accountability Ledger</p>
          <p>
            A source index for public records and community leads. A filing or allegation is not proof.
          </p>
        </div>
        <div>
          <p className="footer-label">Read first</p>
          <Link href="/methodology">Publication standards</Link>
          <Link href="/status">Project status</Link>
          <Link href="/methodology#corrections">Corrections &amp; fair response</Link>
        </div>
        <div>
          <p className="footer-label">Privacy</p>
          <p>Raw submissions are private by default and never publish automatically.</p>
        </div>
      </div>
    </footer>
  );
}
