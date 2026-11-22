import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { getReleases } from "@/lib/changelog";
import { GITHUB_URL } from "@/lib/site";

const description = "Every Goko release and what changed in it: new features, changes and fixes, newest first.";

export const metadata: Metadata = {
  title: "Goko changelog: every release and what changed",
  description,
  alternates: { canonical: "/changelog" },
  openGraph: { title: "Goko changelog", description, url: "/changelog" },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function ChangelogPage() {
  const releases = getReleases();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 sm:pb-36 sm:pt-40">
        <h1 className="text-5xl font-semibold leading-none tracking-tighter sm:text-7xl">Changelog</h1>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
          Every Goko release and what changed in it, newest first. Downloads for each version are on{" "}
          <a
            href={`${GITHUB_URL}/releases`}
            data-analytics-event="releases_click"
            data-analytics-placement="changelog"
            className="inline-flex items-center gap-1 text-fg underline decoration-line underline-offset-4 hover:decoration-fg"
          >
            GitHub <ArrowUpRightIcon size={14} weight="bold" />
          </a>
          .
        </p>

        <div className="mt-16 border-t border-line">
          {releases.map((release, i) => (
            <article
              key={release.version}
              id={`v${release.version}`}
              className="grid scroll-mt-24 grid-cols-1 gap-6 border-b border-line py-12 lg:grid-cols-12 lg:gap-10 lg:py-16"
            >
              <header className="lg:col-span-3">
                <div className="lg:sticky lg:top-24">
                  <h2 className="flex items-center gap-3 text-4xl font-semibold tracking-tighter">
                    <a href={`#v${release.version}`}>{release.version}</a>
                    {i === 0 && (
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium tracking-normal text-accent-ink">
                        Latest
                      </span>
                    )}
                  </h2>
                  {release.date && (
                    <time dateTime={release.date} className="mt-2 block font-mono text-sm text-muted">
                      {formatDate(release.date)}
                    </time>
                  )}
                </div>
              </header>
              <div className="space-y-10 lg:col-span-9">
                {release.groups.map((group) => (
                  <section key={group.title}>
                    <h3 className="text-xl font-semibold tracking-tight">{group.title}</h3>
                    <ul className="mt-4 max-w-[78ch] list-disc space-y-3 pl-5 leading-relaxed [overflow-wrap:anywhere] text-muted marker:text-accent">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Markdown
                            components={{
                              p: ({ children }) => <>{children}</>,
                              a: ({ href, children }) => (
                                <a href={href} className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg">
                                  {children}
                                </a>
                              ),
                              code: ({ children }) => (
                                <code className="rounded-md bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>
                              ),
                              strong: ({ children }) => <strong className="font-medium text-fg">{children}</strong>,
                            }}
                          >
                            {item}
                          </Markdown>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
