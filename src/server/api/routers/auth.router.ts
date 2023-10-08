import { env } from '@/env.mjs'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { comparePassword, hashedPassword } from '@/utils'
import { setToken } from '@/utils/api'
import { createId } from '@paralleldrive/cuid2'
import * as jwt from 'jsonwebtoken'

import { string, z } from 'zod'

export const authRouter = createTRPCRouter({
  manualSignUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8)
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserExistWithEmail = await ctx.db.user.findFirst({
          where: {
            OR: [
              {
                username: input.username
              },
              {
                email: input.email
              }
            ]
          }
        })
        if (isUserExistWithEmail) throw new Error('User already exist')

        const isUserExistWithUsername = await ctx.db.user.findUnique({
          where: {
            username: input.username
          }
        })
        if (isUserExistWithUsername) throw new Error('User already exist')

        const user = await ctx.db.user.create({
          data: {
            id: createId(),
            name: input.username,
            username: input.username,
            email: input.email
          }
        })

        const passwordHash = await hashedPassword(input.password)

        await ctx.db.account.create({
          data: {
            id: createId(),
            userId: user.id,
            type: 'manual',
            passwordHash,
            provider: `manual${user.id}`,
            providerAccountId: user.id
          }
        })

        return "You've successfully signed up!"
      } catch (error) {
        throw new Error((error as Error).message)
      }
    }),
  manualSignIn: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findFirst({
          where: {
            OR: [
              {
                username: input.username
              },
              {
                email: input.username
              }
            ]
          }
        })

        if (!user) throw new Error('User not found')

        const account = await ctx.db.account.findFirst({
          where: {
            userId: user.id
          }
        })

        const isValidAccount = await comparePassword({
          password: input.password,
          passwordHash: account?.passwordHash ?? ''
        })

        if (!isValidAccount) throw new Error('Invalid password')

        const jwtSecret = env.JWT_SECRET
        const accessToken = jwt.sign(user, jwtSecret)
        setToken(String(accessToken))

        await ctx.db.session.create({
          data: {
            id: createId(),
            userId: user.id,
            sessionToken: accessToken,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          }
        })

        return 'You have successfully signed in!'
      } catch (error) {}
    })
})
