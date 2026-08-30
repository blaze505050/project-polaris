import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { opportunityQuery } from "@/lib/db";
import { CATEGORY_LABELS, LEVEL_LABELS, STATUS_LABELS, formatDate } from "@/lib/labels";

export const Route = createFileRoute("/opportunities/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Opportunity — Project Polaris` },
      {
        name: "description",
        content:
          "Details, requirements and timeline for this Project Polaris opportunity, plus how to apply.",
      },
      { property: "og:title", content: "Opportunity — Project Polaris" },
      {
        property: "og:description",
        content: "What you'll do, who can apply and how to join this Project Polaris opportunity.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: OpportunityDetail,
});

function List({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-muted-foreground">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function OpportunityDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading, isError } = useQuery(opportunityQuery(slug));

  if (isLoading) {
    return (
      <div className="shell section pt-36">
        <LoadingCards count={3} />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="shell section pt-36">
        <ErrorState />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="shell section pt-36">
        <EmptyState title="We couldn't find that opportunity" note="It may have closed or moved.">
          <Button asChild variant="outline">
            <Link to="/opportunities">Back to opportunities</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={CATEGORY_LABELS[data.category] ?? data.category}
        title={data.title}
        lead={data.summary}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/join" search={{ opportunity: data.slug }}>
              Apply now
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/opportunities">
              <ArrowLeft />
              All opportunities
            </Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
          <div className="space-y-14">
            {data.description ? (
              <section>
                <h2 className="text-2xl">Overview</h2>
                <p className="mt-5 text-muted-foreground">{data.description}</p>
              </section>
            ) : null}
            <List title="What you'll do" items={data.what_you_do} />
            <List title="Who can apply" items={data.who_can_apply} />
            <List title="Requirements" items={data.requirements} />
            <List title="Timeline" items={data.timeline} />
            <List title="What you gain" items={data.what_you_gain} />

            {data.faqs?.length ? (
              <section>
                <h2 className="text-2xl">Questions</h2>
                <dl className="mt-5 divide-y divide-border border-y border-border">
                  {data.faqs.map((faq) => (
                    <div key={faq.q} className="py-5">
                      <dt className="font-display text-lg">{faq.q}</dt>
                      <dd className="mt-2 text-sm text-muted-foreground">{faq.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card-elevated p-6">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="eyebrow-muted mb-1.5">Status</dt>
                  <dd>{STATUS_LABELS[data.status] ?? data.status}</dd>
                </div>
                <div>
                  <dt className="eyebrow-muted mb-1.5">Level</dt>
                  <dd>{LEVEL_LABELS[data.level] ?? data.level}</dd>
                </div>
                <div>
                  <dt className="eyebrow-muted mb-1.5">Who it's for</dt>
                  <dd className="text-muted-foreground">{data.audience}</dd>
                </div>
                {data.start_date ? (
                  <div>
                    <dt className="eyebrow-muted mb-1.5">Starts</dt>
                    <dd className="text-muted-foreground">{formatDate(data.start_date)}</dd>
                  </div>
                ) : null}
                {data.deadline ? (
                  <div>
                    <dt className="eyebrow-muted mb-1.5">Apply by</dt>
                    <dd className="text-muted-foreground">{formatDate(data.deadline)}</dd>
                  </div>
                ) : null}
              </dl>
              <Button asChild className="mt-7 w-full">
                <Link to="/join" search={{ opportunity: data.slug }}>
                  Apply
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
