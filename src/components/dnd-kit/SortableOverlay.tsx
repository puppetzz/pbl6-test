import { type ReactNode } from 'react'
import { type DropAnimation } from '@dnd-kit/core'
import { defaultDropAnimationSideEffects, DragOverlay } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}

export function SortableOverlay({ children }: { children: ReactNode }) {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  )
}
