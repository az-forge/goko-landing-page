import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Release = {
  version: string;
  date: string;
  groups: { title: string; items: string[] }[];
};

// content/CHANGELOG.md is a copy of the goko repo's CHANGELOG.md (`pnpm sync:changelog`).
export function getReleases(): Release[] {
  const lines = readFileSync(join(process.cwd(), "content/CHANGELOG.md"), "utf8").split(/\r?\n/);
  const releases: Release[] = [];
  let items: string[] | null = null;

  for (const line of lines) {
    const version = line.match(/^## \[(.+?)\](?: - (\d{4}-\d{2}-\d{2}))?/);
    if (version) {
      releases.push({ version: version[1], date: version[2] ?? "", groups: [] });
      items = null;
      continue;
    }
    const release = releases.at(-1);
    if (!release) continue;
    const group = line.match(/^### (.+)/);
    if (group) {
      items = [];
      release.groups.push({ title: group[1], items });
    } else if (items && line.startsWith("- ")) {
      items.push(line.slice(2));
    } else if (items?.length && line.trim()) {
      items[items.length - 1] += ` ${line.trim()}`;
    }
  }
  return releases.filter((r) => r.groups.some((g) => g.items.length));
}
