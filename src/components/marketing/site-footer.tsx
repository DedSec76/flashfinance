import Link from "next/link";
import { teamMembers } from "@/lib/team";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="site-footer-mark">Flash Finance</p>
          <p className="site-footer-copy">
            A private ledger for income, expenses, and the balance of the month.
          </p>
          <div className="site-footer-actions">
            <Link href="/register" className="future-cta">
              Create account
            </Link>
            <Link href="/login" className="future-ghost">
              Sign in
            </Link>
          </div>
        </div>

        <div>
          <p className="site-footer-label">Explore</p>
          <ul className="site-footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/contact#team-message">Write the team</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="site-footer-label">Team 2</p>
          <ul className="site-footer-links">
            {teamMembers.map((member) => (
              <li key={member.id}>
                <Link href={`/contact#${member.id}`}>{member.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bar">
        <p>Team 2 · Flash Finance</p>
        <p>Private accounts. One ledger each.</p>
      </div>
    </footer>
  );
}
