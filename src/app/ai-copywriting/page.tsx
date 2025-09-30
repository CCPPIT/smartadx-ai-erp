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
  Type,
  Copy,
  Clipboard,
  Check,
  BarChart3
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
import { toast } from "sonner"
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AICopywritingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStyle, setFilterStyle] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingCopy, setViewingCopy] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newCopy, setNewCopy] = useState({
    prompt: "",
    style: "persuasive",
    tone: "professional",
    length: "medium",
  });
  
  const { data: copies, isLoading, refetch } = trpc.aiCopywriting.getAll.useQuery();
  const { data: styles } = trpc.aiCopywriting.getStyles.useQuery();
  const { data: tones } = trpc.aiCopywriting.getTones.useQuery();
  const { data: lengths } = trpc.aiCopywriting.getLengths.useQuery();
  const { data: templates } = trpc.aiCopywriting.getTemplates.useQuery();
//   const { toast } = useToast();
  
  // Generate copy mutation
  const generateCopyMutation = trpc.aiCopywriting.generate.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewCopy({
        prompt: "",
        style: "persuasive",
        tone: "professional",
        length: "medium",
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء النص الإعلاني بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء النص الإعلاني: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete copy mutation
  const deleteCopyMutation = trpc.aiCopywriting.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف النص الإعلاني بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف النص الإعلاني: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredCopies = copies?.filter(copy => {
    const matchesSearch = copy.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         copy.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = filterStyle === "all" || copy.entityId === filterStyle;
    return matchesSearch && matchesStyle;
  });
  
  const handleGenerateCopy = () => {
    generateCopyMutation.mutate({
      prompt: newCopy.prompt,
      style: newCopy.style,
      tone: newCopy.tone,
      length: newCopy.length,
      userId: "user-1", // In a real app, this would be the current user ID
    });
  };
  
  const handleDeleteCopy = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا النص الإعلاني؟")) {
      deleteCopyMutation.mutate(id);
    }
  };
  
  const openViewDialog = (copy: any) => {
    setViewingCopy(copy);
    setIsViewDialogOpen(true);
  };
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص إلى الحافظة",
    });
  };
  
  const getStyleName = (styleId: string) => {
    const style = styles?.find(s => s.id === styleId);
    return style ? style.name : styleId;
  };
  
  const getToneName = (toneId: string) => {
    const tone = tones?.find(t => t.id === toneId);
    return tone ? tone.name : toneId;
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
              مولد النصوص الدعائية AI
            </h1>
            <p className="text-muted-foreground mt-1">
              إنشاء نصوص إعلانية مقنعة باستخدام الذكاء الاصطناعي
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                نص إعلاني جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إنشاء نص إعلاني ذكي</DialogTitle>
                <DialogDescription>
                  صف النص الإعلاني الذي ترغب في إنشائه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prompt" className="text-right">
                    الموضوع
                  </Label>
                  <Textarea
                    id="prompt"
                    value={newCopy.prompt}
                    onChange={(e) => setNewCopy({...newCopy, prompt: e.target.value})}
                    className="col-span-3"
                    placeholder="مثال: إعلان لتطبيق جديد لإدارة المهام"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="style" className="text-right">
                    الأسلوب
                  </Label>
                  <select
                    id="style"
                    value={newCopy.style}
                    onChange={(e) => setNewCopy({...newCopy, style: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {styles?.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tone" className="text-right">
                    النبرة
                  </Label>
                  <select
                    id="tone"
                    value={newCopy.tone}
                    onChange={(e) => setNewCopy({...newCopy, tone: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {tones?.map(tone => (
                      <option key={tone.id} value={tone.id}>
                        {tone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="length" className="text-right">
                    الطول
                  </Label>
                  <select
                    id="length"
                    value={newCopy.length}
                    onChange={(e) => setNewCopy({...newCopy, length: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    {lengths?.map(length => (
                      <option key={length.id} value={length.id}>
                        {length.name}
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
                          onClick={() => setNewCopy({
                            ...newCopy,
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
                <Button onClick={handleGenerateCopy} disabled={generateCopyMutation.isPending}>
                  {generateCopyMutation.isPending ? "جاري الإنشاء..." : "إنشاء النص"}
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
                  <Type className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي النصوص</p>
                  <p className="text-2xl font-bold">{copies?.length || 0}</p>
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
                  <p className="text-sm text-muted-foreground">نصوص هذا الأسبوع</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">النصوص المنسوخة</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الأنماط المختلفة</p>
                  <p className="text-2xl font-bold">{styles?.length || 0}</p>
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
                  placeholder="بحث في النصوص الإعلانية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filterStyle === "all" ? "default" : "outline"}
                  onClick={() => setFilterStyle("all")}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </Button>
                <Button 
                  variant={filterStyle === "persuasive" ? "default" : "outline"}
                  onClick={() => setFilterStyle("persuasive")}
                  className="flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  إقناعي
                </Button>
                <Button 
                  variant={filterStyle === "descriptive" ? "default" : "outline"}
                  onClick={() => setFilterStyle("descriptive")}
                  className="flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  وصفي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Copies Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>النصوص الإعلانية</CardTitle>
            <CardDescription>إدارة النصوص الإعلانية المولدة</CardDescription>
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
                    <TableHead>الموضوع</TableHead>
                    <TableHead>الأسلوب والنبرة</TableHead>
                    <TableHead>النص</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCopies && filteredCopies.map((copy) => (
                    <TableRow key={copy.id}>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {copy.prompt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit">
                            {getStyleName(copy.entityId || "persuasive")}
                          </Badge>
                          <Badge variant="outline" className="w-fit">
                            {getToneName(copy.entityId || "professional")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="text-sm line-clamp-2">
                            {copy.content}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-6 px-2 text-xs"
                            onClick={() => copyToClipboard(copy.content, copy.id)}
                          >
                            {copiedId === copy.id ? (
                              <>
                                <Check className="w-3 h-3 ml-1" />
                                تم النسخ
                              </>
                            ) : (
                              <>
                                <Clipboard className="w-3 h-3 ml-1" />
                                نسخ
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {copy.createdAt ? format(new Date(copy.createdAt), "PPP", { locale: ar }) : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(copy)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteCopy(copy.id)}
                            disabled={deleteCopyMutation.isPending}
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
      
      {/* View Copy Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>عرض النص الإعلاني</DialogTitle>
            <DialogDescription>
              تفاصيل النص الإعلاني المولد
            </DialogDescription>
          </DialogHeader>
          {viewingCopy && (
            <div className="grid gap-4 py-4">
              <div>
                <Label>الموضوع</Label>
                <p className="mt-1 text-sm">{viewingCopy.prompt}</p>
              </div>
              <div>
                <Label>الأسلوب والنبرة</Label>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">
                    {getStyleName(viewingCopy.entityId || "persuasive")}
                  </Badge>
                  <Badge variant="outline">
                    {getToneName(viewingCopy.entityId || "professional")}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>النص المولد</Label>
                <Textarea
                  value={viewingCopy.content}
                  readOnly
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <div>
                <Label>تاريخ الإنشاء</Label>
                <p className="mt-1 text-sm">
                  {viewingCopy.createdAt ? format(new Date(viewingCopy.createdAt), "PPP p", { locale: ar }) : ""}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => copyToClipboard(viewingCopy.content, viewingCopy.id)}
                  disabled={copiedId === viewingCopy.id}
                >
                  {copiedId === viewingCopy.id ? (
                    <>
                      <Check className="w-4 h-4 ml-2" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4 ml-2" />
                      نسخ إلى الحافظة
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}