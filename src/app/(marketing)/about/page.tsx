import type { Metadata } from "next";
import Link from "next/link";
import { teamMembers } from "@/lib/team";

export const metadata: Metadata = {
  title: "About · Flash Finance",
  description: "Flash Finance is a personal finance app built by Team 2 for private income and expense tracking.",
};

const principles = [
  {
    index: "01",
    title: "Private by account",
    body: "Registration creates a personal workspace. Signed-in pages show only that person’s transactions, categories, and summaries.",
  },
  {
    index: "02",
    title: "Organized by category",
    body: "Income and expense categories keep records comparable, and a transaction stays with a category of the same type.",
  },
  {
    index: "03",
    title: "Reviewed by month",
    body: "The dashboard and monthly report turn individual entries into income, expenses, and balance for the period you are looking at.",
  },
];

export default function AboutPage() {
  return (
    <main className="future">
      <section className="future-deck">
        <p className="future-status">
          <span className="future-dot" aria-hidden="true" />
          About · Team 2 · one private account
        </p>

        <div className="future-headline">
          <h1 className="future-display">
            A workspace that stays <span className="future-hot">private.</span>
          </h1>
          <div>
            <p className="future-lead">
              Flash Finance helps someone record income and expenses, sort them into categories, and
              review a monthly balance without sharing that history with another account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="future-cta">
                Contact the team
              </Link>
              <Link href="/register" className="future-ghost">
                Create account
              </Link>
            </div>
          </div>
        </div>

        <div className="future-cards future-cards-3">
          {principles.map((principle) => (
            <article key={principle.title} className="future-card">
              <span className="future-index">{principle.index}</span>
              <h2>{principle.title}</h2>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="future-deck">
        <p className="future-status">
          <span className="future-dot" aria-hidden="true" />
          The people building it
        </p>
        <h2 className="future-display mt-4">Team 2</h2>
        <p className="future-lead mt-4">
          Flash Finance is built by Team 2. Each member keeps their own contact links.
        </p>
        <ul className="future-cards future-cards-3">
          {teamMembers.map((member, index) => (
            <li key={member.id} className="future-card">
              <span className="future-index">0{index + 1}</span>
              <h3 className="name-display">{member.name}</h3>
              <Link href={`/contact#${member.id}`} className="future-more">
                Contact links
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
