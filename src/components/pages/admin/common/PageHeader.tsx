import { cn } from '@/lib/utils'

type PageHeaderProps = {
  className?: string
  pageName: string
  description: string
}

export const PageHeader = ({
  className,
  pageName,
  description
}: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="mb-2">Breadcrumbs</span>
      <span className="text-4xl font-bold">{pageName}</span>
      <span className="text-md font-light text-muted-foreground">
        {description}
      </span>
    </div>
  )
}
