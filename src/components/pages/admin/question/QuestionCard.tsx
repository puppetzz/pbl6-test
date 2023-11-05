import { type Questions } from '@/types'
import { levelTransformer } from '@/utils/tools.util'

type QuestionCardHeaderProps = {
  level: number
}
const QuestionCardHeader = ({ level }: QuestionCardHeaderProps) => {
  return <div>{levelTransformer(level, 'toString')}</div>
}

type QuestionCardProps = {
  question: Questions[number]
}
const QuestionCard = ({ question }: QuestionCardProps) => {
  console.log(question)
  return (
    <div className="border">
      <QuestionCardHeader level={question.level} />
    </div>
  )
}

export default QuestionCard
