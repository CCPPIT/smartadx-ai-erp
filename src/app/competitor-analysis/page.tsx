"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageCircle
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function CompetitorAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState<any>(null);
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    industry: "technology",
    website: "",
  });
  
  const { data: analyses, isLoading, refetch } = trpc.competitorAnalysis.getAll.useQuery();
  const { data: industries } = trpc.competitorAnalysis.getIndustries.useQuery();
  const { toast } = useToast();
  
  // Create competitor analysis mutation
  const createAnalysisMutation = trpc.competitorAnalysis.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewCompetitor({
        name: "",
        industry: "technology",
        website: "",
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء تحليل المنافس بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء تحليل المنافس: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update competitor analysis mutation
  const updateAnalysisMutation = trpc.competitorAnalysis.update.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم تحديث تحليل المنافس بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل تحديث تحليل المنافس: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete competitor analysis mutation
  const deleteAnalysisMutation = trpc.competitorAnalysis.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف تحليل المنافس بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف تحليل المنافس: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Generate report mutation
  const generateReportMutation = trpc.competitorAnalysis.generateReport.useMutation({
    onSuccess: (data) => {
      toast({
        title: "نجاح",
        description: "تم إنشاء تقرير التحليل بنجاح",
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

  const filteredAnalyses = analyses?.filter(analysis => {
    const matchesSearch = analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === "all" || analysis.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });
  
  const handleCreateAnalysis = () => {
    createAnalysisMutation.mutate({
      name: newCompetitor.name,
      industry: newCompetitor.industry,
      website: newCompetitor.website || undefined,
      userId: "user-1", // In a real app, this would be the current user ID
    });
  };
  
  const handleDeleteAnalysis = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التحليل؟")) {
      deleteAnalysisMutation.mutate(id);
    }
  };
  
  const handleGenerateReport = () => {
    if (!analyses || analyses.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد تحاليل للمنافسين لإنشاء التقرير",
        variant: "destructive",
      });
      return;
    }
    
    generateReportMutation.mutate({
      userId: "user-1", // In a real app, this would be the current user ID
      competitorIds: analyses.map(a => a.id),
    });
  };
  
  const openViewDialog = (analysis: any) => {
    setViewingAnalysis(analysis);
    setIsViewDialogOpen(true);
  };
  
  const getIndustryName = (industryId: string) => {
    const industry = industries?.find(ind => ind.id === industryId);
    return industry ? industry.name : industryId;
  };
  
  const getSWOTScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
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
              تحليل المنافسين التلقائي
            </h1>
            <p className="text-muted-foreground mt-1">
              تحليل شامل للمنافسين في السوق وتتبع الأداء
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  منافس جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة منافس جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل المنافس الجديد لتحليله
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newCompetitor.name}
                      onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="industry" className="text-right">
                      الصناعة
                    </Label>
                    <select
                      id="industry"
                      value={newCompetitor.industry}
                      onChange={(e) => setNewCompetitor({...newCompetitor, industry: e.target.value})}
                      className="col-span-3 border rounded-md p-2"
                    >
                      {industries?.map(industry => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      الموقع الإلكتروني
                    </Label>
                    <Input
                      id="website"
                      value={newCompetitor.website}
                      onChange={(e) => setNewCompetitor({...newCompetitor, website: e.target.value})}
                      className="col-span-3"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateAnalysis} disabled={createAnalysisMutation.isPending}>
                    {createAnalysisMutation.isPending ? "جاري الإنشاء..." : "إضافة"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending || !analyses || analyses.length === 0}
            >
              <BarChart3 className={`w-4 h-4 ml-2 ${generateReportMutation.isPending ? 'animate-spin' : ''}`} />
              {generateReportMutation.isPending ? "جاري الإنشاء..." : "تقرير شامل"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المنافسون المراقبون</p>
                  <p className="text-2xl font-bold">{analyses?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المنافسون الأقوى</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الفرص المتاحة</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التهديدات المحتملة</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SWOT Analysis Chart */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              تحليل SWOT العام
            </CardTitle>
            <CardDescription>
              نقاط القوة والضعف والفرص والتهديدات
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

        {/* Filters and Search */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="بحث في المنافسين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filterIndustry === "all" ? "default" : "outline"}
                  onClick={() => setFilterIndustry("all")}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </Button>
                <Button 
                  variant={filterIndustry === "technology" ? "default" : "outline"}
                  onClick={() => setFilterIndustry("technology")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  التكنولوجيا
                </Button>
                <Button 
                  variant={filterIndustry === "finance" ? "default" : "outline"}
                  onClick={() => setFilterIndustry("finance")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  الخدمات المالية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>تحليل المنافسين</CardTitle>
            <CardDescription>قائمة المنافسين المراقبين وتحليلهم</CardDescription>
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
                    <TableHead>المنافس</TableHead>
                    <TableHead>الصناعة</TableHead>
                    <TableHead>حصة السوق</TableHead>
                    <TableHead>نقاط القوة</TableHead>
                    <TableHead>نقاط الضعف</TableHead>
                    <TableHead>آخر تحليل</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses && filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{analysis.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.website || "لا يوجد موقع"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getIndustryName(analysis.industry)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span>{analysis.marketShare}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{analysis.strengths?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>{analysis.weaknesses?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {analysis.lastAnalysis ? format(new Date(analysis.lastAnalysis), "PPP", { locale: ar }) : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(analysis)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                            disabled={deleteAnalysisMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* View Analysis Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تحليل المنافس: {viewingAnalysis?.name}</DialogTitle>
            <DialogDescription>
              تفاصيل التحليل الشامل
            </DialogDescription>
          </DialogHeader>
          {viewingAnalysis && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      نقاط القوة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {viewingAnalysis.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      نقاط الضعف
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {viewingAnalysis.weaknesses?.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      الفرص
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {viewingAnalysis.opportunities?.map((opportunity: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      التهديدات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {viewingAnalysis.threats?.map((threat: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {viewingAnalysis.swotAnalysis && (
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      تحليل SWOT المُدرَج
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSWOTScoreColor(viewingAnalysis.swotAnalysis.strengthScore)}`}>
                          {viewingAnalysis.swotAnalysis.strengthScore}
                        </div>
                        <div className="text-sm text-muted-foreground">نقاط القوة</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSWOTScoreColor(viewingAnalysis.swotAnalysis.weaknessScore)}`}>
                          {viewingAnalysis.swotAnalysis.weaknessScore}
                        </div>
                        <div className="text-sm text-muted-foreground">نقاط الضعف</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSWOTScoreColor(viewingAnalysis.swotAnalysis.opportunityScore)}`}>
                          {viewingAnalysis.swotAnalysis.opportunityScore}
                        </div>
                        <div className="text-sm text-muted-foreground">الفرص</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSWOTScoreColor(viewingAnalysis.swotAnalysis.threatScore)}`}>
                          {viewingAnalysis.swotAnalysis.threatScore}
                        </div>
                        <div className="text-sm text-muted-foreground">التهديدات</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {viewingAnalysis.performanceMetrics && (
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      مقاييس الأداء
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold">{viewingAnalysis.performanceMetrics.monthlyVisitors}</div>
                        <div className="text-sm text-muted-foreground">الزوار الشهريين</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{viewingAnalysis.performanceMetrics.conversionRate}</div>
                        <div className="text-sm text-muted-foreground">معدل التحويل</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{viewingAnalysis.performanceMetrics.socialEngagement}</div>
                        <div className="text-sm text-muted-foreground">معدل التفاعل الاجتماعي</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  آخر تحديث: {viewingAnalysis.lastAnalysis ? format(new Date(viewingAnalysis.lastAnalysis), "PPP p", { locale: ar }) : ""}
                </div>
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  تعليق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}