import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
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
          "Daily science drops, interactive challenges, live sessions and discussions with students, mentors and professionals inside the Project Polaris community.",
      },
      { property: "og:title", content: "Community — Project Polaris" },
      { property: "og:description", content: "Sessions, discussions and daily learning with builders." },
    ],
  }),
  component: Community,
});

const RITUALS = [
  {
    name: "Aaj Ka Gyan (Daily)",
    note: "Curated space science research drops, equations, and telemetry logs released every weekday morning.",
  },
  {
    name: "Technical Polls & Challenges",
    note: "Weekly physics, orbital mechanics, and propulsion intuition challenges designed to test fundamentals.",
  },
  {
    name: "Live Expert Masterclasses",
    note: "Direct technical interactive lectures with scientists from ISRO, university professors, and industry leaders.",
  },
  {
    name: "R&D Sprint Cohorts",
    note: "Small student project teams collaborating on numerical simulators, hardware CAD, and verified datasets.",
  },
];

function Community() {
  const { data, isLoading, isError } = useQuery(eventsQuery);
  const events = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Student Community"
        title="An active laboratory where curiosity is normal."
        lead="Students, researchers, mentors, and engineers learning in public across daily science drops and weekly sprints."
      >
        <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
          <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <MessageCircle className="size-3.5" />
            <span>Join WhatsApp Community</span>
          </a>
        </Button>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            <SectionHeader eyebrow="Cadence" title="Daily rituals kept consistently" />
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map((ritual, i) => (
              <ScrollReveal key={ritual.name} direction="up" delay={i * 60}>
                <div className="card-premium p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold">0{i + 1}</span>
                    <h3 className="mt-2 text-base font-bold text-foreground">{ritual.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{ritual.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <SectionHeader
              eyebrow="Sessions"
              title="Masterclasses & upcoming workshops"
              lead="Direct interactive technical lectures with scientists and propulsion researchers."
            />
          </ScrollReveal>

          {/* Past Conducted Masterclasses Archive */}
          <div className="mt-10 space-y-6">
            <h3 className="text-base font-mono font-semibold uppercase tracking-wider text-muted-foreground">Conducted Masterclasses</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {WORKSHOPS.map((workshop, i) => (
                <ScrollReveal key={workshop.id} direction="up" delay={i * 70}>
                  <div className="card-premium p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                        <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-primary font-medium text-[11px]">{workshop.tag}</span>
                        <span>{workshop.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-foreground leading-snug">{workshop.title}</h4>
                      <p className="mt-2 text-xs font-mono text-primary font-medium">{workshop.mentor} · {workshop.mentorOrg}</p>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">{workshop.summary}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 text-[11px]">Archived</span>
                      {workshop.linkedin ? (
                        <a
                          href={workshop.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 text-xs font-semibold"
                        >
                          <span>Mentor Bio</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Upcoming Live Sessions */}
          <div className="mt-16">
            <h3 className="text-base font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-6">Upcoming Scheduled Sessions</h3>
            {isLoading ? <LoadingCards /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && events.length === 0 ? (
              <div className="card-premium p-8 text-center">
                <p className="text-sm font-semibold text-foreground">Next cohort sessions announced in WhatsApp</p>
                <p className="mt-1 text-xs text-muted-foreground">Join our WhatsApp community for instant registration links and live Zoom invites.</p>
                <Button asChild size="sm" variant="outline" className="mt-4 h-8 text-xs">
                  <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                    Join Community
                  </a>
                </Button>
              </div>
            ) : null}
            {!isLoading && !isError && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="card-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                        <Calendar className="size-3 text-primary" />
                        <span>{formatDate(event.event_date) ?? "Date TBD"}</span>
                      </div>
                      <h4 className="text-lg font-bold text-foreground">{event.title}</h4>
                      {event.speaker ? (
                        <p className="font-mono text-xs text-primary mt-1">
                          {event.speaker} {event.speaker_note ? `· ${event.speaker_note}` : ""}
                        </p>
                      ) : null}
                    </div>
                    {event.registration_link ? (
                      <Button asChild size="sm" className="h-8 px-4 bg-foreground text-background font-medium shrink-0">
                        <a href={event.registration_link} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                          <span>Register</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
