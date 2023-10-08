import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userList = await ctx.db.user.findMany()
      return userList
    } catch (error) {
      throw new Error((error as Error).message)
    }
  })
})
