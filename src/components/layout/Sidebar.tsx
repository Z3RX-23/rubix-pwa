import { BookOpen, Clock, FolderHeart, User } from 'lucide-react'
import { cn } from '../../utils/helpers'

const sidebarItems = [
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'trainer', label: 'Trainer', icon: Clock },
  { id: 'collections', label: 'Collections', icon: FolderHeart },
  { id: 'profile', label: 'Profile', icon: User },
]

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-card h-screen sticky top-0">
      <div className="flex items-center gap-2 px-4 h-14 border-b">
        <div className="w-6 h-6 rounded bg-primary" />
        <span className="font-bold">Rubix</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors',
              currentPage === item.id
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
