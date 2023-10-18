import { cn } from '@/lib/utils'

import { MenuBox } from './MenuBox'
import { UserBox } from './UserBox'

interface TopBarProps {
  className?: string
}

const TopBar = ({ className = '' }: TopBarProps) => {
  return (
    <div
      className={cn(
        'bg-background text-foreground top-bar-height flex px-12 items-center gap-4',
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
