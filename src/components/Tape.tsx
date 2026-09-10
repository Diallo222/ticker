import { formatPercent, formatPrice } from '../lib/format'
import type { TapeItem } from '../lib/marketEngine'

interface TapeProps {
  items: TapeItem[]
}

export function Tape({ items }: TapeProps) {
  const doubled = [...items, ...items]

  return (
    <section
      className="group border-t-2 border-ink bg-paper-2"
      aria-label="Live tape"
    >
      <div className="flex items-center gap-3 overflow-hidden px-4 py-2.5 md:px-5">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          Tape
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="tape-track flex w-max gap-6 group-hover:[animation-play-state:paused]">
            {doubled.map((item, i) => {
              const up = item.changePct >= 0
              return (
                <span
                  key={`${item.id}-${i}`}
                  className="inline-flex items-baseline gap-2 font-mono text-[12px] tabular-nums text-ink"
                >
                  <span className="font-medium">{item.ticker}</span>
                  <span>{formatPrice(item.price)}</span>
                  <span className={up ? 'text-up' : 'text-down'}>
                    {up ? '▲' : '▼'} {formatPercent(item.changePct)}
                  </span>
                  <span className="text-ink/25" aria-hidden>
                    ·
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
