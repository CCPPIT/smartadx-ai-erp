"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Zap,
  Brain,
  Sparkles,
  Eye,
  Search,
  Users,
  Target,
  TrendingUp,
  Gift,
  Crown,
  Bot,
  Image,
  FileText,
  Download,
  Upload,
  Save,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [smartSidebar, setSmartSidebar] = useState(true);
  const [priorityNotifications, setPriorityNotifications] = useState(true);
  const [smartSearch, setSmartSearch] = useState(true);
  const [aiAdGeneration, setAiAdGeneration] = useState(true);
  const [marketTrendAnalysis, setMarketTrendAnalysis] = useState(true);
  const [smartTargeting, setSmartTargeting] = useState(true);
  const [aiCopywriting, setAiCopywriting] = useState(true);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(true);
  const [creatorRewards, setCreatorRewards] = useState(true);

  const features = [
    {
      id: "ai-ad-generation",
      title: "توليد إعلانات بالذكاء الاصطناعي",
      description: "إنشاء إعلانات تلقائية باستخدام الذكاء الاصطناعي",
      icon: Sparkles,
      enabled: aiAdGeneration,
      setEnabled: setAiAdGeneration,
      badge: "AI"
    },
    {
      id: "market-trend-analysis",
      title: "تحليل ترندات السوق الآلي",
      description: "تحليل تلقائي لترندات السوق وسلوك المستهلكين",
      icon: TrendingUp,
      enabled: marketTrendAnalysis,
      setEnabled: setMarketTrendAnalysis,
      badge: "تحليل"
    },
    {
      id: "smart-targeting",
      title: "نظام توصيات الاستهداف الذكي",
      description: "توصيات استهداف متقدمة بناءً على البيانات",
      icon: Target,
      enabled: smartTargeting,
      setEnabled: setSmartTargeting,
      badge: "ذكي"
    },
    {
      id: "ai-copywriting",
      title: "مولد النصوص الدعائية AI",
      description: "إنشاء نصوص دعائية جذابة بالذكاء الاصطناعي",
      icon: FileText,
      enabled: aiCopywriting,
      setEnabled: setAiCopywriting,
      badge: "نصوص"
    },
    {
      id: "competitor-analysis",
      title: "تحليل المنافسين التلقائي",
      description: "مراقبة وتحليل أداء المنافسين تلقائيًا",
      icon: Users,
      enabled: competitorAnalysis,
      setEnabled: setCompetitorAnalysis,
      badge: "تحليل"
    },
    {
      id: "creator-rewards",
      title: "نظام المكافآت للمبدعين",
      description: "مكافآت تلقائية لأفضل المبدعين في الحملات",
      icon: Gift,
      enabled: creatorRewards,
      setEnabled: setCreatorRewards,
      badge: "مكافآت"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              الإعدادات
            </h1>
            <p className="text-muted-foreground mt-2">
              تخصيص النظام وميزات الذكاء الاصطناعي الثورية
            </p>
          </div>
          <Button className="gradient-primary text-white">
            <Save className="w-4 h-4 mr-2" />
            حفظ التغييرات
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="appearance">المظهر</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
            <TabsTrigger value="integrations">التكامل</TabsTrigger>
            <TabsTrigger value="advanced">الميزات الثورية</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>
                  تخصيص الإعدادات الأساسية للنظام
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="language">اللغة</Label>
                    <p className="text-sm text-muted-foreground">
                      تغيير لغة واجهة النظام
                    </p>
                  </div>
                  <Select defaultValue="ar">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد المنطقة الزمنية للنظام
                    </p>
                  </div>
                  <Select defaultValue="gmt+3">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="اختر المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmt+2">GMT+2</SelectItem>
                      <SelectItem value="gmt+3">GMT+3</SelectItem>
                      <SelectItem value="gmt+4">GMT+4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="currency">العملة الافتراضية</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد العملة المستخدمة في التقارير
                    </p>
                  </div>
                  <Select defaultValue="sar">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sar">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="usd">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="eur">يورو (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المظهر</CardTitle>
                <CardDescription>
                  تخصيص مظهر وتصميم واجهة النظام
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">الوضع الليلي</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل الوضع الليلي للنظام
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="theme">سمة النظام</Label>
                    <p className="text-sm text-muted-foreground">
                      اختيار سمة الألوان الرئيسية للنظام
                    </p>
                  </div>
                  <Select defaultValue="indigo">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="اختر السمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indigo">إنديجو</SelectItem>
                      <SelectItem value="purple">بنفسجي</SelectItem>
                      <SelectItem value="blue">أزرق</SelectItem>
                      <SelectItem value="green">أخضر</SelectItem>
                      <SelectItem value="pink">وردي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="animations">الرسوم المتحركة</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل الرسوم المتحركة في النظام
                    </p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>
                  تخصيص كيفية استلام الإشعارات والتقارير
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">الإشعارات</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل جميع الإشعارات
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">الإشعارات عبر البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      استلام نسخة من الإشعارات عبر البريد الإلكتروني
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="smart-notifications">الإشعارات الذكية مع تحليل الأولوية</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل نظام الإشعارات الذكية الذي يحلل الأولوية
                    </p>
                  </div>
                  <Switch
                    id="smart-notifications"
                    checked={priorityNotifications}
                    onCheckedChange={setPriorityNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notification-frequency">تردد الإشعارات</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد عدد الإشعارات التي تتلقاها
                    </p>
                  </div>
                  <Select defaultValue="normal">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="اختر التردد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">مرتفع</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="low">منخفض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
                <CardDescription>
                  تخصيص ميزات الذكاء الاصطناعي في النظام
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="ai-assistant">المساعد الذكي</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل المساعد الذكي في جميع أنحاء النظام
                    </p>
                  </div>
                  <Switch id="ai-assistant" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="ai-insights">الرؤى الذكية</Label>
                    <p className="text-sm text-muted-foreground">
                      عرض الرؤى الذكية في لوحة التحكم
                    </p>
                  </div>
                  <Switch id="ai-insights" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="ai-suggestions">اقتراحات الذكاء الاصطناعي</Label>
                    <p className="text-sm text-muted-foreground">
                      عرض اقتراحات الذكاء الاصطناعي في النماذج
                    </p>
                  </div>
                  <Switch
                    id="ai-suggestions"
                    checked={aiSuggestions}
                    onCheckedChange={setAiSuggestions}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="ai-integrations">تكامل مع GPT-4 و DALL-E</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل التكامل مع نماذج الذكاء الاصطناعي المتقدمة
                    </p>
                  </div>
                  <Switch id="ai-integrations" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التكامل مع المنصات</CardTitle>
                <CardDescription>
                  ربط النظام مع منصات التواصل الاجتماعي والأدوات الخارجية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "فيسبوك", connected: true },
                    { name: "تويتر", connected: false },
                    { name: "إنستغرام", connected: true },
                    { name: "لينكد إن", connected: false },
                    { name: "تيك توك", connected: false },
                    { name: "يوتيوب", connected: true }
                  ].map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <span>{platform.name}</span>
                      {platform.connected ? (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
                          متصل
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          ربط الحساب
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="api-key">مفتاح API الخارجي</Label>
                  <div className="flex gap-2 mt-2">
                    <Input id="api-key" placeholder="أدخل مفتاح API" className="flex-1" />
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      حفظ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الميزات الثورية المستقبلية</CardTitle>
                <CardDescription>
                  تفعيل أو تعطيل الميزات الثورية المستقبلية للنظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{feature.title}</h3>
                            <Badge variant="secondary">{feature.badge}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={feature.setEnabled}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    ميزات مميزة قادمة
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    سيتم إطلاق هذه الميزات الثورية قريبًا:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      Sidebar ذكي يتكيف مع سلوك المستخدم
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      بحث ذكي مع اقتراحات AI
                    </li>
                    <li className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-pink-500" />
                      تكامل متقدم مع أدوات التصميم
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}