import { ArrowUpRightIcon, DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { GITHUB_URL } from "@/lib/site";
import { HeroScene } from "./scene/hero-scene";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col overflow-hidden pt-16 lg:block">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_68%_48%,rgb(244_119_53/0.13),transparent_70%)]" />
      <div className="relative order-2 h-[58dvh] min-h-[380px] lg:absolute lg:inset-y-0 lg:right-0 lg:top-16 lg:h-auto lg:w-[61%]">
        <HeroScene />
      </div>
      <div className="pointer-events-none relative mx-auto flex w-full max-w-[1400px] px-5 pt-10 sm:px-8 lg:min-h-[calc(100dvh-4rem)] lg:items-center lg:pt-0">
        <div className="pointer-events-auto max-w-[34rem] lg:pb-16">
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl xl:text-7xl">
            <span className="block animate-rise">All your agents. </span>
            <span className="block animate-rise text-accent [animation-delay:120ms]">One window.</span>
          </h1>
          <p className="mt-6 max-w-[30rem] animate-rise text-lg leading-relaxed text-muted [animation-delay:240ms]">
            A native desktop app that runs Claude Code, Codex and other CLI agents side by side, grouped by project.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:360ms]">
            <a
              href="#install"
              data-analytics-event="install_cta_click"
              data-analytics-placement="hero"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <DownloadSimpleIcon size={18} weight="bold" />
              Download
            </a>
            <a
              href={GITHUB_URL}
              data-analytics-event="github_click"
              data-analytics-placement="hero"
              className="flex items-center gap-1.5 rounded-full border border-line px-6 py-3.5 font-medium transition-colors hover:bg-raised active:scale-[0.97]"
            >
              View on GitHub
              <ArrowUpRightIcon size={16} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
