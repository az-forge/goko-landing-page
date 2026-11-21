"use client";

import { AppleLogoIcon, CheckIcon, CopyIcon, LinuxLogoIcon, WindowsLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { GITHUB_URL, INSTALL } from "@/lib/site";
import { Reveal } from "./reveal";

const TABS = [
  { id: "unix", label: "macOS and Linux", command: INSTALL.unix, note: "Apple Silicon, Linux x86_64 and aarch64. Run it again to update." },
  { id: "windows", label: "Windows", command: INSTALL.windows, note: "x86_64, Windows 10 1809 or later. Run it in PowerShell." },
] as const;

export function Install() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("unix");
  const [copied, setCopied] = useState(false);
  const active = TABS.find((t) => t.id === tab)!;

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="install" className="border-t border-line bg-[radial-gradient(70%_80%_at_50%_100%,rgb(244_119_53/0.14),transparent_70%)]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-36">
        <Reveal>
          <h2 className="text-5xl font-semibold leading-none tracking-tighter sm:text-7xl">Install with one line.</h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
            Free and open source under Apache 2.0. The installer checks the download before it installs.
          </p>
        </Reveal>
        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
          <div role="tablist" aria-label="Operating system" className="flex gap-1 border-b border-line p-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-raised text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t.id === "unix" ? (
                  <>
                    <AppleLogoIcon size={16} weight="fill" />
                    <LinuxLogoIcon size={16} weight="fill" />
                  </>
                ) : (
                  <WindowsLogoIcon size={16} weight="fill" />
                )}
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <code className="min-w-0 flex-1 break-all font-mono text-base leading-relaxed sm:text-lg">
              <span className="select-none text-accent">{tab === "unix" ? "$ " : "> "}</span>
              {active.command}
            </code>
            <button
              onClick={copy}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink transition-transform active:scale-[0.97]"
            >
              {copied ? <CheckIcon size={18} weight="bold" /> : <CopyIcon size={18} weight="bold" />}
              <span aria-live="polite">{copied ? "Copied" : "Copy command"}</span>
            </button>
          </div>
          <p className="border-t border-line px-6 py-4 text-sm text-muted sm:px-8">
            {active.note} Intel Macs can{" "}
            <a href={`${GITHUB_URL}#build`} className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg">
              build from source
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
