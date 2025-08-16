"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Users,
  Brain,
  Settings,
  LogOut,
  Sparkles,
  Target,
  Calendar,
  DollarSign,
  Palette,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Plus,
  Star,
  Zap,
  Layers,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    badge: null,
    gradient: "from-blue-500 to-purple-600",
    description: "نظرة عامة شاملة"
  },
  {
    id: "campaigns",
    label: "الحملات الإعلانية",
    icon: Megaphone,
    badge: "12",
    gradient: "from-pink-500 to-rose-600",
    description: "إدارة وتتبع الحملات"
  },
  {
    id: "analytics",
    label: "التحليلات المتقدمة",
    icon: BarChart3,
    badge: "جديد",
    gradient: "from-green-500 to-emerald-600",
    description: "رؤى وتقارير ذكية"
  },
  {
    id: "clients",
    label: "إدارة العملاء",
    icon: Users,
    badge: "48",
    gradient: "from-orange-500 to-red-600",
    description: "نظام CRM متكامل"
  },
  {
    id: "ai",
    label: "الذكاء الاصطناعي",
    icon: Brain,
    badge: "AI",
    gradient: "from-purple-500 to-indigo-600",
    description: "مساعد ذكي متطور"
  },
  {
    id: "design",
    label: "استوديو التصميم",
    icon: Palette,
    badge: "Pro",
    gradient: "from-cyan-500 to-blue-600",
    description: "تصميم بالذكاء الاصطناعي"
  },
  {
    id: "automation",
    label: "الأتمتة الذكية",
    icon: Zap,
    badge: "Beta",
    gradient: "from-yellow-500 to-orange-600",
    description: "جدولة وأتمتة متقدمة"
  }
];

const quickActions = [
  { id: "new-campaign", label: "حملة جديدة", icon: Plus, color: "from-indigo-500 to-purple-600" },
  { id: "ai-design", label: "تصميم AI", icon: Sparkles, color: "from-pink-500 to-rose-600" },
  { id: "analytics", label: "تحليل سريع", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
  { id: "calendar", label: "الجدولة", icon: Calendar, color: "from-blue-500 to-cyan-600" },
];

const notifications = [
  { type: "success", message: "تم إطلاق حملة جديدة بنجاح", time: "منذ دقيقتين" },
  { type: "warning", message: "انخفاض في معدل النقر", time: "منذ 10 دقائق" },
  { type: "info", message: "تحديث جديد متوفر", time: "منذ ساعة" }
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-50 group"
    >
      {/* Main Sidebar Container */}
      <div className="relative h-full">
        {/* Background with advanced effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-indigo-900/95 backdrop-blur-xl border-r border-white/10">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-rose-600/20 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-0 w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Header Section */}
          <div className="p-4">
            {/* Logo & Toggle */}
            <div className="flex items-center justify-between mb-6">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        SmartAdX
                      </h2>
                      <p className="text-xs text-gray-400">AI ERP System</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {/* Search Bar */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="بحث سريع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Profile */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6"
                >
                  <div className="relative p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-purple-400/50">
                          <AvatarImage src="/api/placeholder/48/48" />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold">
                            أم
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">أحمد محمد</p>
                        <p className="text-xs text-gray-400">مدير النظام</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-white/10 text-white/70 hover:text-white relative"
                      >
                        <Bell className="w-4 h-4" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4"
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    القائمة الرئيسية
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>

            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Button
                  variant="ghost"
                  className={`w-full h-auto p-0 relative group transition-all duration-300 ${
                    activeTab === item.id ? "scale-105" : "hover:scale-105"
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.gradient} shadow-2xl shadow-purple-500/25`
                      : hoveredItem === item.id
                        ? `bg-gradient-to-r ${item.gradient} opacity-20`
                        : "bg-transparent group-hover:bg-white/5"
                  }`} />

                  {/* Content */}
                  <div className={`relative flex items-center gap-3 p-3 w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <div className={`relative ${
                      activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    } transition-colors`}>
                      <item.icon className="w-5 h-5" />
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 blur-md opacity-50"
                        >
                          <item.icon className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1 text-right"
                        >
                          <div className={`font-medium text-sm ${
                            activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          } transition-colors`}>
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!isCollapsed && item.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge
                            variant="secondary"
                            className={`text-xs border-0 ${
                              activeTab === item.id
                                ? 'bg-white/20 text-white'
                                : 'bg-white/10 text-gray-300'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
              </motion.div>
            ))}

            <Separator className="my-6 bg-white/10" />

            {/* Quick Actions */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4"
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                    إجراءات سريعة
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-16 flex-col gap-2 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-gray-300">{action.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 space-y-2">
            {!isCollapsed && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span className="flex-1 text-right">الإعدادات</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="flex-1 text-right">تسجيل الخروج</span>
                </Button>
              </>
            )}

            {isCollapsed && (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full aspect-square p-0 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full aspect-square p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-20 left-full ml-4 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 z-50"
            >
              <h4 className="font-semibold text-white mb-3">الإشعارات</h4>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <p className="text-sm text-gray-300">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
