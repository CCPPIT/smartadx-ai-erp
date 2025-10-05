# 🚀 RealtimeAnalytics - التحليلات في الوقت الفعلي

> نظام تحليلات احترافي مع بيانات حقيقية وتحليل AI

[![Status](https://img.shields.io/badge/Status-✅_Complete-success)]()
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [البدء السريع](#-البدء-السريع)
- [التوثيق](#-التوثيق)
- [الاستخدام](#-الاستخدام)
- [التقنيات](#-التقنيات)
- [المساهمة](#-المساهمة)

---

## 🎯 نظرة عامة

**RealtimeAnalytics** هو مكون React متقدم يعرض تحليلات الحملات الإعلانية في الوقت الفعلي مع:

- ✅ **بيانات حقيقية** من قاعدة البيانات
- 🧠 **تحليل AI** للأداء والتوصيات
- 🎨 **واجهة تفاعلية** مع رسوم متحركة
- 📊 **رسوم بيانية** متقدمة
- 🔄 **تحديث مباشر** كل 5 ثوان

---

## ✨ الميزات

### 1. البيانات الحقيقية
```typescript
// جلب من قاعدة البيانات عبر tRPC
trpc.dashboard.getRealtimeAnalytics.useQuery({
  timeRange: '24h',
  campaignIds: ['camp1', 'camp2']
})
```

### 2. تحليل AI
| CTR | التقييم | التوصية |
|-----|---------|----------|
| < 2% | 🔴 يحتاج تحسين | حسّن الإعلانات والاستهداف |
| 2-4% | 🟡 جيد | جرب محتوى جديد |
| > 4% | 🟢 ممتاز | استمر على هذا النهج |

### 3. واجهة تفاعلية
- 🎨 Framer Motion animations
- ⚡ أيقونة دوّارة عند التحديث
- 🏷️ Badge "مباشر" عند التفعيل
- 📊 Area Charts مع Gradients

### 4. البيانات المعروضة
- 👁️ **الإظهارات** - Impressions + Progress
- 📈 **النقرات** - Clicks + CTR + Trend
- 👥 **التحويلات** - Conversions + Rate
- 💰 **الإيرادات** - Revenue ($)

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 22.19.0+
- PostgreSQL
- npm أو yarn

### التثبيت

#### 1. إضافة البيانات التجريبية
```bash
npm run seed-analytics
```

#### 2. تشغيل التطبيق
```bash
npm run dev
```

#### 3. افتح المتصفح
```
http://localhost:3000/dashboard
```

---

## 📚 التوثيق

### الملفات المرجعية

| الملف | الوصف | للمن؟ |
|------|-------|-------|
| [`QUICK_START_REALTIME.md`](QUICK_START_REALTIME.md) | البدء السريع (3 خطوات) | المبتدئين |
| [`SUMMARY_AR.md`](SUMMARY_AR.md) | ملخص شامل بالعربية | الجميع |
| [`REALTIME_ANALYTICS_UPGRADE.md`](REALTIME_ANALYTICS_UPGRADE.md) | شرح تفصيلي للميزات | المطورين |
| [`REALTIME_SETUP.md`](REALTIME_SETUP.md) | دليل الإعداد الكامل | DevOps |
| [`REALTIME_ANALYTICS_COMPLETE.md`](REALTIME_ANALYTICS_COMPLETE.md) | التوثيق الكامل | المراجعة |

### الكود المصدري

```
src/
├── components/dashboard/
│   └── RealtimeAnalytics.tsx    # المكون الرئيسي
├── server/routers/
│   └── dashboard.ts              # API Endpoints
└── hooks/
    └── use-realtime.ts           # WebSocket Hook

scripts/
└── seed-analytics.ts             # إضافة بيانات تجريبية
```

---

## 💻 الاستخدام

### تفعيل التحديث المباشر

```typescript
const [realtimeEnabled, setRealtimeEnabled] = useState(false)

// عند التفعيل
<Button onClick={() => setRealtimeEnabled(true)}>
  تحديث تلقائي
</Button>

// النتيجة:
// ✅ الأيقونة تدور
// ✅ Badge "مباشر" يظهر
// ✅ البيانات تتحدث كل 5 ثوان
```

### تغيير الفترة الزمنية

```typescript
const [timeRange, setTimeRange] = useState('24h')

<Select value={timeRange} onValueChange={setTimeRange}>
  <SelectItem value="1h">آخر ساعة</SelectItem>
  <SelectItem value="6h">آخر 6 ساعات</SelectItem>
  <SelectItem value="24h">آخر 24 ساعة</SelectItem>
  <SelectItem value="7d">آخر 7 أيام</SelectItem>
  <SelectItem value="30d">آخر 30 يوم</SelectItem>
</Select>
```

### تصدير البيانات

```typescript
const handleExport = () => {
  // تصدير إلى CSV
  const csvContent = [
    ['الوقت', 'النقرات', 'الإظهارات', 'التحويلات', 'الإيرادات'],
    ...timeSeriesData.map(data => [
      data.time,
      data.clicks,
      data.impressions,
      data.conversions,
      data.revenue
    ])
  ]
  // ... تحميل الملف
}
```

---

## 🛠️ التقنيات

### Backend
- **tRPC** - Type-safe API
- **Prisma** - ORM
- **Zod** - Validation
- **PostgreSQL** - Database

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Framer Motion** - Animations
- **Recharts** - Charts
- **Shadcn/ui** - Components
- **TailwindCSS** - Styling

### DevOps
- **Next.js 15** - Framework
- **Docker** - Containerization
- **Turbopack** - Build Tool

---

## 📊 API Reference

### `getRealtimeAnalytics`

```typescript
// Request
{
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d',
  campaignIds?: string[]
}

// Response
{
  timeSeriesData: AnalyticsDataPoint[],
  campaignMetrics: CampaignMetric[],
  totals: {
    clicks: number,
    impressions: number,
    conversions: number,
    revenue: number
  },
  stats: {
    totalImpressions: number,
    totalClicks: number,
    totalConversions: number,
    totalRevenue: number,
    ctr: string,
    conversionRate: string
  }
}
```

### `getCampaignComparison`

```typescript
// Request
{
  campaignIds: string[],  // 1-5 campaigns
  days?: number           // default: 7
}

// Response
Campaign[] // with analytics data
```

---

## 🎨 Screenshots

### Dashboard الرئيسي
```
┌─────────────────────────────────────────────┐
│  ⚡ التحليلات في الوقت الفعلي  🟢 مباشر   │
├─────────────────────────────────────────────┤
│  🧠 تحليل AI: ممتاز ✅                      │
│  الأداء ممتاز! استمر على هذا النهج         │
├─────────────────────────────────────────────┤
│  👁️ 50K    📈 1.5K    👥 250    💰 $12.5K  │
│  Impressions  Clicks  Conversions  Revenue  │
├─────────────────────────────────────────────┤
│  📊 Area Chart - Performance Trends         │
│  📊 Bar Chart - Campaign Metrics            │
│  📋 Detailed Performance Table              │
└─────────────────────────────────────────────┘
```

---

## 🔧 الأوامر المفيدة

```bash
# إضافة بيانات تجريبية
npm run seed-analytics

# تشغيل التطبيق
npm run dev

# فتح Prisma Studio
npm run db:studio

# إعادة تعيين قاعدة البيانات
npm run db:reset

# توليد Prisma Client
npm run db:generate
```

---

## 🐛 حل المشاكل

### ❌ لا توجد بيانات
```bash
npm run seed-analytics
npx prisma studio  # للتحقق
```

### ❌ خطأ في API
```bash
npx prisma generate
npm run dev
```

### ❌ WebSocket غير متصل
- WebSocket اختياري
- التطبيق يعمل بدونه
- يستخدم polling (refetchInterval)

---

## 📈 الأداء

### Optimizations
- ✅ `useMemo` للتحليلات الثقيلة
- ✅ `useCallback` للـ handlers
- ✅ Lazy loading للرسوم البيانية
- ✅ Debouncing للتحديثات

### Caching
```typescript
{
  staleTime: 30000,      // 30 ثانية
  cacheTime: 300000,     // 5 دقائق
  refetchInterval: 5000  // 5 ثوان (عند التفعيل)
}
```

---

## 🔐 الأمان

### Authentication
```typescript
// في API route
if (!session?.user) {
  throw new TRPCError({ code: 'UNAUTHORIZED' })
}
```

### Rate Limiting
```typescript
// حد أقصى للطلبات
const rateLimit = 100 // طلب/دقيقة
```

---

## 🚀 الخطوات التالية

### المرحلة 2
- [ ] Google Ads API Integration
- [ ] WebSocket Server
- [ ] Smart Alerts
- [ ] Custom Dashboards
- [ ] PDF Export

### المرحلة 3
- [ ] Redis Caching
- [ ] Rate Limiting
- [ ] Pagination
- [ ] Compression

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License.

---

## 👥 الفريق

**SmartADX AI Team**
- التطوير: AI Assistant
- التاريخ: 2025-10-04
- الإصدار: 2.0.0

---

## 📞 الدعم

### الموارد
- 📖 [التوثيق الكامل](REALTIME_ANALYTICS_COMPLETE.md)
- 🚀 [البدء السريع](QUICK_START_REALTIME.md)
- 🔧 [دليل الإعداد](REALTIME_SETUP.md)
- 📝 [الملخص العربي](SUMMARY_AR.md)

### الاتصال
- GitHub Issues
- Email: support@smartadx.com
- Discord: SmartADX Community

---

## ⭐ شكراً

إذا أعجبك المشروع، لا تنسى إعطاءه ⭐ على GitHub!

---

<div align="center">

**صُنع بـ ❤️ بواسطة SmartADX Team**

[![GitHub](https://img.shields.io/badge/GitHub-SmartADX-blue?logo=github)]()
[![Twitter](https://img.shields.io/badge/Twitter-@SmartADX-blue?logo=twitter)]()
[![LinkedIn](https://img.shields.io/badge/LinkedIn-SmartADX-blue?logo=linkedin)]()

</div>
