interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      </div>
    </header>
  )
}
