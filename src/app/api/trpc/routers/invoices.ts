import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const invoiceRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invoice.findMany({
      include: {
        client: true,
        user: true,
        items: true,
        payments: true,
      },
    })
  }),
  
  getByClientId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findMany({
        where: {
          clientId: input,
        },
        include: {
          client: true,
          user: true,
          items: true,
          payments: true,
        },
      })
    }),
    
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findMany({
        where: {
          userId: input,
        },
        include: {
          client: true,
          user: true,
          items: true,
          payments: true,
        },
      })
    }),
    
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findUnique({
        where: {
          id: input,
        },
        include: {
          client: true,
          user: true,
          items: true,
          payments: true,
        },
      })
    }),
    
  create: publicProcedure
    .input(
      z.object({
        number: z.string(),
        clientId: z.string().optional(),
        userId: z.string().optional(),
        amount: z.number(),
        dueDate: z.date().optional(),
        items: z.array(
          z.object({
            description: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.create({
        data: {
          number: input.number,
          clientId: input.clientId,
          userId: input.userId,
          amount: input.amount,
          dueDate: input.dueDate,
          items: {
            create: input.items,
          },
        },
      })
    }),
    
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        number: z.string().optional(),
        clientId: z.string().optional(),
        userId: z.string().optional(),
        amount: z.number().optional(),
        status: z.string().optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.invoice.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.delete({
        where: {
          id: input,
        },
      })
    }),
    
  // Invoice Items
  createItem: publicProcedure
    .input(
      z.object({
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
        invoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.invoiceItem.create({
        data: {
          description: input.description,
          quantity: input.quantity,
          price: input.price,
          invoiceId: input.invoiceId,
        },
      })
    }),
    
  updateItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().optional(),
        quantity: z.number().optional(),
        price: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.invoiceItem.update({
        where: {
          id,
        },
        data: updateData,
      })
    }),
    
  deleteItem: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.invoiceItem.delete({
        where: {
          id: input,
        },
      })
    }),
})