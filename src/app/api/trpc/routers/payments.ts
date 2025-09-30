import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const paymentRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.payment.findMany({
      include: {
        invoice: true,
        user: true,
        client: true,
      },
    })
  }),
  
  getByInvoiceId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payment.findMany({
        where: {
          invoiceId: input,
        },
        include: {
          invoice: true,
          user: true,
          client: true,
        },
      })
    }),
    
  getByClientId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payment.findMany({
        where: {
          clientId: input,
        },
        include: {
          invoice: true,
          user: true,
          client: true,
        },
      })
    }),
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payment.findUnique({
        where: {
          id: input,
        },
        include: {
          invoice: true,
          user: true,
          client: true,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        currency: z.string().optional(),
        method: z.string().optional(),
        status: z.string().optional(),
        invoiceId: z.string().optional(),
        userId: z.string().optional(),
        clientId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.payment.create({
        data: {
          amount: input.amount,
          currency: input.currency || 'USD',
          method: input.method,
          status: input.status || 'PENDING',
          invoiceId: input.invoiceId,
          userId: input.userId,
          clientId: input.clientId,
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        method: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.payment.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.payment.delete({
        where: {
          id: input,
        },
      })
    }),
})