This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics

Umami tracks pageviews on the landing page and changelog, excluding URL fragments and respecting Do Not Track. The tracker is disabled in `pnpm dev`. Set `NEXT_PUBLIC_SITE_URL` to the production origin at build time to restrict tracking to its hostname and exclude deployment previews.

| Event | Trigger | Property |
| --- | --- | --- |
| `install_cta_click` | Download or Install link clicked | `placement`: `hero`, `nav`, `nav_menu` |
| `install_platform_selected` | Installer tab changed | `platform`: `unix` (macOS/Linux), `windows` |
| `install_command_copied` | Installer command successfully copied, not an installation | `platform`: `unix`, `windows` |
| `github_click` | GitHub repo link clicked | `placement`: `hero`, `nav`, `footer` |
| `releases_click` | GitHub Releases link clicked | `placement`: `changelog`, `footer` |
| `build_from_source_click` | Build from source link clicked | `placement`: `install` |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
