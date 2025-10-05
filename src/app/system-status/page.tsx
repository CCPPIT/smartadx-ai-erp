"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Server, 
  Database, 
  Wifi, 
  Cloud, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  RefreshCw,
  Clock,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SystemStatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock system status data
  const systemComponents = [
    {
      id: "web-server",
      name: "خادم الويب",
      status: "operational",
      responseTime: 45,
      uptime: 99.9,
      icon: Server,
      description: "خادم Next.js الرئيسي"
    },
    {
      id: "database",
      name: "قاعدة البيانات",
      status: "operational",
      responseTime: 12,
      uptime: 99.95,
      icon: Database,
      description: "PostgreSQL مع Prisma"
    },
    {
      id: "api",
      name: "واجهة API",
      status: "operational",
      responseTime: 32,
      uptime: 99.8,
      icon: Wifi,
      description: "RESTful API endpoints"
    },
    {
      id: "ai-services",
      name: "خدمات الذكاء الاصطناعي",
      status: "degraded",
      responseTime: 1200,
      uptime: 98.5,
      icon: Brain,
      description: "OpenAI وخدمات الذكاء الاصطناعي"
    },
    {
      id: "storage",
      name: "التخزين السحابي",
      status: "operational",
      responseTime: 65,
      uptime: 99.99,
      icon: Cloud,
      description: "AWS S3 للتخزين"
    },
    {
      id: "cache",
      name: "ذاكرة التخزين المؤقت",
      status: "operational",
      responseTime: 5,
      uptime: 99.9,
      icon: HardDrive,
      description: "Redis cache"
    },
    {
      id: "authentication",
      name: "نظام المصادقة",
      status: "operational",
      responseTime: 28,
      uptime: 99.7,
      icon: Shield,
      description: "JWT ونظام OAuth"
    },
    {
      id: "websocket",
      name: "اتصال WebSocket",
      status: "operational",
      responseTime: 15,
      uptime: 99.6,
      icon: Zap,
      description: "اتصالات الوقت الفعلي"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "يعمل بشكل طبيعي";
      case "degraded":
        return "تدهور في الأداء";
      case "down":
        return "غير متوفر";
      default:
        return "جارٍ التحقق";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const operationalCount = systemComponents.filter(c => c.status === "operational").length;
  const degradedCount = systemComponents.filter(c => c.status === "degraded").length;
  const downCount = systemComponents.filter(c => c.status === "down").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              حالة النظام
            </h1>
            <p className="text-muted-foreground mt-1">
              مراقبة صحة وحالة جميع مكونات النظام
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-2" />
              )}
              تحديث
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">يعمل بشكل طبيعي</p>
                  <p className="text-2xl font-bold">{operationalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تدهور في الأداء</p>
                  <p className="text-2xl font-bold">{degradedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">غير متوفر</p>
                  <p className="text-2xl font-bold">{downCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الاستجابة</p>
                  <p className="text-2xl font-bold">
                    {Math.round(systemComponents.reduce((sum, c) => sum + c.responseTime, 0) / systemComponents.length)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Components */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              مكونات النظام
            </CardTitle>
            <CardDescription>
              حالة وصحة جميع مكونات النظام الأساسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {systemComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(component.status)}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{component.name}</h3>
                          {getStatusIcon(component.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {component.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {component.responseTime}ms
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {component.uptime}%
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getStatusText(component.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                استخدام المعالج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                <p className="text-muted-foreground">رسم بياني لاستخدام المعالج</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MemoryStick className="w-5 h-5" />
                استخدام الذاكرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                <p className="text-muted-foreground">رسم بياني لاستخدام الذاكرة</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>الحوادث الأخيرة</CardTitle>
            <CardDescription>
              سجل بأحدث الحوادث والمشاكل في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="font-medium">تدهور في أداء خدمات الذكاء الاصطناعي</h3>
                    <p className="text-sm text-muted-foreground">
                      تم حل المشكلة في 14:30 - استمرت لمدة 45 دقيقة
                    </p>
                  </div>
                  <Badge variant="secondary" className="mr-auto">
                    تم الحل
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">تحديث صيانة روتيني</h3>
                    <p className="text-sm text-muted-foreground">
                      النظام محدث إلى الإصدار 2.1.5
                    </p>
                  </div>
                  <Badge variant="secondary" className="mr-auto">
                    مكتمل
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Icon components that were referenced but not imported
function Brain({ className }: { className?: string }) {
  return <BarChart3 className={className} />;
}

function Shield({ className }: { className?: string }) {
  return <CheckCircle className={className} />;
}

function Zap({ className }: { className?: string }) {
  return <Wifi className={className} />;
}