"use client";

import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const insights = [
  {
    type: "success",
    icon: CheckCircle,
    title: "أداء ممتاز",
    description: "حملة 'منتج صيفي' تحقق نتائج أعلى من المتوقع بنسبة 23%",
    action: "عرض التفاصيل",
    time: "منذ دقيقتين"
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "تحسين مطلوب",
    description: "معدل النقر في حملة 'تطبيق موبايل' منخفض. يُنصح بتحديث النصوص الإعلانية",
    action: "تحسين الآن",
    time: "منذ 15 دقيقة"
  },
  {
    type: "insight",
    icon: Lightbulb,
    title: "فرصة جديدة",
    description: "اكتشف الذكاء الاصطناعي ترند جديد في منصة TikTok. يمكن زيادة الاستهداف",
    action: "استكشاف",
    time: "منذ ساعة"
  },
  {
    type: "trend",
    icon: TrendingUp,
    title: "تحليل السوق",
    description: "نمو بنسبة 15% في الطلب على الإعلانات المرئية هذا الأسبوع",
    action: "إنشاء حملة",
    time: "منذ 3 ساعات"
  }
];

const aiRecommendations = [
  "زيادة الميزانية للحملات عالية الأداء بنسبة 20%",
  "تغيير أوقات النشر للحملة الجديدة إلى المساء",
  "استهداف شريحة عمرية 25-35 سنة للمنتج الجديد",
  "إضافة فيديوهات قصيرة لزيادة التفاعل"
];

export default function AIInsights() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500 animate-pulse" />
                رؤى الذكاء الاصطناعي
              </CardTitle>
              <CardDescription>تحليلات وتوصيات ذكية لتحسين حملاتك</CardDescription>
            </div>
            <Badge className="gradient-purple text-white border-0 animate-pulse-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Insights */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              التحديثات المباشرة
            </h4>
            {insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg glass-morphism border border-white/10"
              >
                <div className={`p-1.5 rounded-lg ${
                  insight.type === "success" ? "bg-green-500/20" :
                  insight.type === "warning" ? "bg-yellow-500/20" :
                  insight.type === "insight" ? "bg-blue-500/20" :
                  "bg-purple-500/20"
                }`}>
                  <insight.icon className={`w-4 h-4 ${
                    insight.type === "success" ? "text-green-500" :
                    insight.type === "warning" ? "text-yellow-500" :
                    insight.type === "insight" ? "text-blue-500" :
                    "text-purple-500"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{insight.title}</h5>
                    <span className="text-xs text-muted-foreground">{insight.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs mt-1 text-blue-500"
                  >
                    {insight.action}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              توصيات الذكاء الاصطناعي
            </h4>
            <div className="space-y-2">
              {aiRecommendations.slice(0, 3).map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full gradient-purple" />
                  <p className="text-sm text-muted-foreground flex-1">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="glass-morphism border-white/20 hover:border-purple-500/50"
            >
              <Brain className="w-4 h-4 mr-2" />
              تحليل عميق
            </Button>
            <Button
              size="sm"
              className="gradient-purple text-white border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              إنشاء تلقائي
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
