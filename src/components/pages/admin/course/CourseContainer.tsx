import { type TPagingCourse } from '@/types/client.type'
import { Inbox } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { Loading } from '@/components/common/Loading'
import { cn } from '@/lib/utils'

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
  if (!courses?.length && loadingStatus === 'success') {
    return (
      <div className="flex flex-col items-center">
        <Inbox className="text-muted-foreground" width={48} height={48} />
        <span className="text-muted-foreground">No lesson found</span>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2 lg:grid-cols-2', className)}>
      {courses?.map((course) => <CourseCard key={course.id} course={course} />)}
      {(loadingStatus === 'idle' || loadingStatus === 'loading') && (
        <Loading className="col-span-2 flex justify-center p-4" />
      )}
    </div>
  )
}

export default CourseContainer
