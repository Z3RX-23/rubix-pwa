import { useEffect, useRef } from 'react'

function arrowToString(a: { s1: { face: number; n: number }; s2: { face: number; n: number }; color?: string; scale?: number }) {
  const faceNames = ['U', 'R', 'F', 'D', 'L', 'B']
  const color = (a.color ?? '#000').replace(/^#/, '')
  return `${faceNames[a.s1.face]}${a.s1.n}${faceNames[a.s2.face]}${a.s2.n}-s${a.scale ?? 10}-${color}`
}

function stripRotations(alg: string): string {
  return alg.split(/\s+/).filter(m => !/^[xyz]/.test(m)).join(' ')
}

export function AlgorithmCube({ alg, size = 150, showCase = true, view = 'plan', mask, arrows }: { alg: string; size?: number; showCase?: boolean; view?: 'plan' | '3d'; mask?: string; arrows?: { s1: { face: number; n: number }; s2: { face: number; n: number }; color?: string; scale?: number }[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrowsKey = arrows ? JSON.stringify(arrows) : ''

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false

    ;(async () => {
      try {
        const mod = await import('sr-visualizer')
        if (cancelled) return
        container.innerHTML = ''

        const arrowsStr = (arrows ?? []).map(arrowToString).join(',')

        const caseAlg = showCase ? stripRotations(alg) : undefined

        mod.default.cubeSVG(container, {
          ...(view === 'plan' ? { view: 'plan', dist: 5 } : { dist: 3 }),
          case: caseAlg,
          algorithm: showCase ? undefined : alg,
          ...(mask === 'oll' ? { mask: mod.default.Masking.OLL } : {}),
          backgroundColor: 'transparent',
          arrows: arrowsStr,
        })
      } catch {
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;font-size:11px;color:#666;">Cube error</div>`
      }
    })()

    return () => { cancelled = true }
  }, [alg, size, showCase, view, mask, arrowsKey])

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
  )
}
