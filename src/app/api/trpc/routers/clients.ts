import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const clientRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.client.findMany()
  }),
  
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.client.findUnique({
        where: {
          id: input,
        },
      })
    }),
    
  getByEmail: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.client.findUnique({
        where: {
          email: input,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.client.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.client.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.client.delete({
        where: {
          id: input,
        },
      })
    }),
})