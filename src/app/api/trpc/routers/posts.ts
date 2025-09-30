import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const postRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      include: {
        user: true,
        campaign: true,
        comments: true,
      },
    })
  }),
  
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
        include: {
          user: true,
          campaign: true,
          comments: true,
        },
      })
    }),
    
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
          campaign: true,
        },
      })
    }),
    
  getByCampaignId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          campaignId: input,
        },
        include: {
          user: true,
          campaign: true,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        imageUrl: z.string().optional(),
        scheduledAt: z.date().optional(),
        platform: z.string(),
        campaignId: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          imageUrl: input.imageUrl,
          scheduledAt: input.scheduledAt,
          platform: input.platform,
          campaignId: input.campaignId,
          userId: input.userId,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        scheduledAt: z.date().optional(),
        publishedAt: z.date().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.post.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      })
    }),
    
  publish: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input,
        },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }),
})