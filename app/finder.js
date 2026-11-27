// Deal Verdict — the finder itself: search, filters, sort, grid and deal pages.
// State lives in the URL hash, so a filtered view or a deal page is a real view
// the screenshots can show: #/ , #/cat/Audio , #/store/Target , #/deal/airpods-pro-3 .
import { CHECKED_LABEL, COMPARE, COMPARE_PRODUCT, DEALS } from "./deals.js";
import { discountPct, money, saving, storeClass, verdictLabel } from "./verdict.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");
const compare = document.getElementById("compare");
const empty = document.getElementById("empty");
const resultLine = document.getElementById("result-line");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const discountSelect = document.getElementById("min-discount");
const categoryChips = document.getElementById("category-chips");
const storeChips = document.getElementById("store-chips");

const CATEGORIES = [...new Set(DEALS.map((d) => d.category))].sort();
const STORES = [...new Set(DEALS.map((d) => d.store))];

let state = { query: "", category: "All", store: "All", minDiscount: 0, sort: "saving" };

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function chip(label, pressed, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.textContent = label;
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.addEventListener("click", onClick);
  return button;
}

function renderChips() {
  categoryChips.replaceChildren(
    chip("All categories", state.category === "All", () => setHash("cat", "All")),
    ...CATEGORIES.map((c) => chip(c, state.category === c, () => setHash("cat", c))),
  );
  storeChips.replaceChildren(
    chip("All stores", state.store === "All", () => setHash("store", "All")),
    ...STORES.map((s) => chip(s, state.store === s, () => setHash("store", s))),
  );
}

function renderCompare() {
  const list = document.getElementById("compare-list");
  const cheapest = Math.min(...COMPARE.map((c) => c.price));
  list.replaceChildren(
    ...COMPARE.map((c) => {
      const li = document.createElement("li");
      if (c.price === cheapest) li.className = "best";
      li.innerHTML =
        `<span class="compare-store">${escapeHtml(c.store)}</span>` +
        `<span class="compare-price">${money(c.price)}</span>` +
        `<span class="compare-was">was ${money(c.was)}</span>` +
        `<span class="compare-tag">${escapeHtml(c.note)}</span>`;
      return li;
    }),
  );
}

function cardHtml(deal) {
  const pct = discountPct(deal);
  return `<article class="card">
    <div class="card-top">
      <span class="store-badge ${storeClass(deal.store)}">${escapeHtml(deal.store)}</span>
      <span class="category">${escapeHtml(deal.category)}</span>
    </div>
    <h3><a href="#/deal/${deal.id}">${escapeHtml(deal.product)}</a></h3>
    <div class="price-row">
      <span class="price">${money(deal.price)}</span>
      <span class="was">was ${money(deal.was)}</span>
      <span class="off-badge">-${pct}%</span>
    </div>
    <p class="save-line">You save ${money(Math.round(saving(deal) * 100) / 100)}</p>
    <div class="verdict ${deal.verdict}">
      <strong>Verdict: ${verdictLabel(deal.verdict)}</strong>
      <p>${escapeHtml(deal.evidence)}</p>
    </div>
    <p class="checked-line">Checked ${CHECKED_LABEL} &middot; Source: ${escapeHtml(deal.source)}</p>
    <a class="store-link" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} &rarr;</a>
  </article>`;
}

function filteredDeals() {
  const q = state.query.trim().toLowerCase();
  let list = DEALS.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPct(d) < state.minDiscount) return false;
    if (q && !(d.product + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  if (state.sort === "saving") list = [...list].sort((a, b) => saving(b) - saving(a));
  if (state.sort === "discount") list = [...list].sort((a, b) => discountPct(b) - discountPct(a));
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function renderHome() {
  detail.hidden = true;
  compare.hidden = false;
  grid.hidden = false;
  const list = filteredDeals();
  grid.innerHTML = list.map(cardHtml).join("");
  empty.hidden = list.length !== 0;
  const bits = [`${list.length} of ${DEALS.length} deals`];
  if (state.category !== "All") bits.push(`in ${state.category}`);
  if (state.store !== "All") bits.push(`at ${state.store}`);
  if (state.minDiscount > 0) bits.push(`${state.minDiscount}% off or more`);
  if (state.query.trim()) bits.push(`matching \u201c${state.query.trim()}\u201d`);
  resultLine.textContent = bits.join(" · ") + ` — checked ${CHECKED_LABEL}.`;
  renderChips();
}

function renderDetail(id) {
  const deal = DEALS.find((d) => d.id === id);
  if (!deal) {
    location.hash = "#/";
    return;
  }
  grid.hidden = true;
  compare.hidden = true;
  empty.hidden = true;
  detail.hidden = false;
  const pct = discountPct(deal);
  const sameProduct = DEALS.filter((d) => d.product === deal.product && d.id !== deal.id);
  detail.innerHTML =
    `<a class="back" href="#/">&larr; Back to all ${DEALS.length} deals</a>` +
    `<h2>${escapeHtml(deal.product)}</h2>` +
    `<div class="detail-grid"><div>` +
    `<div class="price-row"><span class="price">${money(deal.price)}</span>` +
    `<span class="was">was ${money(deal.was)}</span><span class="off-badge">-${pct}%</span></div>` +
    `<p class="save-line">You save ${money(Math.round(saving(deal) * 100) / 100)} (${pct}% off)</p>` +
    `<div class="verdict ${deal.verdict}"><strong>Verdict: ${verdictLabel(deal.verdict)}</strong><p>${escapeHtml(deal.evidence)}</p></div>` +
    `</div><div><dl>` +
    `<dt>Store</dt><dd>${escapeHtml(deal.store)}</dd>` +
    `<dt>Category</dt><dd>${escapeHtml(deal.category)}</dd>` +
    `<dt>Checked</dt><dd>${CHECKED_LABEL}</dd>` +
    `<dt>Source</dt><dd>${escapeHtml(deal.source)}</dd>` +
    `</dl><p><a class="store-link" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} &rarr;</a></p>` +
    (sameProduct.length
      ? `<p><strong>Same product elsewhere:</strong> ${sameProduct.map((d) => `${escapeHtml(d.store)} ${money(d.price)}`).join(" · ")} — the cheapest wins.</p>`
      : "") +
    `</div></div>`;
  renderChips();
}

function setHash(kind, value) {
  if (kind === "cat") location.hash = value === "All" ? "#/" : `#/cat/${encodeURIComponent(value)}`;
  if (kind === "store") location.hash = value === "All" ? "#/" : `#/store/${encodeURIComponent(value)}`;
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [kind, raw] = hash.split("/");
  if (kind === "deal" && raw) return renderDetail(decodeURIComponent(raw));
  if (kind === "cat") state.category = decodeURIComponent(raw || "All");
  else if (kind === "store") state.store = decodeURIComponent(raw || "All");
  else {
    state.category = "All";
    state.store = "All";
  }
  renderHome();
}

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  renderHome();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  renderHome();
});
discountSelect.addEventListener("change", () => {
  state.minDiscount = Number(discountSelect.value);
  renderHome();
});
window.addEventListener("hashchange", route);

document.getElementById("masthead-stats").textContent =
  `${DEALS.length} verified deals · ${STORES.length} stores · checked ${CHECKED_LABEL}`;
renderCompare();
route();
