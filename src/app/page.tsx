"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Users,
  PlusCircle,
  Brain,
  Sparkles,
  Megaphone,
  Palette,
  Calendar,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import StatsCards from "@/components/dashboard/StatsCards";
import CampaignOverview from "@/components/dashboard/CampaignOverview";
import AIInsights from "@/components/dashboard/AIInsights";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isMobileSidebarOpen}
          onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-morphism border-b border-white/20 backdrop-blur-xl p-6 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="lg:ml-0 ml-16">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  📢 SmartAdX AI ERP
                </h1>
                <p className="text-muted-foreground mt-1">
                  نظام دعاية وإعلان ثوري بالذكاء الاصطناعي
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  حملة جديدة
                </Button>
                <Avatar className="animate-pulse-glow ring-2 ring-purple-400/50">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className="gradient-secondary text-white">AI</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </motion.header>

          {/* Dashboard Content */}
          <main className="p-6 pb-20 lg:pb-6">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* AI Welcome Banner */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass-morphism border-white/20 overflow-hidden relative">
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90">
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />
                      </div>
                    </div>

                    <div className="relative p-8 text-white">
                      <div className="flex items-center gap-6">
                        <div className="animate-float">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Brain className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                            مرحباً بك في المستقبل
                            <Sparkles className="w-7 h-7 animate-pulse" />
                          </h2>
                          <p className="text-white/90 text-lg">
                            الذكاء الاصطناعي جاهز لإنشاء حملاتك الإعلانية التالية
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Quick Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-morphism border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        إجراءات سريعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { icon: Megaphone, label: "حملة إعلانية", color: "gradient-primary", desc: "إنشاء حملة جديدة" },
                          { icon: Palette, label: "تصميم بالذكاء الاصطناعي", color: "gradient-secondary", desc: "توليد تصاميم ذكية" },
                          { icon: Calendar, label: "جدولة نشر", color: "gradient-success", desc: "أتمتة النشر" },
                          { icon: BarChart3, label: "تحليل الأداء", color: "gradient-warning", desc: "رؤى متقدمة" }
                        ].map((action, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-24 flex-col gap-3 glass-morphism border-white/20 hover:border-white/40 group transition-all duration-300"
                            >
                              <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-center">
                                <span className="text-sm font-semibold block">{action.label}</span>
                                <span className="text-xs text-muted-foreground">{action.desc}</span>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Campaign Overview & AI Insights */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <CampaignOverview />
                  <AIInsights />
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">الحملات الإعلانية</CardTitle>
                    <CardDescription>إدارة وتتبع جميع حملاتك الإعلانية</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center">
                        <Megaphone className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - إدارة الحملات الإعلانية</h3>
                      <p className="text-muted-foreground">نظام متقدم لإدارة وتتبع حملاتك الإعلانية</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">التحليلات والتقارير</CardTitle>
                    <CardDescription>مراقبة أداء حملاتك بالذكاء الاصطناعي</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - تحليلات متقدمة بالذكاء الاصطناعي</h3>
                      <p className="text-muted-foreground">رؤى عميقة وتقارير ذكية لحملاتك</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "clients" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">إدارة العملاء</CardTitle>
                    <CardDescription>نظام CRM متكامل لإدارة علاقات العملاء</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - نظام إدارة العملاء الذكي</h3>
                      <p className="text-muted-foreground">CRM متطور لإدارة علاقات العملاء</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">مساعد الذكاء الاصطناعي</CardTitle>
                    <CardDescription>أدوات الذكاء الاصطناعي المتقدمة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center animate-pulse">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - مساعد الذكاء الاصطناعي الشامل</h3>
                      <p className="text-muted-foreground">مساعد ذكي متطور لجميع احتياجاتك</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "design" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">استوديو التصميم</CardTitle>
                    <CardDescription>تصميم الإعلانات بالذكاء الاصطناعي</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center">
                        <Palette className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - استوديو التصميم الذكي</h3>
                      <p className="text-muted-foreground">إنشاء تصاميم احترافية بالذكاء الاصطناعي</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "automation" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">الأتمتة الذكية</CardTitle>
                    <CardDescription>جدولة وأتمتة الحملات الإعلانية</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">قريباً - نظام الأتمتة الذكية</h3>
                      <p className="text-muted-foreground">أتمتة كاملة لحملاتك الإعلانية</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden">
        <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
