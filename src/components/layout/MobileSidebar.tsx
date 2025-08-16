"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  X,
  Bell,
  Search,
  Plus,
  Zap,
  TrendingUp,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface MobileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
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

export default function MobileSidebar({ activeTab, onTabChange, isOpen, onToggle }: MobileSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onToggle(); // Close sidebar after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 w-80 h-screen z-50"
          >
            {/* Background with advanced effects */}
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/98 via-purple-900/95 to-indigo-900/98 backdrop-blur-xl">
                {/* Animated background patterns */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-20 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/30 to-rose-600/30 rounded-full blur-2xl animate-pulse delay-1000" />
                  <div className="absolute top-1/2 left-0 w-36 h-36 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-2000" />
                </div>

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40">
                        <Sparkles className="w-7 h-7 text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping" />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        SmartAdX
                      </h2>
                      <p className="text-sm text-gray-400">AI ERP System</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="p-2 hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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

                {/* User Profile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="relative p-4 rounded-2xl bg-gradient-to-r from-white/15 to-white/5 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-14 h-14 ring-2 ring-purple-400/50">
                          <AvatarImage src="/api/placeholder/56/56" />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold text-lg">
                            أم
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-lg">أحمد محمد</p>
                        <p className="text-sm text-gray-400">مدير النظام</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-white/10 text-white/70 hover:text-white relative"
                      >
                        <Bell className="w-5 h-5" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Menu */}
                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                      القائمة الرئيسية
                    </h3>
                  </motion.div>

                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full h-auto p-0 relative group transition-all duration-300 ${
                          activeTab === item.id ? "scale-[1.02]" : ""
                        }`}
                        onClick={() => handleTabChange(item.id)}
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
                        <div className="relative flex items-center gap-4 p-4 w-full">
                          <div className={`relative ${
                            activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          } transition-colors`}>
                            <item.icon className="w-6 h-6" />
                            {activeTab === item.id && (
                              <motion.div
                                layoutId="mobileActiveGlow"
                                className="absolute inset-0 blur-md opacity-50"
                              >
                                <item.icon className="w-6 h-6 text-white" />
                              </motion.div>
                            )}
                          </div>

                          <div className="flex-1 text-right">
                            <div className={`font-semibold text-base ${
                              activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            } transition-colors`}>
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                              {item.description}
                            </div>
                          </div>

                          {item.badge && (
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
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}

                  <Separator className="my-6 bg-white/10" />

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-4">
                      إجراءات سريعة
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-18 flex-col gap-2 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                          >
                            <div className={`p-2.5 rounded-lg bg-gradient-to-r ${action.color}`}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm text-gray-300 font-medium">{action.label}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3 pt-4"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 h-14 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="flex-1 text-right text-base">الإعدادات</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 h-14 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="flex-1 text-right text-base">تسجيل الخروج</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
