import { contactSlots, type TeamMember } from "@/lib/team";

type TeamContactCardProps = {
  member: TeamMember;
};

export function TeamContactCard({ member }: TeamContactCardProps) {
  return (
    <article id={member.id} className="future-card scroll-mt-28">
      <h2 className="name-display">{member.name}</h2>
      <p className="future-kicker">Team 2</p>

      <ul className="mt-5 space-y-2">
        {contactSlots(member).map((slot) => {
          if (!slot.href) {
            return (
              <li key={slot.channel}>
                <div className="future-slot">
                  <span>{slot.label}</span>
                  <span>Not listed yet</span>
                </div>
              </li>
            );
          }

          const external = slot.href.startsWith("http");

          return (
            <li key={slot.channel}>
              <a
                href={slot.href}
                className="future-slot is-live"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span>{slot.label}</span>
                <span>Open</span>
              </a>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
