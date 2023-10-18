import { cn } from '@/lib/utils'

type StatusAlertProps = {
  className?: string
  status: 'draft' | 'published'
}

const StatusAlert = ({ status, className }: StatusAlertProps) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span
        className={cn('aspect-square w-2 rounded-full', {
          'bg-pending': status === 'draft',
          'bg-success': status === 'published'
        })}
      ></span>
      <span className="text-sm capitalize">{status}</span>
    </div>
  )
}

export default StatusAlert
