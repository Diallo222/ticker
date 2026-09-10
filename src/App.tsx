import { BootIntro } from './components/BootIntro'
import { Desk } from './components/Desk'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useCallback, useState } from 'react'

export default function App() {
  const [booting, setBooting] = useState(true)
  const finishBoot = useCallback(() => setBooting(false), [])

  return (
    <ErrorBoundary>
      {booting && <BootIntro onComplete={finishBoot} />}
      {!booting && <Desk />}
    </ErrorBoundary>
  )
}
