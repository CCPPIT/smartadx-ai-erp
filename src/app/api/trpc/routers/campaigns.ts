import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const campaignRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const campaigns = await ctx.prisma.campaign.findMany({
      include: {
        user: true,
        ads: true,
        _count: {
          select: {
            ads: true
          }
        }
      },
    })
    
    // Add analytics for each campaign
    return await Promise.all(campaigns.map(async (campaign) => {
      // Get analytics data
      const analytics = await ctx.prisma.analytics.findMany({
        where: {
          campaignId: campaign.id
        }
      })
      
      // Calculate totals
      const totals = analytics.reduce((acc, curr) => ({
        clicks: acc.clicks + curr.clicks,
        impressions: acc.impressions + curr.impressions,
        conversions: acc.conversions + curr.conversions,
        revenue: acc.revenue + curr.revenue
      }), { clicks: 0, impressions: 0, conversions: 0, revenue: 0 })
      
      return {
        ...campaign,
        analytics: totals
      }
    }))
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.delete({
        where: {
          id: input.id,
        },
      })
    }),
    
  pause: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.update({
        where: {
          id: input.id,
        },
        data: {
          status: 'PAUSED',
        },
      })
    }),
    
  resume: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.campaign.update({
        where: {
          id: input.id,
        },
        data: {
          status: 'ACTIVE',
        },
      })
    }),
})