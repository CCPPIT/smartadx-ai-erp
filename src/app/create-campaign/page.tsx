"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Target,
  DollarSign,
  Calendar,
  Users,
  Globe,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    platform: "",
    adType: "",
    description: ""
  });

  const steps = [
    { number: 1, title: "المعلومات الأساسية", icon: FileText },
    { number: 2, title: "الميزانية والجدول", icon: DollarSign },
    { number: 3, title: "الجمهور المستهدف", icon: Target },
    { number: 4, title: "المراجعة والإطلاق", icon: Check }
  ];

  const handleInputChange = (field: string, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Campaign Data:", campaignData);
    // هنا يمكن إرسال البيانات للـ API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-purple-600" />
            إنشاء حملة إعلانية جديدة
          </h1>
          <p className="text-muted-foreground mt-2">
            أنشئ حملتك الإعلانية بخطوات بسيطة وذكية
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          الخطوة {step} من {steps.length}
        </Badge>
      </motion.div>

      {/* Progress Steps */}
      <Card className="glass-morphism border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <p className={`text-sm mt-2 font-medium ${isActive ? "text-purple-600" : "text-muted-foreground"}`}>
                      {s.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${
                        step > s.number ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
              <CardDescription>أدخل المعلومات الأساسية لحملتك الإعلانية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الحملة *</Label>
                <Input
                  id="name"
                  placeholder="مثال: حملة إطلاق المنتج الجديد"
                  value={campaignData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="glass-morphism"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">هدف الحملة *</Label>
                <Select
                  value={campaignData.objective}
                  onValueChange={(value) => handleInputChange("objective", value)}
                >
                  <SelectTrigger className="glass-morphism">
                    <SelectValue placeholder="اختر هدف الحملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">زيادة الوعي بالعلامة التجارية</SelectItem>
                    <SelectItem value="traffic">زيادة الزيارات للموقع</SelectItem>
                    <SelectItem value="conversions">زيادة المبيعات والتحويلات</SelectItem>
                    <SelectItem value="engagement">زيادة التفاعل</SelectItem>
                    <SelectItem value="leads">جمع العملاء المحتملين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">المنصة الإعلانية *</Label>
                <Select
                  value={campaignData.platform}
                  onValueChange={(value) => handleInputChange("platform", value)}
                >
                  <SelectTrigger className="glass-morphism">
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="snapchat">Snapchat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الحملة</Label>
                <Textarea
                  id="description"
                  placeholder="اكتب وصفاً مختصراً لحملتك..."
                  value={campaignData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="glass-morphism min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                الميزانية والجدول الزمني
              </CardTitle>
              <CardDescription>حدد ميزانيتك والفترة الزمنية للحملة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">الميزانية الإجمالية (بالدولار) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    value={campaignData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className="glass-morphism pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  الميزانية الموصى بها: $500 - $5,000 للحملات الصغيرة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={campaignData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="glass-morphism"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={campaignData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="glass-morphism"
                  />
                </div>
              </div>

              {/* Budget Recommendations */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">توصيات الذكاء الاصطناعي</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        بناءً على هدفك، نوصي بميزانية يومية قدرها ${campaignData.budget ? Math.round(Number(campaignData.budget) / 30) : '50'} لمدة 30 يوماً
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                الجمهور المستهدف
              </CardTitle>
              <CardDescription>حدد جمهورك المستهدف بدقة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">وصف الجمهور المستهدف *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="مثال: رجال ونساء من 25-45 سنة، مهتمون بالتكنولوجيا..."
                  value={campaignData.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  className="glass-morphism min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الوصول المتوقع</p>
                        <p className="text-xl font-bold">50K - 100K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المناطق الجغرافية</p>
                        <p className="text-xl font-bold">عالمي</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">اقتراحات الذكاء الاصطناعي</h4>
                      <ul className="text-sm text-purple-700 dark:text-purple-300 mt-2 space-y-1">
                        <li>• استهدف المستخدمين المهتمين بالمنتجات المشابهة</li>
                        <li>• ركز على الفئة العمرية 25-45 لأفضل النتائج</li>
                        <li>• استخدم الاستهداف الجغرافي للمدن الكبرى</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                المراجعة والإطلاق
              </CardTitle>
              <CardDescription>راجع معلومات حملتك قبل الإطلاق</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">ملخص الحملة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">اسم الحملة</p>
                      <p className="font-medium">{campaignData.name || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الهدف</p>
                      <p className="font-medium">{campaignData.objective || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المنصة</p>
                      <p className="font-medium">{campaignData.platform || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الميزانية</p>
                      <p className="font-medium">${campaignData.budget || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تاريخ البدء</p>
                      <p className="font-medium">{campaignData.startDate || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                      <p className="font-medium">{campaignData.endDate || "غير محدد"}</p>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">جاهز للإطلاق!</h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          حملتك جاهزة للإطلاق. اضغط على "إطلاق الحملة" للبدء.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <Card className="glass-morphism border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </Button>

            {step < 4 ? (
              <Button
                onClick={nextStep}
                className="gradient-primary text-white gap-2"
              >
                التالي
                <ArrowLeft className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gradient-primary text-white gap-2"
              >
                <Sparkles className="w-4 h-4" />
                إطلاق الحملة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
