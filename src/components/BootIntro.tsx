import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STEPS = ['Preparing desk', 'Opening session', 'Connecting feed'] as const

interface BootIntroProps {
  onComplete: () => void
}

export function BootIntro({ onComplete }: BootIntroProps) {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(() => {
        setVisible(false)
      }, 350)
      return () => window.clearTimeout(t)
    }

    const stepMs = 520
    const timers: number[] = []

    STEPS.forEach((_, i) => {
      if (i === 0) return
      timers.push(window.setTimeout(() => setStep(i), stepMs * i))
    })

    timers.push(
      window.setTimeout(() => setVisible(false), stepMs * STEPS.length + 320),
    )

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [reduceMotion])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading Ticker"
        >
          <div className="grain pointer-events-none absolute inset-0" aria-hidden />

          <motion.div
            className="relative z-[1] w-full max-w-md text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              Markets desk
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.5rem,12vw,5.5rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
              Ticker
            </h1>

            <div className="mx-auto mt-10 h-px w-full max-w-[220px] overflow-hidden bg-ink/15">
              <motion.div
                className="boot-progress h-full origin-left bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (step + 1) / STEPS.length }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              {STEPS[step]}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
