import { useDroppable } from '@dnd-kit/core'
import { type PropsWithChildren } from 'react'

export const Droppable = ({ children }: PropsWithChildren<object>) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable'
  })
  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}
