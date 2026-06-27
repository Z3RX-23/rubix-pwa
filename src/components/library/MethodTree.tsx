import { ChevronDown, ChevronRight } from 'lucide-react'
import { useLibraryStore } from '../../stores/libraryStore'
import { cn } from '../../utils/helpers'

export function MethodTree() {
  const { methods, steps, selectedMethod, selectedStep, selectMethod, selectStep } = useLibraryStore()

  const topSteps = steps.filter(s => !s.parentId)
  const childSteps = (parentId: string) => steps.filter(s => s.parentId === parentId)

  return (
    <nav className="space-y-1">
      {methods.map(method => (
        <div key={method.id}>
          <button
            onClick={() => selectMethod(selectedMethod === method.id ? null : method.id)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              selectedMethod === method.id && 'bg-accent font-medium'
            )}
          >
            {selectedMethod === method.id ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="font-semibold">{method.name}</span>
            <span className="text-[10px] text-muted-foreground ml-auto">{steps.length} steps</span>
          </button>

          {selectedMethod === method.id && (
            <div className="ml-2 space-y-0.5 mt-0.5">
              {topSteps.map(step => {
                const children = childSteps(step.id)
                return (
                  <div key={step.id}>
                    <button
                      onClick={() => selectStep(step.id)}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-lg transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        selectedStep === step.id && 'bg-accent text-accent-foreground font-medium'
                      )}
                    >
                      {step.abbr}
                      <span className="text-[10px] text-muted-foreground">{step.name}</span>
                      {children.length > 0 && (
                        <span className="text-[10px] text-muted-foreground ml-auto">+{children.length}</span>
                      )}
                    </button>
                    {children.length > 0 && (
                      <div className="ml-3 border-l pl-2 space-y-0.5 mt-0.5">
                        {children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => selectStep(child.id)}
                            className={cn(
                              'flex items-center gap-2 w-full px-3 py-1 text-xs rounded-lg transition-colors',
                              'hover:bg-accent hover:text-accent-foreground',
                              selectedStep === child.id && 'bg-accent text-accent-foreground font-medium'
                            )}
                          >
                            {child.abbr}
                            <span className="text-[10px] text-muted-foreground">{child.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
