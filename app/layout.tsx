import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeanScale Ghostwriter",
  description: "Internal LinkedIn post hub for the LeanScale leadership team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="nav-brand">
              <span className="nav-brand-dot" />
              <span>LeanScale Ghostwriter</span>
            </Link>
            <span className="nav-meta">Internal · v0.1</span>
          </div>
        </nav>
        {children}
        <footer className="site-footer">
          <div className="container">
            <p className="footer-meta">
              Internal LeanScale tool · <a href="https://www.leanscale.team">www.leanscale.team</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
