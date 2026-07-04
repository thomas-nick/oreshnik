# Oreshnik

Personal blog and portfolio on the [Brutal](https://brutal.elian.codes/) Astro theme, edited with [Sveltia CMS](https://sveltia.com/), deployed to [mahoot.xyz](https://mahoot.xyz) via GitHub Pages.

## Stack

- Astro 6 + Tailwind CSS 4
- Brutal / neobrutalist UI ([eliancodes/brutal](https://github.com/eliancodes/brutal))
- Sveltia CMS at `/admin`
- GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:4321

OAuth uses the same Cloudflare Worker as Siam History (`sveltia-cms-auth.nthomas1999.workers.dev`). Ensure your GitHub OAuth app callback URL matches the worker.

## Deploy

Push to `main` builds and deploys to **GitHub Pages** at [mahoot.xyz](https://mahoot.xyz).

1. Repo **Settings → Pages → Build and deployment**: source must be **GitHub Actions**.
2. Point **mahoot.xyz** DNS at GitHub Pages (apex `A` records or `www` `CNAME` to `thomas-nick.github.io`). See [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. In **Settings → Pages**, set the custom domain to `mahoot.xyz` and enable HTTPS.

## Content

Blog posts live in `src/data/blog/*.md`. Cover images from the CMS go to `public/uploads/`.

Draft posts (`draft: true`) are hidden from the site until published.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
