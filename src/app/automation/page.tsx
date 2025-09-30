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
  Calendar,
  Clock,
  Play,
  Pause,
  Smartphone,
  Monitor,
  Tablet,
  CalendarClock
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

export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
    scheduledAt: "",
    platform: "facebook",
    campaignId: "",
  });
  
  const { data: scheduledPosts, isLoading, refetch } = trpc.automation.getScheduledPosts.useQuery();
  const { data: campaigns } = trpc.campaign.getAll.useQuery();
  const { toast } = useToast();
  
  // Schedule post mutation
  const schedulePostMutation = trpc.automation.schedulePost.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewPost({
        content: "",
        imageUrl: "",
        scheduledAt: "",
        platform: "facebook",
        campaignId: "",
      });
      toast({
        title: "نجاح",
        description: "تم جدولة المنشور بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل جدولة المنشور: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reschedule post mutation
  const reschedulePostMutation = trpc.automation.reschedulePost.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditDialogOpen(false);
      setEditingPost(null);
      toast({
        title: "نجاح",
        description: "تم إعادة جدولة المنشور بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إعادة جدولة المنشور: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Cancel scheduled post mutation
  const cancelPostMutation = trpc.automation.cancelScheduledPost.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم إلغاء جدولة المنشور بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إلغاء جدولة المنشور: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredPosts = scheduledPosts?.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.campaign?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || post.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });
  
  const handleSchedulePost = () => {
    schedulePostMutation.mutate({
      content: newPost.content,
      imageUrl: newPost.imageUrl || undefined,
      scheduledAt: new Date(newPost.scheduledAt),
      platform: newPost.platform,
      campaignId: newPost.campaignId || undefined,
      userId: "user-1", // In a real app, this would be the current user ID
    });
  };
  
  const handleReschedulePost = () => {
    if (!editingPost) return;
    
    reschedulePostMutation.mutate({
      id: editingPost.id,
      scheduledAt: new Date(editingPost.scheduledAt),
    });
  };
  
  const handleCancelPost = (id: string) => {
    if (confirm("هل أنت متأكد من إلغاء جدولة هذا المنشور؟")) {
      cancelPostMutation.mutate(id);
    }
  };
  
  const openEditDialog = (post: any) => {
    setEditingPost({
      ...post,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().split('T')[0] + 'T' + new Date(post.scheduledAt).toTimeString().slice(0, 5) : "",
    });
    setIsEditDialogOpen(true);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Smartphone className="w-4 h-4" />;
      case 'twitter':
        return <Monitor className="w-4 h-4" />;
      case 'instagram':
        return <Tablet className="w-4 h-4" />;
      case 'linkedin':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };
  
  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'فيسبوك';
      case 'twitter':
        return 'تويتر';
      case 'instagram':
        return 'إنستغرام';
      case 'linkedin':
        return 'لينكدإن';
      default:
        return platform;
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
              الجدولة التلقائية
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة وجدولة منشوراتك على وسائل التواصل الاجتماعي
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                منشور جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>جدولة منشور جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل المنشور وحدد وقت النشر
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    المحتوى
                  </Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    رابط الصورة
                  </Label>
                  <Input
                    id="imageUrl"
                    value={newPost.imageUrl}
                    onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="scheduledAt" className="text-right">
                    وقت النشر
                  </Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={newPost.scheduledAt}
                    onChange={(e) => setNewPost({...newPost, scheduledAt: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    المنصة
                  </Label>
                  <select
                    id="platform"
                    value={newPost.platform}
                    onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    <option value="facebook">فيسبوك</option>
                    <option value="twitter">تويتر</option>
                    <option value="instagram">إنستغرام</option>
                    <option value="linkedin">لينكدإن</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="campaignId" className="text-right">
                    الحملة
                  </Label>
                  <select
                    id="campaignId"
                    value={newPost.campaignId}
                    onChange={(e) => setNewPost({...newPost, campaignId: e.target.value})}
                    className="col-span-3 border rounded-md p-2"
                  >
                    <option value="">بدون حملة</option>
                    {campaigns?.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSchedulePost} disabled={schedulePostMutation.isPending}>
                  {schedulePostMutation.isPending ? "جاري الجدولة..." : "جدولة"}
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
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المنشورات المجدولة</p>
                  <p className="text-2xl font-bold">{scheduledPosts?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المنشورات اليوم</p>
                  <p className="text-2xl font-bold">
                    {scheduledPosts?.filter(post => 
                      post.scheduledAt && 
                      new Date(post.scheduledAt).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">منشورات فيسبوك</p>
                  <p className="text-2xl font-bold">
                    {scheduledPosts?.filter(post => post.platform === 'facebook').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Tablet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">منشورات إنستغرام</p>
                  <p className="text-2xl font-bold">
                    {scheduledPosts?.filter(post => post.platform === 'instagram').length || 0}
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
                  placeholder="بحث في المنشورات..."
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
                  variant={filterPlatform === "instagram" ? "default" : "outline"}
                  onClick={() => setFilterPlatform("instagram")}
                  className="flex items-center gap-2"
                >
                  <Tablet className="w-4 h-4" />
                  إنستغرام
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>المنشورات المجدولة</CardTitle>
            <CardDescription>إدارة المنشورات المجدولة للنشر</CardDescription>
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
                    <TableHead>المحتوى</TableHead>
                    <TableHead>المنصة</TableHead>
                    <TableHead>الحملة</TableHead>
                    <TableHead>وقت النشر</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts && filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {post.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(post.platform)}
                          {getPlatformName(post.platform)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.campaign ? (
                          <Badge variant="secondary">{post.campaign.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">بدون حملة</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {post.scheduledAt ? format(new Date(post.scheduledAt), "PPP p", { locale: ar }) : "غير محدد"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancelPost(post.id)}
                            disabled={cancelPostMutation.isPending}
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
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل جدولة المنشور</DialogTitle>
            <DialogDescription>
              قم بتحديث وقت نشر المنشور
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">
                  المحتوى
                </Label>
                <Textarea
                  id="edit-content"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  className="col-span-3"
                  rows={4}
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-scheduledAt" className="text-right">
                  وقت النشر الجديد
                </Label>
                <Input
                  id="edit-scheduledAt"
                  type="datetime-local"
                  value={editingPost.scheduledAt}
                  onChange={(e) => setEditingPost({...editingPost, scheduledAt: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleReschedulePost} disabled={reschedulePostMutation.isPending}>
              {reschedulePostMutation.isPending ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}