"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  Target,
  BarChart3,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit,
  Pause,
  Play,
  Trash2,
  MoreVertical,
  TrendingDown,
  Activity,
  Calendar,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  ACTIVE: "bg-green-500",
  COMPLETED: "bg-blue-500",
  PAUSED: "bg-yellow-500",
  DRAFT: "bg-gray-500",
};

export default function TopCampaigns() {
  const router = useRouter();
  const { toast } = useToast();
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [limit, setLimit] = useState(5);
  
  const { data: campaigns, isLoading, error, refetch } = trpc.dashboard.getTopCampaigns.useQuery({
    limit
  });
  
  // Mutations
  const pauseCampaign = trpc.campaign.pause.useMutation({
    onSuccess: () => {
      toast({
        title: "تم إيقاف الحملة مؤقتاً",
        description: "تم إيقاف الحملة بنجاح",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resumeCampaign = trpc.campaign.resume.useMutation({
    onSuccess: () => {
      toast({
        title: "تم استئناف الحملة",
        description: "تم استئناف الحملة بنجاح",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteCampaign = trpc.campaign.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "تم حذف الحملة",
        description: "تم حذف الحملة بنجاح",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handlePause = (id: string) => {
    pauseCampaign.mutate({ id });
  };
  
  const handleResume = (id: string) => {
    resumeCampaign.mutate({ id });
  };
  
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحملة؟")) {
      deleteCampaign.mutate({ id });
    }
  };
  
  const handleEdit = (id: string) => {
    router.push(`/campaigns/${id}/edit`);
  };
  
  const handleView = (id: string) => {
    router.push(`/campaigns/${id}`);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedCampaign(expandedCampaign === id ? null : id);
  };
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "تم التحديث",
      description: "تم تحديث البيانات بنجاح",
    });
  };
  
  const calculateROI = (revenue: number, budget: number): string => {
    if (budget === 0) return "0";
    return ((revenue - budget) / budget * 100).toFixed(1);
  };
  
  const getPerformanceIndicator = (ctr: string) => {
    const value = parseFloat(ctr);
    if (value >= 5) return { label: "ممتاز", color: "text-green-500" };
    if (value >= 3) return { label: "جيد", color: "text-blue-500" };
    if (value >= 1) return { label: "متوسط", color: "text-yellow-500" };
    return { label: "ضعيف", color: "text-red-500" };
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            أفضل الحملات أداءً
          </CardTitle>
          <CardDescription>الحملات ذات الأداء الأفضل</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5" />
            خطأ في تحميل الحملات
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            أفضل الحملات أداءً
          </CardTitle>
          <CardDescription>الحملات ذات الأداء الأفضل</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد حملات نشطة</p>
            <p className="text-xs text-muted-foreground mt-1">ابدأ بإنشاء حملتك الأولى</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              أفضل الحملات أداءً
            </CardTitle>
            <CardDescription>الحملات ذات الأداء الأفضل ({campaigns?.length || 0})</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="glass-morphism border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {campaigns && campaigns.length >= limit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit(limit + 5)}
                className="glass-morphism border-white/20"
              >
                عرض المزيد
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaigns.map((campaign, index) => {
            const ctrValue = parseFloat(campaign.ctr);
            const statusColor = statusColors[campaign.status as keyof typeof statusColors] || statusColors.DRAFT;
            
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-purple-500/30 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
                      <h4 className="font-semibold text-sm group-hover:text-purple-500 transition-colors cursor-pointer" onClick={() => handleView(campaign.id)}>
                        {campaign.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {campaign.adsCount} إعلان
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(campaign.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {campaign.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(campaign.id)}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(campaign.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {campaign.status === "ACTIVE" ? (
                          <DropdownMenuItem onClick={() => handlePause(campaign.id)}>
                            <Pause className="w-4 h-4 mr-2" />
                            إيقاف مؤقت
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleResume(campaign.id)}>
                            <Play className="w-4 h-4 mr-2" />
                            استئناف
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="text-red-500">
                          <Trash2 className="w-4 h-4 mr-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Performance Indicator */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs ${getPerformanceIndicator(campaign.ctr).color}`}>
                    {getPerformanceIndicator(campaign.ctr).label}
                  </Badge>
                  {parseFloat(campaign.ctr) >= 3 && (
                    <Badge variant="outline" className="text-xs text-green-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      أداء عالي
                    </Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30">
                      <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">مشاهدات</p>
                      <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30">
                      <MousePointerClick className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">نقرات</p>
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30">
                      <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">تحويلات</p>
                      <p className="font-semibold">{campaign.conversions.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 rounded bg-yellow-100 dark:bg-yellow-900/30">
                      <DollarSign className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">إيرادات</p>
                      <p className="font-semibold">${campaign.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* CTR Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">معدل النقر (CTR)</span>
                    <span className="font-semibold">{campaign.ctr}%</span>
                  </div>
                  <Progress value={Math.min(ctrValue * 10, 100)} className="h-1.5" />
                </div>

                {/* Budget & ROI */}
                {campaign.budget > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">الميزانية</span>
                      <span className="font-semibold">${campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">ROI</span>
                      <span className={`font-semibold ${
                        parseFloat(calculateROI(campaign.revenue, campaign.budget)) > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {calculateROI(campaign.revenue, campaign.budget)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(campaign.id)}
                  className="w-full text-xs gap-2 mt-2"
                >
                  {expandedCampaign === campaign.id ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      إخفاء التفاصيل
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      عرض المزيد
                    </>
                  )}
                </Button>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedCampaign === campaign.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 pt-3 border-t border-border/50"
                    >
                      {/* Additional Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">تكلفة النقرة</p>
                          <p className="text-sm font-semibold">
                            ${(campaign.budget / campaign.clicks).toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">تكلفة التحويل</p>
                          <p className="text-sm font-semibold">
                            ${(campaign.budget / campaign.conversions).toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">معدل التحويل</p>
                          <p className="text-sm font-semibold">
                            {((campaign.conversions / campaign.clicks) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">متوسط قيمة الطلب</p>
                          <p className="text-sm font-semibold">
                            ${(campaign.revenue / campaign.conversions).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(campaign.id)}
                          className="flex-1 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          عرض التقرير
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(campaign.id)}
                          className="flex-1 text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          تعديل
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
