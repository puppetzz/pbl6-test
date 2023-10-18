import * as z from 'zod'

export const createCourseSchema = z.object({
  name: z.string().min(2, {
    message: 'Course name must be at least 2 characters.'
  }),
  description: z.string({
    description: 'Please leave a description for the course.'
  }),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    description: 'Please select a level for the course.'
  })
})
