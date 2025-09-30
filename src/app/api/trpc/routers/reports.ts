import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const reportRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.report.findMany({
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
      return await ctx.prisma.report.findMany({
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
      return await ctx.prisma.report.findUnique({
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
        type: z.string(),
        format: z.string(),
        userId: z.string(),
        filters: z.string().optional(),
        data: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.report.create({
        data: {
          title: input.title,
          type: input.type,
          format: input.format,
          userId: input.userId,
          filters: input.filters,
          data: input.data,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        type: z.string().optional(),
        format: z.string().optional(),
        filters: z.string().optional(),
        data: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.report.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.report.delete({
        where: {
          id: input,
        },
      })
    }),
})