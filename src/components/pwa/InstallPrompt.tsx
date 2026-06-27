import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const installedHandler = () => {
      setInstalled(true)
      setShow(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
    setShow(false)
  }

  if (installed || !show) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-card border shadow-xl rounded-xl p-4 flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Install Rubix</p>
          <p className="text-xs text-muted-foreground">Add to your home screen for offline use</p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Install
        </button>
        <button
          onClick={() => setShow(false)}
          className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
