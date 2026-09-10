import { ALL_SYMBOLS, EQUITIES, SECTOR_LABELS, type SectorId } from './symbols'

export type Timeframe = '1D' | '1W' | '1M' | '1Y'

export interface Quote {
  id: string
  price: number
  open: number
  change: number
  changePct: number
  direction: 'up' | 'down' | 'flat'
}

export interface SectorHeat {
  id: SectorId
  label: string
  changePct: number
}

export interface TapeItem {
  id: string
  ticker: string
  price: number
  changePct: number
}

export type QuoteMap = Record<string, Quote>

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Mulberry32 — deterministic PRNG from a seed. */
export function createRng(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function createInitialQuotes(seed = 42): QuoteMap {
  const rng = createRng(seed)
  const quotes: QuoteMap = {}

  for (const s of ALL_SYMBOLS) {
    const drift = (rng() - 0.48) * 0.012
    const open = s.basePrice * (1 + drift)
    const price = open
    quotes[s.id] = {
      id: s.id,
      price,
      open,
      change: 0,
      changePct: 0,
      direction: 'flat',
    }
  }

  return quotes
}

export function tickQuotes(quotes: QuoteMap, rng: () => number): QuoteMap {
  const next: QuoteMap = { ...quotes }

  // Only a few names move each beat — keeps the desk quiet
  for (const s of ALL_SYMBOLS) {
    if (rng() > 0.28) continue

    const q = next[s.id]
    if (!q) continue

    const vol = s.kind === 'index' ? 0.00022 : 0.0007
    const jump = rng() < 0.03 ? (rng() - 0.5) * vol * 5 : 0
    const step = (rng() - 0.49) * vol + jump
    const price = clamp(q.price * (1 + step), q.open * 0.94, q.open * 1.06)
    const change = price - q.open
    const changePct = (change / q.open) * 100
    const direction =
      price > q.price + 1e-9 ? 'up' : price < q.price - 1e-9 ? 'down' : 'flat'

    next[s.id] = { ...q, price, change, changePct, direction }
  }

  return next
}

const POINTS: Record<Timeframe, number> = {
  '1D': 78,
  '1W': 56,
  '1M': 48,
  '1Y': 64,
}

export function buildSeries(
  symbolId: string,
  timeframe: Timeframe,
  quote: Quote,
  seed = 42,
): number[] {
  const rng = createRng(seed + symbolId.charCodeAt(0) * 97 + timeframe.length * 13)
  const count = POINTS[timeframe]
  const points: number[] = []
  let price = quote.open

  const vol =
    timeframe === '1D' ? 0.0012 : timeframe === '1W' ? 0.002 : timeframe === '1M' ? 0.004 : 0.01

  for (let i = 0; i < count - 1; i++) {
    price = price * (1 + (rng() - 0.48) * vol)
    points.push(price)
  }

  // End near live quote so chart meets the tape.
  points.push(quote.price)
  return points
}

export function computeSectors(quotes: QuoteMap): SectorHeat[] {
  const buckets = new Map<SectorId, number[]>()

  for (const eq of EQUITIES) {
    if (!eq.sector) continue
    const q = quotes[eq.id]
    if (!q) continue
    const list = buckets.get(eq.sector) ?? []
    list.push(q.changePct)
    buckets.set(eq.sector, list)
  }

  return (Object.keys(SECTOR_LABELS) as SectorId[]).map((id) => {
    const vals = buckets.get(id) ?? [0]
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    return { id, label: SECTOR_LABELS[id], changePct: avg }
  })
}

export function buildTape(quotes: QuoteMap): TapeItem[] {
  return EQUITIES.map((eq) => {
    const q = quotes[eq.id]!
    return {
      id: `${eq.id}-${q.price.toFixed(2)}`,
      ticker: eq.ticker,
      price: q.price,
      changePct: q.changePct,
    }
  })
}
