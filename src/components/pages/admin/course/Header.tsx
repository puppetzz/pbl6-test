import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

type HeaderProps = {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="mb-2">Breadcrumbs</span>
      <span className="text-4xl font-bold">Course</span>
      <span className="text-md font-light text-muted-foreground">
        Building courses and publish to users
      </span>
      <div className="mt-2 flex w-fit cursor-pointer items-center rounded-md border-2 border-black p-2 transition-all hover:border-success hover:text-success">
        <Plus />
        <span>Add course</span>
      </div>
    </div>
  )
}
