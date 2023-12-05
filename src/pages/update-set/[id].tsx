import { StudySetForm } from '@/components/pages/admin/common/StudySetForm'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'

const EditStudySetPage = () => {
  const router = useRouter()
  const { data: studySet } = api.study.getStudySetById.useQuery({
    id: String(router.query.id)
  })

  return (
    <div className="px-[25%] py-8">
      <StudySetForm defaultValues={studySet} isUpdateStatus />
    </div>
  )
}

export default EditStudySetPage
