import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { pagingDataReturn } from '@/utils'

import { z } from 'zod'

export const courseRouter = createTRPCRouter({
  getPagingCourses: protectedProcedure
    .input(z.object({ page: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { page } = input
      try {
        const courses = await ctx.db.course.findMany({
          skip: (page - 1) * 10,
          take: 10
        })
        const total = await ctx.db.course.count()

        return pagingDataReturn({ items: courses || [], page, total })
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    })
})
