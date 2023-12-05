import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { pagingDataReturn } from '@/utils'

import { z } from 'zod'

export const studyRouter = createTRPCRouter({
  getPagingStudySets: protectedProcedure
    .input(z.object({ page: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { page } = input
      try {
        const studySets = await ctx.db.studySet.findMany({
          skip: (page - 1) * 10,
          take: 10
        })
        const total = await ctx.db.studySet.count()

        return pagingDataReturn({ items: studySets || [], page, total })
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  getAllStudySetsByUserId: protectedProcedure
    .input(
      z.object({ userId: z.string(), filter: z.string().optional().nullable() })
    )
    .query(async ({ ctx, input }) => {
      const { userId, filter } = input
      try {
        const studySets = await ctx.db.studySet.findMany({
          where: {
            userId,
            title: {
              contains: filter || ''
            }
          },
          orderBy: [
            {
              createdAt: 'desc'
            }
          ]
        })

        return studySets
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  getStudySetById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input
      try {
        const studySet = await ctx.db.studySet.findFirst({
          where: { id }
        })

        const cards = await ctx.db.studyCard.findMany({
          where: { studySetId: id }
        })

        return { ...studySet, cards }
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  createStudySet: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        userId: z.string(),
        isPublic: z.boolean(),
        cards: z
          .array(
            z.object({
              term: z.string(),
              definition: z.string(),
              imageURL: z.string().optional().nullable(),
              index: z.number()
            })
          )
          .min(2)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cards, ...studySetValues } = input
      try {
        const studySet = await ctx.db.studySet.create({
          data: studySetValues
        })

        const returnedCards = await ctx.db.studyCard.createMany({
          data: cards.map((card) => ({
            ...card,
            studySetId: studySet.id
          }))
        })

        return { ...studySet, cards: returnedCards }
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    }),
  updateStudySet: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        isPublic: z.boolean(),
        cards: z
          .array(
            z.object({
              term: z.string(),
              definition: z.string(),
              imageURL: z.string().optional().nullable(),
              index: z.number()
            })
          )
          .min(2)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cards, id, ...rest } = input
      try {
        const studySet = await ctx.db.studySet.update({
          where: { id },
          data: rest
        })

        await ctx.db.studyCard.deleteMany({
          where: { studySetId: input.id }
        })

        const returnedCards = await ctx.db.studyCard.createMany({
          data: cards.map((card) => ({
            ...card,
            studySetId: studySet.id
          }))
        })

        return { ...studySet, cards: returnedCards }
      } catch (error) {
        throw new Error((error as Error)?.message)
      }
    })
})
