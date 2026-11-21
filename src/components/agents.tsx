import { TerminalWindowIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

// Logos are from @lobehub/icons-static-svg (MIT); each mark belongs to its owner.
const AGENTS = [
  { name: "Claude Code", cmd: "claude", logo: "/agents/claude-code.svg" },
  { name: "Codex", cmd: "codex", logo: "/agents/codex.svg" },
  { name: "OpenCode", cmd: "opencode", logo: "/agents/opencode.svg" },
  { name: "Devin", cmd: "devin", logo: "/agents/devin.svg" },
  { name: "Antigravity", cmd: "agy", logo: "/agents/antigravity.svg" },
  { name: "Shell", cmd: "zsh", logo: null },
];

export function Agents() {
  return (
    <section aria-labelledby="agents-heading" className="border-y border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <h2 id="agents-heading" className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Goko starts any of these agents in one click, or your own shell.
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {AGENTS.map((agent) => (
            <li
              key={agent.name}
              className="group flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 transition-colors sm:gap-3.5 sm:p-4 duration-300 hover:border-fg/25 hover:bg-raised"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bg sm:size-12 transition-transform duration-300 group-hover:scale-105">
                {agent.logo ? (
                  <Image src={agent.logo} alt="" width={28} height={28} unoptimized />
                ) : (
                  <TerminalWindowIcon size={28} className="text-fg" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium sm:text-base">{agent.name}</span>
                <span className="block truncate font-mono text-xs text-muted">{agent.cmd}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
