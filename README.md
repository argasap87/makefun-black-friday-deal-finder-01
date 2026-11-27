# Deal Verdict — Black Friday 2026

[![black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/argasap87/makefun-black-friday-deal-finder-01/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/argasap87/makefun-black-friday-deal-finder-01/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

A Black Friday deal finder that only lists deals that were actually checked. **26 real deals** at Amazon, Best Buy, Walmart and Target — each with its product, store, store link, sale price, usual price, discount, check time and source, plus a verdict on whether it is really a deal.

## The hook: a verdict on every deal, and the same deal at every store

- **Real Deal Verdict** — every card carries a verdict with its evidence: **New low** (an all-time low price), **Strong deal** (a deep cut), **Solid deal** (a fair cut), or **Routine sale** (a small cut — including one deal we openly call routine, because honesty is the point).
- **Same deal, every store** — a compare strip shows AirPods Pro 3 at all four stores side by side (Amazon $149 vs Best Buy $180), so you never overpay for the same product.
- **Search + filters that work** — search by product, brand or store; filter by category, store and minimum discount (20% / 40% / 50%+); sort by biggest saving, biggest discount, cheapest or priciest. Filter state lives in the URL hash (`#/cat/Audio`, `#/store/Target`, `#/deal/airpods-pro-3`).
- **Dense first view** — the cover shows the compare strip and the biggest deals at a glance, on desktop and on a phone.

## How the deals were checked

Every deal was found and checked in-session on **27 November 2026, 14:45 WIB** (07:45 UTC), reading the price in a deals source that names the store. Each card names its source and check time. Sources: 9to5Toys (25–26 Nov), Black Friday Deals Diary (26–27 Nov), TradingView / Benzinga (27 Nov, 05:34 UTC), Cashback Index (26 Nov). Prices move all day on Black Friday — confirm the price at checkout before you buy.

## Run it

Static files under `app/` — no build step, no network at runtime. Serve `app/` with any static server and open `index.html`:

```sh
python3 -m http.server 8080 --directory app
```

Build the hand-in locally with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` (Node 22+).

## License

MIT — see [LICENSE](LICENSE).
