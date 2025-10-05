# 🚀 دليل إعداد التحليلات في الوقت الفعلي

## 📋 المتطلبات

### 1. قاعدة البيانات
تأكد من وجود جدول `Analytics` في Prisma Schema:

```prisma
model Analytics {
  id          String   @id @default(cuid())
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  date        DateTime
  impressions Int      @default(0)
  clicks      Int      @default(0)
  conversions Int      @default(0)
  revenue     Float    @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([campaignId])
  @@index([date])
}
```

### 2. تشغيل Migration
```bash
npx prisma migrate dev --name add_analytics
npx prisma generate
```

## 🎯 خطوات الإعداد

### الخطوة 1: إضافة بيانات تجريبية

قم بتشغيل السكريبت لإضافة بيانات تحليلات تجريبية:

```bash
npx ts-node scripts/seed-analytics.ts
```

**ماذا يفعل السكريبت؟**
- ✅ يضيف بيانات تحليلات لآخر 30 يوم
- ✅ يولد بيانات واقعية (impressions, clicks, conversions, revenue)
- ✅ يراعي حالة الحملة (نشطة/متوقفة)
- ✅ يضيف اتجاه نمو تدريجي للبيانات

### الخطوة 2: التحقق من البيانات

```bash
npx prisma studio
```

افتح جدول `Analytics` وتحقق من وجود البيانات.

### الخطوة 3: تشغيل التطبيق

```bash
npm run dev
```

### الخطوة 4: الوصول للتحليلات

افتح المتصفح وانتقل إلى:
```
http://localhost:3000/dashboard
```

## 🔧 الاستخدام

### 1. تفعيل التحديث المباشر

انقر على زر "تحديث تلقائي" لتفعيل التحديث كل 5 ثوان:
- ⚡ الأيقونة تدور
- 🟢 يظهر badge "مباشر"
- 🔄 البيانات تتحدث تلقائياً

### 2. تغيير الفترة الزمنية

استخدم القائمة المنسدلة لاختيار الفترة:
- آخر ساعة
- آخر 6 ساعات
- آخر 24 ساعة
- آخر 7 أيام
- آخر 30 يوم

### 3. تصدير البيانات

انقر على "تصدير البيانات" لتحميل ملف CSV يحتوي على:
- الوقت
- النقرات
- الإظهارات
- التحويلات
- الإيرادات

## 📊 فهم البيانات

### بطاقات الإحصائيات

#### 1. الإظهارات (Impressions)
- عدد مرات ظهور الإعلان
- كلما زاد العدد، زاد الوصول

#### 2. النقرات (Clicks)
- عدد النقرات على الإعلان
- يتضمن معدل النقر (CTR)
- **CTR = (النقرات / الإظهارات) × 100**

#### 3. التحويلات (Conversions)
- عدد الإجراءات المكتملة (شراء، تسجيل، إلخ)
- يتضمن معدل التحويل
- **معدل التحويل = (التحويلات / النقرات) × 100**

#### 4. الإيرادات (Revenue)
- المبلغ الإجمالي المحقق بالدولار

### تحليل AI

يقوم النظام بتحليل الأداء تلقائياً:

| CTR | التقييم | اللون | التوصية |
|-----|---------|-------|----------|
| < 2% | يحتاج تحسين | 🔴 أحمر | حسّن الإعلانات والاستهداف |
| 2-4% | جيد | 🟡 أصفر | جرب محتوى جديد |
| > 4% | ممتاز | 🟢 أخضر | استمر على هذا النهج |

## 🎨 الرسوم البيانية

### 1. رسم الأداء في الوقت الفعلي
- **النوع**: Area Chart
- **البيانات**: الإظهارات، النقرات، التحويلات
- **الألوان**:
  - 🔵 أزرق: الإظهارات
  - 🟣 بنفسجي: النقرات
  - 🌸 وردي: التحويلات

### 2. مقاييس الحملات
- **النوع**: Bar Chart
- **البيانات**: النقرات لكل حملة
- **الألوان**: متدرجة لكل حملة

### 3. جدول الأداء التفصيلي
- قائمة بجميع الحملات
- مقاييس تفصيلية
- تقييم الأداء
- Progress bars

## 🔄 WebSocket (اختياري)

لتفعيل التحديثات الفورية عبر WebSocket:

### 1. إنشاء WebSocket Server

```typescript
// server/websocket.ts
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (ws) => {
  console.log('Client connected')
  
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString())
    
    if (data.type === 'subscribe') {
      // اشتراك في التحديثات
    }
  })
})
```

### 2. تشغيل WebSocket Server

```bash
node server/websocket.js
```

### 3. تحديث متغيرات البيئة

```env
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

## 🐛 حل المشاكل

### المشكلة: لا توجد بيانات

**الحل:**
```bash
# تأكد من وجود حملات
npx prisma studio

# أضف بيانات تجريبية
npx ts-node scripts/seed-analytics.ts
```

### المشكلة: خطأ في API

**الحل:**
```bash
# تحقق من تشغيل السيرفر
npm run dev

# تحقق من Prisma
npx prisma generate
```

### المشكلة: WebSocket غير متصل

**الحل:**
- WebSocket اختياري
- التطبيق يعمل بدونه
- يستخدم polling بدلاً منه

## 📈 تحسين الأداء

### 1. Caching
```typescript
// استخدم React Query caching
{
  staleTime: 30000, // 30 ثانية
  cacheTime: 300000, // 5 دقائق
}
```

### 2. Pagination
```typescript
// للبيانات الكبيرة
{
  take: 100,
  skip: 0,
}
```

### 3. Indexing
```prisma
@@index([campaignId])
@@index([date])
```

## 🔐 الأمان

### 1. التحقق من الصلاحيات
```typescript
// في API route
if (!session?.user) {
  throw new TRPCError({ code: 'UNAUTHORIZED' })
}
```

### 2. Rate Limiting
```typescript
// حد أقصى للطلبات
const rateLimit = 100 // طلب في الدقيقة
```

## 📝 ملاحظات مهمة

1. **البيانات التجريبية** للاختبار فقط
2. **WebSocket** اختياري - التطبيق يعمل بدونه
3. **التحديث التلقائي** يستهلك موارد - استخدمه بحذر
4. **التصدير** يعمل على البيانات المعروضة فقط

## 🚀 الخطوات التالية

1. ✅ إضافة بيانات حقيقية من Google Ads API
2. ✅ تفعيل WebSocket للتحديثات الفورية
3. ✅ إضافة تنبيهات ذكية
4. ✅ Dashboard مخصص لكل مستخدم
5. ✅ تصدير PDF مع رسوم بيانية

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من console للأخطاء
2. راجع ملف `REALTIME_ANALYTICS_UPGRADE.md`
3. تحقق من Prisma Studio

---

**تم التطوير بواسطة**: SmartADX Team  
**التاريخ**: 2025-10-04  
**الإصدار**: 2.0.0
