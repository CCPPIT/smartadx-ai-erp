"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
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
  TrendingUp,
  FileText,
  WandSparkles, // This should work
  Gift,
  User,
  HelpCircle,
  BookOpen,
  Server,
  Shield,
  Key,
  CreditCard,
  Building,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Define user roles including SUPER_ADMIN
type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "ANALYST" | "USER";

// Extend User interface to include role
interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}

const menuItems = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    badge: null,
    gradient: "from-blue-500 to-purple-600",
    description: "نظرة عامة شاملة",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "campaigns",
    label: "الحملات الإعلانية",
    icon: Megaphone,
    badge: "12",
    gradient: "from-pink-500 to-rose-600",
    description: "إدارة وتتبع الحملات",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "analytics",
    label: "التحليلات المتقدمة",
    icon: BarChart3,
    badge: "جديد",
    gradient: "from-green-500 to-emerald-600",
    description: "رؤى وتقارير ذكية",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "clients",
    label: "إدارة العملاء",
    icon: Users,
    badge: "48",
    gradient: "from-orange-500 to-red-600",
    description: "نظام CRM متكامل",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "ai",
    label: "الذكاء الاصطناعي",
    icon: Brain,
    badge: "AI",
    gradient: "from-purple-500 to-indigo-600",
    description: "مساعد ذكي متطور",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "design",
    label: "استوديو التصميم",
    icon: Palette,
    badge: "Pro",
    gradient: "from-cyan-500 to-blue-600",
    description: "تصميم بالذكاء الاصطناعي",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "ai-ads",
    label: "توليد الإعلانات AI",
    icon: WandSparkles,
    badge: "جديد",
    gradient: "from-purple-500 to-pink-600",
    description: "إعلانات ذكية مولدة تلقائيًا",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "market-trends",
    label: "تحليل السوق",
    icon: TrendingUp,
    badge: "AI",
    gradient: "from-blue-500 to-cyan-600",
    description: "تحليل ترندات السوق الآلي",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "smart-targeting",
    label: "الاستهداف الذكي",
    icon: Target,
    badge: "ذكي",
    gradient: "from-indigo-500 to-purple-600",
    description: "توصيات استهداف متقدمة",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "ai-copywriting",
    label: "النصوص الدعائية AI",
    icon: FileText,
    badge: "جديد",
    gradient: "from-purple-500 to-pink-600",
    description: "مولد النصوص الذكي",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "competitor-analysis",
    label: "تحليل المنافسين",
    icon: Users,
    badge: "تحليل",
    gradient: "from-blue-500 to-indigo-600",
    description: "مراقبة المنافسين تلقائيًا",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "automation",
    label: "الأتمتة الذكية",
    icon: Zap,
    badge: "Beta",
    gradient: "from-yellow-500 to-orange-600",
    description: "جدولة وأتمتة متقدمة",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "notifications",
    label: "الإشعارات",
    icon: Bell,
    badge: "3",
    gradient: "from-red-500 to-pink-600",
    description: "إدارة الإشعارات",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "billing",
    label: "الفواتير",
    icon: DollarSign,
    badge: null,
    gradient: "from-green-500 to-emerald-600",
    description: "إدارة المدفوعات",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "reports",
    label: "التقارير",
    icon: FileText,
    badge: "5",
    gradient: "from-blue-500 to-indigo-600",
    description: "تقارير وتحليلات",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST"]
  },
  {
    id: "rewards",
    label: "المكافآت",
    icon: Gift,
    badge: "جديد",
    gradient: "from-yellow-500 to-orange-600",
    description: "نظام المكافآت للمبدعين",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "search",
    label: "البحث",
    icon: Search,
    badge: "AI",
    gradient: "from-purple-500 to-pink-600",
    description: "بحث ذكي مع اقتراحات",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "profile",
    label: "الملف الشخصي",
    icon: User,
    badge: null,
    gradient: "from-blue-500 to-cyan-600",
    description: "إدارة الملف الشخصي",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "settings",
    label: "الإعدادات",
    icon: Settings,
    badge: null,
    gradient: "from-gray-500 to-slate-600",
    description: "تخصيص النظام",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"]
  },
  {
    id: "help",
    label: "المساعدة والدعم",
    icon: HelpCircle,
    badge: null,
    gradient: "from-green-500 to-emerald-600",
    description: "الدعم الفني والمساعدة",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "documentation",
    label: "التوثيق",
    icon: BookOpen,
    badge: null,
    gradient: "from-purple-500 to-pink-600",
    description: "دليل الاستخدام والمراجع",
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ANALYST", "USER"]
  },
  {
    id: "system-status",
    label: "حالة النظام",
    icon: Server,
    badge: null,
    gradient: "from-blue-500 to-indigo-600",
    description: "مراقبة صحة النظام",
    roles: ["SUPER_ADMIN", "ADMIN"]
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
  const { user, logout } = useAuth();

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

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    if (!user) return [];
    
    // Cast user to UserWithRole to access role property
    const userWithRole = user as UserWithRole;
    const userRole = userWithRole.role || "USER";
    return menuItems.filter(item => item.roles.includes(userRole as UserRole));
  }, [user]);

  // Filter menu items based on search query
  const searchedMenuItems = useMemo(() => {
    if (!searchQuery) return filteredMenuItems;
    
    return filteredMenuItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredMenuItems, searchQuery]);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  const handleLogout = () => {
    logout();
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
          </div>

          {/* User Profile Section */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 mb-6"
              >
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-white/15 to-white/5 border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-purple-400/50">
                        <AvatarImage src="/api/placeholder/48/48" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold">
                          {user?.name ? user.name.charAt(0) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {user?.name || "مستخدم"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {(user as UserWithRole)?.role === "SUPER_ADMIN" && "مدير عليا"}
                        {(user as UserWithRole)?.role === "ADMIN" && "مدير النظام"}
                        {(user as UserWithRole)?.role === "MANAGER" && "مدير"}
                        {(user as UserWithRole)?.role === "ANALYST" && "محلل"}
                        {(user as UserWithRole)?.role === "USER" && "مستخدم"}
                        {!(user as UserWithRole)?.role && "مستخدم"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-white/10 text-white/70 hover:text-white relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell className="w-4 h-4" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-white/20">
            <div className="space-y-1">
              {searchedMenuItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full h-auto p-0 relative group transition-all duration-300 ${
                      activeTab === item.id ? "scale-[1.02]" : ""
                    }`}
                    onClick={() => onTabChange(item.id)}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.gradient} shadow-xl shadow-purple-500/25`
                        : hoveredItem === item.id
                          ? `bg-gradient-to-r ${item.gradient} opacity-20`
                          : "bg-transparent group-hover:bg-white/5"
                    }`} />

                    {/* Content */}
                    <div className="relative flex items-center gap-3 p-3 w-full">
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

                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex-1 flex items-center justify-between"
                          >
                            <div className="flex-1 text-right">
                              <div className={`font-medium text-sm ${
                                activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                              } transition-colors`}>
                                {item.label}
                              </div>
                              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors mt-0.5">
                                {item.description}
                              </div>
                            </div>

                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className={`text-xs border-0 mr-2 ${
                                  activeTab === item.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/10 text-gray-300'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-4"
              >
                <Separator className="my-4 bg-white/10" />
                
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                    إجراءات سريعة
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <motion.div
                        key={action.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-16 flex-col gap-1 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-gray-300 font-medium">{action.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className={`p-4 ${isCollapsed ? 'py-8' : ''}`}>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 ${
                  isCollapsed ? 'px-2' : 'px-4'
                } text-gray-300 hover:text-white hover:bg-white/10 transition-all`}
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-right text-sm"
                  >
                    تسجيل الخروج
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}