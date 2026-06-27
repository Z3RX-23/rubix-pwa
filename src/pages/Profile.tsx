import { useState } from 'react'
import { LogIn, UserPlus, LogOut, Cloud, CheckCircle2, Download } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useSyncStore } from '../stores/syncStore'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function Profile() {
  const { user, loading, signIn, signUp, signOut } = useAuthStore()
  const { status, lastSync } = useSyncStore()
  const { canInstall, installed, install } = useInstallPrompt()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const err = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password)

    if (err) setError(err)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>

      {/* Sync status */}
      <div className="bg-card rounded-lg p-4 space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Email: </span>
          {user?.email || 'Offline'}
        </div>
        {user && (
          <>
            <div className="flex items-center gap-2 text-sm">
              {status === 'syncing' ? (
                <><Cloud className="w-4 h-4 text-blue-500 animate-pulse" /> Syncing...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 text-green-500" /> Synced</>
              )}
            </div>
            {lastSync && (
              <div className="text-xs text-muted-foreground">
                Last sync: {new Date(lastSync).toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Install PWA */}
      {canInstall && !installed && (
        <button
          onClick={install}
          className="w-full py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20"
        >
          <Download className="w-4 h-4" /> Install App
        </button>
      )}

      {/* Auth */}
      {!user ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button onClick={handleSubmit} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      ) : (
        <button
          onClick={signOut}
          className="w-full py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-destructive/20"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      )}
    </div>
  )
}
