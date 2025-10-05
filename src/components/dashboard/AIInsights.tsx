"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  RefreshCw,
  ChevronRight,
  TrendingDown,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { text: "زيادة الميزانية للحملات عالية الأداء بنسبة 20%", impact: "high", category: "budget" },
  { text: "تغيير أوقات النشر للحملة الجديدة إلى المساء", impact: "medium", category: "timing" },
  { text: "استهداف شريحة عمرية 25-35 سنة للمنتج الجديد", impact: "high", category: "targeting" },
  { text: "إضافة فيديوهات قصيرة لزيادة التفاعل", impact: "medium", category: "content" },
  { text: "تحسين النصوص الإعلانية باستخدام كلمات مفتاحية أقوى", impact: "high", category: "content" },
  { text: "توسيع الاستهداف الجغرافي للمدن الكبرى", impact: "medium", category: "targeting" }
];

const performanceMetrics = [
  { label: "معدل التحويل", value: "8.5%", change: "+2.3%", trend: "up", icon: Target },
  { label: "معدل النقر", value: "3.2%", change: "+0.8%", trend: "up", icon: Zap },
  { label: "التفاعل", value: "12.4K", change: "+15%", trend: "up", icon: Users },
  { label: "العائد على الاستثمار", value: "245%", change: "+18%", trend: "up", icon: DollarSign }
];

const aiPredictions = [
  { title: "توقعات الأسبوع القادم", description: "زيادة متوقعة في التفاعل بنسبة 12%", confidence: 85 },
  { title: "أفضل وقت للنشر", description: "الثلاثاء والخميس من 2-4 مساءً", confidence: 92 },
  { title: "الجمهور المثالي", description: "ذكور 28-35 سنة، مهتمون بالتكنولوجيا", confidence: 78 }
];

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState("insights");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-500 bg-green-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
  };

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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="glass-morphism border-white/20"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Badge className="gradient-purple text-white border-0 animate-pulse-glow">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">الرؤى</TabsTrigger>
              <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
              <TabsTrigger value="predictions">التوقعات</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {performanceMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-morphism border-white/10">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-4 h-4 text-purple-500" />
                            <Badge variant="secondary" className="text-xs gap-1">
                              <TrendIcon className="w-3 h-3" />
                              {metric.change}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-lg font-bold">{metric.value}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Live Insights */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  التحديثات المباشرة
                </h4>
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg glass-morphism border cursor-pointer transition-all ${
                      selectedInsight === index ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedInsight(selectedInsight === index ? null : index)}
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
                      <AnimatePresence>
                        {selectedInsight === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 pt-2 border-t border-white/10"
                          >
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-purple-500 gap-1"
                            >
                              {insight.action}
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-3">
              <div className="space-y-2">
                {aiRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg glass-morphism border border-white/10 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="w-2 h-2 rounded-full gradient-purple mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground group-hover:text-purple-500 transition-colors">
                        {recommendation.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getImpactColor(recommendation.impact)}`}
                        >
                          {recommendation.impact === "high" ? "تأثير عالي" : "تأثير متوسط"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {recommendation.category === "budget" ? "الميزانية" :
                           recommendation.category === "timing" ? "التوقيت" :
                           recommendation.category === "targeting" ? "الاستهداف" : "المحتوى"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-3">
              {aiPredictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-morphism border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">{prediction.title}</h4>
                          <p className="text-xs text-muted-foreground">{prediction.description}</p>
                        </div>
                        <Badge className="gradient-purple text-white border-0">
                          {prediction.confidence}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">مستوى الثقة</span>
                          <span className="font-medium">{prediction.confidence}%</span>
                        </div>
                        <Progress value={prediction.confidence} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>

          {/* AI Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="glass-morphism border-white/20 hover:border-purple-500/50 transition-all"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              تحليل عميق
            </Button>
            <Button
              size="sm"
              className="gradient-purple text-white border-0 hover:scale-105 transition-transform"
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
