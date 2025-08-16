"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "إجمالي الحملات",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: Zap,
    color: "gradient-primary",
    description: "هذا الشهر"
  },
  {
    title: "الإيرادات",
    value: "₽2.4M",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "gradient-success",
    description: "إجمالي هذا الشهر"
  },
  {
    title: "العملاء النشطين",
    value: "1,234",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "gradient-secondary",
    description: "عملاء متفاعلين"
  },
  {
    title: "معدل التحويل",
    value: "68.2%",
    change: "-2%",
    trend: "down",
    icon: TrendingUp,
    color: "gradient-warning",
    description: "آخر 30 يوم"
  }
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="glass-morphism border-white/20 hover:border-white/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} animate-pulse-glow`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Mini chart or progress indicator */}
              <div className="mt-4">
                <div className="w-full bg-muted/30 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                    className={`h-1.5 rounded-full ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
