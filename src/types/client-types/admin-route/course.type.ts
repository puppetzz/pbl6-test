import type { AppRouter } from '@/server/api/root'
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type RouterInput = inferRouterInputs<AppRouter>

export type TPagingCourse = RouterOutput['admin']['getPagingCourses']
export type TCreateCourseInput = RouterInput['admin']['createCourse']
export type TUpdateCourseInput = RouterInput['admin']['updateCourse']
