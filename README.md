# Ticker

**An editorial real-time markets desk** — financial press energy, gallery-site craft.

Ticker is a single-composition markets terminal for US equities and major indices. It is designed as a portfolio piece: typography-first, motion-aware, and intentionally *not* a stock-widget dashboard.

> Simulated live market data. Built for demos, design, and product storytelling — not trading advice.

---

## Preview

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://127.0.0.1:5173`).

---

## What it is

One viewport. One composition.

| Region | Role |
|--------|------|
| **Masthead** | Brand, session label, live clock (ET) |
| **Index strip** | SPX · NDX · DJI · RUT |
| **Watchlist** | Mega-cap names — click to focus |
| **Chart** | Custom SVG series with 1D / 1W / 1M / 1Y |
| **Sectors** | Soft heat from constituent movers |
| **Tape** | Continuous scrolling prints |

The desk uses a cooler paper ground, Newsreader for editorial display type, and IBM Plex Mono for prices and labels — closer to a morning markets page than a neon fintech UI.

---

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (load / selection motion)
- Custom SVG chart (no heavy chart library)
- Client-only SPA — no backend required

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |

---

## How the “live” feed works

Prices are driven by a seeded simulation engine:

- Indices and ~12 equities start from realistic baselines
- A calm tick loop updates a subset of symbols each beat
- Day change is measured from session open
- Chart paths stay stable; only the tip follows the live quote
- Sector heat aggregates equity movers

That keeps demos reliable (no API keys, no rate limits) while still feeling like a desk under the open.

---

## Project layout

```
src/
  components/     # Masthead, strip, watchlist, chart, sectors, tape, desk shell
  hooks/          # useMarket — quotes, selection, series
  lib/            # symbol universe, formatters, tick / chart math
  index.css       # design tokens, grain, tape marquee
```

---

## Design notes

- **Brand first** — “Ticker” is the hero signal, not a nav leftover
- **One job per region** — hairline rules, not card chrome
- **Restraint over flash** — no blinking row highlights; green/red stay in the numbers
- **Motion with purpose** — enter stagger, selection transition, continuous tape

---

## Disclaimer

Ticker does **not** connect to a brokerage or market-data vendor. Figures are illustrative. Do not use this project for investment decisions.

---

## License

[MIT](./LICENSE) © 2026 Diallo222
