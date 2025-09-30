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
  Sparkles,
  Image,
  Play,
  Pause,
  BarChart3,
  Target,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  XCircle
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
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner"

export default function AIAdsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [viewingAd, setViewingAd] = useState<any>(null);
  const [testingAd, setTestingAd] = useState<any>(null);
  const [newAd, setNewAd] = useState({
    prompt: "",
    platform: "facebook",
    format: "image",
  });
  
  const { data: ads, isLoading, refetch } = trpc.aiAd.getAll.useQuery();
  const { data: platforms } = trpc.aiAd.getPlatforms.useQuery();
  const { data: formats } = trpc.aiAd.getFormats.useQuery();
  const { data: templates } = trpc.aiAd.getTemplates.useQuery();
//   const {toast}=useToast()
  
  // Generate ad mutation
  const generateAdMutation = trpc.aiAd.generate.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewAd({
        prompt: "",
        platform: "facebook",
        format: "image",
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء الإعلان الذكي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء الإعلان الذكي: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update ad mutation
  const updateAdMutation = trpc.aiAd.update.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم تحديث الإعلان الذكي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل تحديث الإعلان الذكي: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete ad mutation
  const deleteAdMutation = trpc.aiAd.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف الإعلان الذكي بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف الإعلان الذكي: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Test performance mutation
  const testPerformanceMutation = trpc.aiAd.testPerformance.useMutation({
    onSuccess: () => {
      refetch();
      setIsTestDialogOpen(false);
      setTestingAd(null);
      toast({
        title: "نجاح",
        description: "تم اختبار أداء الإعلان بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل اختبار أداء الإعلان: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredAds = ads?.filter(ad => {
    const matchesSearch = ad.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || ad.entityId === filterPlatform;
    return matchesSearch && matchesPlatform;
  });
  
  const handleGenerateAd = () => {
    generateAdMutation.mutate({
      prompt: newAd.prompt,
      platform: newAd.platform,
      format: newAd.format,
      userId: "user-1", // In a real app, this would be the current user ID
    });
  };
  
  const handleDeleteAd = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      deleteAdMutation.mutate(id);
    }
  };
  
  const handleTestPerformance = (adId: string) => {
    testPerformanceMutation.mutate({
      adId: adId,
      metrics: {
        clicks: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 10000),
        conversions: Math.floor(Math.random() * 100),
        engagement: Math.floor(Math.random() * 500),
      },
    });
  };
  
  const openViewDialog = (ad: any) => {
    setViewingAd(ad);
    setIsViewDialogOpen(true);
  };
  
  const openTestDialog = (ad: any) => {
    setTestingAd(ad);
    setIsTestDialogOpen(true);
  };
  
  const getPlatformIcon = (platformId: string) => {
    switch (platformId) {
      case 'facebook':
        return <Smartphone className="w-4 h-4" />;
      case 'google':
        return <Monitor className="w-4 h-4" />;
      case 'twitter':
        return <Smartphone className="w-4 h-4" />;
      case 'linkedin':
        return <Monitor className="w-4 h-4" />;
      case 'tiktok':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };
  
  const getPlatformName = (platformId: string) => {
    const platform = platforms?.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };
  
  const getFormatName = (formatId: string) => {
    const format = formats?.find(f => f.id === formatId);
    return format ? format.name : formatId;
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
              توليد إعلانات بالذكاء الاصطناعي
            </h1>
            <p className="text-muted-foreground mt-1">
              إنشاء وإدارة الإعلانات الذكية باستخدام الذكاء الاصطناعي
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                إعلان ذكي جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إنشاء إعلان ذكي</DialogTitle>
                <DialogDescription>
                  صف الإعلان الذي ترغب في إنشائه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prompt" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="prompt"
                    value={newAd.prompt}
                    onChange={(e) => setNewAd({...newAd, prompt: e.target.value})}
                    className="col-span-3"
                    placeholder="مثال: إعلان لتطبيق جديد لإدارة المهام بألوان زاهية"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    المنصة
                  </Label>
                  <select
                    id="platform"
                    value={newAd.platform}
                    onChange={(e) => setNewAd({...newAd, platform: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {platforms?.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="format" className="text-right">
                    التنسيق
                  </Label>
                  <select
                    id="format"
                    value={newAd.format}
                    onChange={(e) => setNewAd({...newAd, format: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {formats?.map(format => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {templates && templates.length > 0 && (
                  <div>
                    <Label className="text-right block mb-2">القوالب المقترحة</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {templates.slice(0, 3).map(template => (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="justify-between"
                          onClick={() => setNewAd({
                            ...newAd,
                            prompt: template.prompt
                          })}
                        >
                          <span>{template.name}</span>
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleGenerateAd} disabled={generateAdMutation.isPending}>
                  {generateAdMutation.isPending ? "جاري الإنشاء..." : "إنشاء الإعلان"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإعلانات</p>
                  <p className="text-2xl font-bold">{ads?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إعلانات هذا الأسبوع</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الأداء</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المنصات المدعومة</p>
                  <p className="text-2xl font-bold">{platforms?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              أداء الإعلانات
            </CardTitle>
            <CardDescription>
              مقارنة أداء الإعلانات عبر المنصات المختلفة
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
                  placeholder="بحث في الإعلانات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filterPlatform === "all" ? "default" : "outline"}
                  onClick={() => setFilterPlatform("all")}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </Button>
                <Button 
                  variant={filterPlatform === "facebook" ? "default" : "outline"}
                  onClick={() => setFilterPlatform("facebook")}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  فيسبوك
                </Button>
                <Button 
                  variant={filterPlatform === "google" ? "default" : "outline"}
                  onClick={() => setFilterPlatform("google")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  جوجل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>الإعلانات الذكية</CardTitle>
            <CardDescription>إدارة الإعلانات المولدة بواسطة الذكاء الاصطناعي</CardDescription>
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
                    <TableHead>الإعلان</TableHead>
                    <TableHead>المنصة والتنسيق</TableHead>
                    <TableHead>الأداء</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds && filteredAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                            {ad.imageUrl ? (
                              <img 
                                src={ad.imageUrl} 
                                alt="AI Generated Ad" 
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="max-w-xs">
                            <div className="font-medium line-clamp-1">{ad.prompt}</div>
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {ad.content}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(ad.entityId || "facebook")}
                            <span>{getPlatformName(ad.entityId || "facebook")}</span>
                          </div>
                          <Badge variant="secondary" className="w-fit">
                            {getFormatName(ad.entityId || "image")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">85%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm">15%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ad.createdAt ? format(new Date(ad.createdAt), "PPP", { locale: ar }) : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(ad)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openTestDialog(ad)}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteAd(ad.id)}
                            disabled={deleteAdMutation.isPending}
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
      
      {/* View Ad Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>عرض الإعلان الذكي</DialogTitle>
            <DialogDescription>
              تفاصيل الإعلان المولد
            </DialogDescription>
          </DialogHeader>
          {viewingAd && (
            <div className="grid gap-4 py-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                {viewingAd.imageUrl ? (
                  <img 
                    src={viewingAd.imageUrl} 
                    alt="AI Generated Ad" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">إعلان ذكي</p>
                  </div>
                )}
              </div>
              <div>
                <Label>الوصف</Label>
                <p className="mt-1 text-sm">{viewingAd.prompt}</p>
              </div>
              <div>
                <Label>المنصة والتنسيق</Label>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">
                    {getPlatformName(viewingAd.entityId || "facebook")}
                  </Badge>
                  <Badge variant="outline">
                    {getFormatName(viewingAd.entityId || "image")}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>المحتوى المولد</Label>
                <Textarea
                  value={viewingAd.content}
                  readOnly
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <Label>تاريخ الإنشاء</Label>
                <p className="mt-1 text-sm">
                  {viewingAd.createdAt ? format(new Date(viewingAd.createdAt), "PPP p", { locale: ar }) : ""}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Test Performance Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>اختبار أداء الإعلان</DialogTitle>
            <DialogDescription>
              اختبار أداء الإعلان وتحليل النتائج
            </DialogDescription>
          </DialogHeader>
          {testingAd && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                  {testingAd.imageUrl ? (
                    <img 
                      src={testingAd.imageUrl} 
                      alt="AI Generated Ad" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Image className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{testingAd.prompt}</div>
                  <div className="text-sm text-muted-foreground">
                    {getPlatformName(testingAd.entityId || "facebook")}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-green-500">85%</div>
                    <div className="text-sm text-muted-foreground">معدل النقر</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-blue-500">3.2%</div>
                    <div className="text-sm text-muted-foreground">معدل التحويل</div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Label>التوصيات</Label>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">استمر في استخدام هذا الإعلان</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Play className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">جرب تعديل نص الإعلان لتحسين الأداء</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={() => handleTestPerformance(testingAd.id)}
                  disabled={testPerformanceMutation.isPending}
                >
                  {testPerformanceMutation.isPending ? "جاري الاختبار..." : "اختبار جديد"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}