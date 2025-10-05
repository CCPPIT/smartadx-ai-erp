'use client'

import { useState, useEffect, useMemo } from 'react'
import { trpc } from '@/lib/trpc-react'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Wifi, 
  WifiOff, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye,
  BarChart3,
  PieChart,
  Download,
  Filter,
  TrendingDown,
  Activity,
  Zap,
  Brain,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area } from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Define types
type Campaign = {
  id: string
  name: string
}

type AnalyticsDataPoint = {
  time: string
  clicks: number
  impressions: number
  conversions: number
  revenue: number
}

type CampaignMetric = {
  id: string
  name: string
  status?: string
  clicks: number
  impressions: number
  conversions: number
  ctr: string
  conversionRate?: string
  revenue: number
}

export default function RealtimeAnalytics() {
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'overview' | 'comparison'>('overview')
  
  const { data: campaigns, isLoading: campaignsLoading } = trpc.campaign.getAll.useQuery()
  const { data: analyticsData, isLoading, isError, error, refetch } = trpc.dashboard.getRealtimeAnalytics.useQuery(
    { 
      timeRange,
      campaignIds: selectedCampaigns.length > 0 ? selectedCampaigns : undefined
    },
    {
      refetchInterval: realtimeEnabled ? 5000 : false, // Auto-refresh every 5 seconds when enabled
    }
  )
  
  const { isConnected, messages, subscribeToCampaigns, unsubscribeFromCampaigns } = useRealtime()
  
  // AI Analysis for performance insights
  const aiInsights = useMemo(() => {
    if (!analyticsData?.stats) return null
    
    const ctr = parseFloat(analyticsData.stats.ctr)
    const convRate = parseFloat(analyticsData.stats.conversionRate)
    
    let performance = 'ممتاز'
    let color = 'text-green-500'
    let icon = CheckCircle2
    let recommendation = 'الأداء ممتاز! استمر على هذا النهج'
    
    if (ctr < 2) {
      performance = 'يحتاج تحسين'
      color = 'text-red-500'
      icon = AlertCircle
      recommendation = 'معدل النقر منخفض. جرب تحسين الإعلانات والاستهداف'
    } else if (ctr < 4) {
      performance = 'جيد'
      color = 'text-yellow-500'
      icon = Activity
      recommendation = 'الأداء جيد ولكن يمكن تحسينه بتجربة محتوى جديد'
    }
    
    return { performance, color, icon, recommendation, ctr, convRate }
  }, [analyticsData])
  
  // Real-time updates effect
  useEffect(() => {
    if (realtimeEnabled) {
      subscribeToCampaigns()
    } else {
      unsubscribeFromCampaigns()
    }
  }, [realtimeEnabled, subscribeToCampaigns, unsubscribeFromCampaigns])
  
  const toggleRealtime = () => {
    setRealtimeEnabled(!realtimeEnabled)
    if (!realtimeEnabled) {
      subscribeToCampaigns()
    } else {
      unsubscribeFromCampaigns()
    }
  }
  
  const handleRefresh = () => {
    refetch().catch((err) => {
      console.error('Failed to refresh campaigns:', err)
    })
  }
  
  const handleExport = () => {
    try {
      // Create CSV data
      const csvContent = [
        ['الوقت', 'النقرات', 'الإظهارات', 'التحويلات', 'الإيرادات'],
        ...timeSeriesData.map(data => [
          data.time,
          data.clicks,
          data.impressions,
          data.conversions,
          data.revenue
        ])
      ]
      .map(row => row.join(','))
      .join('\n')
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }
  
  // Colors for charts
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
  
  // Get stats from API data
  const stats = analyticsData?.stats || {
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    ctr: '0%',
    conversionRate: '0%'
  }
  
  const timeSeriesData = analyticsData?.timeSeriesData || []
  const campaignMetrics = analyticsData?.campaignMetrics || []
  
  if (isError) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>خطأ في تحميل التحليلات</CardTitle>
          <CardDescription>{error?.message || 'فشل في تحميل بيانات التحليلات'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: realtimeEnabled ? 360 : 0 }}
            transition={{ duration: 2, repeat: realtimeEnabled ? Infinity : 0, ease: "linear" }}
          >
            <Zap className="w-8 h-8 text-purple-500" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              التحليلات في الوقت الفعلي
              {realtimeEnabled && (
                <Badge className="bg-green-500 text-white animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  مباشر
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground">
              متابعة أداء الحملات الإعلانية بشكل مباشر • آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[130px] glass-morphism border-white/20">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">آخر ساعة</SelectItem>
              <SelectItem value="6h">آخر 6 ساعات</SelectItem>
              <SelectItem value="24h">آخر 24 ساعة</SelectItem>
              <SelectItem value="7d">آخر 7 أيام</SelectItem>
              <SelectItem value="30d">آخر 30 يوم</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير البيانات
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
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
          <Button 
            variant="outline" 
            size="sm"
            disabled
          >
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </Button>
        </div>
      </div>
      
      {/* AI Insights Banner */}
      {aiInsights && (
        <Card className="glass-morphism border-white/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    تحليل AI للأداء
                    <Badge className={`${aiInsights.color} border-0`}>
                      {aiInsights.performance}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">{aiInsights.recommendation}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">CTR</p>
                  <p className="font-bold">{aiInsights.ctr.toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">معدل التحويل</p>
                  <p className="font-bold">{aiInsights.convRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الإظهارات</p>
                <p className="text-2xl font-bold">
                  {stats.totalImpressions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">النقرات</p>
                <p className="text-2xl font-bold">
                  {stats.totalClicks.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">CTR: {stats.ctr}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التحويلات</p>
                <p className="text-2xl font-bold">
                  {stats.totalConversions.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">معدل التحويل: {stats.conversionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الإيرادات</p>
                <p className="text-2xl font-bold">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              أداء الحملات في الوقت الفعلي
            </CardTitle>
            <CardDescription>
              تتبع الإظهارات والنقرات والتحويلات
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f093fb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f093fb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="#667eea" 
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#764ba2" 
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#f093fb" 
                    fillOpacity={1}
                    fill="url(#colorConversions)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            )}
          </CardContent>
        </Card>
        
        {/* Campaign Metrics */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              مقاييس الحملات
            </CardTitle>
            <CardDescription>
              مقارنة أداء الحملات المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                    />
                    <Bar dataKey="clicks" name="النقرات" radius={[8, 8, 0, 0]}>
                      {campaignMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Campaign Performance Table */}
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>أداء الحملات التفصيلي</CardTitle>
          <CardDescription>تحليل مفصل لأداء كل حملة</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {campaignMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{metric.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span>{metric.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{metric.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{metric.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>${metric.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">معدل النقر: {metric.ctr}</div>
                    <Badge variant="secondary" className="mt-1">
                      {Math.random() > 0.5 ? 'أداء جيد' : 'تحتاج تحسين'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}