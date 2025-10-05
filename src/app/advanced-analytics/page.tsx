"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  MousePointerClick,
  Target,
  Calendar,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Mock data
  const performanceData = [
    { date: "1 أكتوبر", impressions: 4000, clicks: 240, conversions: 48, revenue: 960 },
    { date: "2 أكتوبر", impressions: 3000, clicks: 198, conversions: 38, revenue: 760 },
    { date: "3 أكتوبر", impressions: 5000, clicks: 350, conversions: 70, revenue: 1400 },
    { date: "4 أكتوبر", impressions: 4500, clicks: 315, conversions: 63, revenue: 1260 },
    { date: "5 أكتوبر", impressions: 6000, clicks: 420, conversions: 84, revenue: 1680 },
    { date: "6 أكتوبر", impressions: 5500, clicks: 385, conversions: 77, revenue: 1540 },
    { date: "7 أكتوبر", impressions: 7000, clicks: 490, conversions: 98, revenue: 1960 }
  ];

  const platformData = [
    { name: "Facebook", value: 35, color: "#1877F2" },
    { name: "Instagram", value: 30, color: "#E4405F" },
    { name: "Google", value: 25, color: "#4285F4" },
    { name: "Twitter", value: 10, color: "#1DA1F2" }
  ];

  const campaignPerformance = [
    {
      name: "حملة المنتج الجديد",
      impressions: 15000,
      clicks: 1200,
      conversions: 240,
      ctr: "8.0%",
      revenue: "$4,800",
      trend: "up",
      change: "+15%"
    },
    {
      name: "عرض الصيف",
      impressions: 12000,
      clicks: 840,
      conversions: 168,
      ctr: "7.0%",
      revenue: "$3,360",
      trend: "up",
      change: "+8%"
    },
    {
      name: "حملة الوعي بالعلامة",
      impressions: 20000,
      clicks: 1000,
      conversions: 150,
      ctr: "5.0%",
      revenue: "$3,000",
      trend: "down",
      change: "-3%"
    }
  ];

  const metrics = [
    {
      title: "إجمالي الإظهارات",
      value: "35,000",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "إجمالي النقرات",
      value: "2,398",
      change: "+8.3%",
      trend: "up",
      icon: MousePointerClick,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "معدل التحويل",
      value: "6.85%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "إجمالي الإيرادات",
      value: "$9,360",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      color: "from-orange-500 to-red-600"
    }
  ];

  const insights = [
    {
      title: "أفضل يوم للنشر",
      description: "الجمعة يحقق أعلى معدل تفاعل بنسبة 35%",
      type: "success"
    },
    {
      title: "توصية الميزانية",
      description: "زيادة ميزانية حملة المنتج الجديد بنسبة 20% للحصول على نتائج أفضل",
      type: "info"
    },
    {
      title: "تحذير الأداء",
      description: "حملة الوعي بالعلامة تحتاج إلى تحسين - معدل التحويل منخفض",
      type: "warning"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            تحليل الأداء المتقدم
          </h1>
          <p className="text-muted-foreground mt-2">
            رؤى عميقة وتحليلات شاملة لحملاتك الإعلانية
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] glass-morphism">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 90 يوم</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-morphism border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${
                        metric.trend === "up"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات</TabsTrigger>
          <TabsTrigger value="platforms">المنصات</TabsTrigger>
          <TabsTrigger value="insights">الرؤى</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle>أداء الحملات</CardTitle>
              <CardDescription>تتبع الأداء عبر الزمن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="impressions"
                      stroke="#667eea"
                      strokeWidth={2}
                      name="الإظهارات"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#764ba2"
                      strokeWidth={2}
                      name="النقرات"
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#f093fb"
                      strokeWidth={2}
                      name="التحويلات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle>الإيرادات اليومية</CardTitle>
              <CardDescription>تتبع الإيرادات المحققة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar dataKey="revenue" fill="#667eea" name="الإيرادات ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {campaignPerformance.map((campaign, index) => {
            const TrendIcon = campaign.trend === "up" ? TrendingUp : TrendingDown;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{campaign.name}</h3>
                        <Badge
                          variant="secondary"
                          className={`${
                            campaign.trend === "up"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          <TrendIcon className="w-3 h-3 mr-1" />
                          {campaign.change}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        عرض التفاصيل
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">الإظهارات</p>
                        <p className="text-xl font-bold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">النقرات</p>
                        <p className="text-xl font-bold">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">التحويلات</p>
                        <p className="text-xl font-bold">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">معدل النقر</p>
                        <p className="text-xl font-bold">{campaign.ctr}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الإيرادات</p>
                        <p className="text-xl font-bold">{campaign.revenue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle>توزيع المنصات</CardTitle>
                <CardDescription>نسبة الإنفاق على كل منصة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle>أداء المنصات</CardTitle>
                <CardDescription>مقارنة الأداء بين المنصات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformData.map((platform, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-sm text-muted-foreground">{platform.value}%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${platform.value}%`,
                            backgroundColor: platform.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                رؤى الذكاء الاصطناعي
              </CardTitle>
              <CardDescription>
                توصيات مخصصة بناءً على تحليل بياناتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    insight.type === "success"
                      ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                      : insight.type === "warning"
                      ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
                      : "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                  }`}
                >
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
