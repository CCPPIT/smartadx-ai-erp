"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Eye,
  MousePointerClick,
  Target,
  Activity,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const iconMap = {
  Zap,
  DollarSign,
  Users,
  TrendingUp
};

const colorMap = {
  0: "gradient-primary",
  1: "gradient-success",
  2: "gradient-secondary",
  3: "gradient-warning"
};

export default function StatsCards() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: statsData, isLoading, error, refetch } = trpc.dashboard.getStats.useQuery();
  
  // Get analytics data for real-time updates
  const { data: analyticsData } = trpc.dashboard.getAnalyticsOverview.useQuery({
    days: 30
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الإحصائيات بنجاح",
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((index) => (
          <Card key={index} className="glass-morphism border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
              <Skeleton className="h-1.5 w-full mt-4 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morphism border-red-500/20">
          <CardContent className="p-6">
            <p className="text-red-500 text-sm">فشل تحميل الإحصائيات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsData?.stats || [];
  
  // Calculate real progress percentages based on goals
  const getProgressPercentage = (value: string, index: number) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const goals = [100, 50, 200, 10]; // Goals for each stat
    return Math.min((numValue / goals[index]) * 100, 100);
  };
  
  // Get detailed icon based on stat type
  const getStatIcon = (title: string, index: number) => {
    if (title.includes('الحملات')) return Activity;
    if (title.includes('الإيرادات')) return DollarSign;
    if (title.includes('العملاء')) return Users;
    if (title.includes('التحويل')) return Target;
    const icons = [Zap, DollarSign, Users, TrendingUp];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-4">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">الإحصائيات الرئيسية</h2>
          <p className="text-sm text-muted-foreground">نظرة عامة على أداء حملاتك</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="glass-morphism border-white/20 gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          // Use index to determine icon instead of trend
          const IconComponent = getStatIcon(stat.title, index);
          const color = colorMap[index as keyof typeof colorMap] || "gradient-primary";
          const progressPercentage = getProgressPercentage(stat.value, index);
        
          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="glass-morphism border-white/20 hover:border-white/40 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold group-hover:scale-105 transition-transform">{stat.value}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            stat.trend === "up"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Progress indicator based on real data */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">التقدم نحو الهدف</span>
                      <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: 0.5 + index * 0.2, duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${color} shadow-sm`}
                      />
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  {analyticsData && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">متوسط يومي</span>
                        <span className="font-semibold">
                          {index === 0 && analyticsData.totals.clicks}
                          {index === 1 && `$${(analyticsData.totals.revenue / 30).toFixed(0)}`}
                          {index === 2 && Math.floor(analyticsData.totals.impressions / 30)}
                          {index === 3 && `${((analyticsData.totals.conversions / analyticsData.totals.clicks) * 100).toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
