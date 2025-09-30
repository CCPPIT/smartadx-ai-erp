import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const rewardRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reward.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),
  
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reward.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
    
  getUnclaimedByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reward.findMany({
        where: {
          userId: input,
          claimedAt: null,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reward.findUnique({
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
        title: z.string(),
        description: z.string().optional(),
        points: z.number().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reward.create({
        data: {
          title: input.title,
          description: input.description,
          points: input.points || 0,
          userId: input.userId,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        points: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.reward.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  claim: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reward.update({
        where: {
          id: input,
        },
        data: {
          claimedAt: new Date(),
        },
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reward.delete({
        where: {
          id: input,
        },
      })
    }),
})