# 🔧 حل خطأ Build Manifest

## ❌ الخطأ

```
Error: ENOENT: no such file or directory, open 
'C:\...\smartadx-ai-erp\.next\server\pages\_app\build-manifest.json'
```

---

## 🎯 السبب

هذا الخطأ يحدث عندما:
1. مجلد `.next` تالف أو غير مكتمل
2. تم إيقاف عملية البناء بشكل مفاجئ
3. تعارض في الملفات المؤقتة
4. تحديث Next.js أو المكتبات

---

## ✅ الحل السريع

### الطريقة 1: حذف مجلد .next (موصى بها)

```bash
# PowerShell
Remove-Item -Recurse -Force .next

# أو CMD
rmdir /s /q .next

# ثم أعد تشغيل التطبيق
npm run dev
```

### الطريقة 2: حذف جميع الملفات المؤقتة

```bash
# حذف .next و node_modules
Remove-Item -Recurse -Force .next, node_modules

# إعادة تثبيت المكتبات
npm install

# تشغيل التطبيق
npm run dev
```

### الطريقة 3: تنظيف شامل

```bash
# حذف جميع الملفات المؤقتة
Remove-Item -Recurse -Force .next, node_modules, .turbo

# مسح cache npm
npm cache clean --force

# إعادة تثبيت
npm install

# توليد Prisma Client
npx prisma generate

# تشغيل
npm run dev
```

---

## 🔍 التشخيص

### تحقق من المشكلة:

```bash
# 1. تحقق من وجود مجلد .next
Test-Path .next

# 2. تحقق من محتويات المجلد
Get-ChildItem .next -Recurse -ErrorAction SilentlyContinue

# 3. تحقق من العمليات المفتوحة
Get-Process -Name node -ErrorAction SilentlyContinue
```

---

## 🛠️ الحلول المتقدمة

### إذا استمرت المشكلة:

#### 1. أغلق جميع عمليات Node.js
```bash
# PowerShell
Get-Process -Name node | Stop-Process -Force

# انتظر ثانيتين ثم أعد المحاولة
npm run dev
```

#### 2. تحقق من الأذونات
```bash
# تأكد من أن لديك صلاحيات الكتابة
icacls .next
```

#### 3. تحقق من مساحة القرص
```bash
# تحقق من المساحة المتاحة
Get-PSDrive C
```

#### 4. استخدم أمر build بدلاً من dev
```bash
# جرب البناء أولاً
npm run build

# ثم التشغيل
npm run dev
```

---

## 📋 قائمة التحقق

عند مواجهة هذا الخطأ، جرب بالترتيب:

- [ ] حذف مجلد `.next`
- [ ] إعادة تشغيل `npm run dev`
- [ ] إذا استمر: حذف `node_modules` و `.next`
- [ ] إعادة تثبيت: `npm install`
- [ ] إذا استمر: مسح cache: `npm cache clean --force`
- [ ] إذا استمر: إغلاق جميع عمليات Node.js
- [ ] إذا استمر: إعادة تشغيل الكمبيوتر

---

## 🚨 الأخطاء المشابهة

### خطأ: "Module not found"
```bash
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run dev
```

### خطأ: "Cannot find module"
```bash
npx prisma generate
npm run dev
```

### خطأ: "Port 3000 already in use"
```bash
# ابحث عن العملية
netstat -ano | findstr :3000

# أغلق العملية (استبدل PID برقم العملية)
taskkill /PID <PID> /F

# أو استخدم منفذ آخر
$env:PORT=3001; npm run dev
```

---

## 💡 نصائح للوقاية

### 1. أغلق التطبيق بشكل صحيح
- استخدم `Ctrl+C` في Terminal
- لا تغلق Terminal مباشرة

### 2. استخدم .gitignore
تأكد من أن `.next` في `.gitignore`:
```
.next/
node_modules/
.turbo/
```

### 3. نظف بشكل دوري
```bash
# أضف script في package.json
"scripts": {
  "clean": "Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue",
  "clean:all": "Remove-Item -Recurse -Force .next, node_modules -ErrorAction SilentlyContinue"
}

# استخدمه
npm run clean
```

---

## 📞 إذا استمرت المشكلة

### جرب هذه الخطوات:

1. **تحديث Next.js**
```bash
npm install next@latest react@latest react-dom@latest
```

2. **تحقق من package.json**
تأكد من توافق الإصدارات

3. **تحقق من next.config.js**
تأكد من عدم وجود إعدادات خاطئة

4. **افحص الـ Console**
ابحث عن أخطاء أخرى قد تكون السبب

---

## ✅ التحقق من الحل

بعد تطبيق الحل، تحقق من:

```bash
# 1. التطبيق يعمل
# افتح: http://localhost:3000

# 2. لا توجد أخطاء في Console
# افتح DevTools (F12) وتحقق من Console

# 3. مجلد .next موجود
Test-Path .next

# 4. الملفات موجودة
Test-Path .next\server\pages\_app\build-manifest.json
```

---

## 📊 الحالة

**الخطأ:** `ENOENT: build-manifest.json`  
**الحل:** ✅ حذف مجلد `.next` وإعادة التشغيل  
**الوقت:** 1-2 دقيقة  
**الصعوبة:** سهل ⭐

---

**آخر تحديث:** 2025-10-04  
**الحالة:** ✅ تم الحل
