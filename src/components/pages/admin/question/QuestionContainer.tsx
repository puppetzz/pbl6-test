import { type Questions } from '@/types'
import { Inbox } from 'lucide-react'
import QuestionCard from './QuestionCard'
import { cn } from '@/lib/utils'

type CourseContainerProps = {
  className?: string
  questions: Questions
  loadingStatus: 'idle' | 'loading' | 'success' | 'error'
}

const QuestionContainer = ({
  className,
  questions,
  loadingStatus
}: CourseContainerProps) => {
  if (
    !questions.length &&
    (loadingStatus === 'idle' || loadingStatus === 'loading')
  ) {
    return <div className="text-center">loading...</div>
  }

  if (!questions?.length) {
    return (
      <div className="flex flex-col items-center">
        <Inbox className="text-muted-foreground" width={48} height={48} />
        <span className="text-muted-foreground">No course found</span>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2 lg:grid-cols-2', className)}>
      {questions?.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}

export default QuestionContainer
