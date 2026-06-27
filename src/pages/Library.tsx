import { useEffect } from 'react'
import { MethodTree } from '../components/library/MethodTree'
import { AlgorithmList } from '../components/library/AlgorithmList'
import { useLibraryStore } from '../stores/libraryStore'
import { db } from '../services/db'

export function Library() {
  const { selectedStep, algorithms, steps } = useLibraryStore()
  const step = steps.find(s => s.id === selectedStep)

  useEffect(() => {
    db.steps.orderBy('order').toArray().then(allSteps => {
      if (allSteps.length > 0) {
        useLibraryStore.setState({ steps: allSteps })
      }
    })
  }, [])

  return (
    <div className="flex flex-1 h-full">
      <div className="w-56 border-r hidden sm:block p-2 overflow-y-auto">
        <MethodTree />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="sm:hidden mb-3">
          <MethodTree />
        </div>
        {step && (
          <div className="mb-3 text-sm text-muted-foreground">
            {step.name} — {algorithms.length} algorithms
          </div>
        )}
        <AlgorithmList />
      </div>
    </div>
  )
}
