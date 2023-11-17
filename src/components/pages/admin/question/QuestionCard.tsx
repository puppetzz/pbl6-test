import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type Questions } from '@/types'
import { api } from '@/utils/api'
import { levelTransformerToString } from '@/utils'
import {
  ChevronUp,
  ChevronsUp,
  Equal,
  MoreHorizontal,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

type QuestionCardHeaderProps = {
  level: number
}
const classGenerator = (level: number) => {
  switch (level) {
    case 0:
      return 'text-beginner'
    case 1:
      return 'text-intermediate'
    case 2:
      return 'text-advanced'
    default:
      return ''
  }
}
const iconGenerator = (level: number) => {
  switch (level) {
    case 0:
      return <Equal />
    case 1:
      return <ChevronUp />
    case 2:
      return <ChevronsUp />
    default:
      return <Equal />
  }
}

const QuestionCardHeader = ({ level }: QuestionCardHeaderProps) => {
  const [dialogStates, setDialogStates] = useState({
    isDeleteDialogOpen: false,
    isEditDialogOpen: false
  })

  const { mutate: deleteQuestion } = api.admin.deleteQuestion.useMutation()

  return (
    <>
      <div
        className={cn(
          'flex items-center font-bold gap-1',
          classGenerator(level)
        )}
      >
        {iconGenerator(level)}
        <span>{levelTransformerToString(level)}</span>
        <span className="ml-auto rounded-md hover:bg-secondary">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center p-1 text-secondary-foreground">
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  setDialogStates((prev) => ({
                    ...prev,
                    isDeleteDialogOpen: true
                  }))
                }
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </div>
      <Dialog
        open={dialogStates.isDeleteDialogOpen}
        onOpenChange={(value) =>
          setDialogStates((prev) => ({ ...prev, isDeleteDialogOpen: value }))
        }
      >
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <XCircle
              strokeWidth={1.5}
              size={100}
              className="text-destructive"
            />
            <h2 className="text-3xl">Are you sure?</h2>
            <p className="text-center text-sm text-secondary-foreground">
              This action cannot be undone. This will permanently delete the
              question.
            </p>
            <div className="space-x-2">
              <Button
                onClick={() =>
                  setDialogStates((prev) => ({
                    ...prev,
                    isDeleteDialogOpen: false
                  }))
                }
              >
                Cancel
              </Button>
              <Button className="bg-destructive hover:bg-destructive/70">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

type QuestionCardProps = {
  question: Questions[number]
}
const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <div className="rounded-lg border p-4">
      <QuestionCardHeader level={question.level} />
      <div>{question.content}</div>
    </div>
  )
}

export default QuestionCard
