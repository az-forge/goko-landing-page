import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/site";

const LINKS = [
  ["Features", "/#features"],
  ["How it works", "/#daemon"],
  ["Benchmarks", "/#benchmarks"],
  ["Install", "/#install", "install_cta_click"],
  ["Changelog", "/changelog"],
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <Image src="/icon.svg" alt="" width={28} height={28} />
          Goko
        </Link>
        <div className="hidden gap-7 text-sm text-muted md:flex">
          {LINKS.map(([label, href, event]) => (
            <Link
              key={href}
              href={href}
              data-analytics-event={event}
              data-analytics-placement={event ? "nav_menu" : undefined}
              className="transition-colors hover:text-fg"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={GITHUB_URL}
            data-analytics-event="github_click"
            data-analytics-placement="nav"
            aria-label="Goko on GitHub"
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <GithubLogoIcon size={20} weight="fill" />
          </a>
          <Link
            href="/#install"
            data-analytics-event="install_cta_click"
            data-analytics-placement="nav"
            className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
          >
            Download
          </Link>
        </div>
      </nav>
    </header>
  );
}
