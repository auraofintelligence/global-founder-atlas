# Interop index: how the ecosystem fits together

A condensed thread for future recall, by Luke or another agent. The full
initiative spans ~120 repos under the GitHub org `auraofintelligence`. This
file is the map of how they connect, so nobody has to re-derive it.

**Read this first.** Nothing in this ecosystem is operational, partnered or
pitched yet. Most repos are descriptions ahead of code, on purpose (trust is
earned by working in the open). A live page means the plan is public, not that
a venture is trading. Hold all of it as vision. Hold threat cadences (a
cyclical solar micronova especially) as open questions, not asserted facts.

The living, structured version of the layer map is `data/ecosystem.json` in
this repo (rendered by `renderTerritory` in `assets/app.js` onto
`territory.html`). This file is the human-and-agent narrative around it.

## The stack (8 layers, live URLs, one-line roles)

Base URL for every repo below: `https://auraofintelligence.github.io/<repo>/`

**L0 Core engine**
- `` (root site) — Aura of Intelligence: the human-centred, privacy-first way to build software you own.
- `GAJRA-earth` — Global Association for Joyful Responsible Abundance on Earth: the alignment pitch and values compass. GAJRA is an org/lore, not a character.

**L1 Trust and compute anchor** (tenders lab + co-op stand up new island entities so money, skills and resilience stay local)
- `strange-but-true` — the sole trader; the community ledger every project card opens from.
- `ready-set-co-op-trust-hub` — the co-op, envisioned in a vacant high-street building at **9 Ballow Road, Dunwich** (ex cafe/wine bar), anchored by ONE shared ~70-GPU rack (order of A$4-6M). One rack, not many.
- `straddie-tenders-lab` — the mechanism to establish local entities and win local tenders (worked example: `windemere-skate-bowl-tender-workspace`).
- `ballow-road-sand-screen-hub` — evidence-maps the **10-12 Ballow Road** waterfront lot, envisioned for the Sandy Sports & Culture Club and the Dunwich tunnel entrance.
- Decentralised/edge compute (no single repo): one trusted community rack per council area at schools and wellness hubs, scaling by density; local models for municipal work and data sovereignty in the Sensorium L0-L1-L2-L3 stack; plus Folding@home-style volunteer compute.

**L2 Capital architecture** (proposals, not financial advice)
- `Queens_Venture` — 500 Queens Venture: patient capital.
- `moreton-bay-community-wealth-and-mutuals` — community sovereign wealth + mutuals.
- C-hours carve-out (no repo): mobilise volunteer economies without extraction; precursor to a universal adequate income.
- `aura-dementia` — the monetised-care side of the braided economy (NDIS / My Aged Care), correct in its place.

**L3 Subterranean build (Grain by Grain)**
- `grain-by-grain` — the spine (jetty to a city under the dunes).
- `dunwich-gumpi-ferry-terminal-open-data-lab` — the Gumpi ferry terminals + the Gumpi Loop park-and-ride (A$41M SEQ City Deal upgrade at Junner St; council pushes to amalgamate both terminals; locals prefer keeping the One Mile terminal).
- `straddie-makerspace-lab` — the workshop; skills and materials.
- `straddie-tip-loop-lab` — the tip loop; reclaim and recirculate materials.
- `straddie-capsule-surge-lab` — modular capsules for surge worker accommodation and compute.
- `sandworm-subterranean-systems` — tunnelling saturated sand; the honest frontier.
- `straddie-clean-energy-superpower` — the island energy arithmetic.

**L4 Cultural bridge**
- `quandamooka-film-festival` — brings local kids into the story.
- `i-C-infinity-music-universe` — the music universe.
- `ai-native-indie-distribution` — AI-native indie music production and distribution.
- `infinity-engine` — the music-to-visuals pipeline.

**L5 Fractal governance**
- `p4a-xyz-cinema` (P4A), `p4a-oceania-cinema` (P4O), `p4a-native-nations-cinema` (P4NN) — self-similar, peace-first governance.

**L6 Truth Engine**
- `web3-sensorium` — a fractal twin system with an L0-L1-L2-L3 stack the local models run inside; grows into a Truth Engine. NOTE: not published to GitHub Pages yet (repo/site 404), so it carries no public link on the map.

**L7 Travel and cosmos (runs through all)**
- `Australian-world-travel` — the travel strategy.
- `strange-but-true-cosmic-nexus` — the deep-time / existential why.
- `strange-but-true-travel-oracle` — the wayfinder for 256+ countries.

**This atlas + its domestic sibling**
- `global-founder-atlas` — this repo: the scored international funding atlas + the Territory map.
- `stradbroke-grants-lab` — the domestic sibling: Australian/QLD/council grants, plus `data/entities.json` (see below).

## How the pieces interoperate
- **Strange but True** holds the community ledger; every project card opens from it.
- **Tenders lab + co-op** are the vehicle that stands up the other island entities (makerspace, tip loop, capsule lab, sports club) so value stays on-island.
- **The rack (9 Ballow) + decentralised compute** feed the **Sensorium L0-L3 stack**, which hosts the local municipal models and data sovereignty.
- **Grain by Grain** is the physical spine; the **tip loop** feeds its materials; the **Gumpi Loop** solves the transport pinch; the **clean-energy** work powers it.
- **The cultural bridge** (film festival, music, Infinity Engine) brings people in; **fractal governance** (P4A/O/NN) is how decisions nest from a street to the world.
- **This atlas** funds the parts; **Stradbroke Grants Lab** covers the domestic half; **Right Place Right Time** carries the narrative pitch.

## Local-entity data sources (seed for who could be stood up or partnered)
- `stradbroke-grants-lab/data/entities.json` — 149 mapped island entities. Categories include: Artists and makers (44), Hospitality and retail (26), Community/safety/sport (17), Trades and services (16), Events (13), plus emergency services, health, First Nations bodies, rangers, transport, housing/aged care. Fields: name, category, location, status, grant_fit, source_group, town, place_area.
- `legal-memory-workbench` — jurisdiction, source and risk-preparation layer for anything touching legal obligations.
- `quandamooka-country-events-engine` — local events and organisations on Country.

## Conventions and house rules
- **Skin**: cinematic family (self-hosted Archivo + JetBrains Mono, deep-ink base, gold kintsugi seams, reveal-on-scroll) shared with `grain-by-grain` and `infinity-engine`.
- **Voice**: Australian English, no em dashes, plain-speaking with mind's-eye analogies for big numbers, honest tense (never state unbuilt as built, never invent deadlines/values).
- **Held private** (do not publish without Luke's go-ahead): the faith-community partnership (82 Claytons Rd / Anglican) and the specific C4 wellness-hub parcel. Kept at pattern level.
- **Deploy**: GitHub Pages from `master` root; `gh` keyring token; guard git with `GIT_TERMINAL_PROMPT=0` and a timeout. Serve locally with `npx serve <repo> -l <port>`.
- **Preview-browser caveat**: the in-app preview browser mis-handles screenshots, IntersectionObserver and query strings. Verify via `read_page` / `javascript_tool` DOM checks, not screenshots. A reveal safety net in `cinematic.js` guarantees content shows even if IO never fires.

## Known issues to fix
- `web3-sensorium` has no public GitHub Pages site (404) — link removed from the map; publish or point elsewhere when ready.
- `p4a-xyz-cinema` returns 301 (redirect) rather than 200 — works in-browser, but worth confirming the target.
- A full read-only refresh audit of all ~120 repos (stale links, old skins, dead callbacks) is queued as a separate task.

## This atlas's own data model (to extend it)
- `data/opportunities.json` — 49 funding programs. Each has the full field set + eight 0-5 sub-scores (`elig, value, align, early, infra, ip, reloc, cred`); the weighted 0-100 score is computed in `app.js` (`scoreOf`) with weights 20/15/20/10/10/10/5/10.
- `data/ecosystem.json` — the Territory map: `why`, `legend`, and 8 `layers` of `projects` (each with repo, stage, oneliner, themes, and matched opportunity ids).
- `data/categories.json`, `data/themes.json`, `data/strategy.json`, `data/networks.json` — the A-I buckets, project lenses, 90-day plan, and People/networks.
- Pages are data-driven via `body[data-page]`; add a program by editing `opportunities.json`, a project by editing `ecosystem.json`. No build step.
