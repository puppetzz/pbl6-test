import AdminLayout from '@/components/layouts/AdminLayout'
import { useState, type ReactElement } from 'react'
import { DndContext } from '@dnd-kit/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { createCourseSchema } from '../../../schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { PageHeader as CoursePageHeader } from '@/components/pages/admin/common/PageHeader'
import { api } from '@/utils/api'
import { Waypoint } from 'react-waypoint'
import { type PaginatedResponse } from '@/types/responseType.type'
import { type Question, type Course as TCourse } from '@prisma/client'
import CourseContainer from '@/components/pages/admin/course/CourseContainer'
import { type TPagingCourse } from '@/types/client.type'
import CreateCourseForm from '@/components/pages/admin/course/CreateCourseForm'

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

  const courseForm = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {}
  })

  return (
    <div className="mx-4">
      <CoursePageHeader
        className="mb-2"
        pageName="Course"
        description="
        Build courses and publish to users
      "
      />
      <CreateCourseForm className="mb-2" />
      <CourseContainer courses={courses?.items || []} loadingStatus={status} />
      <Waypoint onEnter={handleOnEnter} />
      <Form {...courseForm}>
        <form></form>
      </Form>
    </div>
  )
}

Course.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Course
