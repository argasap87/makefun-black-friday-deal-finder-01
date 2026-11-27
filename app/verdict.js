// Deal Verdict — the verdict math. Every number on a card is computed here from
// the deal's own sale price and usual price, so the discount can never disagree
// with the two prices the sources state.

export const VERDICT_LABELS = {
  "new-low": "New low",
  strong: "Strong deal",
  solid: "Solid deal",
  routine: "Routine sale",
};

export function discountPct(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saving(deal) {
  return deal.was - deal.price;
}

export function money(n) {
  const text = n % 1 === 0 ? String(n) : n.toFixed(2);
  return "$" + text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function verdictLabel(verdict) {
  return VERDICT_LABELS[verdict] ?? "Deal";
}

export function storeClass(store) {
  return store.toLowerCase().replace(/[^a-z]/g, "");
}
