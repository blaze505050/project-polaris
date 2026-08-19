import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { eventsQuery } from "@/lib/db";
import { formatDate } from "@/lib/labels";
import { SITE, WORKSHOPS } from "@/lib/site";
import { MessageCircle, ExternalLink, Calendar } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Project Polaris" },
      {
        name: "description",
        content:
          "Daily learning, live sessions and discussions with students, mentors and professionals inside the Project Polaris WhatsApp community.",
      },
      { property: "og:title", content: "Community — Project Polaris" },
      { property: "og:description", content: "Sessions, discussions and daily learning with builders." },
    ],
  }),
  component: Community,
});

const RITUALS = [
  {
    name: "Aaj Ka Gyan (Mon–Fri)",
    note: "Daily curated scientific facts based on weekly themes released every morning to spark daily curiosity.",
  },
  {
    name: "Saturday Community Polls",
    note: "Weekly interactive polls prepared by the content team to test intuition and ignite debate.",
  },
  {
    name: "Live Expert Masterclasses",
    note: "Interactive workshops with scientists from ISRO, missile development leaders & university professors.",
  },
  {
    name: "Research & Build Cohorts",
    note: "Small teams collaborating on authentic research papers, hardware prototypes, and open-source models.",
  },
];

function Community() {
  const { data, isLoading, isError } = useQuery(eventsQuery);
  const events = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="A room where curiosity is normal."
        lead="Students, researchers, mentors, educators and professionals learning in public — together."
      >
        <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent hover:opacity-95 hover:scale-105 active:scale-95 text-primary-foreground border-none btn-shimmer transition-all duration-300">
          <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            <span>Join WhatsApp Community</span>
          </a>
        </Button>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader eyebrow="How it runs" title="Small rituals, kept consistently" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map((ritual, i) => (
              <div
                key={ritual.name}
                className="bg-background p-6 hover:bg-surface transition-colors"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 70}ms both` }}
              >
                <h3 className="font-display text-lg font-bold text-foreground">{ritual.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ritual.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <SectionHeader eyebrow="Sessions" title="What we've run and what's next" lead="Direct, live masterclasses with scientists from ISRO and aerospace leaders." />

          {/* Past Conducted Masterclasses Archive */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-display font-bold text-foreground">Conducted Masterclasses</h3>
            <ul className="divide-y divide-border border-y border-border">
              {WORKSHOPS.map((workshop) => (
                <li key={workshop.id} className="grid gap-4 py-8 md:grid-cols-[0.3fr_1fr] md:gap-10 items-start">
                  <div className="font-ui text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span className="font-mono">{workshop.date}</span>
                    </div>
                    <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-primary uppercase">
                      {workshop.tag}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-display font-bold text-foreground">{workshop.title}</h4>
                    <div className="flex items-center gap-2 text-sm font-ui">
                      <span className="font-bold text-primary">{workshop.mentor}</span>
                      <span className="text-muted-foreground">· {workshop.mentorTitle}</span>
                    </div>
                    <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">{workshop.summary}</p>
                    {workshop.linkedin ? (
                      <a
                        href={workshop.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="font-ui inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>View {workshop.mentor}'s Profile</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Live Sessions */}
          <div className="mt-16">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Upcoming Sessions</h3>
            {isLoading ? <LoadingCards /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && events.length === 0 ? (
              <EmptyState title="Next cohort sessions announced in WhatsApp" note="Join our WhatsApp community for the latest dates and registration links." />
            ) : null}
            {!isLoading && !isError && events.length > 0 ? (
              <ul className="divide-y divide-border border-y border-border">
                {events.map((event) => (
                  <li key={event.id} className="grid gap-4 py-7 md:grid-cols-[0.3fr_1fr] md:gap-10 items-start">
                    <div className="font-ui text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span>{formatDate(event.event_date) ?? "Date to be announced"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">{event.title}</h3>
                      {event.speaker ? (
                        <p className="font-ui mt-1.5 text-sm text-primary font-semibold">
                          {event.speaker}
                          {event.speaker_note ? ` · ${event.speaker_note}` : ""}
                        </p>
                      ) : null}
                      {event.description ? (
                        <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      ) : null}
                      {event.registration_link ? (
                        <a
                          href={event.registration_link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-ui mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <span>Register</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

