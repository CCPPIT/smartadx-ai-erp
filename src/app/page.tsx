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
  DollarSign,
  FileText,
  Bell,
  Gift,
  Search,
  Wand2
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
import RealtimeCampaigns from "@/components/dashboard/RealtimeCampaigns";

import CampaignsPage from "./campaigns/page";
import ClientsPage from "./clients/page";
import AIPage from "./ai/page";
import DesignPage from "./design/page";
import AutomationPage from "./automation/page";
import NotificationsPage from "./notifications/page";
import BillingPage from "./billing/page";
import ReportsPage from "./reports/page";
import RewardsPage from "./rewards/page";
import SearchPage from "./search/page";
import AIAdsPage from "./ai-ads/page";
import MarketTrendsPage from "./market-trends/page";
import SmartTargetingPage from "./smart-targeting/page";
import AICopywritingPage from "./ai-copywriting/page";
import CompetitorAnalysisPage from "./competitor-analysis/page";

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

          {/* Page Content */}
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

                {/* Real-time Campaigns */}
                <RealtimeCampaigns />

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

            {activeTab === "campaigns" && <CampaignsPage />}
            {activeTab === "clients" && <ClientsPage />}
            {activeTab === "ai" && <AIPage />}
            {activeTab === "design" && <DesignPage />}
            {activeTab === "automation" && <AutomationPage />}
            {activeTab === "notifications" && <NotificationsPage />}
            {activeTab === "billing" && <BillingPage />}
            {activeTab === "reports" && <ReportsPage />}
            {activeTab === "rewards" && <RewardsPage />}
            {activeTab === "search" && <SearchPage />}
            {activeTab === "ai-ads" && <AIAdsPage />}
            {activeTab === "market-trends" && <MarketTrendsPage />}
            {activeTab === "smart-targeting" && <SmartTargetingPage />}
            {activeTab === "ai-copywriting" && <AICopywritingPage />}
            {activeTab === "competitor-analysis" && <CompetitorAnalysisPage />}
          </main>
        </div>
      </div>
    </div>
  );
}
