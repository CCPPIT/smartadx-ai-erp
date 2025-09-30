"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  BarChart3,
  Calendar,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Check,
  X
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

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  
  const { data: campaigns, isLoading, refetch } = trpc.campaign.getAll.useQuery();
  const { toast } = useToast();
  
  // Create campaign mutation
  const createCampaignMutation = trpc.campaign.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewCampaign({
        name: "",
        description: "",
        budget: "",
        startDate: "",
        endDate: "",
      });
      toast({
        title: "نجاح",
        description: "تم إنشاء الحملة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل إنشاء الحملة: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update campaign mutation
  const updateCampaignMutation = trpc.campaign.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditDialogOpen(false);
      setEditingCampaign(null);
      toast({
        title: "نجاح",
        description: "تم تحديث الحملة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل تحديث الحملة: " + error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete campaign mutation
  const deleteCampaignMutation = trpc.campaign.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "نجاح",
        description: "تم حذف الحملة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف الحملة: " + error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>;
      case 'PAUSED':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">متوقف</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-500 hover:bg-blue-600">مكتمل</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">مسودة</Badge>;
    }
  };

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateCampaign = () => {
    createCampaignMutation.mutate({
      name: newCampaign.name,
      description: newCampaign.description,
      userId: "user-1", // In a real app, this would be the current user ID
      budget: newCampaign.budget ? parseFloat(newCampaign.budget) : undefined,
      startDate: newCampaign.startDate ? new Date(newCampaign.startDate) : undefined,
      endDate: newCampaign.endDate ? new Date(newCampaign.endDate) : undefined,
    });
  };
  
  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;
    
    updateCampaignMutation.mutate({
      id: editingCampaign.id,
      name: editingCampaign.name,
      description: editingCampaign.description,
      status: editingCampaign.status,
      budget: editingCampaign.budget ? parseFloat(editingCampaign.budget) : undefined,
      startDate: editingCampaign.startDate ? new Date(editingCampaign.startDate) : undefined,
      endDate: editingCampaign.endDate ? new Date(editingCampaign.endDate) : undefined,
    });
  };
  
  const handleDeleteCampaign = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحملة؟")) {
      deleteCampaignMutation.mutate(id);
    }
  };
  
  const openEditDialog = (campaign: any) => {
    setEditingCampaign({
      ...campaign,
      budget: campaign.budget?.toString() || "",
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
    });
    setIsEditDialogOpen(true);
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
              الحملات الإعلانية
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة وتتبع جميع حملاتك الإعلانية
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                <PlusCircle className="w-4 h-4 mr-2" />
                حملة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إنشاء حملة جديدة</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الحملة الإعلانية الجديدة
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    الاسم
                  </Label>
                  <Input
                    id="name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">
                    الميزانية
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    تاريخ البدء
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    تاريخ الانتهاء
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateCampaign} disabled={createCampaignMutation.isPending}>
                  {createCampaignMutation.isPending ? "جاري الإنشاء..." : "إنشاء"}
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الحملات</p>
                  <p className="text-2xl font-bold">{campaigns?.length || 0}</p>
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
                  <p className="text-sm text-muted-foreground">النشطة</p>
                  <p className="text-2xl font-bold">
                    {campaigns?.filter(c => c.status === 'ACTIVE').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الميزانية المستخدمة</p>
                  <p className="text-2xl font-bold">
                    ${campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0).toFixed(2)}
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
                  <p className="text-sm text-muted-foreground">معدل التحويل</p>
                  <p className="text-2xl font-bold">3.2%</p>
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
                  placeholder="بحث في الحملات..."
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
                  variant={filterStatus === "ACTIVE" ? "default" : "outline"}
                  onClick={() => setFilterStatus("ACTIVE")}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  نشطة
                </Button>
                <Button 
                  variant={filterStatus === "DRAFT" ? "default" : "outline"}
                  onClick={() => setFilterStatus("DRAFT")}
                  className="flex items-center gap-2"
                >
                  مسودات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>جميع الحملات</CardTitle>
            <CardDescription>إدارة الحملات الإعلانية الخاصة بك</CardDescription>
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
                    <TableHead>الحملة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الميزانية</TableHead>
                    <TableHead>النقرات</TableHead>
                    <TableHead>الإظهارات</TableHead>
                    <TableHead>التحويلات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns && filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        {campaign.budget ? `$${campaign.budget.toFixed(2)}` : 'غير محددة'}
                      </TableCell>
                      <TableCell>1,250</TableCell>
                      <TableCell>15,000</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(campaign)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            disabled={deleteCampaignMutation.isPending}
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
      
      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الحملة</DialogTitle>
            <DialogDescription>
              قم بتحديث تفاصيل الحملة الإعلانية
            </DialogDescription>
          </DialogHeader>
          {editingCampaign && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  الاسم
                </Label>
                <Input
                  id="edit-name"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  الوصف
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({...editingCampaign, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  الحالة
                </Label>
                <select
                  id="edit-status"
                  value={editingCampaign.status}
                  onChange={(e) => setEditingCampaign({...editingCampaign, status: e.target.value})}
                  className="col-span-3 border rounded-md p-2"
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="ACTIVE">نشطة</option>
                  <option value="PAUSED">متوقفة</option>
                  <option value="COMPLETED">مكتملة</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-budget" className="text-right">
                  الميزانية
                </Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={editingCampaign.budget}
                  onChange={(e) => setEditingCampaign({...editingCampaign, budget: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDate" className="text-right">
                  تاريخ البدء
                </Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editingCampaign.startDate}
                  onChange={(e) => setEditingCampaign({...editingCampaign, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endDate" className="text-right">
                  تاريخ الانتهاء
                </Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editingCampaign.endDate}
                  onChange={(e) => setEditingCampaign({...editingCampaign, endDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateCampaign} disabled={updateCampaignMutation.isPending}>
              {updateCampaignMutation.isPending ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}