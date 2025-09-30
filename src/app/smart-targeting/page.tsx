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
  Target, 
  Users, 
  MapPin, 
  Heart, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Star,
  Save,
  Sparkles
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

export default function SmartTargetingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingRecommendation, setViewingRecommendation] = useState<any>(null);
  const [newPreset, setNewPreset] = useState({
    name: "",
    description: "",
    demographics: [] as string[],
    interests: [] as string[],
    geography: [] as string[],
  });
  
  const { data: recommendations, isLoading: recommendationsLoading, refetch: refetchRecommendations } = trpc.smartTargeting.getAll.useQuery();
  const { data: categories } = trpc.smartTargeting.getCategories.useQuery();
  const { data: presets, isLoading: presetsLoading, refetch: refetchPresets } = trpc.smartTargeting.getPresets.useQuery("user-1");
  const { toast } = useToast();
  
  // Generate recommendations mutation
  const generateRecommendationsMutation = trpc.smartTargeting.generateRecommendations.useMutation({
    onSuccess: () => {
      refetchRecommendations();
      toast({
        title: "نجاح",
        description: "تم إنشاء توصيات الاستهداف بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء التوصيات: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Save preset mutation
  const savePresetMutation = trpc.smartTargeting.savePreset.useMutation({
    onSuccess: () => {
      refetchPresets();
      setIsCreateDialogOpen(false);
      setNewPreset({
        name: "",
        description: "",
        demographics: [],
        interests: [],
        geography: [],
      });
      toast({
        title: "نجاح",
        description: "تم حفظ الإعداد المسبق بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حفظ الإعداد المسبق: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredRecommendations = recommendations?.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || rec.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleGenerateRecommendations = () => {
    generateRecommendationsMutation.mutate({
      userId: "user-1", // In a real app, this would be the current user ID
      data: {
        demographics: ["18-35"],
        interests: ["technology", "innovation"],
        geography: ["major_cities"],
      },
    });
  };
  
  const handleSavePreset = () => {
    savePresetMutation.mutate({
      name: newPreset.name,
      description: newPreset.description || undefined,
      userId: "user-1", // In a real app, this would be the current user ID
      targetingData: {
        demographics: newPreset.demographics,
        interests: newPreset.interests,
        geography: newPreset.geography,
      },
    });
  };
  
  const openViewDialog = (recommendation: any) => {
    setViewingRecommendation(recommendation);
    setIsViewDialogOpen(true);
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'demographic':
        return 'bg-blue-500';
      case 'interest':
        return 'bg-green-500';
      case 'behavior':
        return 'bg-purple-500';
      case 'geographic':
        return 'bg-pink-500';
      case 'combined':
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
              نظام توصيات الاستهداف الذكي
            </h1>
            <p className="text-muted-foreground mt-1">
              توصيات ذكية لاستهداف الجمهور المناسب لحملاتك
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="gradient-primary text-white"
              onClick={handleGenerateRecommendations}
              disabled={generateRecommendationsMutation.isPending}
            >
              <Sparkles className={`w-4 h-4 ml-2 ${generateRecommendationsMutation.isPending ? 'animate-spin' : ''}`} />
              {generateRecommendationsMutation.isPending ? "جاري التوليد..." : "توصيات جديدة"}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  إعداد مسبق
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>حفظ إعداد استهداف مسبق</DialogTitle>
                  <DialogDescription>
                    احفظ إعدادات الاستهداف الحالية كإعداد مسبق
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newPreset.name}
                      onChange={(e) => setNewPreset({...newPreset, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      الوصف
                    </Label>
                    <Textarea
                      id="description"
                      value={newPreset.description}
                      onChange={(e) => setNewPreset({...newPreset, description: e.target.value})}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSavePreset} disabled={savePresetMutation.isPending}>
                    {savePresetMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  <p className="text-sm text-muted-foreground">التوصيات النشطة</p>
                  <p className="text-2xl font-bold">{recommendations?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الإعدادات المسبقة</p>
                  <p className="text-2xl font-bold">{presets?.length || 0}</p>
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
                  <p className="text-sm text-muted-foreground">الجمهور المستهدف</p>
                  <p className="text-2xl font-bold">2.5M</p>
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
                  <p className="text-sm text-muted-foreground">معدل التحويل المتوقع</p>
                  <p className="text-2xl font-bold">4.2%</p>
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
                توزيع الجمهور المستهدف
              </CardTitle>
              <CardDescription>
                توزيع الجمهور حسب الفئات
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
                <PieChart className="w-5 h-5" />
                فعالية الاستهداف
              </CardTitle>
              <CardDescription>
                مقارنة بين فعالية التوصيات المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-12 h-12 mx-auto text-muted-foreground" />
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
                  placeholder="بحث في التوصيات..."
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
                  variant={filterCategory === "demographic" ? "default" : "outline"}
                  onClick={() => setFilterCategory("demographic")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  التركيبة السكانية
                </Button>
                <Button 
                  variant={filterCategory === "interest" ? "default" : "outline"}
                  onClick={() => setFilterCategory("interest")}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  الاهتمامات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>توصيات الاستهداف</CardTitle>
            <CardDescription>التوصيات الذكية لاستهداف الجمهور</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التوصية</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>الثقة</TableHead>
                    <TableHead>الوصول المقدر</TableHead>
                    <TableHead>CTR المتوقع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations && filteredRecommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rec.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {rec.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(rec.category)} text-white`}>
                          {getCategoryName(rec.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${rec.confidence}%` }}
                            ></div>
                          </div>
                          <span>{rec.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rec.estimatedReach}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>{rec.expectedCTR || "3.5%"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rec.lastUpdated ? format(new Date(rec.lastUpdated), "PPP", { locale: ar }) : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(rec)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Save className="w-4 h-4" />
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

        {/* Presets Section */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              الإعدادات المسبقة
            </CardTitle>
            <CardDescription>
              الإعدادات المحفوظة مسبقًا للاستخدام السريع
            </CardDescription>
          </CardHeader>
          <CardContent>
            {presetsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : presets && presets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presets.map((preset) => (
                  <Card key={preset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{preset.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {preset.description}
                          </p>
                        </div>
                        <Badge variant={preset.isFavorite ? "default" : "secondary"}>
                          {preset.isFavorite ? "مفضل" : "عادي"}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {preset.targetingData.demographics?.map((demo, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {demo}
                          </Badge>
                        ))}
                        {preset.targetingData.interests?.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {preset.createdAt ? format(new Date(preset.createdAt), "PPP", { locale: ar }) : ""}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Save className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">لا توجد إعدادات مسبقة</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  احفظ إعدادات استهدافك المفضلة لاستخدامها لاحقًا
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <PlusCircle className="w-4 h-4 ml-2" />
                  إنشاء إعداد مسبق
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* View Recommendation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingRecommendation?.name}</DialogTitle>
            <DialogDescription>
              تفاصيل توصية الاستهداف
            </DialogDescription>
          </DialogHeader>
          {viewingRecommendation && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>الوصف</Label>
                <p className="mt-1 text-sm">{viewingRecommendation.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">المقاييس</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>مستوى الثقة</span>
                          <span>{viewingRecommendation.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${viewingRecommendation.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>الوصول المقدر</span>
                        <span className="font-medium">{viewingRecommendation.estimatedReach}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CTR المتوقع</span>
                        <span className="font-medium">{viewingRecommendation.expectedCTR || "3.5%"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>العطاء المقترح</span>
                        <span className="font-medium">{viewingRecommendation.suggestedBid || "$2.50"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">الفئة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Badge className={`${getCategoryColor(viewingRecommendation.category)} text-white`}>
                      {getCategoryName(viewingRecommendation.category)}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
              
              {viewingRecommendation.details && (
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">التفاصيل</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(viewingRecommendation.details).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-sm mt-1">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  آخر تحديث: {viewingRecommendation.lastUpdated ? format(new Date(viewingRecommendation.lastUpdated), "PPP p", { locale: ar }) : ""}
                </div>
                <Button>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ كإعداد مسبق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}