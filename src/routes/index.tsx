import { createFileRoute } from "@tanstack/react-router";
import { Nav, Hero, Story, Celebrations, CountdownSection, Travel, Faq, Closing } from "@/components/wedding/sections";
import { Rsvp, Gallery, Wishes } from "@/components/wedding/interactive";
import { ShareButton } from "@/components/wedding/share";

const title = "Nidhi & Puneet — Wedding Invitation";
const description = "Together with our families, we invite you to celebrate the wedding of Nidhi & Puneet. Events, travel, RSVP and more.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Nav />
      <Hero />
      <Story />
      <Celebrations />
      <CountdownSection />
      <Travel />
      <Rsvp />
      <Gallery />
      <Wishes />
      <Faq />
      <Closing />
      <ShareButton variant="float" />
    </main>
  );
}
