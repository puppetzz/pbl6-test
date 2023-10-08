import * as z from 'zod'

export const signInformSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
})

export const signUpformSchema = z
  .object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.'
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.'
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.'
    }),
    email: z.string().email({
      message: 'Invalid email address.'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password must be match with password.',
    path: ['confirmPassword']
  })
