# cwpa.dev

Portfolio for Adam Cooper. Same kind of page as a single-scrolling personal site: intro, a clock, about, a timeline, skills, projects, and a contact row. Built as plain HTML so it can sit on Cloudflare Pages with no build step.

## Layout

```
index.html                 home
projects/index.html        work index
projects/soar.html         SOAR write-up (edit this as the project settles)
projects/triagerpg.html    TriageRPG
projects/ai-siem.html      Portsmouth final-year project
404.html
css/main.css               shared type, colour, nav, footer, project frame
css/home.css               home only
css/projects.css           work index only
css/soar.css               SOAR page only
css/triagerpg.css          TriageRPG page only
css/ai-siem.css            AI SIEM page only
css/404.css                missing page only
js/site.js                 theme, UK clock, scroll, reveal, accordion
assets/                    avatar and icon
robots.txt                 crawler hint
sitemap.xml                page list for cwpa.dev
```

The reference site keeps its CSS and script inside one HTML file. This split matches that behaviour, with a master stylesheet and a stylesheet for each page so a local change does not leak.

`js/site.js` is the behaviour file: colour theme, the clock, scroll progress, reveal-on-scroll, the experience accordion, and the count-up used if you add `data-count` to a stat.

## Edit your details

Words live in the HTML. Search for your name, the email, or a sentence and replace it.

| What | Where |
| --- | --- |
| Name, intro, about, timeline, skills, contact | `index.html` |
| SOAR scope, tools, and results | `projects/soar.html` |
| Clock timezone | the `data-timezone` attribute on `#local-clock` in `index.html` |
| Theme, motion | `js/site.js` |
| Colours and type used everywhere | the `:root` block in `css/main.css` |
| Something that should only change on one page | that page's CSS file |

The SOAR page is deliberately high level. The project is in progress and not in a public repo yet, so the page does not invent a tool list or results. Replace the sentences in `projects/soar.html` when you want it to be specific. Leave lab detail off the page.

TriageRPG and the AI SIEM page are written from the public HomeLab and University repositories.

## Run it locally

```bash
python3 -m http.server 44721 --bind 0.0.0.0
```

Or `npm run dev`. Open `http://127.0.0.1:44721`.

Paths start with `/`, so open it through this server. Opening the HTML file directly will not load the CSS.

## Cloudflare Workers & Pages

The site is already connected through Workers Builds. The workers.dev hostname is [cwpa-folio.cwpa.workers.dev](https://cwpa-folio.cwpa.workers.dev). `cwpa.dev` stays unstyled until the routes in `wrangler.toml` are deployed: the homepage can be cached from the Worker while CSS, JavaScript, and other paths still fall through to an origin Cloudflare cannot reach (HTTP 522).

Cloudflare's git list only includes GitHub and GitLab. The Cursor copy of this repository does not appear in that list. The same files are on GitHub at [sobraxus/cwpa-folio](https://github.com/sobraxus/cwpa-folio).

1. In the Cloudflare dashboard, open **Workers & Pages**.
2. Select **Create application**, then **Pages**, then **Connect to Git**.
3. Choose **GitHub** and the **sobraxus** account.
4. Select **cwpa-folio**. If it is missing, GitHub is only sharing some repositories with Cloudflare. Open [GitHub installations](https://github.com/settings/installations), choose **Cloudflare Workers & Pages**, and add `cwpa-folio` under repository access. Return to Cloudflare and refresh the list.
5. Production branch: `main`.
6. Framework preset: **None** (classic Pages), or connect as a **Worker** with Git builds.

### If Cloudflare requires deploy and preview commands (Workers Builds)

That flow uses Wrangler, not an empty build step alone. This repo includes `wrangler.toml` for a static assets-only Worker:

| Setting | Value |
| --- | --- |
| Build command | leave empty, or `exit 0` |
| **Deploy command** | `npx wrangler deploy` |
| **Preview command** | `npx wrangler preview` (not `deploy`) |

Set the Worker **name** in the dashboard to match `name` in `wrangler.toml` (`cwpa-folio`), or rename the field in `wrangler.toml` to match the Worker you created.

`wrangler.toml` publishes routes for `cwpa.dev/*` and `www.cwpa.dev/*` on the next `npx wrangler deploy`. That is what makes stylesheets and scripts load on the custom domain.

If that deploy fails while adding the routes, add them in the dashboard instead: Worker **cwpa-folio** → **Settings** → **Domains & Routes** → **Add** → **Custom domain** `cwpa.dev`, then the same for `www.cwpa.dev`.

A later push to `main` on that GitHub repository publishes the site. `_headers` sets a few basic response headers.

If `cwpa.dev` email is not routed yet, the contact address on the site is `sobraxus@gmail.com`. Swap it in `index.html` when you want a `cwpa.dev` mailbox instead.
