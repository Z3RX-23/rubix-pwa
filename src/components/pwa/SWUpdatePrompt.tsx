import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export function SWUpdatePrompt() {
  const [waitingSW, setWaitingSW] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const registerSW = async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return

      if (registration.waiting) {
        setWaitingSW(registration.waiting)
        return
      }

      const onUpdateFound = () => {
        const sw = registration.installing
        if (!sw) return
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingSW(sw)
          }
        })
      }

      registration.addEventListener('updatefound', onUpdateFound)
    }

    registerSW()

    const onControllerChange = () => window.location.reload()
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
  }, [])

  const handleUpdate = () => {
    if (waitingSW) {
      waitingSW.postMessage({ type: 'SKIP_WAITING' })
    }
    setWaitingSW(null)
  }

  if (!waitingSW) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-card border shadow-xl rounded-xl p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Update available</p>
          <p className="text-xs text-muted-foreground">A new version is ready</p>
        </div>
        <button
          onClick={handleUpdate}
          className="shrink-0 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload
        </button>
      </div>
    </div>
  )
}
