/* Global Founder Atlas - shared render engine.
   Data-driven, no build step. One script drives every page via body[data-page]. */

const NAV_LINKS = [
  ["territory.html", "Territory"],
  ["opportunities.html", "Atlas"],
  ["shortlist.html", "Shortlist"],
  ["categories.html", "Categories"],
  ["relocation.html", "Relocation"],
  ["themes.html", "By Project"],
  ["minjerribah.html", "Minjerribah"],
  ["people.html", "People"],
  ["strategy.html", "90-Day Plan"],
  ["brief.html", "Brief"],
];

const WEIGHTS = { elig: 20, value: 15, align: 20, early: 10, infra: 10, ip: 10, reloc: 5, cred: 10 };

const navHtml = `
  <a class="brand" href="index.html" aria-label="Global Founder Atlas home">
    <span class="brand-mark" aria-hidden="true"></span>
    <span class="brand-text"><strong>Global Founder Atlas</strong><span>Non-dilutive treasure worldwide</span></span>
  </a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="site-nav" id="site-nav" aria-label="Primary">
    ${NAV_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
  </nav>`;

const footerHtml = `
  <div>
    <p>Global Founder Atlas. A travelling Australian founder's map of non-dilutive-first international funding, visas, residencies and pilots.</p>
    <p>A Luke &times; Claude build. Curated first pass to author knowledge (to January 2026): verify every live date, amount and eligibility at the official source before applying.</p>
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
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function scoreOf(opp) {
  const s = opp.scores || {};
  let total = 0;
  for (const key in WEIGHTS) total += (Number(s[key]) || 0) * WEIGHTS[key];
  return Math.round(total / 5); // scores are 0-5, weights sum to 100 -> 0-100
}

const STATUS_LABEL = { open: "Open / rolling", soon: "Opening soon", recurring: "Recurring", closed: "Round closed" };

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function auBadge(opp) {
  const yes = /^yes/i.test(opp.au_eligible || "");
  return `<span class="badge ${yes ? "au-yes" : "au-check"}">${yes ? "AU eligible" : "AU: verify"}</span>`;
}

function detailRow(label, value, muted) {
  if (!value) return "";
  return `<dt>${esc(label)}</dt><dd class="${muted ? "muted" : ""}">${esc(value)}</dd>`;
}

function oppCard(opp, options = {}) {
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
        ${detailRow("Organisation", opp.org)}
        ${detailRow("Location", opp.city_region)}
        ${detailRow("Status", opp.status)}
        ${detailRow("Opens", opp.opens)}
        ${detailRow("Closes", opp.closes)}
        ${detailRow("Recurring", opp.recurring ? "Yes" : "No")}
        ${detailRow("Eligibility", opp.eligibility)}
        ${detailRow("Australians eligible", opp.au_eligible)}
        ${detailRow("Local entity / relocation", opp.requires_local)}
        ${detailRow("Stage accepted", opp.stage)}
        ${detailRow("Funding amount", opp.funding_amount)}
        ${detailRow("Currency", opp.funding_currency)}
        ${detailRow("Support type", opp.support_type)}
        ${detailRow("Equity requested", opp.equity)}
        ${detailRow("Other benefits", opp.other_benefits)}
        ${detailRow("IP conditions", opp.ip_conditions)}
        ${detailRow("Matching / co-funding", opp.matching_required)}
        ${detailRow("Key documents", opp.key_documents)}
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
      ${details}
      ${actions}
    </article>`;
}

function byScoreDesc(a, b) { return scoreOf(b) - scoreOf(a); }

/* ---------- pages ---------- */

async function renderHome() {
  const [opps, cats] = await Promise.all([loadJson("data/opportunities.json"), loadJson("data/categories.json")]);
  const stats = document.querySelector("#homeStats");
  if (stats) {
    const auYes = opps.filter((o) => /^yes/i.test(o.au_eligible)).length;
    const nonDilutive = opps.filter((o) => /grant|prize|fellowship|in-kind|reimburse/i.test(o.support_type)).length;
    const remote = opps.filter((o) => /^no/i.test(o.requires_local) || /remote|rolling/i.test(o.requires_local)).length;
    stats.innerHTML = [
      [opps.length, "verified opportunities"],
      [auYes, "open to Australians"],
      [nonDilutive, "non-dilutive by design"],
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
    topGrid.innerHTML = [...opps].sort(byScoreDesc).slice(0, 3)
      .map((o, i) => oppCard(o, { rank: i + 1 })).join("");
  }
}

async function renderOpportunities() {
  const data = await loadJson("data/opportunities.json");
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
        || (state.cat === "recurring" && o.status_class === "recurring");
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
  const data = await loadJson("data/opportunities.json");
  const grid = document.querySelector("#shortlistGrid");
  const top = [...data].sort(byScoreDesc).slice(0, 15);
  grid.innerHTML = top.map((o, i) => oppCard(o, { rank: i + 1, showPitch: true })).join("");
}

async function renderCategories() {
  const [opps, cats] = await Promise.all([loadJson("data/opportunities.json"), loadJson("data/categories.json")]);
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
  const data = await loadJson("data/opportunities.json");
  const grid = document.querySelector("#relocationGrid");
  const items = data.filter((o) => o.category === "D" || /visa|residency|relocat|soft-landing|free-zone/i.test(`${o.support_type} ${o.other_benefits}`)).sort(byScoreDesc);
  grid.innerHTML = items.map((o) => oppCard(o, { showPitch: true })).join("");
}

async function renderThemes() {
  const [opps, themes] = await Promise.all([loadJson("data/opportunities.json"), loadJson("data/themes.json")]);
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
        <div class="data-grid">${items.map((o) => oppCard(o)).join("")}</div>
      </section>`;
  }).join("");
}

async function renderMinjerribah() {
  const [opps, themes] = await Promise.all([loadJson("data/opportunities.json"), loadJson("data/themes.json")]);
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
  const opps = await loadJson("data/opportunities.json");
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
      const names = b.ids.map((id) => byId[id]).filter(Boolean)
        .map((o) => `<li><a href="opportunities.html?focus=${o.id}">${esc(o.name)}</a> <span class="chip gold">${scoreOf(o)}</span></li>`).join("");
      return `<article class="data-card"><h3>${esc(b.title)}</h3><ul class="checklist">${names}</ul></article>`;
    }).join("");
  }
}

function projectCard(p, byId) {
  const stageLabels = { live: "Live site", building: "In build", surveyed: "Surveyed" };
  const matches = (p.match || []).map((id) => byId[id]).filter(Boolean);
  const matchLinks = matches.length
    ? `<div class="match-links"><span class="match-label">Funding fits</span>${matches.map((o) => `<a href="opportunities.html?focus=${esc(o.id)}">${esc(o.name.split(" (")[0])} <b>${scoreOf(o)}</b></a>`).join("")}</div>`
    : "";
  const actions = [
    p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">Open project</a>` : "",
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
  const [eco, opps] = await Promise.all([loadJson("data/ecosystem.json"), loadJson("data/opportunities.json")]);
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
    refreshCinematic();
  } catch (error) {
    const main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("beforeend", `<p class="load-error">${esc(error.message)}. If you opened the file directly, run a local server first (see the README).</p>`);
  }
}

boot();
