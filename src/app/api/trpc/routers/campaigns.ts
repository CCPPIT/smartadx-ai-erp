import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const campaignRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.campaign.findMany({
      include: {
        user: true,
        ads: true,
      },
    })
  }),
  
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.findUnique({
        where: {
          id: input,
        },
        include: {
          user: true,
          ads: true,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        userId: z.string(),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.create({
        data: {
          name: input.name,
          description: input.description,
          userId: input.userId,
          budget: input.budget,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.campaign.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.delete({
        where: {
          id: input,
        },
      })
    }),
})