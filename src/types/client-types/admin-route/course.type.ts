import type { AppRouter } from '@/server/api/root'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>

export type TPagingCourse = RouterOutput['admin']['getPagingCourses']
