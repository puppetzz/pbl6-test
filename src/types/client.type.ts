import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@/server/api/root'

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

export type TPagingCourse = RouterOutput['admin']['getPagingCourses']
