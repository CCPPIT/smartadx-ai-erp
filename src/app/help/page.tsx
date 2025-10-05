"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  Settings,
  BarChart3,
  Megaphone,
  Palette,
  Database
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

export default function HelpPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const categories = [
    { id: "all", label: "الكل", icon: HelpCircle },
    { id: "account", label: "الحساب", icon: User },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "settings", label: "الإعدادات", icon: Settings },
    { id: "analytics", label: "التحليلات", icon: BarChart3 },
    { id: "campaigns", label: "الحملات", icon: Megaphone },
    { id: "design", label: "التصميم", icon: Palette },
    { id: "data", label: "البيانات", icon: Database }
  ];

  const faqs = [
    {
      id: "1",
      category: "account",
      question: "كيف يمكنني تغيير معلومات حسابي؟",
      answer: "يمكنك تغيير معلومات حسابك من خلال الذهاب إلى صفحة الملف الشخصي والنقر على زر تعديل الملف الشخصي. يمكنك تحديث اسمك وعنوان بريدك الإلكتروني ورقم هاتفك والتفاصيل الأخرى."
    },
    {
      id: "2",
      category: "security",
      question: "كيف يمكنني تفعيل التحقق بخطوتين؟",
      answer: "لتفعيل التحقق بخطوتين، اذهب إلى صفحة الإعدادات ثم قسم الأمان وقم بتفعيل خيار التحقق بخطوتين. سيُطلب منك إدخال رقم هاتفك لتلقي رموز التحقق."
    },
    {
      id: "3",
      category: "campaigns",
      question: "كيف يمكنني إنشاء حملة إعلانية جديدة؟",
      answer: "لإنشاء حملة إعلانية جديدة، انقر على زر 'حملة جديدة' في لوحة التحكم الرئيسية، ثم اختر نوع الحملة وقم بتحديد الجمهور المستهدف والميزانية والمدة الزمنية."
    },
    {
      id: "4",
      category: "analytics",
      question: "كيف يمكنني عرض تقارير الأداء؟",
      answer: "يمكنك عرض تقارير الأداء من خلال الذهاب إلى قسم التقارير في القائمة الجانبية، حيث يمكنك اختيار نوع التقرير والوقت المطلوب لعرض البيانات التحليلية."
    },
    {
      id: "5",
      category: "settings",
      question: "كيف يمكنني تغيير لغة التطبيق؟",
      answer: "لتغيير لغة التطبيق، اذهب إلى صفحة الإعدادات ثم قسم اللغة واختر اللغة المطلوبة من القائمة المنسدلة. سيتم تطبيق التغيير فوراً."
    },
    {
      id: "6",
      category: "design",
      question: "كيف يمكنني استخدام أدوات التصميم بالذكاء الاصطناعي؟",
      answer: "للوصول إلى أدوات التصميم بالذكاء الاصطناعي، اذهب إلى قسم التصميم في القائمة الجانبية، ثم اختر 'تصميم بالذكاء الاصطناعي' وابدأ بإنشاء تصاميمك المخصصة."
    }
  ];

  const tutorials = [
    {
      id: "1",
      title: "إنشاء حملة إعلانية للمرة الأولى",
      duration: "5 دقائق",
      type: "فيديو",
      icon: Video
    },
    {
      id: "2",
      title: "تحليل أداء الحملات الإعلانية",
      duration: "8 دقائق",
      type: "فيديو",
      icon: Video
    },
    {
      id: "3",
      title: "إعداد التحقق بخطوتين",
      duration: "3 دقائق",
      type: "دليل",
      icon: BookOpen
    },
    {
      id: "4",
      title: "تخصيص لوحة التحكم",
      duration: "4 دقائق",
      type: "دليل",
      icon: BookOpen
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === "all" || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send to your support system
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم إرسال الطلب",
        description: "شكرًا لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.",
      });
      
      setSupportForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلب الدعم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            المساعدة والدعم
          </h1>
          <p className="text-muted-foreground mt-2">
            كيف يمكننا مساعدتك اليوم؟
          </p>
        </div>

        {/* Search Bar */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg bg-white/10 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  فئات المساعدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-300"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass-morphism border-white/20 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  تواصل معنا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">support@smartadx.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">الهاتف</p>
                    <p className="text-sm text-muted-foreground">+970 000 0000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* FAQ Section */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  الأسئلة الشائعة
                </CardTitle>
                <CardDescription>
                  ابحث في الأسئلة الأكثر شيوعاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-right">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-right">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>لم يتم العثور على نتائج للبحث</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tutorials Section */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  الدروس التعليمية
                </CardTitle>
                <CardDescription>
                  تعلم كيفية استخدام النظام من خلال الدروس التعليمية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorials.map((tutorial) => {
                    const Icon = tutorial.icon;
                    return (
                      <div 
                        key={tutorial.id} 
                        className="p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{tutorial.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                              <span className="text-xs bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded">
                                {tutorial.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Support Form */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  طلب دعم فني
                </CardTitle>
                <CardDescription>
                  اتصل بفريق الدعم لدينا للحصول على مساعدة إضافية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSupport} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input
                        id="name"
                        name="name"
                        value={supportForm.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={supportForm.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={supportForm.subject}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={supportForm.message}
                      onChange={handleFormChange}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}