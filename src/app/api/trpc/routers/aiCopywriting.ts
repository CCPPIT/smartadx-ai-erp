import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'

export const aiCopywritingRouter = router({
  // Get all AI-generated copy
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.aIGeneratedContent.findMany({
      where: {
        type: 'copywriting',
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),
  
  // Get copy by user
  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.findMany({
        where: {
          userId: input,
          type: 'copywriting',
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
    
  // Get copy by ID
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
    
  // Generate copy
  generate: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        style: z.string().optional(),
        tone: z.string().optional(),
        length: z.string().optional(), // short, medium, long
        userId: z.string(),
        entityId: z.string().optional(), // Associated campaign or ad ID
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate the response
      const generatedContent = `نسخة مولدة تلقائيًا بناءً على الطلب: "${input.prompt}". 
      هذه النسخة مصممة بأسلوب ${input.style || 'عادي'} وبنبرة ${input.tone || 'مهنية'}.
      الطول المطلوب: ${input.length || 'متوسط'}.`
      
      return await ctx.prisma.aIGeneratedContent.create({
        data: {
          type: 'copywriting',
          prompt: input.prompt,
          content: generatedContent,
          userId: input.userId,
          entityId: input.entityId,
        },
      })
    }),
    
  // Update copy
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        prompt: z.string().optional(),
        content: z.string().optional(),
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
    
  // Delete copy
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.aIGeneratedContent.delete({
        where: {
          id: input,
        },
      })
    }),
    
  // Get copywriting styles
  getStyles: publicProcedure.query(async ({ ctx }) => {
    return [
      { id: 'persuasive', name: 'إقناعي', description: 'يهدف إلى إقناع الجمهور باتخاذ إجراء' },
      { id: 'descriptive', name: 'وصفي', description: 'يوصف المنتج أو الخدمة بتفصيل' },
      { id: 'narrative', name: 'سردي', description: 'يروي قصة للارتباط العاطفي' },
      { id: 'humorous', name: 'فكاهي', description: 'يستخدم الفكاهة لجذب الانتباه' },
      { id: 'formal', name: 'رسمي', description: 'يستخدم لغة رسمية ومناسبة للجمهور المهني' },
    ]
  }),
  
  // Get copywriting tones
  getTones: publicProcedure.query(async ({ ctx }) => {
    return [
      { id: 'professional', name: 'مهني', description: 'نبرة رسمية ومناسبة للبيئة التجارية' },
      { id: 'friendly', name: 'ودود', description: 'نبرة مريحة وسهلة التواصل' },
      { id: 'enthusiastic', name: 'متحمس', description: 'نبرة مليئة بالطاقة والإيجابية' },
      { id: 'authoritative', name: 'مُخوّل', description: 'نبرة تظهر الخبرة والثقة' },
      { id: 'empathetic', name: 'متعاطف', description: 'نبرة تُظهر الفهم والاهتمام بالجمهور' },
    ]
  }),
  
  // Get copywriting lengths
  getLengths: publicProcedure.query(async ({ ctx }) => {
    return [
      { id: 'short', name: 'قصير', description: 'مناسب للعناوين والعناصر النائبة' },
      { id: 'medium', name: 'متوسط', description: 'مناسب لمعظم أنواع المحتوى' },
      { id: 'long', name: 'طويل', description: 'مناسب للمقالات والمحتوى التفصيلي' },
    ]
  }),
  
  // Get copywriting templates
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    return [
      {
        id: 'template-1',
        name: 'عنوان إعلان',
        description: 'قالب لعناوين الإعلانات الجذابة',
        prompt: 'أنشئ عنوان إعلان جذاب لـ [المنتج/الخدمة] يستهدف [الجمهور]',
        category: 'ads',
      },
      {
        id: 'template-2',
        name: 'وصف المنتج',
        description: 'قالب لوصف المنتجات بطريقة مقنعة',
        prompt: 'اكتب وصفًا مقنعًا لـ [المنتج] يسلط الضوء على [الميزة الرئيسية]',
        category: 'product',
      },
      {
        id: 'template-3',
        name: 'بريد إخباري',
        description: 'قالب لهيكل بريد إخباري فعال',
        prompt: 'أنشئ هيكل بريد إخباري يتضمن [الموضوع الرئيسي] ودعوة للإجراء',
        category: 'email',
      },
    ]
  }),
})