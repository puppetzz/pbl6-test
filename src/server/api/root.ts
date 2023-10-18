import { createTRPCRouter } from '@/server/api/trpc'
import { authRouter } from './routers/auth.router'
import { userRouter } from './routers/user.router'
import { courseRouter } from './routers/course.router'
import { adminRouter } from './routers/admin.router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  course: courseRouter,
  admin: adminRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
