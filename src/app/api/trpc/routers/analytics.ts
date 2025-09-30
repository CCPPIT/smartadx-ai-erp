import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const analyticsRouter = router({
  getByCampaignId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.analytics.findMany({
        where: {
          campaignId: input,
        },
        orderBy: {
          date: 'desc',
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        campaignId: z.string(),
        clicks: z.number().optional(),
        impressions: z.number().optional(),
        conversions: z.number().optional(),
        revenue: z.number().optional(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.analytics.create({
        data: {
          campaignId: input.campaignId,
          clicks: input.clicks || 0,
          impressions: input.impressions || 0,
          conversions: input.conversions || 0,
          revenue: input.revenue || 0,
          date: input.date,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        clicks: z.number().optional(),
        impressions: z.number().optional(),
        conversions: z.number().optional(),
        revenue: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.analytics.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
})