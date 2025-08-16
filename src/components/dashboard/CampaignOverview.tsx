"use client";

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Calendar,
  Target,
  Eye,
  MousePointer,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const campaigns = [
  {
    id: 1,
    name: "حملة منتج صيفي",
    status: "active",
    budget: "₽45,000",
    spent: "₽28,500",
    impressions: "1.2M",
    clicks: "45.2K",
    startDate: "15 يوليو",
    endDate: "30 يوليو",
    platform: "Meta",
    image: "/api/placeholder/60/60"
  },
  {
    id: 2,
    name: "إعلان تطبيق موبايل",
    status: "paused",
    budget: "₽32,000",
    spent: "₽18,900",
    impressions: "890K",
    clicks: "32.1K",
    startDate: "10 يوليو",
    endDate: "25 يوليو",
    platform: "Google",
    image: "/api/placeholder/60/60"
  },
  {
    id: 3,
    name: "حملة العروض الخاصة",
    status: "active",
    budget: "₽25,000",
    spent: "₽22,100",
    impressions: "650K",
    clicks: "28.5K",
    startDate: "20 يوليو",
    endDate: "5 أغسطس",
    platform: "TikTok",
    image: "/api/placeholder/60/60"
  }
];

export default function CampaignOverview() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                الحملات النشطة
              </CardTitle>
              <CardDescription>نظرة عامة على أداء الحملات</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="glass-morphism border-white/20">
              عرض الكل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg glass-morphism border border-white/10 hover:border-white/20 transition-all"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={campaign.image} />
                <AvatarFallback className="gradient-primary text-white">
                  {campaign.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{campaign.name}</h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {campaign.status === "active" ? "نشط" : "متوقف"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {campaign.impressions}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointer className="w-3 h-3" />
                    {campaign.clicks}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {campaign.startDate}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>الميزانية المستخدمة</span>
                    <span>{campaign.spent} / {campaign.budget}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full gradient-primary"
                      style={{
                        width: `${(parseInt(campaign.spent.replace(/[₽,]/g, '')) / parseInt(campaign.budget.replace(/[₽,]/g, ''))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 glass-morphism border-white/20"
                >
                  {campaign.status === "active" ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 glass-morphism border-white/20"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
