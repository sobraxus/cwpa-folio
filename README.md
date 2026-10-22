# cwpa.dev

Portfolio for Adam Cooper. One scrolling page: intro, about, portfolio, focus, skills, experience, and contact. Plain HTML so Cloudflare Workers can serve the folder with no build step.

## Layout

```
index.html       home
404.html         missing page
css/main.css     type, colour, layout
js/site.js       menu, portfolio cards, skill bars, year
assets/          portrait and icon
robots.txt
sitemap.xml
_headers         response headers
wrangler.toml    Workers static assets + cwpa.dev routes
```

Words live in `index.html`. Colours and type live in the `:root` block in `css/main.css`.

## Run it locally

```bash
python -m http.server 44721 --bind 0.0.0.0
```

Or `npm run dev`. Open `http://127.0.0.1:44721`.

Paths start with `/`, so open it through this server. Opening the HTML file directly will not load the CSS.

## Cloudflare Workers

The Worker name is `cwpa-folio`. The workers.dev hostname is [cwpa-folio.cwpa.workers.dev](https://cwpa-folio.cwpa.workers.dev). Git is on [sobraxus/cwpa-folio](https://github.com/sobraxus/cwpa-folio).

| Setting | Value |
| --- | --- |
| Build command | leave empty, or `exit 0` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Production branch | `main` |

`wrangler.toml` publishes routes for `cwpa.dev/*` and `www.cwpa.dev/*`. That is what makes stylesheets and scripts load on the custom domain. If a deploy fails while adding those routes, add them in the dashboard: Worker **cwpa-folio** → **Settings** → **Domains & Routes**.

A later push to `main` publishes the site. `_headers` sets a few basic response headers.

If `cwpa.dev` email is not routed yet, the contact address on the site is `sobraxus@gmail.com`.
