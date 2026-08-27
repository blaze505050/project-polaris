import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { eventsQuery } from "@/lib/db";
import { formatDate } from "@/lib/labels";
import { SITE, WORKSHOPS } from "@/lib/site";
import { MessageCircle, ExternalLink, Calendar, Sparkles } from "lucide-react";

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
      {/* ── Community Hero with Parallax Background ── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24 border-b border-border">
        <ParallaxImage
          src="/media/telescope-milkyway.jpg"
          alt="Milky way astronomy observation telescope"
          intensity={0.2}
          overlay={0.75}
          kenBurns={true}
          className="absolute inset-0 size-full pointer-events-none"
        />

        <div className="shell relative z-10 max-w-4xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight">
              An active laboratory where curiosity is normal.
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Students, researchers, mentors, and engineers learning in public across daily science drops and weekly sprints.
            </p>
          </ScrollReveal>

          <div className="pt-4 flex justify-center">
            <Button asChild size="default" className="h-11 px-7 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors active:scale-[0.97]">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <MessageCircle className="size-4 text-emerald-950" />
                <span>Join WhatsApp Community</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Daily Rituals ── */}
      <section className="section border-b border-border">
        <div className="shell font-sans">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Daily rituals kept consistently
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                The routine habits that turn curious students into active builders.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map((ritual, i) => (
              <ScrollReveal key={ritual.name} direction="up" delay={i * 50}>
                <div className="p-6 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between card-gold-hover">
                  <div>
                    <span className="font-mono text-xs text-gold font-bold">0{i + 1}</span>
                    <h3 className="mt-2 text-base font-bold font-display text-foreground">{ritual.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{ritual.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sessions & Masterclasses Archive ── */}
      <section className="section bg-surface/20">
        <div className="shell font-sans">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
                Masterclasses & Workshops
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Conducted Masterclasses
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Direct interactive technical lectures with scientists and propulsion researchers.
              </p>
            </div>
          </ScrollReveal>

          {/* Past Conducted Masterclasses Archive */}
          <div className="grid gap-4 md:grid-cols-3">
            {WORKSHOPS.map((workshop, i) => (
              <ScrollReveal key={workshop.id} direction="up" delay={i * 50}>
                <div className="p-6 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between card-gold-hover">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-medium text-[10px]">{workshop.tag}</span>
                      <span>{workshop.date}</span>
                    </div>
                    <h4 className="text-base font-bold font-display text-foreground leading-snug">{workshop.title}</h4>
                    <p className="mt-2 text-xs font-mono text-gold font-medium">{workshop.mentor} · {workshop.mentorOrg}</p>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">{workshop.summary}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 text-[11px]">Archived</span>
                    {workshop.linkedin ? (
                      <a
                        href={workshop.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 text-xs font-semibold active:scale-[0.97]"
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

          {/* Upcoming Live Sessions */}
          <div className="mt-16">
            <h3 className="text-base font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-6">Upcoming Scheduled Sessions</h3>
            {isLoading ? <LoadingCards /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && events.length === 0 ? (
              <div className="p-8 rounded-xl border border-white/8 bg-card text-center">
                <p className="text-sm font-semibold text-foreground">Next cohort sessions announced in WhatsApp</p>
                <p className="mt-1 text-xs text-muted-foreground">Join our WhatsApp community for instant registration links and live invites.</p>
                <Button asChild size="sm" variant="outline" className="mt-4 h-9 px-5 rounded-full text-xs active:scale-[0.97]">
                  <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                    Join Community
                  </a>
                </Button>
              </div>
            ) : null}
            {!isLoading && !isError && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-6 rounded-xl border border-white/8 bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 card-gold-hover">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                        <Calendar className="size-3 text-primary" />
                        <span>{formatDate(event.event_date) ?? "Date TBD"}</span>
                      </div>
                      <h4 className="text-lg font-bold font-display text-foreground">{event.title}</h4>
                      {event.speaker ? (
                        <p className="font-mono text-xs text-primary mt-1">
                          {event.speaker} {event.speaker_note ? `· ${event.speaker_note}` : ""}
                        </p>
                      ) : null}
                    </div>
                    {event.registration_link ? (
                      <Button asChild size="sm" className="h-9 px-5 bg-primary text-primary-foreground font-bold rounded-lg shrink-0 active:scale-[0.97]">
                        <a href={event.registration_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
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
