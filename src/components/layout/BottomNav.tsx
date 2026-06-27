import { BookOpen, Clock, FolderHeart, User } from 'lucide-react'
import { cn } from '../../utils/helpers'

const navItems = [
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'trainer', label: 'Trainer', icon: Clock },
  { id: 'collections', label: 'Collections', icon: FolderHeart },
  { id: 'profile', label: 'Profile', icon: User },
]

interface BottomNavProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
              currentPage === item.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
