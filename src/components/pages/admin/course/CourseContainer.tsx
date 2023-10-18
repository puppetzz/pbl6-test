import { cn } from '@/lib/utils'
import { type Course } from '@prisma/client'
import { Inbox } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { type TPagingCourse } from '@/types/client.type'

type CourseContainerProps = {
  className?: string
  courses: TPagingCourse['items']
  loadingStatus: 'idle' | 'loading' | 'success' | 'error'
}

const CourseContainer = ({
  className,
  courses,
  loadingStatus
}: CourseContainerProps) => {
  if (
    !courses.length &&
    (loadingStatus === 'idle' || loadingStatus === 'loading')
  ) {
    console.log(loadingStatus)
    return <div className="text-center">loading...</div>
  }

  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center">
        <Inbox className="text-muted-foreground" width={48} height={48} />
        <span className="text-muted-foreground">No course found</span>
      </div>
    )
  }

  return (
    <div className="grid gap-2 lg:grid-cols-2">
      {courses?.map((course) => <CourseCard key={course.id} course={course} />)}
    </div>
  )
}

export default CourseContainer
