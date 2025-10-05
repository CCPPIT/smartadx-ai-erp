"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Megaphone,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const activityIcons = {
  campaign: Megaphone,
  client: Users,
  payment: DollarSign,
  invoice: FileText,
  product: Package,
  order: ShoppingCart,
  analytics: TrendingUp,
};

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  PAUSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  NEW: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PENDING: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function RecentActivities() {
  const { toast } = useToast();
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: activities, isLoading, error, refetch } = trpc.dashboard.getRecentActivities.useQuery({
    limit
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الأنشطة بنجاح",
      });
    }, 500);
  };
  
  const handleLoadMore = () => {
    setLimit(limit + 10);
  };
  
  // Filter activities
  const filteredActivities = activities?.filter(activity => {
    if (filter === "all") return true;
    return activity.type === filter;
  }) || [];
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case "campaign": return "from-purple-500 to-pink-600";
      case "client": return "from-blue-500 to-indigo-600";
      case "payment": return "from-green-500 to-emerald-600";
      case "invoice": return "from-orange-500 to-red-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-500" />
            آخر الأنشطة
          </CardTitle>
          <CardDescription>تتبع آخر التحديثات والأنشطة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
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
            <XCircle className="w-5 h-5" />
            خطأ في تحميل الأنشطة
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-500" />
            آخر الأنشطة
          </CardTitle>
          <CardDescription>تتبع آخر التحديثات والأنشطة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد أنشطة حتى الآن</p>
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
              <Activity className="w-5 h-5 text-purple-500" />
              آخر الأنشطة
            </CardTitle>
            <CardDescription>تتبع آخر التحديثات والأنشطة ({filteredActivities.length})</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px] glass-morphism border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="campaign">الحملات</SelectItem>
                <SelectItem value="client">العملاء</SelectItem>
                <SelectItem value="payment">المدفوعات</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="glass-morphism border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Activity;
              const statusColor = statusColors[activity.status as keyof typeof statusColors] || statusColors.NEW;
              const activityColor = getActivityColor(activity.type);
            
              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all border border-transparent hover:border-purple-500/30 group"
                >
                  <Avatar className="w-10 h-10 ring-2 ring-purple-400/30 group-hover:ring-purple-500/50 transition-all">
                    <AvatarFallback className={`bg-gradient-to-br ${activityColor} text-white`}>
                      <Icon className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm group-hover:text-purple-500 transition-colors">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${statusColor} whitespace-nowrap`}>
                        {activity.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: ar
                          })}
                        </span>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Statistics Summary */}
        {activities && activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {activities.filter(a => a.type === 'campaign').length}
                </p>
                <p className="text-xs text-muted-foreground">حملات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {activities.filter(a => a.type === 'client').length}
                </p>
                <p className="text-xs text-muted-foreground">عملاء</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter(a => a.type === 'payment').length}
                </p>
                <p className="text-xs text-muted-foreground">مدفوعات</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Load More Button */}
        {activities && activities.length >= limit && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              className="glass-morphism border-white/20 gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              عرض المزيد
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
