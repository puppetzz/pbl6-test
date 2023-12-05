import type { AppRouter } from '@/server/api/root'
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type RouterInput = inferRouterInputs<AppRouter>

export type TStudySetById = RouterOutput['study']['getStudySetById']
