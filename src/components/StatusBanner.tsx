import type { FeedStatus } from '../hooks/useMarket'

interface StatusBannerProps {
  status: FeedStatus
  onRetry: () => void
}

const COPY: Partial<Record<FeedStatus, { title: string; body: string }>> = {
  offline: {
    title: 'Connection lost',
    body: 'The live feed is paused. Check your network, then retry.',
  },
  reconnecting: {
    title: 'Reconnecting',
    body: 'Restoring the US session feed…',
  },
  error: {
    title: 'Feed error',
    body: 'The desk could not refresh quotes. Try again.',
  },
}

export function StatusBanner({ status, onRetry }: StatusBannerProps) {
  const copy = COPY[status]
  if (!copy) return null

  const showRetry = status === 'offline' || status === 'error'

  return (
    <div
      className="status-banner flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-paper-2 px-5 py-2.5 md:px-8"
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
          {copy.title}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-ink-muted">{copy.body}</p>
      </div>
      {showRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 border border-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Retry
        </button>
      )}
    </div>
  )
}
