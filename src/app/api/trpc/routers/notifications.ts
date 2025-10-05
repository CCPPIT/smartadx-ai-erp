import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const notificationRouter = router({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(20)
    }))
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.prisma.notification.findMany({
        take: input.limit,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      
      // Transform to match expected format
      return notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        read: notif.read,
        timestamp: notif.createdAt,
        userId: notif.userId,
        entityId: notif.entityId,
        entityType: notif.entityType
      }))
    }),
  
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({
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
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findUnique({
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
        message: z.string(),
        type: z.string(),
        priority: z.number().optional(),
        userId: z.string(),
        entityId: z.string().optional(),
        entityType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.create({
        data: {
          title: input.title,
          message: input.message,
          type: input.type,
          priority: input.priority || 0,
          userId: input.userId,
          entityId: input.entityId,
          entityType: input.entityType,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        message: z.string().optional(),
        type: z.string().optional(),
        read: z.boolean().optional(),
        priority: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.notification.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  markAsRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.update({
        where: {
          id: input.id,
        },
        data: {
          read: true,
        },
      })
    }),
    
  markAllAsRead: publicProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.notification.updateMany({
        where: {
          read: false,
        },
        data: {
          read: true,
        },
      })
    }),
    
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.delete({
        where: {
          id: input.id,
        },
      })
    }),
})