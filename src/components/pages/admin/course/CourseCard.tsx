import StatusAlert from '@/components/common/StatusAlert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { type TPagingCourse } from '@/types/client.type'
import { getLevelLabel } from '@/utils/renderLabel.util'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type CourseCardProps = {
  className?: string
  course: TPagingCourse['items'][number]
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  const level = getLevelLabel(course.level)

  return (
    <div className="flex overflow-hidden rounded-lg bg-neutral-50 shadow-md">
      <div
        className={cn('flex basis-1/4 flex-col gap-2.5 p-5', {
          'bg-beginner': level === 'Beginner',
          'bg-intermediate': level === 'Intermediate',
          'bg-advanced': level === 'Advanced'
        })}
      >
        <span className="text-xs uppercase tracking-widest text-white/60">
          course
        </span>
        <h5
          className={cn('text-xl', {
            'text-beginner-foreground': level === 'Beginner',
            'text-intermediate-foreground': level === 'Intermediate',
            'text-advanced-foreground': level === 'Advanced'
          })}
        >
          {course.name}
        </h5>
        <Link
          href={`/admin/course/${course.id}`}
          className="group mt-auto flex w-fit items-center text-[0.7rem] text-white/60"
        >
          View all chapters{' '}
          <ChevronRight className="transition-all group-hover:ml-1" />
        </Link>
      </div>
      <div className="flex grow flex-col justify-between p-5">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-black/60">
              chapter 1
            </span>
            <h1 className="text-2xl">{course.name}</h1>
            <p className="line-clamp-2 h-12 text-black/70">
              {course.description}
            </p>
          </div>
          <div className="flex basis-[30%] flex-col gap-1">
            <Progress value={60} className="h-2 w-full bg-black/5" />
            <span className="ml-auto text-[0.7rem]">6/10 steps</span>
          </div>
        </div>
        <div className="flex justify-between">
          <StatusAlert
            status={course.isPublished ? 'published' : 'draft'}
            className="w-fit"
          />
          <div className="grid grid-cols-2 gap-1">
            <Button className="rounded-full">Edit course</Button>
            {course.isPublished ? (
              <Button className="rounded-full">Draft back</Button>
            ) : (
              <Button className="rounded-full">Publish</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
