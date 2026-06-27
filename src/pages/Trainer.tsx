import { useState, useEffect, useRef, useCallback } from 'react'
import { Check, Shuffle } from 'lucide-react'
import { useTimerStore } from '../stores/timerStore'
import { useLibraryStore } from '../stores/libraryStore'
import { useProgressStore } from '../stores/progressStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useAuthStore } from '../stores/authStore'
import { db } from '../services/db'
import { generateScramble, eventLabels } from '../services/scramble'
import { formatTime, ao5, ao12 } from '../utils/helpers'
import { AlgorithmCube } from '../components/cube/AlgorithmCube'
import { formatNotation, countMoves } from '../utils/notation'
import type { WCAEvent, Algorithm } from '../types/database'

function getStepMask(stepId: string): string | undefined {
  if (stepId.startsWith('oll_')) return 'oll'
  return undefined
}

type Mode = 'scramble' | 'alg'

export function Trainer() {
  const ts = useTimerStore()
  const { steps, loadSteps } = useLibraryStore()
  const { progressMap, loadProgress, setStatus } = useProgressStore()
  const { collections, loadCollections } = useCollectionStore()
  const { user } = useAuthStore()
  const userId = user?.id || 'local'

  const [mode, setMode] = useState<Mode>('scramble')
  const [stepFilter, setStepFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [collectionFilter, setCollectionFilter] = useState<string>('')
  const [currentAlg, setCurrentAlg] = useState<Algorithm | null>(null)
  const [availableAlgs, setAvailableAlgs] = useState<Algorithm[]>([])
  const [event, setEvent] = useState<WCAEvent>('333')
  const [isHolding, setIsHolding] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [view3d, setView3d] = useState(false)

  const holdStartRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const inspectionRef = useRef<number | null>(null)
  const modeRef = useRef(mode)
  const currentAlgRef = useRef(currentAlg)
  const progressMapRef = useRef(progressMap)
  modeRef.current = mode
  currentAlgRef.current = currentAlg
  progressMapRef.current = progressMap

  useEffect(() => {
    if (user) loadCollections(user.id)
  }, [user])

  useEffect(() => {
    loadSteps('cfop')
  }, [])

  // Load algorithms matching filters (alg mode only)
  useEffect(() => {
    if (mode !== 'alg') {
      setAvailableAlgs([])
      setCurrentAlg(null)
      return
    }
    const load = async () => {
      let algs = await db.algorithms.where('userId').equals(userId).toArray()

      if (stepFilter) {
        algs = algs.filter(a => a.stepId === stepFilter)
      }

      if (collectionFilter) {
        const col = collections.find(c => c.id === collectionFilter)
        if (col) {
          algs = algs.filter(a => col.algorithmIds.includes(a.id))
        }
      }

      if (statusFilter) {
        await loadProgress(userId, algs.map(a => a.id))
        algs = algs.filter(a => {
          const s = progressMapRef.current[a.id]?.status || 'none'
          return s === statusFilter
        })
      }

      setAvailableAlgs(algs)
      setShowSolution(false)

      if (algs.length > 0) {
        const pick = algs[Math.floor(Math.random() * algs.length)]
        setCurrentAlg(pick)
      } else {
        setCurrentAlg(null)
      }
    }
    load()
  }, [mode, stepFilter, statusFilter, collectionFilter, userId, collections.length])

  const newScramble = useCallback(() => {
    ts.setScramble(generateScramble(event))
  }, [event])

  const pickRandomAlg = useCallback(() => {
    if (availableAlgs.length > 0) {
      ts.reset()
      const pick = availableAlgs[Math.floor(Math.random() * availableAlgs.length)]
      setCurrentAlg(pick)
      setShowSolution(false)
      setView3d(false)
    }
  }, [availableAlgs])

  useEffect(() => {
    newScramble()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (inspectionRef.current) clearInterval(inspectionRef.current)
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code !== 'Space') return
    e.preventDefault()
    const timerState = useTimerStore.getState()

    if (!isHolding) {
      setIsHolding(true)
      holdStartRef.current = Date.now()

      if (timerState.isRunning) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        timerState.setRunning(false)
        timerState.addSolve(timerState.currentTime)
        timerState.setCurrentTime(0)

        const alg = currentAlgRef.current
        const pmap = progressMapRef.current
        if (modeRef.current === 'alg' && alg) {
          const existing = pmap[alg.id]
          const time = timerState.currentTime
          const best = existing?.bestTime ? Math.min(existing.bestTime, time) : time
          const attempts = (existing?.attempts || 0) + 1
          const avg = existing?.avgTime
            ? Math.round((existing.avgTime * (attempts - 1) + time) / attempts)
            : time
          setStatus(userId, alg.id, existing?.status || 'learning')
          db.userProgress.where('[userId+algorithmId]').equals([userId, alg.id]).modify(p => {
            p.bestTime = best
            p.avgTime = avg
            p.attempts = attempts
            p.lastPracticed = Date.now()
          })
        }
      }
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code !== 'Space') return
    e.preventDefault()
    setIsHolding(false)
    const timerState = useTimerStore.getState()
    const holdDuration = Date.now() - holdStartRef.current

    if (holdDuration > 500 && !timerState.isRunning) {
      timerState.setInspecting(true)
      timerState.setInspectionTime(15)
      let insp = 15
      inspectionRef.current = setInterval(() => {
        insp--
        timerState.setInspectionTime(insp)
        if (insp <= 0) {
          if (inspectionRef.current) clearInterval(inspectionRef.current)
          timerState.setInspecting(false)
          timerState.setRunning(true)
          let ms = 0
          timerRef.current = setInterval(() => {
            ms += 10
            timerState.setCurrentTime(ms)
          }, 10)
        }
      }, 1000)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isHolding])

  const startSolve = () => {
    setShowSolution(false)
    if (mode === 'alg') {
      pickRandomAlg()
    } else {
      ts.reset()
      newScramble()
    }
  }

  const avg5 = ao5(ts.previousSolves)
  const avg12 = ao12(ts.previousSolves)
  const best = ts.previousSolves.length > 0 ? Math.min(...ts.previousSolves) : null

  const mask = currentAlg ? getStepMask(currentAlg.stepId) : undefined

  const currentStep = steps.find(s => s.id === currentAlg?.stepId)
  const supports3d = currentStep?.viewMode === '3d'
  const algView = view3d && supports3d ? '3d' as const : 'plan' as const

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 pb-20 md:pb-4">
      <div className="w-full max-w-md space-y-4">
        {/* Top bar: mode toggle + event selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('scramble')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${mode === 'scramble' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent'}`}
          >
            Scramble
          </button>
          <button
            onClick={() => setMode('alg')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${mode === 'alg' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent'}`}
          >
            Algorithm
          </button>

          {mode === 'scramble' && (
            <select
              value={event}
              onChange={(e) => { setEvent(e.target.value as WCAEvent); ts.setScramble(generateScramble(e.target.value as WCAEvent)) }}
              className="ml-auto text-sm bg-background border rounded-lg px-2 py-1"
            >
              {Object.entries(eventLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          )}
        </div>

        {/* --- SCRAMBLE MODE --- */}
        {mode === 'scramble' && (
          <div className="bg-card rounded-xl p-4 text-center">
            <code className="text-sm font-mono leading-relaxed break-all">{ts.scramble}</code>
          </div>
        )}

        {/* --- ALGORITHM MODE --- */}
        {mode === 'alg' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={stepFilter}
                onChange={(e) => setStepFilter(e.target.value)}
                className="text-xs bg-background border rounded-lg px-2 py-1.5"
              >
                <option value="">All steps</option>
                {steps.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-background border rounded-lg px-2 py-1.5"
              >
                <option value="">All status</option>
                <option value="none">None</option>
                <option value="learning">Learning</option>
                <option value="learned">Learned</option>
              </select>
              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="text-xs bg-background border rounded-lg px-2 py-1.5"
              >
                <option value="">All collections</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={pickRandomAlg}
                className="text-xs px-2 py-1.5 rounded-lg border hover:bg-accent transition-colors"
                title="Pick random algorithm"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Algorithm card */}
            {currentAlg && (
              <div className="bg-card rounded-xl p-3 border">
                <div className="flex items-center gap-4">
                  <AlgorithmCube alg={currentAlg.notation} setup={currentAlg.setup} size={80} view={algView} mask={mask} arrows={currentAlg.arrows} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{currentAlg.name}</div>
                    {currentAlg.setup && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-muted-foreground">Setup:</span>
                        <code className="text-[11px] font-mono text-muted-foreground bg-muted px-1 py-0.5 rounded">
                          {currentAlg.setup}
                        </code>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-0.5">{countMoves(currentAlg.notation)} moves</div>
                    {supports3d && (
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => setView3d(false)}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${!view3d ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        >
                          Plan
                        </button>
                        <button
                          onClick={() => setView3d(true)}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${view3d ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        >
                          3D
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {showSolution && (
                  <code className="block text-xs font-mono text-muted-foreground break-all leading-relaxed mt-2 pt-2 border-t">
                    {formatNotation(currentAlg.notation)}
                    {currentAlg.altNotations && currentAlg.altNotations.length > 0 && (
                      <span className="block text-xs text-muted-foreground mt-1">
                        Alt: {currentAlg.altNotations.join(', ')}
                      </span>
                    )}
                  </code>
                )}
                {!showSolution && (
                  <button
                    onClick={() => setShowSolution(true)}
                    className="mt-2 w-full py-1.5 text-xs bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Show Solution
                  </button>
                )}
              </div>
            )}

            {availableAlgs.length === 0 && (stepFilter || statusFilter || collectionFilter) && (
              <div className="bg-card rounded-xl p-4 text-center text-sm text-muted-foreground">
                No algorithms match the selected filters.
              </div>
            )}
          </>
        )}
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center gap-2 my-8">
        {ts.isInspecting ? (
          <div className="text-6xl font-bold tabular-nums animate-pulse text-yellow-500">
            {ts.inspectionTime}
          </div>
        ) : (
          <div className={`text-6xl font-bold tabular-nums tracking-tight ${ts.isRunning ? 'text-green-500' : ''}`}>
            {formatTime(ts.currentTime)}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {ts.isRunning ? 'Release to stop' : ts.isInspecting ? 'Inspection...' : isHolding ? 'Hold to start...' : 'Hold spacebar to start'}
        </p>
      </div>

      {/* Stats */}
      <div className="w-full max-w-md space-y-3">
        {ts.lastSolve !== null && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span className="font-mono">{formatTime(ts.lastSolve)}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-card rounded-lg p-2">
            <div className="text-xs text-muted-foreground">ao5</div>
            <div className="font-mono font-medium">{avg5 ? formatTime(avg5) : '-'}</div>
          </div>
          <div className="bg-card rounded-lg p-2">
            <div className="text-xs text-muted-foreground">ao12</div>
            <div className="font-mono font-medium">{avg12 ? formatTime(avg12) : '-'}</div>
          </div>
          <div className="bg-card rounded-lg p-2">
            <div className="text-xs text-muted-foreground">Best</div>
            <div className="font-mono font-medium">{best ? formatTime(best) : '-'}</div>
          </div>
        </div>

        {ts.previousSolves.length > 0 && (
          <div className="bg-card rounded-lg p-2 max-h-24 overflow-y-auto">
            <div className="text-xs text-muted-foreground mb-1">Recent solves</div>
            <div className="flex flex-wrap gap-1">
              {ts.previousSolves.slice(0, 20).map((t, i) => (
                <span key={i} className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
                  {formatTime(t)}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startSolve}
          className="w-full py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
        >
          {mode === 'alg' ? 'Next Algorithm' : 'Next Solve'}
        </button>
      </div>
    </div>
  )
}
