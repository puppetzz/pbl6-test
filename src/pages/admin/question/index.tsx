import AdminLayout from '@/components/layouts/AdminLayout'
import { PageHeader as QuestionPageHeader } from '@/components/pages/admin/common/PageHeader'
import CreateQuestionForm from '@/components/pages/admin/question/CreateQuestionForm'
import QuestionContainer from '@/components/pages/admin/question/QuestionContainer'
import { api } from '@/utils/api'
import { useEffect, type ReactElement } from 'react'

const QuestionPage = () => {
  const { data, mutate, status } = api.admin.getQuestions.useMutation()
  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-4 space-y-2">
      <QuestionPageHeader
        pageName="Question"
        description="Create question templates to be used in courses"
      />
      <CreateQuestionForm refetch={mutate} />
      <QuestionContainer questions={data || []} loadingStatus={status} />
    </div>
  )
}

QuestionPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}
export default QuestionPage
