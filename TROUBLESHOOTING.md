# دليل حل المشاكل - Dashboard

## 🔍 المشاكل الشائعة والحلول

### 1. الصفحة لا تظهر بشكل صحيح
**الأعراض:**
- عناصر متداخلة
- تخطيط مكسور
- مكونات مفقودة

**الحل:**
✅ **تم الإصلاح:** كانت هناك مشكلة في بنية HTML (علامات إغلاق مفقودة)
- الملف: `src/app/page.tsx`
- التعديل: تم إضافة `</div>`, `</CardContent>`, `</Card>` المفقودة

---

### 2. الأيقونات لا تظهر في بطاقات الإحصائيات
**الأعراض:**
- بطاقات الإحصائيات بدون أيقونات
- أيقونة افتراضية تظهر دائماً

**الحل:**
✅ **تم الإصلاح:** كان هناك خطأ في اختيار الأيقونات
- الملف: `src/components/dashboard/StatsCards.tsx`
- التعديل: استخدام array من الأيقونات بدلاً من iconMap

---

### 3. رسائل خطأ WebSocket في Console
**الأعراض:**
```
WebSocket connection failed
WebSocket error: ...
```

**الحل:**
✅ **تم الإصلاح:** تحسين معالجة الأخطاء
- الملف: `src/hooks/use-realtime.ts`
- التعديل: رسائل خطأ أوضح ولا تظهر بشكل مزعج
- **ملاحظة:** هذا طبيعي إذا لم يكن WebSocket server يعمل

**لتفعيل WebSocket:**
1. أنشئ WebSocket server على المنفذ 3001
2. أو حدد `NEXT_PUBLIC_WEBSOCKET_URL` في `.env`

---

### 4. التحديثات التلقائية لا تعمل
**الأعراض:**
- البيانات لا تتحدث تلقائياً
- زر "تحديث تلقائي" لا يعمل

**السبب:**
- WebSocket server غير متوفر

**الحل:**
1. **الحل المؤقت:** استخدم زر التحديث اليدوي (🔄)
2. **الحل الدائم:** قم بإنشاء WebSocket server

```javascript
// مثال بسيط لـ WebSocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  
  // إرسال تحديثات دورية
  setInterval(() => {
    ws.send(JSON.stringify({
      type: 'campaign_update',
      data: { /* بياناتك */ }
    }));
  }, 5000);
});
```

---

### 5. بيانات الإحصائيات لا تظهر
**الأعراض:**
- بطاقات فارغة
- رسالة "فشل تحميل الإحصائيات"

**الأسباب المحتملة:**
1. **مشكلة في API:**
   - تحقق من أن `/api/trpc` يعمل
   - افتح Network tab في DevTools

2. **مشكلة في قاعدة البيانات:**
   - تأكد من تشغيل Prisma
   - نفذ: `npx prisma generate`

3. **بيانات غير موجودة:**
   - نفذ seed script: `npm run seed`

**الحل:**
```bash
# إعادة إنشاء قاعدة البيانات
npx prisma migrate reset

# توليد Prisma Client
npx prisma generate

# إضافة بيانات تجريبية
npm run seed
```

---

### 6. React Hooks Warnings في Console
**الأعراض:**
```
Warning: React Hook useEffect has missing dependencies
```

**الحل:**
✅ **تم الإصلاح:** تم إضافة dependencies المفقودة
- الملف: `src/components/dashboard/RealtimeNotifications.tsx`
- التعديل: إضافة `[subscribeToCampaigns, unsubscribeFromCampaigns]`

---

### 7. صفحة بيضاء (White Screen)
**الأعراض:**
- الصفحة لا تظهر أي شيء
- Console يظهر أخطاء

**خطوات التشخيص:**
1. افتح Console (F12)
2. ابحث عن أخطاء JavaScript
3. تحقق من Network tab

**الحلول الشائعة:**
```bash
# مسح cache
rm -rf .next
npm run dev

# إعادة تثبيت المكتبات
rm -rf node_modules
npm install

# التحقق من TypeScript
npx tsc --noEmit
```

---

### 8. Build Errors
**الأعراض:**
```
Error: Build failed
Type error: ...
```

**الحل:**
✅ **تم الإصلاح:** جميع أخطاء TypeScript تم حلها

**للتحقق:**
```bash
# فحص TypeScript
npx tsc --noEmit

# فحص ESLint
npm run lint

# البناء
npm run build
```

---

## 🛠️ أدوات التشخيص

### 1. فحص الأخطاء في Console
```javascript
// افتح Console واكتب:
console.log('Dashboard loaded:', !!document.querySelector('[data-dashboard]'));
```

### 2. فحص API
```bash
# اختبر API endpoint
curl http://localhost:3000/api/trpc/dashboard.getStats
```

### 3. فحص WebSocket
```javascript
// في Console:
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (e) => console.log('WebSocket error:', e);
```

---

## 📞 الحصول على المساعدة

### قبل طلب المساعدة، جهز:
1. ✅ نسخة Node.js: `node --version`
2. ✅ نسخة npm: `npm --version`
3. ✅ محتوى Console (F12)
4. ✅ محتوى Network tab
5. ✅ الخطوات لإعادة إنتاج المشكلة

### ملفات مفيدة:
- `DASHBOARD_FIXES.md` - تفاصيل الإصلاحات
- `DASHBOARD_SUMMARY.md` - ملخص شامل
- `package.json` - المكتبات المستخدمة

---

## ✅ قائمة التحقق السريعة

قبل البدء، تأكد من:
- [ ] Node.js مثبت (v18+)
- [ ] npm install تم تنفيذه
- [ ] قاعدة البيانات تعمل
- [ ] Prisma Client تم توليده
- [ ] المنفذ 3000 متاح
- [ ] لا توجد أخطاء في Console

---

**آخر تحديث:** 2025-10-04  
**الحالة:** ✅ جميع المشاكل المعروفة مُصلحة
