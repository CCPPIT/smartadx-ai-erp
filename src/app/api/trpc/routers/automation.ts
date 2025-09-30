import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const automationRouter = router({
  // Get all scheduled posts
  getScheduledPosts: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.post.findMany({
        where: {
          status: 'SCHEDULED',
        },
        include: {
          user: true,
          campaign: true,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      })
    }),
    
  // Get scheduled posts by user
  getScheduledPostsByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          userId: input,
          status: 'SCHEDULED',
        },
        include: {
          user: true,
          campaign: true,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      })
    }),
    
  // Get scheduled posts by campaign
  getScheduledPostsByCampaignId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          campaignId: input,
          status: 'SCHEDULED',
        },
        include: {
          user: true,
          campaign: true,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      })
    }),
    
  // Schedule a post
  schedulePost: publicProcedure
    .input(
      z.object({
        content: z.string(),
        imageUrl: z.string().optional(),
        scheduledAt: z.date(),
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
          status: 'SCHEDULED',
        },
      })
    }),
    
  // Reschedule a post
  reschedulePost: publicProcedure
    .input(
      z.object({
        id: z.string(),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          scheduledAt: input.scheduledAt,
        },
      })
    }),
    
  // Cancel scheduled post
  cancelScheduledPost: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input,
        },
        data: {
          status: 'DRAFT',
          scheduledAt: null,
        },
      })
    }),
    
  // Get automation settings
  getAutomationSettings: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // This would return user-specific automation settings
      // For now, we'll return a default configuration
      return {
        id: input,
        autoPublish: true,
        notifyBeforePublish: true,
        notificationTime: 30, // minutes before publish
        defaultPlatforms: ['facebook', 'twitter'],
      }
    }),
    
  // Update automation settings
  updateAutomationSettings: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        autoPublish: z.boolean().optional(),
        notifyBeforePublish: z.boolean().optional(),
        notificationTime: z.number().optional(),
        defaultPlatforms: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // This would update user-specific automation settings
      // For now, we'll just return the updated settings
      return {
        id: input.userId,
        autoPublish: input.autoPublish,
        notifyBeforePublish: input.notifyBeforePublish,
        notificationTime: input.notificationTime,
        defaultPlatforms: input.defaultPlatforms,
      }
    }),
})