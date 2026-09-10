import { motion } from 'framer-motion'
import { useMarket } from '../hooks/useMarket'
import { ChartPanel } from './ChartPanel'
import { DeskSkeleton } from './DeskSkeleton'
import { IndexStrip } from './IndexStrip'
import { Masthead } from './Masthead'
import { SectorHeat } from './SectorHeat'
import { StatusBanner } from './StatusBanner'
import { Tape } from './Tape'
import { Watchlist } from './Watchlist'

export function Desk() {
  const market = useMarket()
  const connecting = market.status === 'connecting'
  const live = market.status === 'live'

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="grain pointer-events-none absolute inset-0 z-10" aria-hidden />

      <div className="relative z-0 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <Masthead now={market.now} status={market.status} />
        <StatusBanner status={market.status} onRetry={market.retry} />

        {connecting ? (
          <>
            <div className="grid grid-cols-2 border-b border-ink md:grid-cols-4" aria-hidden>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`px-4 py-3.5 md:px-5 ${i % 2 === 0 ? 'border-r border-ink/15' : ''} ${
                    i < 3 ? 'md:border-r md:border-ink/15' : 'md:border-r-0'
                  }`}
                >
                  <div className="skeleton-line h-2 w-10" />
                  <div className="skeleton-line mt-2 h-4 w-20" />
                  <div className="skeleton-line mt-2 h-2.5 w-14" />
                </div>
              ))}
            </div>
            <DeskSkeleton />
            <div className="border-t-2 border-ink bg-paper-2 px-5 py-3" aria-hidden>
              <div className="skeleton-line h-2.5 w-full max-w-xl" />
            </div>
          </>
        ) : !market.selectedQuote ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              No quote
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
              Symbol unavailable
            </h2>
            <p className="mt-2 max-w-sm font-mono text-[12px] text-ink-muted">
              The selected name has no quote in this session. Retry the feed or pick another symbol.
            </p>
            <button
              type="button"
              onClick={market.retry}
              className="mt-6 border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Retry feed
            </button>
          </div>
        ) : (
          <>
            <IndexStrip items={market.indexQuotes} />

            <motion.div
              className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(200px,0.95fr)_minmax(280px,1.55fr)_minmax(180px,0.85fr)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Watchlist
                items={market.equityQuotes}
                selectedId={market.selectedId}
                onSelect={market.select}
              />
              <ChartPanel
                symbol={market.selected}
                quote={market.selectedQuote}
                series={market.series}
                timeframe={market.timeframe}
                onTimeframe={market.setTimeframe}
              />
              <SectorHeat sectors={market.sectors} />
            </motion.div>

            <Tape items={market.tape} active={live} />
          </>
        )}
      </div>
    </div>
  )
}
