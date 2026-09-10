import { motion } from 'framer-motion'
import { useMarket } from '../hooks/useMarket'
import { ChartPanel } from './ChartPanel'
import { IndexStrip } from './IndexStrip'
import { Masthead } from './Masthead'
import { SectorHeat } from './SectorHeat'
import { Tape } from './Tape'
import { Watchlist } from './Watchlist'

export function Desk() {
  const market = useMarket()

  if (!market.selectedQuote) return null

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="grain pointer-events-none absolute inset-0 z-10" aria-hidden />

      <div className="relative z-0 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <Masthead now={market.now} />
        <IndexStrip items={market.indexQuotes} />

        <motion.div
          className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(200px,0.95fr)_minmax(280px,1.55fr)_minmax(180px,0.85fr)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

        <Tape items={market.tape} />
      </div>
    </div>
  )
}
