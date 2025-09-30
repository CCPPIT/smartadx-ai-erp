import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const socialMediaIntegrationRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.socialMediaIntegration.findMany({
      include: {
        user: true,
      },
    })
  }),
  
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.socialMediaIntegration.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
        },
      })
    }),
    
  getByPlatform: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        platform: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.socialMediaIntegration.findMany({
        where: {
          userId: input.userId,
          platform: input.platform,
        },
        include: {
          user: true,
        },
      })
    }),
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.socialMediaIntegration.findUnique({
        where: {
          id: input,
        },
        include: {
          user: true,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        platform: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        userId: z.string(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.socialMediaIntegration.create({
        data: {
          platform: input.platform,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          userId: input.userId,
          expiresAt: input.expiresAt,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        platform: z.string().optional(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.socialMediaIntegration.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.socialMediaIntegration.delete({
        where: {
          id: input,
        },
      })
    }),
})