// Set NEXT_PUBLIC_SITE_URL to the production origin before deploying.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "Goko";
export const SITE_TITLE = "Goko: run all your coding agents in one window";
export const SITE_DESCRIPTION =
  "Goko is a free, open source desktop app for macOS, Linux and Windows that runs Claude Code, Codex and other CLI coding agents side by side, grouped by project.";

export const GITHUB_URL = "https://github.com/asta-nguyen/goko";
export const RELEASES_URL = `${GITHUB_URL}/releases/latest`;

export const INSTALL = {
  unix: `curl -fsSL ${GITHUB_URL}/releases/latest/download/install.sh | sh`,
  windows: `irm ${GITHUB_URL}/releases/latest/download/install.ps1 | iex`,
};

export const AGENTS = ["Claude Code", "Codex", "OpenCode", "Devin", "Antigravity", "Shell"];

export const FAQ = [
  {
    q: "What is Goko?",
    a: "Goko is a native desktop app for running command-line coding agents such as Claude Code and Codex. It groups their terminal sessions by project and adds an editor, diffs and Git history in the same window.",
  },
  {
    q: "Which coding agents does Goko support?",
    a: "Goko has one-click launchers for Claude Code, Codex, OpenCode, Devin and Antigravity, plus a plain shell. Each agent runs as its own CLI in a real terminal, so you keep the tools and accounts you already use.",
  },
  {
    q: "Is Goko free and open source?",
    a: "Yes. Goko is free to use and its source code is on GitHub under the Apache 2.0 license.",
  },
  {
    q: "Which platforms does Goko run on?",
    a: "Goko runs on macOS (Apple Silicon), Linux (x86_64 and aarch64) and Windows 10 1809 or later (x86_64). Intel Macs can build it from source.",
  },
  {
    q: "What happens to my agents when I close Goko?",
    a: "They keep running. A separate daemon called gokod owns every terminal and agent process, so closing the window or quitting the app leaves sessions alive, and the next launch attaches to them again.",
  },
  {
    q: "How do I install and update Goko?",
    a: "Run the one-line install command for your platform. Running it again updates Goko, and Settings, Updates shows when a newer release is available and what changed.",
  },
];
