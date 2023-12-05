import { cn } from '@/lib/utils'

import { MenuBox } from './MenuBox'
import { UserBox } from './UserBox'
import { Switch } from '../ui/switch'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import useHasMounted from '@/hooks/useHasMounted'

interface TopBarProps {
  className?: string
}

const TopBar = ({ className = '' }: TopBarProps) => {
  const { theme, setTheme } = useTheme()
  const { hasMounted } = useHasMounted()

  const handleSetTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light')
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }

  return (
    <div
      className={cn(
        'bg-card text-foreground top-bar-height flex px-12 items-center gap-4',
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

      <div className="ml-auto flex items-center gap-3">
        {hasMounted && (
          <Switch
            defaultChecked={hasMounted && theme === 'dark'}
            icon={theme && theme === 'dark' ? <Moon /> : <Sun />}
            onCheckedChange={handleSetTheme}
          />
        )}
        <UserBox />
      </div>
    </div>
  )
}

export default TopBar
