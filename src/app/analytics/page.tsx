"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  
  // Mock data for charts
  const performanceData = [
    { name: 'Jan', clicks: 4000, impressions: 2400, conversions: 240 },
    { name: 'Feb', clicks: 3000, impressions: 1398, conversions: 221 },
    { name: 'Mar', clicks: 2000, impressions: 9800, conversions: 229 },
    { name: 'Apr', clicks: 2780, impressions: 3908, conversions: 200 },
    { name: 'May', clicks: 1890, impressions: 4800, conversions: 218 },
    { name: 'Jun', clicks: 2390, impressions: 3800, conversions: 250 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              التحليلات المتقدمة
            </h1>
            <p className="text-muted-foreground mt-1">
              رؤى وتقارير ذكية لأداء الحملات الإعلانية
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
                <SelectItem value="90d">آخر 90 يوم</SelectItem>
                <SelectItem value="1y">آخر سنة</SelectItem>
              </SelectContent>
            </Select>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
                  <p className="text-2xl font-bold">1.2M</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    12.5% من الشهر الماضي
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <MousePointerClick className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
                  <p className="text-2xl font-bold">85,420</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    8.3% من الشهر الماضي
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الزيارات الفريدة</p>
                  <p className="text-2xl font-bold">62,180</p>
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    2.1% من الشهر الماضي
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">معدل التحويل</p>
                  <p className="text-2xl font-bold">3.2%</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    0.8% من الشهر الماضي
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="glass-morphism border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                أداء الحملات
              </CardTitle>
              <CardDescription>تحليل النقرات والإظهارات عبر الزمن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-white/5 rounded-lg">
                <div className="text-center">
                  <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">مخطط الأداء</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate Chart */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                معدل التحويل
              </CardTitle>
              <CardDescription>تحليل معدل التحويل عبر الزمن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">مخطط معدل التحويل</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                مصادر الحركة
              </CardTitle>
              <CardDescription>تحليل مصادر الزوار</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">مخطط مصادر الحركة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Campaigns */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>أفضل الحملات أداءً</CardTitle>
            <CardDescription>الحملات التي حققت أعلى معدلات التحويل</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <span className="text-white font-bold">{item}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">حملة الصيف {item}</h3>
                      <p className="text-sm text-muted-foreground">مجموعة منتجات الصيف</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">3.{5-item}%</p>
                      <p className="text-sm text-muted-foreground">معدل التحويل</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(12500 - item * 1500).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">نقرة</p>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">+{12.5 - item * 1.5}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}