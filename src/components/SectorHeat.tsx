import { formatPercent } from '../lib/format'
import type { SectorHeat as SectorHeatType } from '../lib/marketEngine'

interface SectorHeatProps {
  sectors: SectorHeatType[]
}

export function SectorHeat({ sectors }: SectorHeatProps) {
  return (
    <section className="flex h-full flex-col" aria-label="Sector performance">
      <div className="border-b border-ink/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted md:px-5">
        Sectors
      </div>
      <div className="grid flex-1 grid-cols-2 gap-px bg-ink/12 p-px">
        {sectors.map((s) => {
          const up = s.changePct >= 0
          const intensity = Math.min(Math.abs(s.changePct) / 2.2, 1)
          const bg = up
            ? `color-mix(in srgb, var(--color-up) ${8 + intensity * 18}%, var(--color-paper))`
            : `color-mix(in srgb, var(--color-down) ${8 + intensity * 18}%, var(--color-paper))`

          return (
            <div
              key={s.id}
              className="flex flex-col justify-between px-3 py-3 md:px-4"
              style={{ backgroundColor: bg }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                {s.label}
              </span>
              <span
                className={`mt-3 font-mono text-sm font-medium tabular-nums ${up ? 'text-up' : 'text-down'}`}
              >
                {formatPercent(s.changePct)}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
