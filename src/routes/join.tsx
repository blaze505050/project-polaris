import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { JoinForm } from "@/components/site/JoinForm";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { HeartHandshake, UserPlus, MessageCircle } from "lucide-react";

type JoinSearch = { opportunity?: string | undefined };

export const Route = createFileRoute("/join")({
  validateSearch: (search: Record<string, unknown>): JoinSearch => ({
    opportunity: typeof search["opportunity"] === "string" ? search["opportunity"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Join — Project Polaris" },
      {
        name: "description",
        content:
          "Apply to join Project Polaris. Open to students of any background, with options to join as student, volunteer, or associate.",
      },
      { property: "og:title", content: "Join — Project Polaris" },
      { property: "og:description", content: "Apply to join a student-led experiential learning community." },
    ],
  }),
  component: Join,
});

function Join() {
  const { opportunity } = Route.useSearch();

  return (
    <>
      <PageHeader
        eyebrow="Join Polaris"
        title="Start where you are."
        lead={
          opportunity
            ? `You're applying for the ${opportunity} initiative. Complete the details below.`
            : "Choose your path into Project Polaris — whether as a student community member, volunteer, or team lead."
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <MessageCircle className="size-3.5" />
              <span>WhatsApp Community</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <HeartHandshake className="size-3.5" />
              <span>Volunteer Portal</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <a href={SITE.associateFormUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <UserPlus className="size-3.5" />
              <span>Associate Form</span>
            </a>
          </Button>
        </div>
      </PageHeader>
      <section className="section">
        <div className="shell max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <JoinForm opportunitySlug={opportunity} />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
