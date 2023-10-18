import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { pagingDataReturn } from '@/utils'

import { z } from 'zod'

export const adminRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string(),
        level: z.number(),
        type: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, level, type } = input
      try {
        const course = await ctx.db.course.create({
          data: {
            name,
            description,
            level,
            type
          }
        })
        return course
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  getPagingCourses: protectedProcedure
    .input(z.object({ page: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { page } = input
      try {
        const courses = await ctx.db.course.findMany({
          skip: (page - 1) * 10,
          take: 10,
          where: {
            isTemplate: true
          }
        })

        const questions = await ctx.db.question.findMany({
          where: {
            courseId: {
              in: courses.map((course) => course.id)
            }
          }
        })

        const result = courses.map((course) => {
          const courseQuestions = questions.filter(
            (question) => question.courseId === course.id
          )
          return {
            ...course,
            questions: courseQuestions
          }
        })

        const total = await ctx.db.course.count()

        return pagingDataReturn({ items: result || [], page, total })
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    })
})
