import { motion } from 'framer-motion'
import { formatClock } from '../lib/format'

interface MastheadProps {
  now: Date
}

export function Masthead({ now }: MastheadProps) {
  return (
    <motion.header
      className="flex items-end justify-between gap-6 border-b-2 border-ink px-5 pb-3 pt-5 md:px-8 md:pt-7"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
          Ticker
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted md:text-[11px]">
          Real-time markets · US session
        </p>
      </div>
      <div className="pb-1 text-right font-mono text-[11px] leading-relaxed md:text-xs">
        <div className="flex items-center justify-end gap-2 text-live">
          <span className="live-dot" aria-hidden />
          <span className="font-medium tracking-wide">LIVE</span>
        </div>
        <div className="mt-1 text-ink-muted tabular-nums">
          {formatClock(now)} <span className="text-[10px]">ET</span>
        </div>
      </div>
    </motion.header>
  )
}
