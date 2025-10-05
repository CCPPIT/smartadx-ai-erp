"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Search,
  ChevronRight,
  ExternalLink,
  Code,
  Database,
  Shield,
  Users,
  BarChart3,
  Megaphone,
  Palette,
  Zap,
  Globe,
  Server,
  GitBranch
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const documentationSections = [
    {
      id: "getting-started",
      title: "البدء السريع",
      icon: Rocket,
      description: "دليل البدء مع نظام SmartAdX AI ERP",
      items: [
        { title: "متطلبات النظام", link: "#requirements" },
        { title: "التثبيت والإعداد", link: "#installation" },
        { title: "الدخول لأول مرة", link: "#first-login" },
        { title: "إنشاء حملة أولى", link: "#first-campaign" }
      ]
    },
    {
      id: "user-guide",
      title: "دليل المستخدم",
      icon: Users,
      description: "شرح تفصيلي لجميع ميزات النظام",
      items: [
        { title: "لوحة التحكم", link: "#dashboard" },
        { title: "إدارة الحملات", link: "#campaigns" },
        { title: "التحليلات", link: "#analytics" },
        { title: "إدارة العملاء", link: "#clients" }
      ]
    },
    {
      id: "ai-features",
      title: "ميزات الذكاء الاصطناعي",
      icon: Brain,
      description: "استخدام أدوات الذكاء الاصطناعي المتقدمة",
      items: [
        { title: "المساعد الذكي", link: "#ai-assistant" },
        { title: "توليد الإعلانات", link: "#ad-generation" },
        { title: "التصميم الذكي", link: "#ai-design" },
        { title: "النصوص الدعائية", link: "#copywriting" }
      ]
    },
    {
      id: "api-reference",
      title: "مرجع API",
      icon: Code,
      description: "توثيق واجهة برمجة التطبيقات",
      items: [
        { title: "المصادقة", link: "#authentication" },
        { title: "الحملات", link: "#campaigns-api" },
        { title: "العملاء", link: "#clients-api" },
        { title: "التحليلات", link: "#analytics-api" }
      ]
    },
    {
      id: "admin-guide",
      title: "دليل الإدارة",
      icon: Shield,
      description: "إدارة النظام وإعدادات الأمان",
      items: [
        { title: "إدارة المستخدمين", link: "#user-management" },
        { title: "إعدادات الأمان", link: "#security-settings" },
        { title: "النسخ الاحتياطي", link: "#backup" },
        { title: "الصيانة", link: "#maintenance" }
      ]
    },
    {
      id: "troubleshooting",
      title: "استكشاف الأخطاء",
      icon: HelpCircle,
      description: "حلول للمشاكل الشائعة",
      items: [
        { title: "مشاكل تسجيل الدخول", link: "#login-issues" },
        { title: "أخطاء الحملات", link: "#campaign-errors" },
        { title: "مشاكل الأداء", link: "#performance-issues" },
        { title: "الاتصال بالشبكة", link: "#network-issues" }
      ]
    }
  ];

  const resources = [
    {
      title: "دليل المستخدم الكامل",
      type: "PDF",
      size: "2.4 MB",
      icon: FileText,
      link: "#"
    },
    {
      title: "دورة تدريبية فيديو",
      type: "فيديو",
      size: "1.2 GB",
      icon: Video,
      link: "#"
    },
    {
      title: "نموذج API",
      type: "JSON",
      size: "15 KB",
      icon: Code,
      link: "#"
    },
    {
      title: "نموذج تكامل",
      type: "ZIP",
      size: "45 MB",
      icon: Download,
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "ما هي متطلبات النظام لتشغيل SmartAdX AI ERP؟",
      answer: "يحتاج النظام إلى متصفح حديث (Chrome، Firefox، Safari) واتصال بالإنترنت. للحصول على أفضل تجربة، نوصي باستخدام أحدث إصدار من المتصفح."
    },
    {
      question: "كيف يمكنني الحصول على الدعم الفني؟",
      answer: "يمكنك التواصل مع فريق الدعم الفني من خلال صفحة المساعدة في النظام، أو عبر البريد الإلكتروني support@smartadx.ai، أو عبر الهاتف +970 000 0000."
    },
    {
      question: "هل يمكنني تخصيص النظام حسب احتياجات مؤسستي؟",
      answer: "نعم، يوفر النظام إمكانية التخصيص الشامل للواجهة والوظائف حسب احتياجات المؤسسة. يمكن لفريق التطوير لدينا مساعدتك في ذلك."
    },
    {
      question: "ما هي مستويات الأمان المتوفرة في النظام؟",
      answer: "يوفر النظام عدة مستويات أمان تشمل التحقق بخطوتين، تشفير البيانات، وسجلات النشاط. كما يمكن إعداد صلاحيات الوصول حسب أدوار المستخدمين."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            التوثيق والمساعدة
          </h1>
          <p className="text-muted-foreground mt-2">
            كل ما تحتاج لمعرفته حول نظام SmartAdX AI ERP
          </p>
        </div>

        {/* Search Bar */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث في التوثيق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg bg-white/10 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documentation Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  فئات التوثيق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentationSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Accordion type="single" collapsible>
                          <AccordionItem value={section.id} className="border-0">
                            <AccordionTrigger className="px-4 py-3 text-right hover:no-underline">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-right">
                                  <h3 className="font-medium">{section.title}</h3>
                                  <p className="text-xs text-muted-foreground">{section.description}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <ul className="space-y-2">
                                {section.items.map((item, index) => (
                                  <li key={index}>
                                    <a 
                                      href={item.link} 
                                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  الموارد والتنزيلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{resource.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{resource.type}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{resource.size}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-2">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle>نظرة عامة على النظام</CardTitle>
                <CardDescription>
                  نظام SmartAdX AI ERP هو نظام إدارة موارد المؤسسات مصمم خصيصاً لقطاع الدعاية والإعلان
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p>
                    يوفر نظام SmartAdX AI ERP حلاً شاملاً لإدارة الحملات الإعلانية وتحليل البيانات والتنبؤ بالأداء باستخدام تقنيات الذكاء الاصطناعي المتقدمة.
                  </p>
                  <h3>الميزات الرئيسية:</h3>
                  <ul>
                    <li>تحليلات ذكية وتوصيات مخصصة</li>
                    <li>لوحات تحكم تفاعلية ومقاييس أداء متقدمة</li>
                    <li>تصميم متجاوب مع تأثيرات بصرية جذابة</li>
                    <li>أداء عالي مبني على Next.js 15 مع أحدث التقنيات</li>
                    <li>حماية البيانات وإدارة الصلاحيات المتقدمة</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* System Architecture */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  بنية النظام
                </CardTitle>
                <CardDescription>
                  مكونات النظام التقنية والبنية التحتية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-medium">الواجهة الأمامية</h3>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Next.js 15 مع TypeScript</li>
                      <li>ShadCN UI + Radix UI</li>
                      <li>Tailwind CSS 3.4</li>
                      <li>Framer Motion للحركات</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-green-400" />
                      <h3 className="font-medium">ال-backend</h3>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Node.js مع Express</li>
                      <li>PostgreSQL مع Prisma</li>
                      <li>Redis للكاش</li>
                      <li>WebSocket للتحديثات الفورية</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <h3 className="font-medium">الأمان</h3>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>JWT للمصادقة</li>
                      <li>تشفير AES-256</li>
                      <li>التحقق بخطوتين</li>
                      <li>سجلات النشاط</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-medium">التطوير</h3>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Git للتحكم في الإصدار</li>
                      <li>Docker للحاويات</li>
                      <li>Kubernetes للنشر</li>
                      <li>CI/CD مع GitHub Actions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  الأسئلة الشائعة
                </CardTitle>
                <CardDescription>
                  إجابات على الأسئلة الأكثر شيوعاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-right">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-right">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Icon components that were referenced but not imported
function Rocket({ className }: { className?: string }) {
  return <Megaphone className={className} />;
}

function Brain({ className }: { className?: string }) {
  return <BarChart3 className={className} />;
}

function HelpCircle({ className }: { className?: string }) {
  return <HelpCircle className={className} />;
}