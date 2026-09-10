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
const CONNECT_MS = 750
const RECONNECT_MS = 900

export type FeedStatus = 'connecting' | 'live' | 'offline' | 'reconnecting' | 'error'

function isBrowserOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

export function useMarket() {
  const [quotes, setQuotes] = useState<QuoteMap>(() => createInitialQuotes(42))
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED)
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')
  const [now, setNow] = useState(() => new Date())
  const [status, setStatus] = useState<FeedStatus>('connecting')
  const [lastTickAt, setLastTickAt] = useState<Date | null>(null)

  const rngRef = useRef(createRng(Date.now() % 1_000_000))

  const bumpTick = useCallback(() => {
    setQuotes((prev) => tickQuotes(prev, rngRef.current))
    const t = new Date()
    setNow(t)
    setLastTickAt(t)
  }, [])

  // Initial connect after mount
  useEffect(() => {
    if (!isBrowserOnline()) {
      setStatus('offline')
      return
    }

    setStatus('connecting')
    const t = window.setTimeout(() => {
      if (!isBrowserOnline()) {
        setStatus('offline')
        return
      }
      bumpTick()
      setStatus('live')
    }, CONNECT_MS)

    return () => window.clearTimeout(t)
  }, [bumpTick])

  // Live tick loop — only while live
  useEffect(() => {
    if (status !== 'live') return

    const id = window.setInterval(() => {
      if (!isBrowserOnline()) {
        setStatus('offline')
        return
      }
      bumpTick()
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [status, bumpTick])

  // Browser online/offline
  useEffect(() => {
    const onOffline = () => setStatus('offline')

    const onOnline = () => {
      setStatus('reconnecting')
      window.setTimeout(() => {
        if (!isBrowserOnline()) {
          setStatus('offline')
          return
        }
        try {
          bumpTick()
          setStatus('live')
        } catch {
          setStatus('error')
        }
      }, RECONNECT_MS)
    }

    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [bumpTick])

  const retry = useCallback(() => {
    if (!isBrowserOnline()) {
      setStatus('offline')
      return
    }
    setStatus('reconnecting')
    window.setTimeout(() => {
      try {
        rngRef.current = createRng(Date.now() % 1_000_000)
        bumpTick()
        setStatus('live')
      } catch {
        setStatus('error')
      }
    }, RECONNECT_MS)
  }, [bumpTick])

  const selected = useMemo(
    () => ALL_SYMBOLS.find((s) => s.id === selectedId) ?? EQUITIES[1],
    [selectedId],
  )

  const selectedQuote = quotes[selectedId]

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
    status,
    lastTickAt,
    retry,
  }
}

export type MarketState = ReturnType<typeof useMarket>
