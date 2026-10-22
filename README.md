# cwpa.dev

Portfolio for Adam Cooper. Same kind of page as a single-scrolling personal site: intro, a clock, about, a timeline, skills, projects, and a contact row. Built as plain HTML so it can sit on Cloudflare Pages with no build step.

The full site files are in this repository. Cloudflare Workers & Pages only lists a project after you create one, and its git picker only shows GitHub and GitLab repositories.

## Cloudflare

1. Workers & Pages → Create application → Pages → Connect to Git.
2. GitHub, account sobraxus, repository cwpa-folio.
3. If the repo is missing: https://github.com/settings/installations → Cloudflare Workers & Pages → add cwpa-folio.
4. Production branch main. Framework preset None. Build command empty. Output directory /.
5. Custom domain: cwpa.dev.
