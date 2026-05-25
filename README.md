# Oreshnik

Personal blog and portfolio on the [Brutal](https://brutal.elian.codes/) Astro theme, edited with [Sveltia CMS](https://sveltia.com/), deployed to [mahoot.xyz](https://mahoot.xyz).

## Stack

- Astro 6 + Tailwind CSS 4
- Brutal / neobrutalist UI ([eliancodes/brutal](https://github.com/eliancodes/brutal))
- Sveltia CMS at `/admin`
- GitHub Actions → Hostinger static deploy

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:4321

## CMS

1. Go to https://mahoot.xyz/admin/ (or `/admin/` locally after build)
2. Log in with GitHub — authorize the **oreshnik** repo
3. Edit posts under **Blog posts**

OAuth uses the same Cloudflare Worker as Siam History (`sveltia-cms-auth.nthomas1999.workers.dev`). Ensure your GitHub OAuth app callback URL matches the worker.

## Deploy

Push to `main`. GitHub Actions builds and deploys to Hostinger.

**Repo secrets** (Settings → Secrets → Actions):

| Secret | Value |
|--------|--------|
| `HOSTINGER_API_TOKEN` | Hostinger API token |
| `HOSTINGER_DOMAIN` | `mahoot.xyz` |

## Content

Blog posts live in `src/data/blog/*.md`. Cover images from the CMS go to `public/uploads/`.

Draft posts (`draft: true`) are hidden from the site until published.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
