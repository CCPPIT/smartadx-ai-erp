'use client'

import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc-react'
import RealtimeAnalytics from './RealtimeAnalytics'
import RealtimeNotifications from './RealtimeNotifications'
import RealtimeCampaigns from './RealtimeCampaigns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  BarChart3, 
  Bell, 
  Megaphone,
  TrendingUp,
  Users,
  DollarSign,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Progress } from "@/components/ui/progress"

export default function ComprehensiveDashboard() {
  const [activeView, setActiveView] = useState('overview')
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  
  // Fetch real data from API
  const { data: dashboardStats, isLoading, refetch } = trpc.dashboard.getStats.useQuery(
    undefined,
    {
      refetchInterval: realtimeEnabled ? 5000 : false,
    }
  )
  
  const { data: campaigns } = trpc.campaign.getAll.useQuery()
  const { data: analyticsData } = trpc.dashboard.getRealtimeAnalytics.useQuery({
    timeRange: '24h'
  })
  
  const toggleRealtime = () => {
    setRealtimeEnabled(!realtimeEnabled)
  }
  
  const views = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'campaigns', label: 'الحملات', icon: Megaphone },
  ]
  
  // Calculate real-time stats
  const stats = useMemo(() => {
    if (!analyticsData?.stats || !campaigns) {
      return {
        ctr: '0%',
        conversionRate: '0%',
        dailyRevenue: 0,
        activeCampaigns: 0,
        totalImpressions: 0,
        totalClicks: 0
      }
    }
    
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length
    
    return {
      ctr: analyticsData.stats.ctr,
      conversionRate: analyticsData.stats.conversionRate,
      dailyRevenue: analyticsData.stats.totalRevenue,
      activeCampaigns,
      totalImpressions: analyticsData.stats.totalImpressions,
      totalClicks: analyticsData.stats.totalClicks
    }
  }, [analyticsData, campaigns])
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'analytics':
        return <RealtimeAnalytics />
      case 'notifications':
        return <RealtimeNotifications />
      case 'campaigns':
        return <RealtimeCampaigns />
      default:
        return (
          <div className="space-y-6">
            {/* AI Performance Insights */}
            {analyticsData?.stats && (
              <Card className="glass-morphism border-white/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-purple-500" />
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          تحليل AI للأداء العام
                          <Badge className={parseFloat(stats.ctr) > 3 ? 'bg-green-500' : 'bg-yellow-500'}>
                            {parseFloat(stats.ctr) > 3 ? 'ممتاز' : 'جيد'}
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {parseFloat(stats.ctr) > 3 
                            ? 'الأداء ممتاز! استمر على هذا النهج' 
                            : 'الأداء جيد، يمكن تحسينه بتجربة محتوى جديد'}
                        </p>
                      </div>
                    </div>
                    {realtimeEnabled && (
                      <Badge className="bg-green-500 text-white animate-pulse">
                        <Activity className="w-3 h-3 mr-1" />
                        مباشر
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">معدل النقر الكلي</p>
                        <p className="text-2xl font-bold">{stats.ctr}</p>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          {parseFloat(stats.ctr) > 3 ? (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-green-500" />
                              <span className="text-green-500">أعلى من المتوسط</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-3 h-3 text-yellow-500" />
                              <span className="text-yellow-500">متوسط</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">معدل التحويل</p>
                        <p className="text-2xl font-bold">{stats.conversionRate}</p>
                        <Progress value={parseFloat(stats.conversionRate) * 10} className="h-1 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">الإيرادات اليومية</p>
                        <p className="text-2xl font-bold">${stats.dailyRevenue.toLocaleString()}</p>
                        <Progress value={75} className="h-1 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                        <Megaphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">الحملات النشطة</p>
                        <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          من أصل {campaigns?.length || 0} حملة
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Combined Views */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeCampaigns />
              <RealtimeNotifications />
            </div>
            
            <RealtimeAnalytics />
          </div>
        )
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            لوحة التحكم الشاملة
          </h1>
          <p className="text-muted-foreground mt-1">
            مراقبة جميع جوانب حملاتك الإعلانية في مكان واحد
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRealtime}
            className={realtimeEnabled ? 'bg-green-500/20 border-green-500' : ''}
          >
            {realtimeEnabled ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                إيقاف التحديث
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                تحديث تلقائي
              </>
            )}
          </Button>
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              جاري التحميل...
            </Badge>
          )}
        </div>
      </div>
      
      {/* View Navigation */}
      <div className="flex flex-wrap gap-2">
        {views.map((view) => {
          const Icon = view.icon
          return (
            <Button
              key={view.id}
              variant={activeView === view.id ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setActiveView(view.id)}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </Button>
          )
        })}
      </div>
      
      {/* Active View */}
      {renderActiveView()}
    </div>
  )
}