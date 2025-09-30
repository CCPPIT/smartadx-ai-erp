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
  Palette,
  Download,
  Share2,
  Heart,
  Copy
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

export default function DesignPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingDesign, setViewingDesign] = useState<any>(null);
  const [newDesign, setNewDesign] = useState({
    prompt: "",
    category: "social",
  });
  
  const { data: designs, isLoading, refetch } = trpc.design.getAll.useQuery();
  const { data: categories } = trpc.design.getCategories.useQuery();
  const { data: templates } = trpc.design.getTemplates.useQuery();
  const { toast } = useToast();
  
  // Generate design mutation
  const generateDesignMutation = trpc.design.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewDesign({
        prompt: "",
        category: "social",
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء التصميم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء التصميم: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete design mutation
  const deleteDesignMutation = trpc.design.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف التصميم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف التصميم: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredDesigns = designs?.filter(design => {
    const matchesSearch = design.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || design.entityId === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleGenerateDesign = () => {
    generateDesignMutation.mutate({
      prompt: newDesign.prompt,
      content: `تصميم ذكي مولّد بناءً على الطلب: "${newDesign.prompt}"`,
      userId: "user-1", // In a real app, this would be the current user ID
      entityId: newDesign.category,
    });
  };
  
  const handleDeleteDesign = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التصميم؟")) {
      deleteDesignMutation.mutate(id);
    }
  };
  
  const openViewDialog = (design: any) => {
    setViewingDesign(design);
    setIsViewDialogOpen(true);
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
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
              تصميم الإعلانات بالذكاء الاصطناعي
            </h1>
            <p className="text-muted-foreground mt-1">
              إنشاء وتصميم إعلانات ذكية باستخدام الذكاء الاصطناعي
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                تصميم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إنشاء تصميم ذكي</DialogTitle>
                <DialogDescription>
                  صف التصميم الذي ترغب في إنشائه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prompt" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="prompt"
                    value={newDesign.prompt}
                    onChange={(e) => setNewDesign({...newDesign, prompt: e.target.value})}
                    className="col-span-3"
                    placeholder="مثال: إعلان لمنتج جديد بألوان زاهية وتصميم عصري"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    الفئة
                  </Label>
                  <select
                    id="category"
                    value={newDesign.category}
                    onChange={(e) => setNewDesign({...newDesign, category: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                          onClick={() => setNewDesign({
                            ...newDesign,
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
                <Button onClick={handleGenerateDesign} disabled={generateDesignMutation.isPending}>
                  {generateDesignMutation.isPending ? "جاري الإنشاء..." : "إنشاء التصميم"}
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
                  <p className="text-sm text-muted-foreground">إجمالي التصاميم</p>
                  <p className="text-2xl font-bold">{designs?.length || 0}</p>
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
                  <p className="text-sm text-muted-foreground">تصاميم هذا الأسبوع</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التصاميم المفضلة</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الفئات المختلفة</p>
                  <p className="text-2xl font-bold">{categories?.length || 0}</p>
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
                  placeholder="بحث في التصاميم..."
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
                  variant={filterCategory === "social" ? "default" : "outline"}
                  onClick={() => setFilterCategory("social")}
                  className="flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  وسائل التواصل
                </Button>
                <Button 
                  variant={filterCategory === "web" ? "default" : "outline"}
                  onClick={() => setFilterCategory("web")}
                  className="flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  الإعلانات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="glass-morphism border-white/20">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-full h-48 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredDesigns && filteredDesigns.length > 0 ? (
            filteredDesigns.map((design) => (
              <Card key={design.id} className="glass-morphism border-white/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                      {design.imageUrl ? (
                        <img 
                          src={design.imageUrl} 
                          alt="AI Generated Design" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">تصميم ذكي</p>
                        </div>
                      )}
                    </div>
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {getCategoryName(design.entityId || "social")}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold line-clamp-1">{design.prompt}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {design.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {design.createdAt ? format(new Date(design.createdAt), "PPP", { locale: ar }) : ""}
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openViewDialog(design)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteDesign(design.id)}
                          disabled={deleteDesignMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Image className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-medium">لا توجد تصاميم</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ابدأ بإنشاء تصميم ذكي جديد
              </p>
              <Button 
                className="mt-4 gradient-primary text-white"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusCircle className="w-4 h-4 ml-2" />
                تصميم جديد
              </Button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* View Design Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>عرض التصميم</DialogTitle>
            <DialogDescription>
              تفاصيل التصميم الذكي
            </DialogDescription>
          </DialogHeader>
          {viewingDesign && (
            <div className="grid gap-4 py-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                {viewingDesign.imageUrl ? (
                  <img 
                    src={viewingDesign.imageUrl} 
                    alt="AI Generated Design" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">تصميم ذكي</p>
                  </div>
                )}
              </div>
              <div>
                <Label>الوصف</Label>
                <p className="mt-1 text-sm">{viewingDesign.prompt}</p>
              </div>
              <div>
                <Label>الفئة</Label>
                <Badge className="mt-1" variant="secondary">
                  {getCategoryName(viewingDesign.entityId || "social")}
                </Badge>
              </div>
              <div>
                <Label>تاريخ الإنشاء</Label>
                <p className="mt-1 text-sm">
                  {viewingDesign.createdAt ? format(new Date(viewingDesign.createdAt), "PPP p", { locale: ar }) : ""}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة
                </Button>
                <Button>
                  <Download className="w-4 h-4 ml-2" />
                  تنزيل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}