import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const alt = "Goko: all your coding agents in one window";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#141614",
          backgroundImage: "radial-gradient(circle at 85% 20%, rgba(244,119,53,0.28), transparent 55%)",
          color: "#F4F1E9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 600 }}>
          <svg width="72" height="72" viewBox="0 0 512 512">
            <rect x="32" y="32" width="448" height="448" rx="100" fill="#202220" />
            <path
              fill="#F4F1E9"
              d="M326 128H236C170 128 128 170 128 236V304C128 370 170 400 226 400H270C291 400 304 386 304 366C304 346 290 332 270 332H232C208 332 196 320 196 296V236C196 208 212 196 240 196H326C350 196 364 182 364 162C364 142 350 128 326 128Z"
            />
            <path
              fill="#F47735"
              d="M312 248H362C384 248 396 262 396 284V334C396 376 368 400 330 400H306C321 384 328 365 328 344V316H312C294 316 284 304 284 282C284 260 294 248 312 248Z"
            />
          </svg>
          Goko
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>All your agents.</div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 1.1, color: "#F47735" }}>
            One window.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, lineHeight: 1.35, color: "#A29F96", maxWidth: 940 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
