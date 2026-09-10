import { motion } from 'framer-motion'
import { formatPercent, formatPrice } from '../lib/format'
import type { Quote } from '../lib/marketEngine'
import type { MarketSymbol } from '../lib/symbols'

interface IndexStripProps {
  items: { symbol: MarketSymbol; quote: Quote }[]
}

export function IndexStrip({ items }: IndexStripProps) {
  return (
    <motion.section
      className="grid grid-cols-2 border-b border-ink md:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.12, duration: 0.45 }}
      aria-label="Major indices"
    >
      {items.map(({ symbol, quote }, i) => {
        const up = quote.changePct >= 0

        return (
          <div
            key={symbol.id}
            className={`px-4 py-3.5 md:px-5 ${
              i % 2 === 0 ? 'border-r border-ink/15' : ''
            } ${i < items.length - 1 ? 'md:border-r md:border-ink/15' : 'md:border-r-0'}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {symbol.ticker}
            </div>
            <div className="mt-1 font-mono text-base font-medium tabular-nums text-ink md:text-lg">
              {formatPrice(quote.price, symbol.id === 'DJI' ? 0 : 2)}
            </div>
            <div
              className={`mt-0.5 font-mono text-[11px] tabular-nums ${up ? 'text-up' : 'text-down'}`}
            >
              {up ? '▲' : '▼'} {formatPercent(quote.changePct)}
            </div>
          </div>
        )
      })}
    </motion.section>
  )
}
