import { type CSSProperties, type PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import {
  type DraggableSyntheticListeners,
  type UniqueIdentifier
} from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '../ui/button'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  id: UniqueIdentifier
  className?: string
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  ref(node: HTMLElement | null): void
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {
    return
  }
})

export function SortableItem({
  children,
  id,
  className
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({
    id
  })
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  )
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className={cn('flex rounded-md border px-4 py-1', className)}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  )
}

type DragHandleProps = {
  className?: string
}

export function DragHandle({ className }: DragHandleProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { attributes, listeners, ref } = useContext(SortableItemContext)

  return (
    <Button
      className={cn('!p-0', className)}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <GripVertical size={24} className="text-foreground" />
    </Button>
  )
}
