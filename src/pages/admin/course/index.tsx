import AdminLayout from '@/components/layouts/AdminLayout'
import { PageHeader as CoursePageHeader } from '@/components/pages/admin/common/PageHeader'
import CourseContainer from '@/components/pages/admin/course/CourseContainer'
import CreateCourseForm from '@/components/pages/admin/course/CreateCourseForm'
import { type TPagingCourse } from '@/types/client.type'
import { api } from '@/utils/api'
import { useState, type ReactElement, createContext, useCallback } from 'react'
import { Waypoint } from 'react-waypoint'

export type TCoursePageContext = {
  refetch: () => void
}

export const CoursePageContext = createContext<TCoursePageContext>({
  refetch: () => {
    return
  }
})

const Course = () => {
  const [page, setPage] = useState(1)
  const [courses, setCourses] = useState<TPagingCourse>()
  const { data, mutate, status } = api.admin.getPagingCourses.useMutation({
    onSuccess: (data) => {
      setCourses((prev) => ({
        ...data,
        items: [...(prev?.items || []), ...(data?.items || [])]
      }))
    }
  })

  const handleOnEnter = () => {
    if (!data?.items || data?.hasMore) {
      mutate({
        page
      })
      setPage((prev) => prev + 1)
    }
  }

  const refetch = useCallback(() => {
    setCourses(undefined)
    mutate({
      page: 1
    })
  }, [])

  return (
    <CoursePageContext.Provider value={{ refetch }}>
      <div className="mx-4">
        <CoursePageHeader
          className="mb-2"
          pageName="Course"
          description="
          Build courses and publish to users
        "
        />
        <CreateCourseForm
          className="mb-2"
          refetch={() => {
            setCourses(undefined)
            mutate({
              page: 1
            })
          }}
        />
        <CourseContainer
          courses={courses?.items || []}
          loadingStatus={status}
        />
        <Waypoint onEnter={handleOnEnter} />
      </div>
    </CoursePageContext.Provider>
  )
}

Course.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Course
