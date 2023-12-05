import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const dividerVariants = cva('content-divider-horizontal', {
  variants: {
    variant: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center'
    }
  },
  defaultVariants: {
    variant: 'start'
  }
})

type TClasses = {
  root?: string
  label?: string
}

type TTimeStampDividerProps = VariantProps<typeof dividerVariants> & {
  label?: string
  className?: string
  classes?: TClasses
}

export const TimeStampDivider = ({
  className,
  classes,
  label,
  variant
}: TTimeStampDividerProps) => {
  return (
    <div
      className={cn(
        dividerVariants({ variant, className: cn(className, classes?.root) })
      )}
    >
      {!!label && (
        <span className={cn('z-[1] bg-background px-2', classes?.label)}>
          {label}
        </span>
      )}
    </div>
  )
}
