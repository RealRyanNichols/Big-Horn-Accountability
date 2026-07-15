import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Big Horn Accountability Ledger",
    template: "%s | Big Horn Accountability",
  },
  description:
    "A source-backed index of public records, court cases, oversight actions, and community reporting pathways in and around Big Horn County, Montana.",
  metadataBase: new URL("https://big-horn-accountability.vercel.app"),
  robots: { index: false, follow: true, nocache: true },
  openGraph: {
    title: "Big Horn Accountability Ledger",
    description: "Follow source-backed investigation threads through Hardin and Big Horn County public records.",
    type: "website",
    url: "https://big-horn-accountability.vercel.app",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Big Horn Accountability — the stories they don't want told",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Horn Accountability Ledger",
    description: "Follow source-backed investigation threads through Hardin and Big Horn County public records.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
