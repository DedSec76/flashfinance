import type { Metadata } from "next";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeSections } from "@/components/marketing/home-sections";

export const metadata: Metadata = {
  title: "Flash Finance",
  description: "Track income and expenses in a private account with monthly summaries and categories.",
};

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeSections />
    </main>
  );
}
