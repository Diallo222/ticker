import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ticker desk error:', error, info.componentStack)
  }

  private reload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center">
          <div className="grain pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative z-[1] max-w-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Fatal
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink md:text-4xl">
              Desk failed to load
            </h1>
            <p className="mt-3 font-mono text-[12px] leading-relaxed text-ink-muted">
              Something broke while rendering the markets terminal. Reload to try again.
            </p>
            <button
              type="button"
              onClick={this.reload}
              className="mt-8 border border-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
