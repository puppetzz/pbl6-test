import { cn } from '@/lib/utils'

type StatusAlertProps = {
  className?: string
  status: 'draft' | 'published'
  customStatusMessage?: string
}

const StatusAlert = ({
  status,
  className,
  customStatusMessage
}: StatusAlertProps) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span
        className={cn('aspect-square w-2 rounded-full', {
          'bg-pending': status === 'draft',
          'bg-success': status === 'published'
        })}
      ></span>
      <span className="text-sm capitalize">
        {customStatusMessage || status}
      </span>
    </div>
  )
}

export default StatusAlert
