"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function MarketTrendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [timeframe, setTimeframe] = useState("month");
  
  const { data: trends, isLoading, refetch } = trpc.marketTrend.getAll.useQuery();
  const { data: categories } = trpc.marketTrend.getCategories.useQuery();
  const { toast } = useToast();
  
  // Generate report mutation
  const generateReportMutation = trpc.marketTrend.generateReport.useMutation({
    onSuccess: (data) => {
      toast({
        title: "نجاح",
        description: "تم إنشاء تقرير الاتجاهات بنجاح",
      });
      // In a real app, you might want to redirect to the report page or show it in a dialog
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء التقرير: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredTrends = trends?.filter(trend => {
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trend.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || trend.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleGenerateReport = () => {
    generateReportMutation.mutate({
      userId: "user-1", // In a real app, this would be the current user ID
      timeframe: timeframe,
      categories: filterCategory !== "all" ? [filterCategory] : undefined,
    });
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'technology':
        return 'bg-blue-500';
      case 'content':
        return 'bg-green-500';
      case 'influencer':
        return 'bg-purple-500';
      case 'social':
        return 'bg-pink-500';
      case 'ecommerce':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

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
              تحليل ترندات السوق الآلي
            </h1>
            <p className="text-muted-foreground mt-1">
              تحليل الاتجاهات الحالية في السوق وتحليل المنافسين
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
            </select>
            <Button 
              className="gradient-primary text-white"
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 ml-2 ${generateReportMutation.isPending ? 'animate-spin' : ''}`} />
              {generateReportMutation.isPending ? "جاري الإنشاء..." : "تقرير جديد"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الاتجاهات النشطة</p>
                  <p className="text-2xl font-bold">{trends?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الفرص الجديدة</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التهديدات المحتملة</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">أفكار استراتيجية</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                تحليل الاتجاهات
              </CardTitle>
              <CardDescription>
                توزيع الاتجاهات حسب الفئات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    سيتم عرض الرسم البياني هنا
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                النمو المتوقع
              </CardTitle>
              <CardDescription>
                توقعات النمو للاتجاهات الرئيسية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    سيتم عرض الرسم البياني هنا
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
                  placeholder="بحث في الاتجاهات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filterCategory === "all" ? "default" : "outline"}
                  onClick={() => setFilterCategory("all")}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </Button>
                <Button 
                  variant={filterCategory === "technology" ? "default" : "outline"}
                  onClick={() => setFilterCategory("technology")}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  التكنولوجيا
                </Button>
                <Button 
                  variant={filterCategory === "content" ? "default" : "outline"}
                  onClick={() => setFilterCategory("content")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  المحتوى
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>الاتجاهات الحالية</CardTitle>
            <CardDescription>أحدث الاتجاهات في السوق</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاتجاه</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>الصلة</TableHead>
                    <TableHead>الفرص</TableHead>
                    <TableHead>التهديدات</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrends && filteredTrends.map((trend) => (
                    <TableRow key={trend.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trend.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {trend.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(trend.category)} text-white`}>
                          {getCategoryName(trend.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>{trend.relevance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {trend.details?.opportunities?.slice(0, 2).map((op: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-yellow-500" />
                              <span className="truncate max-w-[150px]">{op}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {trend.details?.threats?.slice(0, 2).map((th: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="truncate max-w-[150px]">{th}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {trend.createdAt ? format(new Date(trend.createdAt), "PPP", { locale: ar }) : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
