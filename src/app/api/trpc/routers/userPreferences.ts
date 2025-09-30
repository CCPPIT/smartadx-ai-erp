import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const userPreferenceRouter = router({
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userPreference.findUnique({
        where: {
          userId: input,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        theme: z.string().optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        notifications: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userPreference.create({
        data: {
          userId: input.userId,
          theme: input.theme || 'light',
          language: input.language || 'en',
          timezone: input.timezone || 'UTC',
          notifications: input.notifications !== undefined ? input.notifications : true,
          emailNotifications: input.emailNotifications !== undefined ? input.emailNotifications : true,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        theme: z.string().optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        notifications: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userPreference.upsert({
        where: {
          userId: input.userId,
        },
        update: {
          theme: input.theme,
          language: input.language,
          timezone: input.timezone,
          notifications: input.notifications,
          emailNotifications: input.emailNotifications,
        },
        create: {
          userId: input.userId,
          theme: input.theme || 'light',
          language: input.language || 'en',
          timezone: input.timezone || 'UTC',
          notifications: input.notifications !== undefined ? input.notifications : true,
          emailNotifications: input.emailNotifications !== undefined ? input.emailNotifications : true,
        },
      })
    }),
    
  updateTheme: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        theme: z.string(), // light or dark
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userPreference.upsert({
        where: {
          userId: input.userId,
        },
        update: {
          theme: input.theme,
        },
        create: {
          userId: input.userId,
          theme: input.theme,
          language: 'en',
          timezone: 'UTC',
          notifications: true,
          emailNotifications: true,
        },
      })
    }),
})