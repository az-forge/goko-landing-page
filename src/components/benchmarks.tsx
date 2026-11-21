import Link from "next/link";

// Every number is quoted from content/CHANGELOG.md (the release named in `since`).
const RESULTS = [
  {
    kind: "Memory",
    title: "One terminal with a full 5,000-line history",
    before: 15.8,
    after: 5.4,
    unit: "MB",
    since: "0.4.0",
  },
  {
    kind: "Memory",
    title: "Twenty terminals with full histories",
    before: 353,
    after: 149,
    unit: "MB",
    since: "0.4.0",
  },
  {
    kind: "CPU",
    title: "Daemon wake-ups a second with 20 idle sessions",
    before: 128,
    after: 11,
    unit: "/s",
    since: "0.2.0",
  },
  {
    kind: "Memory",
    title: "Context search index for 4,875 files",
    before: 110,
    after: 34,
    unit: "MB",
    since: "0.2.0",
  },
  {
    kind: "Speed",
    title: "Building that search index",
    before: 17,
    after: 10,
    unit: "s",
    since: "0.2.0",
  },
  {
    kind: "Speed",
    title: "Loading a History page at 83,000 commits",
    before: 0.95,
    after: 0.11,
    unit: "s",
    since: "0.2.0",
  },
];

function Bar({ label, value, unit, share, now }: { label: string; value: number; unit: string; share: number; now?: boolean }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="w-12 shrink-0 text-muted">{label}</span>
      <span className="flex-1">
        <span
          style={{ width: `${Math.max(share * 100, 1.5)}%` }}
          className={`grow-x block h-2.5 rounded-full ${now ? "bg-accent" : "bg-fg/20"}`}
        />
      </span>
      <span className={`w-16 shrink-0 text-right tabular-nums ${now ? "text-fg" : "text-muted"}`}>
        {value} {unit}
      </span>
    </div>
  );
}

export function Benchmarks() {
  return (
    <section id="benchmarks" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-36">
        <div className="reveal">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl">
            Every release gets lighter.
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
            We measure memory, CPU wake-ups and load times before and after a change, then publish both numbers in the
            changelog.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {RESULTS.map((r) => (
            <li key={r.title} className="reveal flex flex-col rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <p className="flex items-center justify-between font-mono text-xs text-muted">
                <span>{r.kind}</span>
                <Link href={`/changelog#v${r.since}`} className="transition-colors hover:text-fg">
                  since {r.since}
                </Link>
              </p>
              <h3 className="mt-3 text-lg font-medium leading-snug tracking-tight">{r.title}</h3>
              <p className="mb-6 mt-5 text-5xl font-semibold tracking-tighter">
                {r.after}
                <span className="ml-1.5 text-2xl text-muted">{r.unit}</span>
              </p>
              <div className="mt-auto space-y-2.5">
                <Bar label="Before" value={r.before} unit={r.unit} share={1} />
                <Bar label="Now" value={r.after} unit={r.unit} share={r.after / r.before} now />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[90ch] text-sm leading-relaxed text-muted">
          Each pair compares one Goko release with the one before it. Terminal memory was measured on a log-like stream at
          120 columns. The search index and History numbers use git&rsquo;s own repository. Full notes are in the{" "}
          <Link href="/changelog" className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg">
            changelog
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
