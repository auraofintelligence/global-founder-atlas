/* Global Founder Atlas - shared render engine.
   Data-driven, no build step. One script drives every page via body[data-page]. */

const NAV = [
  { href: "territory.html", label: "Territory" },
  { href: "opportunities.html", label: "Atlas" },
  { href: "shortlist.html", label: "Shortlist" },
  { label: "Explore", items: [["categories.html", "Categories"], ["relocation.html", "Relocation"], ["themes.html", "By Project"], ["minjerribah.html", "Minjerribah"], ["people.html", "People"]] },
  { label: "Guide", items: [["strategy.html", "90-Day Plan"], ["brief.html", "Research Brief"], ["archive.html", "Round archive"]] },
];

function navItemsHtml() {
  return NAV.map((n) => {
    if (n.href) return `<a href="${n.href}">${n.label}</a>`;
    return `<details class="nav-menu"><summary>${n.label}</summary><div class="nav-drop">${n.items.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</div></details>`;
  }).join("");
}

const WEIGHTS = { elig: 20, value: 15, align: 20, early: 10, infra: 10, ip: 10, reloc: 5, cred: 10 };

const navHtml = `
  <a class="brand" href="index.html" aria-label="Global Founder Atlas home">
    <span class="brand-mark" aria-hidden="true"></span>
    <span class="brand-text"><strong>Global Founder Atlas</strong><span>Non-dilutive treasure worldwide</span></span>
  </a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="site-nav" id="site-nav" aria-label="Primary">
    ${navItemsHtml()}
  </nav>`;

const footerHtml = `
  <div>
    <p>Global Founder Atlas. A travelling Australian founder's map of non-dilutive-first international funding, visas, residencies and pilots.</p>
    <p id="refreshSummary">Source checks are dated on each record. Unverified fields remain research leads; check the official call before applying. <a href="archive.html">Closed rounds and paused programmes</a>.</p>
    <p><a href="LICENCE.md">Strange But True Public Source Licence</a> &#183; Luke Hayes &#215; Claude, Minjerribah.</p>
  </div>
  <nav class="footer-links" aria-label="Ecosystem">
    <a href="brief.html">Research brief</a>
    <a href="strategy.html">90-day plan</a>
    <a href="https://auraofintelligence.github.io/" rel="noopener">Aura of Intelligence</a>
    <a href="https://auraofintelligence.github.io/stradbroke-grants-lab/" rel="noopener">Stradbroke Grants Lab</a>
    <a href="https://auraofintelligence.github.io/grain-by-grain/" rel="noopener">Grain by Grain</a>
  </nav>`;

function mountChrome() {
  document.querySelectorAll(".site-header").forEach((header) => {
    if (!header.children.length) header.innerHTML = navHtml;
  });
  document.querySelectorAll(".site-footer").forEach((footer) => {
    if (!footer.children.length) footer.innerHTML = footerHtml;
  });
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }
  if (window.gfaMarkNav) window.gfaMarkNav();
}

function refreshCinematic() {
  if (window.gfaScanReveals) window.gfaScanReveals();
  if (window.gfaScanSeams) window.gfaScanSeams();
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function isActive(opp) { return opp.status_class !== "closed"; }
function isShortlistCandidate(opp) {
  return isActive(opp) && opp.status_class !== "unknown"
    && opp.verification?.result === "partial";
}
async function loadOpportunities() {
  return (await loadJson("data/opportunities.json")).filter(isActive);
}

async function renderRefreshSummary() {
  const data = await loadJson("data/funding-refresh.json");
  const target = document.querySelector("#refreshSummary");
  if (target) target.innerHTML = `Funding source check: <time datetime="${esc(data.checked_on)}">${esc(data.checked_on)}</time>. ${(data.latest_new_ids || data.new_ids).length} new records in this pass; ${(data.latest_archived_round_ids || data.archived_round_ids).length} newly archived intakes (${data.archived_round_ids.length} total). Unverified terms are labelled. <a href="archive.html">Round archive</a> · <a href="docs/FUNDING-REFRESH-${esc(data.checked_on)}.md">Source audit and remaining checks</a>.`;
}

function scoreOf(opp) {
  const s = opp.scores || {};
  let total = 0;
  for (const key in WEIGHTS) total += (Number(s[key]) || 0) * WEIGHTS[key];
  return Math.round(total / 5); // scores are 0-5, weights sum to 100 -> 0-100
}

const STATUS_LABEL = { open: "Open / application route", soon: "Opening soon", recurring: "Recurring / check round", closed: "Closed / paused", unknown: "Window unverified" };

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function auBadge(opp) {
  const yes = /^yes/i.test(opp.au_eligible || "")
    && (opp.verification?.confirmed_fields || []).includes("au_eligible");
  return `<span class="badge ${yes ? "au-yes" : "au-check"}">${yes ? "AU eligible" : "AU: verify"}</span>`;
}

function detailRow(label, value, muted) {
  if (!value) return "";
  return `<dt>${esc(label)}</dt><dd class="${muted ? "muted" : ""}">${esc(value)}</dd>`;
}

function oppCard(opp, options = {}) {
  const verification = opp.verification;
  const labels = { status: "application status", opens: "opening date", closes: "closing date", eligibility: "applicant requirements", au_eligible: "Australian access", requires_local: "local presence", stage: "project stage", funding_amount: "funding amount", support_type: "support type", equity: "equity", ip_conditions: "IP conditions", matching_required: "co-funding", other_benefits: "other benefits", key_documents: "application documents" };
  const row = (label, key, muted) => detailRow(
    label + (verification?.unverified_fields.includes(key) ? " (unverified)" : ""), opp[key], muted);
  const evidence = verification ? `<details class="opp-details"><summary>Source check: ${esc(verification.checked_on)}</summary><p>${esc(verification.notes)}</p><p>Confirmed in this check: ${esc(verification.confirmed_fields.map((k) => labels[k] || k).join(", ") || "source access only")}. Other terms below are marked unverified.</p>${verification.sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Source and current conditions</a>`).join(" · ")}</details>` : "";
  const score = scoreOf(opp);
  const cat = opp.category ? `<span class="badge cat">Cat ${opp.category}</span>` : "";
  const status = `<span class="badge status-${opp.status_class}">${STATUS_LABEL[opp.status_class] || "Status"}</span>`;
  const themes = (opp.themes || []).slice(0, 4).map((t) => `<span class="chip">${esc(t)}</span>`).join("");
  const conf = opp.confidence ? `<span class="chip gold">Confidence: ${esc(opp.confidence)}</span>` : "";
  const rank = options.rank ? `<span class="rank-num">#${options.rank}</span>` : "";
  const pitch = options.showPitch && opp.pitch ? `
    <div class="pitch-box">
      <p><strong>Best to present:</strong> ${esc(opp.pitch.project)}</p>
      <p><strong>Framing:</strong> ${esc(opp.pitch.framing)}</p>
      <p><strong>Next step:</strong> ${esc(opp.pitch.next_step)}</p>
    </div>` : "";
  const details = `
    <details class="opp-details">
      <summary>Full opportunity detail</summary>
      <dl class="detail-grid">
        ${detailRow("Verification date", verification?.checked_on)}
        ${detailRow("Organisation", opp.org)}
        ${detailRow("Location", opp.city_region)}
        ${row("Status", "status")}
        ${row("Opens", "opens")}
        ${row("Closes", "closes")}
        ${detailRow("Recurring", opp.recurring ? "Yes" : "No")}
        ${row("Eligibility", "eligibility")}
        ${row("Australians eligible", "au_eligible")}
        ${row("Local entity / relocation", "requires_local")}
        ${row("Stage accepted", "stage")}
        ${row("Funding amount", "funding_amount")}
        ${detailRow("Currency", opp.funding_currency)}
        ${row("Support type", "support_type")}
        ${row("Equity requested", "equity")}
        ${row("Other benefits", "other_benefits")}
        ${row("IP conditions", "ip_conditions")}
        ${row("Matching / co-funding", "matching_required")}
        ${row("Key documents", "key_documents")}
        ${detailRow("Difficulty", opp.difficulty)}
        ${detailRow("Best project match", opp.project_match)}
        ${detailRow("Why relevant", opp.why_relevant)}
        ${detailRow("Risks and trade-offs", opp.risks, true)}
        ${detailRow("Verify", opp.verify, true)}
      </dl>
    </details>`;
  const actions = opp.source_url
    ? `<div class="card-actions"><a href="${esc(opp.source_url)}" target="_blank" rel="noopener noreferrer">Official source</a></div>`
    : "";
  return `
    <article class="data-card opp-card" data-id="${esc(opp.id)}">
      <div class="opp-badges">${rank}${cat}${status}${auBadge(opp)}</div>
      <div class="opp-top">
        <div>
          <h3>${esc(opp.name)}</h3>
          <p class="opp-place">${esc(opp.country)}</p>
        </div>
        <div class="score" title="Weighted score out of 100">
          <span class="score-num">${score}</span>
          <span class="score-label">score</span>
          <span class="score-bar"><span style="width:${score}%"></span></span>
        </div>
      </div>
      <p class="opp-summary">${esc(opp.why_relevant)}</p>
      <div class="chips">${conf}${themes}</div>
      ${pitch}
      ${evidence}
      ${details}
      ${actions}
    </article>`;
}

function byScoreDesc(a, b) { return scoreOf(b) - scoreOf(a); }

/* ---------- pages ---------- */

async function renderHome() {
  const [opps, cats] = await Promise.all([loadOpportunities(), loadJson("data/categories.json")]);
  const stats = document.querySelector("#homeStats");
  if (stats) {
    stats.innerHTML = [
      [opps.length, "programme pathways"],
      [opps.filter((o) => /^yes/i.test(o.au_eligible) && o.verification.confirmed_fields.includes("au_eligible")).length, "AU access confirmed"],
      [opps.filter((o) => o.status_class === "open").length, "application routes open"],
      ["9", "categories A to I"],
    ].map(([big, small]) => `<div class="stat-card"><div class="big">${big}</div><div class="small">${small}</div></div>`).join("");
  }
  const catGrid = document.querySelector("#homeCategories");
  if (catGrid) {
    catGrid.innerHTML = cats.map((c) => `
      <a class="link-card" href="categories.html#cat-${c.letter}">
        <p class="tag">Category ${c.letter}</p>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.blurb)}</p>
      </a>`).join("");
  }
  const topGrid = document.querySelector("#homeTop");
  if (topGrid) {
    topGrid.innerHTML = opps.filter(isShortlistCandidate).sort(byScoreDesc).slice(0, 3)
      .map((o, i) => oppCard(o, { rank: i + 1 })).join("");
  }
}

async function renderOpportunities() {
  const data = await loadOpportunities();
  const grid = document.querySelector("#oppGrid");
  const count = document.querySelector("#resultCount");
  const search = document.querySelector("#oppSearch");
  const catSel = document.querySelector("#catFilter");
  const themeSel = document.querySelector("#themeFilter");
  const state = { q: "", cat: "All", theme: "All", sort: "score" };

  const themes = [...new Set(data.flatMap((o) => o.themes || []))].sort();
  if (themeSel) themeSel.insertAdjacentHTML("beforeend", themes.map((t) => `<option value="${t}">${t}</option>`).join(""));

  const draw = () => {
    const q = state.q.trim().toLowerCase();
    let items = data.filter((o) => {
      const catMatch = state.cat === "All"
        || o.category === state.cat
        || (state.cat === "open" && o.status_class === "open")
        || (state.cat === "recurring" && o.status_class === "recurring")
        || (state.cat === "unknown" && o.status_class === "unknown")
        || (state.cat === "soon" && o.status_class === "soon");
      const themeMatch = state.theme === "All" || (o.themes || []).includes(state.theme);
      const hay = `${o.name} ${o.org} ${o.country} ${o.why_relevant} ${o.project_match} ${(o.themes || []).join(" ")}`.toLowerCase();
      return catMatch && themeMatch && (!q || hay.includes(q));
    });
    items = items.sort(state.sort === "score" ? byScoreDesc : (a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = items.length ? items.map((o) => oppCard(o)).join("") : `<p class="load-error">No opportunities match those filters. Loosen the search.</p>`;
    if (count) count.textContent = `${items.length} of ${data.length} opportunities`;
  };

  if (search) search.addEventListener("input", () => { state.q = search.value; draw(); });
  if (catSel) catSel.addEventListener("change", () => { state.cat = catSel.value; draw(); });
  if (themeSel) themeSel.addEventListener("change", () => { state.theme = themeSel.value; draw(); });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.sort = btn.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((b) => b.classList.toggle("is-active", b === btn));
      draw();
    });
  });
  draw();

  const focus = new URLSearchParams(window.location.search).get("focus");
  if (focus) {
    const el = grid.querySelector(`[data-id="${focus}"]`);
    if (el) {
      el.classList.add("is-highlight");
      const details = el.querySelector("details");
      if (details) details.open = true;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

async function renderShortlist() {
  const data = await loadOpportunities();
  const grid = document.querySelector("#shortlistGrid");
  const top = data.filter(isShortlistCandidate).sort(byScoreDesc).slice(0, 15);
  grid.innerHTML = top.map((o, i) => oppCard(o, { rank: i + 1, showPitch: true })).join("");
}

async function renderArchive() {
  const [archive, programmes] = await Promise.all([
    loadJson("data/opportunity-archive.json"), loadJson("data/opportunities.json"),
  ]);
  const rounds = document.querySelector("#archivedRounds");
  if (rounds) rounds.innerHTML = archive.rounds.map((round) => `
    <section class="section compact" id="${esc(round.id)}">
      <div class="section-heading"><h2>${esc(round.round_name)}</h2>
        <p>Closed: ${esc(round.closed_on)}. Archived: ${esc(round.archived_on)}.</p>
        <p>${esc(round.reason)}</p>
        <p>Descriptions and scores below are historical. They do not describe a current offer. The complete original record is retained in the archive data.</p>
      </div>
      ${oppCard({ ...round.record, confidence: "Historical snapshot", status_class: "closed", status: round.reason,
        why_relevant: round.reason, opens: round.round_name, closes: round.closed_on,
        source_url: round.sources[0].url })}
      <p><a href="data/opportunity-archive.json">Full original record and closure evidence</a></p>
    </section>`).join("");
  const paused = document.querySelector("#pausedProgrammes");
  if (paused) paused.innerHTML = programmes.filter((o) => !isActive(o))
    .map((o) => oppCard({ ...o, why_relevant: o.status })).join("");
}

async function renderCategories() {
  const [opps, cats] = await Promise.all([loadOpportunities(), loadJson("data/categories.json")]);
  const root = document.querySelector("#categorySections");
  root.innerHTML = cats.map((c) => {
    const items = opps
      .filter((o) => (c.match === "status" ? o.status_class === c.value : o.category === c.value))
      .sort(byScoreDesc);
    const body = items.length
      ? `<div class="data-grid">${items.map((o) => oppCard(o)).join("")}</div>`
      : `<div class="note-panel"><p>No verified entries sit in this bucket in the current first pass. It fills out on a live-date refresh. In the meantime, use the recurring programs and confirm reopen dates at source.</p></div>`;
    return `
      <section class="section compact reveal" id="cat-${c.letter}">
        <div class="section-heading">
          <p class="eyebrow">Category ${c.letter} &middot; ${items.length} listed</p>
          <h2>${esc(c.title)}</h2>
          <p>${esc(c.blurb)}</p>
        </div>
        ${body}
      </section>`;
  }).join("");
}

async function renderRelocation() {
  const data = await loadOpportunities();
  const grid = document.querySelector("#relocationGrid");
  const items = data.filter((o) => o.category === "D" || /visa|residency|relocat|soft-landing|free-zone/i.test(`${o.support_type} ${o.other_benefits}`)).sort(byScoreDesc);
  grid.innerHTML = items.map((o) => oppCard(o, { showPitch: true })).join("");
}

function projectResearchContext(lens) {
  if (!lens.sources) return "";
  return `<div class="note-panel" data-project-focus="${esc(lens.key)}" style="margin-bottom:1.6rem">
    <dl class="detail-grid">
      ${detailRow("Current stage", lens.stage)}
      ${detailRow("Funding types to research", lens.funding_types.join("; "))}
      ${detailRow("Keywords and related terms", lens.keywords.join("; "))}
    </dl>
    <h3>Applicant and project questions</h3>
    <ul class="checklist">${lens.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
    <p><strong>Project sources:</strong> ${lens.sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join(" · ")}. Checked <time datetime="${esc(lens.source_checked_on)}">${esc(lens.source_checked_on)}</time>.</p>
    <p>${esc(lens.funding_note)}</p>
  </div>`;
}

async function renderThemes() {
  const [opps, themes] = await Promise.all([loadOpportunities(), loadJson("data/themes.json")]);
  const byId = Object.fromEntries(opps.map((o) => [o.id, o]));
  const root = document.querySelector("#themeSections");
  root.innerHTML = themes.lenses.filter((l) => l.key !== "minjerribah").map((lens) => {
    const items = lens.ids.map((id) => byId[id]).filter(Boolean).sort(byScoreDesc);
    return `
      <section class="section compact reveal" id="lens-${lens.key}">
        <div class="section-heading">
          <p class="eyebrow">Focus</p>
          <h2>${esc(lens.title)}</h2>
          <p>${esc(lens.blurb)}</p>
        </div>
        ${projectResearchContext(lens)}
        <div class="data-grid">${items.map((o) => oppCard(o)).join("")}</div>
      </section>`;
  }).join("");
}

async function renderMinjerribah() {
  const [opps, themes] = await Promise.all([loadOpportunities(), loadJson("data/themes.json")]);
  const byId = Object.fromEntries(opps.map((o) => [o.id, o]));
  const lens = themes.lenses.find((l) => l.key === "minjerribah");
  const grid = document.querySelector("#minjerribahGrid");
  if (grid && lens) {
    const items = lens.ids.map((id) => byId[id]).filter(Boolean).sort(byScoreDesc);
    grid.innerHTML = items.map((o) => oppCard(o, { showPitch: true })).join("");
  }
}

async function renderStrategy() {
  const strat = await loadJson("data/strategy.json");
  const opps = await loadOpportunities();
  const byId = Object.fromEntries(opps.map((o) => [o.id, o]));

  const weightBox = document.querySelector("#weightBox");
  if (weightBox) {
    weightBox.innerHTML = strat.weights.map((w) => `
      <div class="weight-row"><span class="label">${esc(w.label)}</span><span class="pct">${w.pct}%</span>
        <span class="weight-track"><span style="width:${w.pct * 5}%"></span></span>
      </div>`).join("");
  }
  const phases = document.querySelector("#phaseList");
  if (phases) {
    phases.innerHTML = strat.phases.map((p) => `
      <li>
        <p class="tag">${esc(p.window)}</p>
        <h4>${esc(p.title)}</h4>
        <p>${esc(p.detail)}</p>
        <ul class="checklist">${p.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </li>`).join("");
  }
  const reuse = document.querySelector("#reusableList");
  if (reuse) reuse.innerHTML = strat.reusable.map((r) => `<li>${esc(r)}</li>`).join("");

  const buckets = document.querySelector("#bucketGrid");
  if (buckets) {
    buckets.innerHTML = strat.buckets.map((b) => {
      const available = b.ids.map((id) => byId[id]).filter(Boolean);
      const names = available
        .map((o) => `<li><a href="opportunities.html?focus=${o.id}">${esc(o.name)}</a> <span class="chip gold">${scoreOf(o)}</span></li>`).join("");
      return `<article class="data-card"><h3>${esc(b.title.replace(/^Five /, `${available.length} `))}</h3><ul class="checklist">${names}</ul></article>`;
    }).join("");
  }
}

function projectCard(p, byId) {
  const stageLabels = { live: "Live site", building: "In build", surveyed: "Surveyed" };
  const matches = (p.match || []).map((id) => byId[id]).filter(Boolean);
  const matchLinks = matches.length
    ? `<div class="match-links"><span class="match-label">${p.research_focus ? "Funding leads to check" : "Funding fits"}</span>${matches.map((o) => `<a href="opportunities.html?focus=${esc(o.id)}">${esc(o.name.split(" (")[0])} <b>${scoreOf(o)}</b></a>`).join("")}</div>`
    : "";
  const actions = [
    p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">Open project</a>` : "",
    p.research_focus ? `<a href="themes.html#lens-${esc(p.research_focus)}">Research terms and requirements</a>` : "",
    `<a href="https://auraofintelligence.github.io/stradbroke-grants-lab/" target="_blank" rel="noopener noreferrer">Local grants</a>`,
  ].join("");
  return `
    <article class="data-card project-card">
      <div class="opp-badges"><span class="badge stage-${esc(p.stage)}">${stageLabels[p.stage] || esc(p.stage)}</span></div>
      <h3>${esc(p.name)}</h3>
      <p class="opp-summary">${esc(p.oneliner)}</p>
      <div class="chips">${(p.themes || []).slice(0, 4).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      ${matchLinks}
      <div class="card-actions">${actions}</div>
    </article>`;
}

async function renderTerritory() {
  const [eco, opps] = await Promise.all([loadJson("data/ecosystem.json"), loadOpportunities()]);
  const byId = Object.fromEntries(opps.map((o) => [o.id, o]));
  const why = document.querySelector("#territoryWhy");
  if (why) {
    why.innerHTML = `
      <p>${esc(eco.why.threatsIntro)}</p>
      <div class="threat-grid">${eco.why.threats.map((t) => `<span class="threat">${esc(t)}</span>`).join("")}</div>
      <p class="gem">${esc(eco.why.gem)}</p>`;
  }
  const legend = document.querySelector("#territoryLegend");
  if (legend) legend.innerHTML = eco.legend.map((l) => `<li><span class="stage-dot ${l.key}"></span><strong>${esc(l.label)}</strong> ${esc(l.desc)}</li>`).join("");
  const root = document.querySelector("#territoryLayers");
  if (root) {
    root.innerHTML = eco.layers.map((layer) => `
      <section class="section compact reveal" id="layer-${esc(layer.key)}">
        <div class="section-heading">
          <p class="eyebrow">Layer ${esc(layer.num)}</p>
          <h2>${esc(layer.title)}</h2>
          <p>${esc(layer.blurb)}</p>
        </div>
        <div class="data-grid">${layer.projects.map((p) => projectCard(p, byId)).join("")}</div>
      </section>`).join("");
  }
}

async function renderPeople() {
  const data = await loadJson("data/networks.json");
  const root = document.querySelector("#peopleSections");
  if (!root) return;
  root.innerHTML = data.groups.map((g) => `
    <section class="section compact reveal" id="net-${g.key}">
      <div class="section-heading">
        <p class="eyebrow">${esc(g.eyebrow || "Network")}</p>
        <h2>${esc(g.title)}</h2>
        <p>${esc(g.blurb)}</p>
      </div>
      <div class="data-grid">
        ${g.items.map((it) => `
          <article class="data-card person-card">
            <p class="role">${esc(it.kind)}${it.cadence ? " &middot; " + esc(it.cadence) : ""}</p>
            <h3>${esc(it.name)}</h3>
            <p class="place">${esc(it.place)}</p>
            <p class="why">${esc(it.why)}</p>
            <div class="chips">${(it.themes || []).slice(0, 4).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
            ${it.url ? `<div class="card-actions"><a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">Visit</a></div>` : ""}
          </article>`).join("")}
      </div>
    </section>`).join("");
}

function wireCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const original = btn.textContent;
        btn.textContent = "Copied to clipboard";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 1800);
      } catch (e) {
        btn.textContent = "Select the text and copy manually";
      }
    });
  });
}

async function boot() {
  mountChrome();
  try {
    const page = document.body.dataset.page;
    if (page === "home") await renderHome();
    if (page === "opportunities") await renderOpportunities();
    if (page === "shortlist") await renderShortlist();
    if (page === "categories") await renderCategories();
    if (page === "relocation") await renderRelocation();
    if (page === "themes") await renderThemes();
    if (page === "minjerribah") await renderMinjerribah();
    if (page === "strategy") await renderStrategy();
    if (page === "territory") await renderTerritory();
    if (page === "people") await renderPeople();
    if (page === "brief") wireCopyButtons();
    if (page === "archive") await renderArchive();
    await renderRefreshSummary();
    refreshCinematic();
  } catch (error) {
    const main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("beforeend", `<p class="load-error">${esc(error.message)}. If you opened the file directly, run a local server first (see the README).</p>`);
  }
}

boot();
