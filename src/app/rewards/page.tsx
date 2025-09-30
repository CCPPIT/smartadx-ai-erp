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
  Gift, 
  Trophy, 
  Star, 
  CheckCircle,
  Clock,
  User,
  Calendar,
  Coins
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

export default function RewardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingReward, setViewingReward] = useState<any>(null);
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    points: 100,
  });
  
  const { data: rewards, isLoading, refetch } = trpc.reward.getAll.useQuery();
  const { toast } = useToast();
  
  // Create reward mutation
  const createRewardMutation = trpc.reward.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewReward({
        title: "",
        description: "",
        points: 100,
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء المكافأة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء المكافأة: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update reward mutation
  const updateRewardMutation = trpc.reward.update.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم تحديث المكافأة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل تحديث المكافأة: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete reward mutation
  const deleteRewardMutation = trpc.reward.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف المكافأة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف المكافأة: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Claim reward mutation
  const claimRewardMutation = trpc.reward.claim.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم المطالبة بالمكافأة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل المطالبة بالمكافأة: " + error.message,
        variant: "destructive",
      });
    },
  });

  const filteredRewards = rewards?.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "claimed" && reward.claimedAt) || 
                         (filterStatus === "unclaimed" && !reward.claimedAt);
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateReward = () => {
    createRewardMutation.mutate({
      title: newReward.title,
      description: newReward.description || undefined,
      points: newReward.points,
      userId: "user-1", // In a real app, this would be the current user ID
    });
  };
  
  const handleDeleteReward = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المكافأة؟")) {
      deleteRewardMutation.mutate(id);
    }
  };
  
  const handleClaimReward = (id: string) => {
    claimRewardMutation.mutate(id);
  };
  
  const openViewDialog = (reward: any) => {
    setViewingReward(reward);
    setIsViewDialogOpen(true);
  };
  
  const getRewardIcon = (points: number) => {
    if (points >= 1000) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (points >= 500) return <Star className="w-5 h-5 text-purple-500" />;
    return <Gift className="w-5 h-5 text-blue-500" />;
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
              نظام المكافآت للمبدعين
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومكافأة المبدعين على إنجازاتهم
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                مكافأة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إنشاء مكافأة جديدة</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل المكافأة الجديدة
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    العنوان
                  </Label>
                  <Input
                    id="title"
                    value={newReward.title}
                    onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="points" className="text-right">
                    النقاط
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    value={newReward.points}
                    onChange={(e) => setNewReward({...newReward, points: parseInt(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateReward} disabled={createRewardMutation.isPending}>
                  {createRewardMutation.isPending ? "جاري الإنشاء..." : "إنشاء"}
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
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المكافآت</p>
                  <p className="text-2xl font-bold">{rewards?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المكافآت المُعلنة</p>
                  <p className="text-2xl font-bold">
                    {rewards?.filter(r => r.claimedAt).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي النقاط</p>
                  <p className="text-2xl font-bold">
                    {rewards?.reduce((sum, r) => sum + (r.points || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المكافآت المعلقة</p>
                  <p className="text-2xl font-bold">
                    {rewards?.filter(r => !r.claimedAt).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Chart */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              توزيع المكافآت
            </CardTitle>
            <CardDescription>
              توزيع المكافآت حسب نوعها وقيمها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Coins className="w-12 h-12 mx-auto text-muted-foreground" />
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
                  placeholder="بحث في المكافآت..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </Button>
                <Button 
                  variant={filterStatus === "claimed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("claimed")}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  مُعلنة
                </Button>
                <Button 
                  variant={filterStatus === "unclaimed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("unclaimed")}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  معلقة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>جميع المكافآت</CardTitle>
            <CardDescription>إدارة المكافآت الممنوحة للمبدعين</CardDescription>
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
                    <TableHead>المكافأة</TableHead>
                    <TableHead>النقاط</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المستلم</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>تاريخ المطالبة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRewards && filteredRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getRewardIcon(reward.points || 0)}
                          <div>
                            <div className="font-medium">{reward.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {reward.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {reward.points} نقطة
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reward.claimedAt ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            مُعلنة
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            <Clock className="w-3 h-3 mr-1" />
                            معلقة
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs">
                            {reward.user?.name?.charAt(0) || "U"}
                          </div>
                          <span>{reward.user?.name || "مستخدم"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reward.createdAt ? format(new Date(reward.createdAt), "PPP", { locale: ar }) : ""}
                      </TableCell>
                      <TableCell>
                        {reward.claimedAt ? format(new Date(reward.claimedAt), "PPP", { locale: ar }) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(reward)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!reward.claimedAt && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleClaimReward(reward.id)}
                              disabled={claimRewardMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteReward(reward.id)}
                            disabled={deleteRewardMutation.isPending}
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
      
      {/* View Reward Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{viewingReward?.title}</DialogTitle>
            <DialogDescription>
              تفاصيل المكافأة
            </DialogDescription>
          </DialogHeader>
          {viewingReward && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                {getRewardIcon(viewingReward.points || 0)}
                <div>
                  <h3 className="font-semibold">{viewingReward.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {viewingReward.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold">{viewingReward.points}</div>
                    <div className="text-sm text-muted-foreground">النقاط</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold">
                      {viewingReward.claimedAt ? (
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {viewingReward.claimedAt ? "مُعلنة" : "معلقة"}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Label>المستلم</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs">
                    {viewingReward.user?.name?.charAt(0) || "U"}
                  </div>
                  <span>{viewingReward.user?.name || "مستخدم"}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الإنشاء</Label>
                  <p className="mt-1 text-sm">
                    {viewingReward.createdAt ? format(new Date(viewingReward.createdAt), "PPP p", { locale: ar }) : ""}
                  </p>
                </div>
                <div>
                  <Label>تاريخ المطالبة</Label>
                  <p className="mt-1 text-sm">
                    {viewingReward.claimedAt ? format(new Date(viewingReward.claimedAt), "PPP p", { locale: ar }) : "-"}
                  </p>
                </div>
              </div>
              
              {!viewingReward.claimedAt && (
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleClaimReward(viewingReward.id)}
                    disabled={claimRewardMutation.isPending}
                  >
                    {claimRewardMutation.isPending ? "جاري المطالبة..." : "المطالبة بالمكافأة"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}