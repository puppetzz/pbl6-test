import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { pagingDataReturn } from '@/utils'
import { createId } from '@paralleldrive/cuid2'
import sortBy from 'lodash/sortBy'

import { z } from 'zod'

export const adminRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string(),
        level: z.number(),
        type: z.string(),
        questionIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { questionIds, ...rest } = input
      try {
        const course = await ctx.db.course.create({
          data: {
            ...rest,
            isTemplate: true
          }
        })

        const questions = await ctx.db.question.findMany({
          where: {
            id: {
              in: questionIds
            }
          }
        })

        await ctx.db.question.createMany({
          data: questions.map((question, index) => ({
            ...question,
            id: createId(),
            courseId: course.id,
            isTemplate: false,
            templateQuestionId: question.id,
            index
          }))
        })

        return course
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  updateCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        description: z.string(),
        level: z.number(),
        type: z.string(),
        questionIds: z.array(
          z.object({
            id: z.string(),
            templateQuestionId: z.string()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { questionIds, ...rest } = input
        const questionsToCreate = questionIds.map((q) => {
          if (!!q.templateQuestionId) {
            return q.templateQuestionId
          }
          return q.id
        })

        const courseUpdated = await ctx.db.course.update({
          where: {
            id: input.id
          },
          data: {
            ...rest
          }
        })

        const questions = await ctx.db.question.findMany({
          where: {
            id: {
              in: questionsToCreate
            }
          }
        })

        await ctx.db.question.deleteMany({
          where: {
            courseId: input.id
          }
        })

        await ctx.db.question.createMany({
          data: questions.map((question) => ({
            ...question,
            id: createId(),
            courseId: input.id,
            isTemplate: false,
            templateQuestionId: question.id,
            index: questionsToCreate.indexOf(question.id)
          }))
        })

        return courseUpdated
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  publishCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        status: z.boolean()
      })
    )
    .mutation(async ({ ctx, input: { courseId, status } }) => {
      try {
        await ctx.db.course.update({
          where: {
            id: courseId
          },
          data: {
            isPublished: status
          }
        })
        return status
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
            questions: sortBy(courseQuestions, ['index'])
          }
        })

        const total = await ctx.db.course.count()

        return pagingDataReturn({ items: result || [], page, total })
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  createQuestion: protectedProcedure
    .input(
      z.object({
        level: z.number(),
        content: z.string(),
        audioURL: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const question = await ctx.db.question.create({
          data: { ...input, score: 0, isTemplate: true }
        })
        return question
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        level: z.number(),
        content: z.string(),
        audioURL: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const question = await ctx.db.question.update({
          where: { id: input.id },
          data: { ...input }
        })
        return question
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const question = await ctx.db.question.delete({
          where: { id: input.id }
        })
        return question
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  getQuestions: protectedProcedure
    .input(
      z
        .object({
          courseId: z.string().optional(),
          filter: z
            .object({
              level: z.number().optional(),
              content: z.string().optional()
            })
            .optional()
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const questions = await ctx.db.question.findMany({
          where: {
            AND: [
              {
                courseId: input?.courseId
              },
              {
                content: {
                  contains: input?.filter?.content
                }
              },
              {
                level: input?.filter?.level
              },
              {
                isTemplate: true
              }
            ]
          }
        })
        return questions
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    })
})
