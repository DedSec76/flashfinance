import type { Metadata } from "next";
import { TeamContactCard } from "@/components/marketing/team-contact-card";
import { TeamContactForm } from "@/components/marketing/team-contact-form";
import { teamMembers } from "@/lib/team";

export const metadata: Metadata = {
  title: "Contact · Flash Finance",
  description: "Send one note to the Flash Finance team, or use a member’s own links.",
};

export default function ContactPage() {
  return (
    <main className="future">
      <section className="future-deck">
        <p className="future-status">
          <span className="future-dot" aria-hidden="true" />
          Contact · one note · whole team
        </p>

        <div className="future-headline">
          <h1 className="future-display">
            Write the <span className="future-hot">team</span> once.
          </h1>
          <p className="future-lead">
            Send a single message to every Team 2 email that has been listed. Individual links stay
            on each member’s card.
          </p>
        </div>

        <TeamContactForm />
      </section>

      <section className="future-deck" aria-labelledby="member-links-heading">
        <h2 id="member-links-heading" className="future-display">
          Or reach one person.
        </h2>
        <p className="future-lead mt-4">
          GitHub is listed now. Email, LinkedIn, and portfolio stay open until that member’s link is
          added.
        </p>
        <div className="future-cards future-cards-3">
          {teamMembers.map((member) => (
            <TeamContactCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </main>
  );
}
