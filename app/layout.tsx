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
        <header className="nav">
          <div className="wrap nav__inner">
            <Link href="/" className="nav__brand">
              <span className="nav__title">LeanScale</span>
              <span className="nav__sep" />
              <span className="nav__label">Ghostwriter</span>
            </Link>
            <a
              className="btn btn--ghost-dark"
              href="https://www.leanscale.team"
              target="_blank"
              rel="noreferrer noopener"
            >
              www.leanscale.team
            </a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap footer__inner">
            <span className="footer__label">LeanScale Ghostwriter</span>
            <div className="footer__meta">
              <span>Internal tool</span>
              <span>·</span>
              <a href="https://www.leanscale.team">www.leanscale.team</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
