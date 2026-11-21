import Link from "next/link";
import { GITHUB_URL, RELEASES_URL } from "@/lib/site";

const LINKS = [
  ["GitHub", GITHUB_URL],
  ["Releases", RELEASES_URL],
  ["Changelog", "/changelog"],
  ["Architecture", `${GITHUB_URL}/blob/main/ARCHITECTURE.md`],
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-3 px-5 pt-10 text-sm text-muted sm:px-8">
        {LINKS.map(([label, href]) => (
          <Link key={label} href={href} className="transition-colors hover:text-fg">
            {label}
          </Link>
        ))}
        <span className="sm:ml-auto">Apache 2.0 licensed</span>
      </div>
      <p aria-hidden className="-mb-[0.12em] mt-2 select-none text-center text-[27vw] font-semibold leading-none tracking-tighter text-fg/[0.06]">
        goko
      </p>
    </footer>
  );
}
