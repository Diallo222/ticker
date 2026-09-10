import { formatPercent, formatPrice } from '../lib/format'
import type { Quote } from '../lib/marketEngine'
import type { MarketSymbol } from '../lib/symbols'

interface WatchlistProps {
  items: { symbol: MarketSymbol; quote: Quote }[]
  selectedId: string
  onSelect: (id: string) => void
}

export function Watchlist({ items, selectedId, onSelect }: WatchlistProps) {
  return (
    <section
      className="flex h-full flex-col border-b border-ink md:border-b-0 md:border-r"
      aria-label="Watchlist"
    >
      <div className="border-b border-ink/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted md:px-5">
        Watchlist
      </div>
      <ul className="flex-1 overflow-auto">
        {items.map(({ symbol, quote }) => {
          const selected = symbol.id === selectedId
          const up = quote.changePct >= 0
          return (
            <li key={symbol.id}>
              <button
                type="button"
                onClick={() => onSelect(symbol.id)}
                className={`relative flex w-full items-baseline justify-between gap-3 border-b border-ink/10 px-4 py-2.5 text-left transition-colors duration-200 md:px-5 ${
                  selected ? 'bg-ink/[0.04]' : 'hover:bg-ink/[0.025]'
                }`}
              >
                {selected && (
                  <span
                    className="absolute inset-y-0 left-0 w-[2px] bg-ink"
                    aria-hidden
                  />
                )}
                <span
                  className={`font-mono text-[13px] ${selected ? 'font-semibold text-ink' : 'text-ink'}`}
                >
                  {symbol.ticker}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-ink">
                  {formatPrice(quote.price)}
                  <span className={`ml-2.5 ${up ? 'text-up' : 'text-down'}`}>
                    {formatPercent(quote.changePct)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
