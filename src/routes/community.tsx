import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { eventsQuery } from "@/lib/db";
import { formatDate } from "@/lib/labels";
import { SITE } from "@/lib/site";
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
  { name: "Aaj Ka Gyan", note: "A daily piece of curated knowledge shared with the whole community." },
  { name: "Live expert sessions", note: "Workshops with speakers from ISRO, missile development & academic leaders." },
  { name: "Saturday Polls & Discussions", note: "Open threads where members discuss space science and engineering questions." },
  { name: "Quizzes & challenges", note: "Low-stakes constellation-hunting challenges and astronomy quizzes." },
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
        <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
          <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            <span>Join WhatsApp Community</span>
          </a>
        </Button>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader eyebrow="How it runs" title="Small rituals, kept consistently" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map((ritual, i) => (
              <div
                key={ritual.name}
                className="bg-[#04060e] p-6 hover:bg-slate-900/80 transition-colors"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 70}ms both` }}
              >
                <h3 className="font-display text-lg font-bold text-white">{ritual.name}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{ritual.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <SectionHeader eyebrow="Sessions" title="What we've run and what's next" />
          <div className="mt-12">
            {isLoading ? <LoadingCards /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && events.length === 0 ? (
              <EmptyState title="No upcoming public sessions listed yet" note="New sessions are announced in the WhatsApp community first." />
            ) : null}
            {!isLoading && !isError && events.length > 0 ? (
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {events.map((event) => (
                  <li key={event.id} className="grid gap-4 py-7 md:grid-cols-[0.3fr_1fr] md:gap-10 items-start">
                    <div className="font-ui text-sm text-slate-400 flex items-center gap-2">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span>{formatDate(event.event_date) ?? "Date to be announced"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">{event.title}</h3>
                      {event.speaker ? (
                        <p className="font-ui mt-1.5 text-sm text-primary font-semibold">
                          {event.speaker}
                          {event.speaker_note ? ` · ${event.speaker_note}` : ""}
                        </p>
                      ) : null}
                      {event.description ? (
                        <p className="mt-3 max-w-2xl text-sm text-slate-300 leading-relaxed">{event.description}</p>
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

