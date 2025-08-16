"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Users,
  Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard, badge: null },
  { id: "campaigns", label: "الحملات", icon: Megaphone, badge: "12" },
  { id: "analytics", label: "التحليلات", icon: BarChart3, badge: null },
  { id: "clients", label: "العملاء", icon: Users, badge: "48" },
  { id: "ai", label: "الذكاء الاصطناعي", icon: Brain, badge: "AI" },
];

export default function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-white/20 backdrop-blur-xl"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? "gradient-primary text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <div className="relative">
              <tab.icon className="w-5 h-5" />
              {tab.badge && (
                <Badge
                  className="absolute -top-2 -right-2 min-w-[16px] h-4 text-[10px] p-0 flex items-center justify-center gradient-secondary border-0 text-white"
                >
                  {tab.badge}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl gradient-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
}
