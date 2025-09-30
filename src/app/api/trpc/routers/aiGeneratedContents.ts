import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const aiGeneratedContentRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.aIGeneratedContent.findMany({
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
      return await ctx.prisma.aIGeneratedContent.findMany({
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
    
  getByType: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.findMany({
        where: {
          type: input,
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
      return await ctx.prisma.aIGeneratedContent.findUnique({
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
        type: z.string(),
        prompt: z.string(),
        content: z.string(),
        imageUrl: z.string().optional(),
        userId: z.string(),
        entityId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.create({
        data: {
          type: input.type,
          prompt: input.prompt,
          content: input.content,
          imageUrl: input.imageUrl,
          userId: input.userId,
          entityId: input.entityId,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        prompt: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.aIGeneratedContent.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.delete({
        where: {
          id: input,
        },
      })
    }),
})