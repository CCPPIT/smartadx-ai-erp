import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const designRouter = router({
  // Get all AI-generated designs
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.aIGeneratedContent.findMany({
      where: {
        type: 'ad_design',
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),
  
  // Get designs by user
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.findMany({
        where: {
          userId: input,
          type: 'ad_design',
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
    
  // Get design by ID
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
    
  // Create AI-generated design
  create: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        content: z.string(),
        imageUrl: z.string().optional(),
        userId: z.string(),
        entityId: z.string().optional(), // Associated ad or campaign ID
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.create({
        data: {
          type: 'ad_design',
          prompt: input.prompt,
          content: input.content,
          imageUrl: input.imageUrl,
          userId: input.userId,
          entityId: input.entityId,
        },
      })
    }),
    
  // Update design
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
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
    
  // Delete design
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.delete({
        where: {
          id: input,
        },
      })
    }),
    
  // Get design templates
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    // Return predefined design templates
    return [
      {
        id: 'template-1',
        name: 'Social Media Post',
        description: 'Standard social media post template',
        dimensions: '1080x1080',
        category: 'social',
      },
      {
        id: 'template-2',
        name: 'Banner Ad',
        description: 'Web banner ad template',
        dimensions: '300x250',
        category: 'web',
      },
      {
        id: 'template-3',
        name: 'Video Thumbnail',
        description: 'YouTube video thumbnail template',
        dimensions: '1280x720',
        category: 'video',
      },
    ]
  }),
  
  // Get design categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return [
      { id: 'social', name: 'Social Media' },
      { id: 'web', name: 'Web Ads' },
      { id: 'video', name: 'Video Content' },
      { id: 'print', name: 'Print Materials' },
    ]
  }),
})