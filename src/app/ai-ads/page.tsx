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
import { useToast } from "@/components/ui/use-toast";

// Define the AIGeneratedContent interface
interface AIGeneratedContent {
  id: string;
  type: string;
  prompt: string;
  content: string;
  imageUrl?: string | null;
  userId: string;
  entityId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface Platform {
  id: string;
  name: string;
  description: string;
}

interface Format {
  id: string;
  name: string;
  description: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
}

export default function AIAdsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [viewingAd, setViewingAd] = useState<AIGeneratedContent | null>(null);
  const [testingAd, setTestingAd] = useState<AIGeneratedContent | null>(null);
  const [newAd, setNewAd] = useState({
    prompt: "",
    platform: "facebook",
    format: "image",
  });
  
  const { toast } = useToast();
  const { data: ads, isLoading, refetch } = trpc.aiAd.getAll.useQuery();
  const { data: platforms } = trpc.aiAd.getPlatforms.useQuery();
  const { data: formats } = trpc.aiAd.getFormats.useQuery();
  const { data: templates } = trpc.aiAd.getTemplates.useQuery();
  
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
  
  const openViewDialog = (ad: AIGeneratedContent) => {
    setViewingAd(ad);
    setIsViewDialogOpen(true);
  };
  
  const openTestDialog = (ad: AIGeneratedContent) => {
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
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handleGenerateAd}
                  disabled={generateAdMutation.isPending}
                >
                  {generateAdMutation.isPending ? "جاري الإنشاء..." : "إنشاء الإعلان"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الإعلانات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="border rounded-md p-2"
                >
                  <option value="all">جميع المنصات</option>
                  {platforms?.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              الإعلانات الذكية
            </CardTitle>
            <CardDescription>
              إدارة الإعلانات المولدة بالذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوصف</TableHead>
                    <TableHead>المنصة</TableHead>
                    <TableHead>التنسيق</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds?.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {ad.prompt}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(ad.entityId || '')}
                          {getPlatformName(ad.entityId || '')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getFormatName(ad.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(ad.createdAt), 'PPP', { locale: ar })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openViewDialog({...ad, imageUrl: ad.imageUrl ?? undefined})}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openTestDialog({...ad, imageUrl: ad.imageUrl ?? undefined})}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteAd(ad.id)}
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

        {/* View Ad Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>عرض الإعلان الذكي</DialogTitle>
            </DialogHeader>
            {viewingAd && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">الوصف:</h3>
                  <p className="text-muted-foreground">{viewingAd.prompt}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">المحتوى المولد:</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{viewingAd.content}</p>
                  </div>
                </div>
                {viewingAd.imageUrl && (
                  <div>
                    <h3 className="font-semibold mb-2">الصورة:</h3>
                    <img 
                      src={viewingAd.imageUrl} 
                      alt="Generated ad" 
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    المنصة: {getPlatformName(viewingAd.entityId || '')}
                  </span>
                  <span>
                    التاريخ: {format(new Date(viewingAd.createdAt), 'PPP', { locale: ar })}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Test Performance Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>اختبار أداء الإعلان</DialogTitle>
              <DialogDescription>
                اختبار الأداء الافتراضي للإعلان
              </DialogDescription>
            </DialogHeader>
            {testingAd && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg">
                  <h3 className="font-semibold mb-2">نتائج الاختبار:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.4%</div>
                      <div className="text-sm text-muted-foreground">معدل النقر</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">85</div>
                      <div className="text-sm text-muted-foreground">درجة الأداء</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">التوصيات:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>جرب تعديل نص الإعلان لزيادة معدل النقر</li>
                    <li>استخدم صورًا مختلفة لتحسين التفاعل</li>
                    <li>غيّر الجمهور المستهدف لزيادة التحويلات</li>
                  </ul>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleTestPerformance(testingAd.id)}
                    disabled={testPerformanceMutation.isPending}
                  >
                    {testPerformanceMutation.isPending ? "جاري الاختبار..." : "اختبار الأداء"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}