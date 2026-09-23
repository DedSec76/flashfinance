export const contactChannels = ["github", "email", "linkedin", "portfolio"] as const;

export type ContactChannel = (typeof contactChannels)[number];

export type TeamContacts = Record<ContactChannel, string>;

export type TeamMember = {
  id: string;
  name: string;
  contacts: TeamContacts;
};

const contactLabels: Record<ContactChannel, string> = {
  github: "GitHub",
  email: "Email",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
};

/**
 * Public team contacts for the About and Contact pages.
 * Fill a channel with a URL (or an email address) to show it.
 * Leave the string empty to keep the slot without publishing a link.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "aldair-rutte-bazan",
    name: "Aldair Rutte Bazán",
    contacts: {
      github: "https://github.com/DedSec76/wdd430-portfolio",
      email: "",
      linkedin: "",
      portfolio: "",
    },
  },
  {
    id: "enoh-uwem-akpan",
    name: "Enoh Uwem Akpan",
    contacts: {
      github: "https://github.com/enohakpan/wdd430-portfolio",
      email: "",
      linkedin: "",
      portfolio: "",
    },
  },
  {
    id: "oluwaseyi-elujoba",
    name: "Oluwaseyi Elujoba",
    contacts: {
      github: "https://github.com/oedesign/wdd430-portfolio",
      email: "",
      linkedin: "",
      portfolio: "",
    },
  },
];

export type ContactSlot = {
  channel: ContactChannel;
  label: string;
  href: string | null;
};

export function teamInboxAddresses(): string[] {
  return teamMembers.flatMap((member) => {
    const value = member.contacts.email.trim().replace(/^mailto:/i, "");
    return value ? [value] : [];
  });
}

export function contactSlots(member: TeamMember): ContactSlot[] {
  return contactChannels.map((channel) => {
    const value = member.contacts[channel].trim();
    if (!value) {
      return { channel, label: contactLabels[channel], href: null };
    }

    const href = channel === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value;
    return { channel, label: contactLabels[channel], href };
  });
}
