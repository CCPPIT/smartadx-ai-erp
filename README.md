# 📢 SmartAdX AI ERP

## نظام دعاية وإعلان ثوري بالذكاء الاصطناعي

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.3-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

### 🚀 نظرة عامة

SmartAdX AI ERP هو نظام إدارة موارد المؤسسات (ERP) المصمم خصيصاً لقطاع الدعاية والإعلان، مدعوم بتقنيات الذكاء الاصطناعي المتقدمة. يوفر حلولاً شاملة لإدارة الحملات الإعلانية وتحليل البيانات والتنبؤ بالأداء.

### ✨ الميزات الرئيسية

- 🤖 **ذكاء اصطناعي متقدم**: تحليلات ذكية وتوصيات مخصصة
- 📊 **تحليلات شاملة**: لوحات تحكم تفاعلية ومقاييس أداء متقدمة
- 📱 **تصميم متجاوب**: تجربة مثالية على جميع الأجهزة
- 🎨 **Glass Morphism**: تصميم عصري مع تأثيرات بصرية جذابة
- ⚡ **أداء عالي**: مبني على Next.js 15 مع أحدث التقنيات
- 🔒 **آمان متقدم**: JWT Authentication, Session Management, Role-Based Access
- 📧 **نظام بريد إلكتروني**: قوالب احترافية مع دعم RTL
- 🐳 **Docker Ready**: جاهز للنشر مع Docker & Docker Compose

### 🛠️ التقنيات المستخدمة

#### Frontend
- **Framework**: Next.js 15.3.2 with TypeScript 5.8.3
- **UI Components**: ShadCN UI + Radix UI (46+ components)
- **Styling**: Tailwind CSS 3.4.17 with Glass Morphism
- **Animations**: Framer Motion 12.23.3
- **Icons**: Lucide React
- **State Management**: React Context + tRPC

#### Backend
- **API**: tRPC with 20+ routers
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Authentication**: JWT + Session Management
- **Email**: Nodemailer (SendGrid/SMTP)
- **Real-time**: WebSocket support

#### DevOps
- **Containerization**: Docker + Docker Compose
- **Caching**: Redis support
- **Code Quality**: Biome, ESLint, TypeScript
- **Package Manager**: npm/bun

### 📁 هيكل المشروع

```
smartadx-ai-erp/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   │   ├── dashboard/       # مكونات لوحة التحكم
│   │   ├── layout/          # مكونات التخطيط
│   │   └── ui/              # مكونات واجهة المستخدم
│   ├── hooks/               # React Hooks مخصصة
│   └── lib/                 # وظائف مساعدة
├── public/                  # الملفات الثابتة
└── docs/                    # التوثيق
```

### 🚀 البدء السريع

#### الطريقة 1: التطوير المحلي

```bash
# 1. استنساخ المشروع
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp

# 2. تثبيت التبعيات
npm install
# أو
bun install

# 3. إعداد البيئة
cp .env.example .env.local
# عدّل .env.local بالقيم المطلوبة

# 4. إعداد قاعدة البيانات
npx prisma generate
npx prisma migrate dev
npm run seed

# 5. تشغيل خادم التطوير
npm run dev
```

#### الطريقة 2: Docker (موصى به)

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

زر [http://localhost:3000](http://localhost:3000) لرؤية التطبيق.

📖 **للمزيد من التفاصيل**: راجع [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

### 🔧 البناء والنشر

#### البناء للإنتاج

```bash
bun run build
```

#### تشغيل نسخة الإنتاج محلياً

```bash
bun start
```

#### فحص الكود

```bash
bun run lint
```

#### تنسيق الكود

```bash
bun run format
```

### 📱 الوحدات والميزات

#### 🔐 المصادقة والأمان
- JWT Authentication (Access & Refresh Tokens)
- Session Management مع قاعدة البيانات
- Password Hashing & Validation
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication (قريباً)
- OAuth Integration (قريباً)

#### 📊 إدارة الحملات
- إنشاء وإدارة الحملات الإعلانية
- تتبع الأداء في الوقت الفعلي
- تحليلات متقدمة ورسوم بيانية
- AI-powered insights

#### 🤖 الذكاء الاصطناعي
- توليد محتوى إعلاني
- تحليل المنافسين
- استهداف ذكي
- كتابة نصوص تسويقية
- تحليل اتجاهات السوق

#### 👥 إدارة العملاء
- قاعدة بيانات العملاء
- سجل التفاعلات
- إدارة الفواتير والمدفوعات

#### 📧 التواصل
- نظام إشعارات متقدم
- قوالب بريد إلكتروني احترافية
- دعم RTL للعربية

#### 📱 وسائل التواصل الاجتماعي
- جدولة المنشورات
- إدارة متعددة المنصات
- تحليل الأداء

#### 💳 الفواتير والمدفوعات
- إنشاء الفواتير
- تتبع المدفوعات
- تقارير مالية

#### 📈 التقارير والتحليلات
- تقارير مخصصة
- تصدير PDF/Excel
- لوحات تحكم تفاعلية

### 📚 التوثيق

- 📖 [دليل التثبيت](INSTALLATION_GUIDE.md) - خطوات التثبيت الكاملة
- 🐳 [دليل Docker](DOCKER_GUIDE.md) - النشر باستخدام Docker
- 🔌 [توثيق API](API_DOCUMENTATION.md) - مرجع API الكامل
- ⚙️ [إعداد البيئة](ENV_SETUP.md) - متغيرات البيئة
- 🗄️ [تحسين قاعدة البيانات](DATABASE_OPTIMIZATION.md) - أداء قاعدة البيانات
- 📝 [سجل التغييرات](CHANGELOG.md) - تاريخ الإصدارات
- 📋 [ملخص التنفيذ](IMPLEMENTATION_SUMMARY.md) - ما تم إنجازه

### 🧪 الاختبار

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### 🐛 الإبلاغ عن المشاكل

إذا وجدت مشكلة، يرجى [فتح issue](https://github.com/CCPPIT/smartadx-ai-erp/issues) مع:
- وصف المشكلة
- خطوات إعادة الإنتاج
- السلوك المتوقع
- لقطات الشاشة (إن أمكن)

### 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

### 📞 التواصل

- **الموقع الإلكتروني**: [https://smartadx.ai](https://smartadx.ai)
- **البريد الإلكتروني**: support@smartadx.ai
- **GitHub**: [@CCPPIT](https://github.com/CCPPIT)

### 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/) للإطار الممتاز
- [ShadCN](https://ui.shadcn.com/) لمكونات UI الجميلة
- [Tailwind CSS](https://tailwindcss.com/) للتصميم السريع
- [Framer Motion](https://www.framer.com/motion/) للحركات الرائعة

---

<div align="center">
  <strong>صُنع بـ ❤️ في فلسطين 🇵🇸</strong>
</div>
