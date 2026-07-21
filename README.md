# Global Founder Atlas

A travelling Australian founder's atlas of verified, non-dilutive-first international funding, startup visas, residencies, research placements and paid pilots. Built for a multidisciplinary creator based on North Stradbroke Island / Minjerribah who may stay in Australia, establish an entity abroad, partner locally, license IP, run a pilot, or base part of the year overseas where the opportunity justifies it.

A Luke x Claude build.

## What it does

- Holds a curated set of genuinely-real programs (countries, cities, free zones, accelerators, sovereign funds, innovation districts, universities and residencies), not a graveyard of expired grants.
- Captures the full field set for each opportunity: dates, eligibility, funding type and amount, equity, IP conditions, benefits, difficulty, project fit, risks and a confidence rating.
- Scores and ranks every opportunity with a weighted method tuned to an Australian founder's priorities.
- Surfaces the reusable research brief so the search can be re-run and extended, then folded back into the same structure.
- Sets out a practical 90-day search-and-apply strategy.

## Honesty stance

This is a first pass to author knowledge (to January 2026). It does not invent deadlines, eligibility or funding values. Where an exact date is not confirmed, the entry says "verify at source" and carries a confidence rating. Verify every live date, amount and eligibility rule at the official program source before applying. The next step is a live-date refresh (run the brief in `brief.html` through a web-research pass and update the data file).

## Pages

- `index.html` - overview, stats, category map and top picks
- `opportunities.html` - the full searchable, filterable, scored atlas
- `shortlist.html` - the executive top 15, with best project, framing and next step
- `categories.html` - opportunities sorted into the A to I buckets
- `relocation.html` - startup relocation and foreign-founder packages (category D)
- `themes.html` - best opportunities mapped to each project area
- `minjerribah.html` - programs that could fund an on-island pilot, approached community-led
- `strategy.html` - the weighted scoring method and the 90-day plan
- `brief.html` - the reusable research prompt and the per-opportunity field spec

## Data

All content is data-driven. Edit these files and every page updates itself:

- `data/opportunities.json` - the master list, with the full field set and eight 0 to 5 sub-scores per opportunity
- `data/categories.json` - the A to I category definitions
- `data/themes.json` - project-area labels and the by-project and Minjerribah lenses
- `data/strategy.json` - weighting, 90-day phases, reusable kit and the five-best buckets

The weighted score is computed in `assets/app.js` from the sub-scores using these weights: eligibility for an Australian 20, non-dilutive value 15, project alignment 20, early-stage openness 10, infrastructure and partnership 10, IP terms 10, low relocation burden 5, credible application 10.

## Local preview

From this folder:

```powershell
python -m http.server 4190
```

Then open `http://localhost:4190/`. A local server is needed because the pages fetch JSON (opening the files directly will show a load error).

## Licence

Strange But True Public Source Licence. See `LICENCE.md`. Non-commercial use is free with credit; commercial and corporate rights stay with Luke Nathan Hayes.
