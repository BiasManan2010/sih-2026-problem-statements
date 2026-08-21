# SIH 2026 Problem Statements

Structured, searchable archive of all **226 problem statements** from
[Smart India Hackathon 2026](https://www.sih.gov.in/sih2026PS) — every statement
as clean markdown, JSON and CSV, plus a fast, SEO-friendly web app to browse,
search and shortlist them.

## Contents

| Path | What it is |
|---|---|
| [`ps_2026/`](ps_2026/) | 226 markdown files (`SIH26001.md` … `SIH26226.md`) + index README |
| [`data/sih2026_ps.json`](data/sih2026_ps.json) | Full structured export (all fields incl. descriptions) |
| [`data/sih2026_ps.csv`](data/sih2026_ps.csv) | Same data, spreadsheet-friendly |
| [`scripts/scrape_sih.py`](scripts/scrape_sih.py) | Reproducible scraper + validator |
| [`web/`](web/) | Next.js + shadcn/ui web app (search, filters, shortlist) |

## Web app

Fast, fully static, SEO-optimized browsing experience:

- **Fuzzy search** across title, description, organization, theme and PS number
  (⌘K / Ctrl+K command palette, `/` focuses search)
- **Filters** by theme, category (Software/Hardware), organization, dataset availability
- **Detail pages** per PS with deadline countdown, similar statements,
  copy/share/open-in-chat and private notes
- **Shortlist** (localStorage) with CSV/Markdown export — pick your team's candidates
- Dark mode, keyboard navigation, mobile-first, fully accessible

### Local development

```bash
cd web
pnpm install        # or npm install
pnpm dev            # http://localhost:3000
pnpm build          # production build (fully static, 234 prerendered pages)
pnpm lint
```

## Dataset stats

| Metric | Value |
|---|---|
| Total problem statements | 226 |
| Software | 172 |
| Hardware | 54 |
| Themes | 18 |
| Source | [sih.gov.in/sih2026PS](https://sih.gov.in/sih2026PS) |

## Automated daily refresh

A [GitHub Actions workflow](.github/workflows/refresh-data.yml) re-scrapes
sih.gov.in **every 24 hours** (04:00 IST) and automatically:

1. Updates `ps_2026/*.md`, `data/sih2026_ps.json`, `data/sih2026_ps.csv` and
   `web/src/data/ps.json` with the latest deadlines, submitted-idea counts,
   dataset links and any new/changed problem statements
2. Validates the result (record count sanity check + field validation) — if the
   scrape looks incomplete, nothing is committed
3. Commits and pushes only when the data actually changed (the scraper is
   byte-deterministic for unchanged records, so there are no noisy commits)

The workflow can also be triggered manually from the Actions tab.

## Regenerating the data

```bash
python3 scripts/scrape_sih.py             # fetch live + regenerate everything
python3 scripts/scrape_sih.py --validate  # validate existing artifacts
python3 scripts/scrape_sih.py --cache FILE.html  # parse a cached copy offline
```

Requires `beautifulsoup4` + `lxml`.

## License & attribution

- **Dataset** (problem statement content): [CC BY 4.0](LICENSE) — content is
  published by Smart India Hackathon / Innovation Cell, Government of India.
  Attribution: "Source: Smart India Hackathon, sih.gov.in".
- **Code** (scraper, web app): [MIT](LICENSE-CODE).

> **Note:** Deadlines and submitted-idea counts are point-in-time snapshots and
> may change on sih.gov.in. Always verify on the official portal before
> submitting.

## Contributing

Fixes to data formatting, translations, or annotations? See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

This is an unofficial, community-maintained archive. It is not affiliated with,
endorsed by, or sponsored by Smart India Hackathon or the Government of India.
