import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, type TabProps } from '../ui/tabs'

export type TRouterTabItem = {
  label: string
  value: string
  href: string
}

type TClasses = {
  root?: string
  list?: string
  trigger?: string
}

type TRouterTabsProps = Omit<TabProps, 'value'> & {
  className?: string
  classes?: TClasses
  items: TRouterTabItem[]
}

export const RouterTabs = ({
  items,
  className,
  classes,
  variant
}: TRouterTabsProps) => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('')

  useEffect(() => {
    const activeTab = items.find((item) => item.href === router.asPath)
    if (activeTab) {
      setCurrentTab(activeTab.value)
    }
  }, [router?.asPath, items])

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => setCurrentTab(value)}
      className={cn(className, classes?.root)}
    >
      <TabsList className={cn(classes?.list)}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            variant={variant}
            className={cn(classes?.trigger)}
            onClick={() => void router.push(item.href)}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
