import { AnimatePresence, motion } from 'framer-motion'
import { formatChange, formatPercent, formatPrice } from '../lib/format'
import type { Quote, Timeframe } from '../lib/marketEngine'
import type { MarketSymbol } from '../lib/symbols'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '1Y']

interface ChartPanelProps {
  symbol: MarketSymbol
  quote: Quote
  series: number[]
  timeframe: Timeframe
  onTimeframe: (tf: Timeframe) => void
}

export function ChartPanel({ symbol, quote, series, timeframe, onTimeframe }: ChartPanelProps) {
  const up = quote.changePct >= 0
  const { line, area } = toPaths(series, 560, 200)

  return (
    <section
      className="flex h-full flex-col border-b border-ink md:border-b-0 md:border-r"
      aria-label={`${symbol.ticker} chart`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink/20 px-4 py-3 md:px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={symbol.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
              {symbol.ticker}
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
              {symbol.name} · NASDAQ
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="text-right font-mono">
          <div className="text-lg font-medium tabular-nums text-ink md:text-xl">
            {formatPrice(quote.price)}
          </div>
          <div className={`text-[12px] tabular-nums ${up ? 'text-up' : 'text-down'}`}>
            {formatChange(quote.change)} · {formatPercent(quote.changePct)}
          </div>
        </div>
      </div>

      <div className="relative min-h-[200px] flex-1 px-3 py-5 md:px-5">
        <svg viewBox="0 0 560 200" className="h-full w-full" preserveAspectRatio="none" role="img">
          <title>{`${symbol.ticker} ${timeframe} price`}</title>
          <line
            x1="0"
            y1="100"
            x2="560"
            y2="100"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="3 5"
            className="text-ink"
          />
          {area && (
            <path d={area} fill="currentColor" className="text-ink" fillOpacity="0.035" />
          )}
          {line && (
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              className="text-ink"
            />
          )}
        </svg>
      </div>

      <div className="flex gap-5 px-4 pb-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted md:px-5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            type="button"
            onClick={() => onTimeframe(tf)}
            className={`pb-0.5 transition-colors duration-200 ${
              timeframe === tf ? 'border-b border-ink text-ink' : 'hover:text-ink'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </section>
  )
}

function toPaths(series: number[], width: number, height: number) {
  if (series.length < 2) return { line: '', area: '' }
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const pad = height * 0.1

  const coords = series.map((v, i) => {
    const x = (i / (series.length - 1)) * width
    const y = pad + (1 - (v - min) / span) * (height - pad * 2)
    return [x, y] as const
  })

  const line = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ')
  const last = coords[coords.length - 1]
  const area = `${line} L ${last[0].toFixed(2)} ${height} L 0 ${height} Z`

  return { line, area }
}
