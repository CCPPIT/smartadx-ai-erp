import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const notificationRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.notification.findMany({
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
    
  getUnreadByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({
        where: {
          userId: input,
          read: false,
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
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.update({
        where: {
          id: input,
        },
        data: {
          read: true,
        },
      })
    }),
    
  markAllAsRead: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.updateMany({
        where: {
          userId: input,
          read: false,
        },
        data: {
          read: true,
        },
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.delete({
        where: {
          id: input,
        },
      })
    }),
})