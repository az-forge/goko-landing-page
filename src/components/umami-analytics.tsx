"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data: Record<string, string>) => Promise<void>;
    };
  }
}

export async function trackUmamiEvent(event: string, data: Record<string, string>) {
  try {
    await window.umami?.track(event, data);
  } catch {
    // Analytics must not affect the interaction when tracking fails.
  }
}

export function UmamiAnalytics({ domain }: { domain?: string }) {
  useEffect(() => {
    // Umami's built-in anchor tracking cancels navigation while sending the event.
    function trackLink(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-analytics-event]");
      const name = link?.dataset.analyticsEvent;
      const placement = link?.dataset.analyticsPlacement;
      if (name && placement) void trackUmamiEvent(name, { placement });
    }

    document.addEventListener("click", trackLink, true);
    document.addEventListener("auxclick", trackLink, true);
    return () => {
      document.removeEventListener("click", trackLink, true);
      document.removeEventListener("auxclick", trackLink, true);
    };
  }, []);

  return (
    <Script
      src="https://umami.n2q.site/script.js"
      strategy="afterInteractive"
      data-website-id="b5fd2099-0dfa-4c2f-9925-e1ceb6b82cb6"
      data-domains={domain}
      data-do-not-track="true"
      data-exclude-hash="true"
    />
  );
}
