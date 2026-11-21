const ROWS = [
  {
    term: "Native Rust, drawn on the GPU",
    detail: "The app and its daemon are native binaries written in Rust. The interface renders on the GPU and there is no browser engine inside.",
  },
  {
    term: "Ghostty\u2019s terminal engine",
    detail: "Terminal output is parsed by libghostty-vt, the engine behind the Ghostty terminal, so agent TUIs draw the way they do in a real terminal.",
  },
  {
    term: "Knows when an agent needs you",
    detail: "Agents that report their state show as working, waiting or done. A Needs you list jumps straight to the session that is waiting, even in another workspace.",
  },
  {
    term: "Your data stays local",
    detail: "Projects, sessions and settings live in a SQLite file on your machine, and the daemon listens only on a local socket.",
  },
];

export function Internals() {
  return (
    <section id="internals" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-36">
        <h2 className="reveal max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl">
          Built like a terminal, not a web page.
        </h2>
        <dl className="mt-14 border-t border-line">
          {ROWS.map((row) => (
            <div key={row.term} className="reveal grid grid-cols-1 gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10">
              <dt className="text-2xl font-semibold tracking-tight md:col-span-5 md:text-3xl">{row.term}</dt>
              <dd className="max-w-[58ch] text-lg leading-relaxed text-muted md:col-span-7">{row.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
