import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const aiChatRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.aIChat.findMany({
      include: {
        user: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
  }),
  
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIChat.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      })
    }),
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIChat.findUnique({
        where: {
          id: input,
        },
        include: {
          user: true,
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIChat.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.aIChat.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIChat.delete({
        where: {
          id: input,
        },
      })
    }),
    
  // AI Chat Messages
  addMessage: publicProcedure
    .input(
      z.object({
        content: z.string(),
        role: z.string(), // user or assistant
        chatId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIChatMessage.create({
        data: {
          content: input.content,
          role: input.role,
          chatId: input.chatId,
        },
      })
    }),
    
  getMessages: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIChatMessage.findMany({
        where: {
          chatId: input,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    }),
})