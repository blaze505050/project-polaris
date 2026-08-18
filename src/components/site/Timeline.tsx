export function Timeline({
  items,
}: {
  items: readonly {
    date: string;
    title: string;
    note: string;
    link?: string;
    linkLabel?: string;
  }[];
}) {
  return (
    <ol className="relative ml-3 border-l border-border">
      {items.map((item) => (
        <li key={item.title} className="relative pb-10 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-primary ring-4 ring-background"
          />
          <p className="eyebrow-muted">{item.date}</p>
          <h3 className="mt-2 text-lg">{item.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{item.note}</p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui mt-3 inline-flex text-sm text-primary underline-offset-4 hover:underline"
            >
              {item.linkLabel ?? "Learn more"}
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
