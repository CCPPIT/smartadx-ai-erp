/**
 * Script لإضافة بيانات تحليلات تجريبية حقيقية
 * يمكن تشغيله باستخدام: npx ts-node scripts/seed-analytics.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 بدء إضافة بيانات التحليلات التجريبية...')

  // الحصول على جميع الحملات
  const campaigns = await prisma.campaign.findMany()

  if (campaigns.length === 0) {
    console.log('❌ لا توجد حملات في قاعدة البيانات. يرجى إضافة حملات أولاً.')
    return
  }

  console.log(`✅ تم العثور على ${campaigns.length} حملة`)

  // حذف البيانات القديمة
  await prisma.analytics.deleteMany({})
  console.log('🗑️  تم حذف البيانات القديمة')

  // إنشاء بيانات تحليلات لآخر 30 يوم
  const analyticsData = []
  const now = new Date()

  for (let day = 30; day >= 0; day--) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)

    for (const campaign of campaigns) {
      // توليد بيانات واقعية بناءً على حالة الحملة
      const isActive = campaign.status === 'ACTIVE'
      const baseMultiplier = isActive ? 1 : 0.3

      // البيانات تزداد تدريجياً مع الوقت
      const dayProgress = (30 - day) / 30
      const trendMultiplier = 0.5 + dayProgress * 0.5

      const impressions = Math.floor(
        (1000 + Math.random() * 4000) * baseMultiplier * trendMultiplier
      )
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.06))
      const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.15))
      const revenue = conversions * (20 + Math.random() * 80)

      analyticsData.push({
        campaignId: campaign.id,
        date: date,
        impressions,
        clicks,
        conversions,
        revenue: Math.floor(revenue),
        createdAt: date,
        updatedAt: date,
      })
    }
  }

  // إضافة البيانات إلى قاعدة البيانات
  console.log(`📊 إضافة ${analyticsData.length} سجل تحليلات...`)
  
  await prisma.analytics.createMany({
    data: analyticsData,
  })

  console.log('✅ تم إضافة البيانات بنجاح!')

  // عرض إحصائيات
  const stats = await prisma.analytics.aggregate({
    _sum: {
      impressions: true,
      clicks: true,
      conversions: true,
      revenue: true,
    },
  })

  console.log('\n📈 إحصائيات البيانات المضافة:')
  console.log(`   الإظهارات: ${stats._sum.impressions?.toLocaleString()}`)
  console.log(`   النقرات: ${stats._sum.clicks?.toLocaleString()}`)
  console.log(`   التحويلات: ${stats._sum.conversions?.toLocaleString()}`)
  console.log(`   الإيرادات: $${stats._sum.revenue?.toLocaleString()}`)

  // حساب CTR ومعدل التحويل
  const ctr = stats._sum.impressions && stats._sum.clicks
    ? (stats._sum.clicks / stats._sum.impressions * 100).toFixed(2)
    : 0
  const conversionRate = stats._sum.clicks && stats._sum.conversions
    ? (stats._sum.conversions / stats._sum.clicks * 100).toFixed(2)
    : 0

  console.log(`   معدل النقر (CTR): ${ctr}%`)
  console.log(`   معدل التحويل: ${conversionRate}%`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
