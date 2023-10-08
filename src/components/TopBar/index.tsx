import { cn } from '@/lib/utils'

import { UserBox } from './UserBox'
import { MenuBox } from './MenuBox'

interface TopBarProps {
  className?: string
}

const TopBar = ({ className = '' }: TopBarProps) => {
  return (
    <div
      className={cn(
        'bg-background text-foreground min-h-[3.5rem] flex px-12 items-center gap-4',
        className
      )}
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          window.location.href = '/'
        }}
      >
        LOGO
      </div>
      <MenuBox />
      <UserBox className="ml-auto" />
    </div>
  )
}

export default TopBar
