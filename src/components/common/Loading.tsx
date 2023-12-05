import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type LoadingProps = {
  className?: string
  classes?: {
    wrapper?: string
    loader?: string
  }
}

export const Loading = ({
  className,
  classes: { loader, wrapper } = {
    loader: '',
    wrapper: ''
  }
}: LoadingProps) => {
  return (
    <div className={cn(className, wrapper)}>
      <Loader2 className={cn('animate-spin', loader)} />
    </div>
  )
}
