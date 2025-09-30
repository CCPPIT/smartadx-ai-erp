"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  PieChart, 
  LineChart, 
  TrendingUp,
  FileText,
  Users,
  Eye,
  Share2,
  Trash2,
  Plus,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc-react";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Mock reports
  const reports = [
    {
      id: 1,
      title: "تقرير أداء الحملات الشهرية",
      type: "campaign_performance",
      format: "PDF",
      date: "2025-09-30",
      size: "2.4 MB",
      views: 124,
      downloads: 42
    },
    {
      id: 2,
      title: "تحليل جمهور العملاء",
      type: "audience_analysis",
      format: "Excel",
      date: "2025-09-28",
      size: "1.8 MB",
      views: 89,
      downloads: 28
    },
    {
      id: 3,
      title: "تقرير الإيرادات المالية",
      type: "financial",
      format: "PDF",
      date: "2025-09-25",
      size: "3.1 MB",
      views: 156,
      downloads: 67
    },
    {
      id: 4,
      title: "تحليل المنافسين",
      type: "competitor_analysis",
      format: "Excel",
      date: "2025-09-20",
      size: "4.2 MB",
      views: 76,
      downloads: 31
    },
    {
      id: 5,
      title: "تقرير وسائل التواصل الاجتماعي",
      type: "social_media",
      format: "PDF",
      date: "2025-09-18",
      size: "1.5 MB",
      views: 98,
      downloads: 45
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'campaign_performance':
        return <Badge className="bg-blue-500 hover:bg-blue-600">أداء الحملات</Badge>;
      case 'audience_analysis':
        return <Badge className="bg-purple-500 hover:bg-purple-600">تحليل الجمهور</Badge>;
      case 'financial':
        return <Badge className="bg-green-500 hover:bg-green-600">مالي</Badge>;
      case 'competitor_analysis':
        return <Badge className="bg-orange-500 hover:bg-orange-600">تحليل المنافسين</Badge>;
      case 'social_media':
        return <Badge className="bg-pink-500 hover:bg-pink-600">وسائل التواصل</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">عام</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'Excel':
        return <BarChart3 className="w-5 h-5 text-green-500" />;
      case 'CSV':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesType;
  });

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
              التقارير والتصدير
            </h1>
            <p className="text-muted-foreground mt-1">
              رؤى وتقارير ذكية بصيغ متعددة
            </p>
          </div>
          <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus className="w-4 h-4" />
            تقرير جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي التقارير</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التنزيلات</p>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, report) => sum + report.downloads, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المشاهدات</p>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, report) => sum + report.views, 0)}
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
                  <p className="text-sm text-muted-foreground">معدل التنزيل</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (reports.reduce((sum, report) => sum + report.downloads, 0) /
                      reports.reduce((sum, report) => sum + report.views, 0)) * 100
                    ) || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="بحث في التقارير..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="نوع التقرير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="campaign_performance">أداء الحملات</SelectItem>
                    <SelectItem value="audience_analysis">تحليل الجمهور</SelectItem>
                    <SelectItem value="financial">مالي</SelectItem>
                    <SelectItem value="competitor_analysis">تحليل المنافسين</SelectItem>
                    <SelectItem value="social_media">وسائل التواصل</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  تطبيق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="glass-morphism border-white/20 rounded-2xl overflow-hidden"
            >
              <Card className="border-0 bg-transparent">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFormatIcon(report.format)}
                      {getTypeBadge(report.type)}
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg mt-3 line-clamp-2">{report.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3" />
                    {report.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{report.size}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {report.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {report.downloads}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      معاينة
                    </Button>
                    <Button size="sm" className="flex-1 gradient-primary text-white border-0 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      تنزيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Report Templates */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              قوالب التقارير الجاهزة
            </CardTitle>
            <CardDescription>ابدأ بسرعة باستخدام القوالب المسبقة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "تقرير أداء الحملات",
                  description: "تحليل شامل لأداء الحملات الإعلانية",
                  icon: BarChart3,
                  type: "campaign_performance"
                },
                {
                  title: "تحليل الجمهور",
                  description: "تحليل ديموغرافي لجمهورك المستهدف",
                  icon: Users,
                  type: "audience_analysis"
                },
                {
                  title: "تقرير مالي",
                  description: "تحليل الإيرادات والمصروفات",
                  icon: TrendingUp,
                  type: "financial"
                },
                {
                  title: "تحليل المنافسين",
                  description: "مقارنة الأداء مع المنافسين",
                  icon: PieChart,
                  type: "competitor_analysis"
                }
              ].map((template, index) => (
                <Card key={index} className="glass-morphism border-white/10 hover:scale-105 transition-transform">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                        <template.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold">{template.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      إنشاء تقرير
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}