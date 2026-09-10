import {
  buildSeries,
  buildTape,
  computeSectors,
  createInitialQuotes,
  createRng,
  tickQuotes,
  type QuoteMap,
  type Timeframe,
} from '../lib/marketEngine'
import { ALL_SYMBOLS, DEFAULT_SELECTED, EQUITIES, INDICES } from '../lib/symbols'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Slower cadence — editorial calm, not arcade flicker */
const TICK_MS = 720

export function useMarket() {
  const [quotes, setQuotes] = useState<QuoteMap>(() => createInitialQuotes(42))
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED)
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')
  const [now, setNow] = useState(() => new Date())
  const rngRef = useRef(createRng(Date.now() % 1_000_000))

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuotes((prev) => tickQuotes(prev, rngRef.current))
      setNow(new Date())
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [])

  const selected = useMemo(
    () => ALL_SYMBOLS.find((s) => s.id === selectedId) ?? EQUITIES[1],
    [selectedId],
  )

  const selectedQuote = quotes[selectedId]

  // Stable path per symbol/timeframe; only the tip follows live price
  const baseSeries = useMemo(() => {
    if (!selectedQuote) return []
    return buildSeries(selectedId, timeframe, selectedQuote, 42).slice(0, -1)
  }, [selectedId, timeframe]) // eslint-disable-line react-hooks/exhaustive-deps -- open seed only

  const series = useMemo(() => {
    if (!selectedQuote || baseSeries.length === 0) return []
    return [...baseSeries, selectedQuote.price]
  }, [baseSeries, selectedQuote])

  const sectors = useMemo(() => computeSectors(quotes), [quotes])
  const tape = useMemo(() => buildTape(quotes), [quotes])

  const indexQuotes = useMemo(
    () => INDICES.map((s) => ({ symbol: s, quote: quotes[s.id]! })),
    [quotes],
  )

  const equityQuotes = useMemo(
    () => EQUITIES.map((s) => ({ symbol: s, quote: quotes[s.id]! })),
    [quotes],
  )

  const select = useCallback((id: string) => setSelectedId(id), [])

  return {
    now,
    quotes,
    selectedId,
    selected,
    selectedQuote,
    timeframe,
    setTimeframe,
    series,
    sectors,
    tape,
    indexQuotes,
    equityQuotes,
    select,
  }
}

export type MarketState = ReturnType<typeof useMarket>
