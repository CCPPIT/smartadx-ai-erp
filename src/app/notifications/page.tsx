"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Filter,
  Settings,
  Trash2,
  Eye,
  Clock,
  User,
  Megaphone,
  BarChart3,
  Calendar,
  Layers
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc-react";

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "تم إطلاق حملة جديدة",
      message: "تم إطلاق حملة الصيف 2025 بنجاح",
      type: "success",
      read: true,
      timestamp: "2025-09-30T09:30:00Z",
      priority: 1,
      entityId: "campaign_123",
      entityType: "campaign"
    },
    {
      id: 2,
      title: "تحذير في الأداء",
      message: "معدل النقر في حملة العطلات انخفض بشكل ملحوظ",
      type: "warning",
      read: false,
      timestamp: "2025-09-30T08:15:00Z",
      priority: 2,
      entityId: "campaign_456",
      entityType: "campaign"
    },
    {
      id: 3,
      title: "تحديث النظام",
      message: "يتوفر تحديث جديد لنظام SmartAdX ERP",
      type: "info",
      read: false,
      timestamp: "2025-09-29T16:45:00Z",
      priority: 0,
      entityId: null,
      entityType: null
    },
    {
      id: 4,
      title: "تقرير أسبوعي",
      message: "تقرير الأداء الأسبوعي لحملة المنتجات الجديدة",
      type: "info",
      read: true,
      timestamp: "2025-09-29T09:00:00Z",
      priority: 1,
      entityId: "report_789",
      entityType: "report"
    },
    {
      id: 5,
      title: "دفع مكتمل",
      message: "تم استلام دفع مبلغ $2,500 من العميل أحمد محمد",
      type: "success",
      read: true,
      timestamp: "2025-09-28T14:20:00Z",
      priority: 1,
      entityId: "payment_101",
      entityType: "payment"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600">نجاح</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">تحذير</Badge>;
      case 'info':
        return <Badge className="bg-blue-500 hover:bg-blue-600">معلومات</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">عام</Badge>;
    }
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 0:
        return <Badge variant="secondary" className="text-xs">منخفض</Badge>;
      case 1:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">متوسط</Badge>;
      case 2:
        return <Badge className="bg-red-500 hover:bg-red-600 text-xs">عالي</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">غير محدد</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "read" && notification.read) || 
                         (filterStatus === "unread" && !notification.read);
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
              الإشعارات
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة الإشعارات والإشعارات الذكية
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إعدادات الإشعارات
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              مسح الكل
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإشعارات</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">غير مقروءة</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
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
                  <p className="text-sm text-muted-foreground">مقروءة</p>
                  <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="نوع الإشعار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="info">معلومات</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="read">مقروءة</SelectItem>
                    <SelectItem value="unread">غير مقروءة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  تطبيق الفلاتر
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>الإشعارات الحديثة</CardTitle>
            <CardDescription>جميع الإشعارات والإشعارات الذكية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read 
                      ? "bg-white/5 border-white/10" 
                      : "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className={`font-semibold ${!notification.read ? "text-purple-300" : ""}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(notification.type)}
                          {getPriorityBadge(notification.priority)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{notification.message}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {notification.entityType === "campaign" && (
                            <span className="flex items-center gap-1">
                              <Megaphone className="w-4 h-4" />
                              حملة إعلانية
                            </span>
                          )}
                          {notification.entityType === "report" && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              تقرير
                            </span>
                          )}
                          {notification.entityType === "payment" && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              دفع
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Eye className="w-4 h-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                          {!notification.read && (
                            <Button variant="ghost" size="sm" className="text-xs">
                              <CheckCircle className="w-4 h-4 ml-1" />
                              وضع كمقروء
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Notifications Info */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات الذكية
            </CardTitle>
            <CardDescription>كيف تعمل الإشعارات الذكية في SmartAdX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "تحليل الأولويات",
                  description: "نظام ذكي يحلل أهمية كل إشعار ويرتبها حسب الأولوية",
                  icon: AlertTriangle
                },
                {
                  title: "تجميع ذكي",
                  description: "تجميع الإشعارات المتشابهة لتجنب الإزعاج",
                  icon: Bell
                },
                {
                  title: "تخصيص الوقت",
                  description: "إرسال الإشعارات في الأوقات المثلى لزيادة التفاعل",
                  icon: Clock
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}