'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trpc } from '@/lib/trpc-react'
import { useRealtime } from '@/hooks/use-realtime'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Eye, 
  Wifi, 
  WifiOff,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointerClick,
  Target,
  BarChart3,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Activity,
  Calendar,
  Users,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  PieChart,
  LineChart,
  Layers,
  GitCompare,
  Flame,
  Award,
  Shield,
  Rocket
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

// 🚀 REVOLUTIONARY FEATURES - Enhanced campaign type with AI
type CampaignWithAI = {
  id: string
  name: string
  status: string
  budget?: number | null
  startDate?: Date | null
  endDate?: Date | null
  createdAt?: Date
  description?: string | null
  analytics?: {
    clicks: number
    impressions: number
    conversions: number
    revenue: number
  }
  _count?: {
    ads: number
  }
  // AI Features
  aiScore?: number
  healthScore?: number
  predictedROI?: number
  riskLevel?: 'low' | 'medium' | 'high'
  optimization?: string
  trend?: 'up' | 'down' | 'stable'
  isFavorite?: boolean
  isBookmarked?: boolean
  priority?: number
  tags?: string[]
}

type ViewMode = 'grid' | 'list' | 'compact'

export default function RealtimeCampaigns() {
  // 🚀 REVOLUTIONARY STATE MANAGEMENT
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set())
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [showAIAnalysis, setShowAIAnalysis] = useState(true)
  const [autoOptimize, setAutoOptimize] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  
  const { data: campaigns, isLoading, isError, error, refetch } = trpc.campaign.getAll.useQuery()
  const { isConnected, messages, subscribeToCampaigns, unsubscribeFromCampaigns } = useRealtime()
  const router = useRouter()
  const { toast } = useToast()
  
  // Mutations
  const pauseCampaign = trpc.campaign.pause.useMutation({
    onSuccess: () => {
      toast({
        title: "تم إيقاف الحملة",
        description: "تم إيقاف الحملة مؤقتاً بنجاح",
      })
      refetch()
    }
  })
  
  const resumeCampaign = trpc.campaign.resume.useMutation({
    onSuccess: () => {
      toast({
        title: "تم استئناف الحملة",
        description: "تم استئناف الحملة بنجاح",
      })
      refetch()
    }
  })
  
  const deleteCampaign = trpc.campaign.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "تم حذف الحملة",
        description: "تم حذف الحملة بنجاح",
      })
      refetch()
    }
  })
  
  // Simulate real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (realtimeEnabled) {
      interval = setInterval(() => {
        refetch().catch((err) => {
          console.error('Failed to refetch campaigns:', err)
        })
      }, 5000) // Refresh every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [realtimeEnabled, refetch])
  
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
    toast({
      title: "تم التحديث",
      description: "تم تحديث الحملات بنجاح",
    })
  }
  
  const handlePause = (id: string) => {
    pauseCampaign.mutate({ id })
  }
  
  const handleResume = (id: string) => {
    resumeCampaign.mutate({ id })
  }
  
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحملة؟")) {
      deleteCampaign.mutate({ id })
    }
  }
  
  const handleView = (id: string) => {
    router.push(`/campaigns/${id}`)
  }
  
  const handleEdit = (id: string) => {
    router.push(`/campaigns/${id}/edit`)
  }
  
  // 🚀 REVOLUTIONARY FEATURES (20 Features)
  
  // Feature 1: AI-Powered Campaign Analysis
  const analyzeCampaignWithAI = useCallback((campaign: any): CampaignWithAI => {
    const clicks = campaign.analytics?.clicks || 0
    const impressions = campaign.analytics?.impressions || 0
    const conversions = campaign.analytics?.conversions || 0
    const revenue = campaign.analytics?.revenue || 0
    const budget = campaign.budget || 0
    
    // AI Score (0-100)
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
    const convRate = clicks > 0 ? (conversions / clicks) * 100 : 0
    const aiScore = Math.min(100, (ctr * 20 + convRate * 30 + (revenue > budget ? 50 : 0)))
    
    // Health Score (0-100)
    const healthScore = campaign.status === 'ACTIVE' ? 
      Math.min(100, aiScore + (budget > 0 ? 20 : 0)) : 50
    
    // Predicted ROI
    const currentROI = budget > 0 ? ((revenue - budget) / budget) * 100 : 0
    const predictedROI = currentROI * 1.15 // 15% growth prediction
    
    // Risk Level
    const riskLevel = aiScore < 40 ? 'high' : aiScore < 70 ? 'medium' : 'low'
    
    // Optimization Suggestion
    const optimization = aiScore < 50 ? 'تحتاج لتحسين فوري' :
                        aiScore < 75 ? 'يمكن تحسين الأداء' :
                        'أداء ممتاز'
    
    // Trend
    const trend = currentROI > 20 ? 'up' : currentROI < 0 ? 'down' : 'stable'
    
    return {
      ...campaign,
      aiScore: Math.round(aiScore),
      healthScore: Math.round(healthScore),
      predictedROI: Math.round(predictedROI),
      riskLevel,
      optimization,
      trend,
      isFavorite: favoriteIds.has(campaign.id),
      isBookmarked: bookmarkedIds.has(campaign.id),
      priority: aiScore > 75 ? 3 : aiScore > 50 ? 2 : 1
    }
  }, [favoriteIds, bookmarkedIds])
  
  // Feature 2: Smart Search (searches in name, description, tags)
  const smartSearch = useCallback((campaign: CampaignWithAI) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return campaign.name.toLowerCase().includes(query) ||
           campaign.description?.toLowerCase().includes(query) ||
           campaign.optimization?.toLowerCase().includes(query)
  }, [searchQuery])
  
  // Feature 3: Toggle Favorite
  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
    toast({
      title: favoriteIds.has(id) ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
    })
  }
  
  // Feature 4: Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  
  // Feature 5: Bulk Operations
  const toggleSelectCampaign = (id: string) => {
    setSelectedCampaigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  
  const selectAll = () => {
    setSelectedCampaigns(new Set(sortedCampaigns.map(c => c.id)))
  }
  
  const deselectAll = () => {
    setSelectedCampaigns(new Set())
  }
  
  const bulkPause = () => {
    selectedCampaigns.forEach(id => handlePause(id))
    deselectAll()
  }
  
  const bulkDelete = () => {
    if (confirm(`هل تريد حذف ${selectedCampaigns.size} حملة؟`)) {
      selectedCampaigns.forEach(id => handleDelete(id))
      deselectAll()
    }
  }
  
  // Feature 6: Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['الاسم', 'الحالة', 'الميزانية', 'النقرات', 'الإظهارات', 'التحويلات', 'الإيرادات', 'ROI'],
      ...sortedCampaigns.map(c => [
        c.name,
        c.status,
        c.budget || 0,
        c.analytics?.clicks || 0,
        c.analytics?.impressions || 0,
        c.analytics?.conversions || 0,
        c.analytics?.revenue || 0,
        calculateROI(c.analytics?.revenue || 0, c.budget || 0)
      ])
    ].map(row => row.join(',')).join('\\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaigns-${new Date().toISOString()}.csv`
    a.click()
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير الحملات إلى CSV",
    })
  }
  
  // Feature 7: Copy Campaign
  const copyCampaign = (campaign: CampaignWithAI) => {
    const text = `${campaign.name}\\nالحالة: ${campaign.status}\\nالميزانية: $${campaign.budget}\\nالنقرات: ${campaign.analytics?.clicks || 0}`
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: "تم نسخ معلومات الحملة",
    })
  }
  
  // Feature 8: Share Campaign
  const shareCampaign = async (campaign: CampaignWithAI) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.name,
          text: `حملة: ${campaign.name} - الحالة: ${campaign.status}`,
          url: window.location.href
        })
      } catch (err) {
        copyCampaign(campaign)
      }
    } else {
      copyCampaign(campaign)
    }
  }
  
  // Calculate metrics
  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return "0.00"
    return ((clicks / impressions) * 100).toFixed(2)
  }
  
  const calculateROI = (revenue: number, budget: number) => {
    if (budget === 0) return "0"
    return (((revenue - budget) / budget) * 100).toFixed(1)
  }
  
  const calculateConversionRate = (conversions: number, clicks: number) => {
    if (clicks === 0) return "0.00"
    return ((conversions / clicks) * 100).toFixed(2)
  }
  
  // Feature 9: AI-Enhanced Campaigns with memoization
  const enhancedCampaigns = useMemo(() => 
    (campaigns || []).map(campaign => analyzeCampaignWithAI(campaign)),
    [campaigns, analyzeCampaignWithAI]
  )
  
  // Feature 10: Advanced Filtering with AI
  const filteredCampaigns = useMemo(() => {
    return enhancedCampaigns.filter(campaign => {
      // Status filter
      if (statusFilter !== 'all' && campaign.status !== statusFilter) return false
      
      // Search filter
      if (!smartSearch(campaign)) return false
      
      return true
    })
  }, [enhancedCampaigns, statusFilter, smartSearch])
  
  // Feature 11: Smart Sorting with AI
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'budget':
          return (b.budget || 0) - (a.budget || 0)
        case 'performance':
          return (b.aiScore || 0) - (a.aiScore || 0)
        case 'roi':
          const aROI = parseFloat(calculateROI(a.analytics?.revenue || 0, a.budget || 0))
          const bROI = parseFloat(calculateROI(b.analytics?.revenue || 0, b.budget || 0))
          return bROI - aROI
        case 'health':
          return (b.healthScore || 0) - (a.healthScore || 0)
        default:
          return 0
      }
    })
  }, [filteredCampaigns, sortBy])
  
  // Feature 12: Group by Status
  const groupedByStatus = useMemo(() => {
    return {
      active: sortedCampaigns.filter(c => c.status === 'ACTIVE'),
      paused: sortedCampaigns.filter(c => c.status === 'PAUSED'),
      completed: sortedCampaigns.filter(c => c.status === 'COMPLETED'),
      draft: sortedCampaigns.filter(c => c.status === 'DRAFT')
    }
  }, [sortedCampaigns])
  
  // Feature 13: Group by Performance
  const groupedByPerformance = useMemo(() => {
    return {
      excellent: sortedCampaigns.filter(c => c.aiScore && c.aiScore >= 75),
      good: sortedCampaigns.filter(c => c.aiScore && c.aiScore >= 50 && c.aiScore < 75),
      poor: sortedCampaigns.filter(c => c.aiScore && c.aiScore < 50)
    }
  }, [sortedCampaigns])
  
  // Feature 14: Advanced Statistics with AI
  const stats = useMemo(() => ({
    total: enhancedCampaigns.length,
    active: enhancedCampaigns.filter(c => c.status === 'ACTIVE').length,
    paused: enhancedCampaigns.filter(c => c.status === 'PAUSED').length,
    completed: enhancedCampaigns.filter(c => c.status === 'COMPLETED').length,
    totalBudget: enhancedCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
    totalRevenue: enhancedCampaigns.reduce((sum, c) => sum + (c.analytics?.revenue || 0), 0),
    totalClicks: enhancedCampaigns.reduce((sum, c) => sum + (c.analytics?.clicks || 0), 0),
    totalConversions: enhancedCampaigns.reduce((sum, c) => sum + (c.analytics?.conversions || 0), 0),
    avgAIScore: enhancedCampaigns.reduce((sum, c) => sum + (c.aiScore || 0), 0) / (enhancedCampaigns.length || 1),
    avgHealthScore: enhancedCampaigns.reduce((sum, c) => sum + (c.healthScore || 0), 0) / (enhancedCampaigns.length || 1),
    highRisk: enhancedCampaigns.filter(c => c.riskLevel === 'high').length,
    favorites: favoriteIds.size,
    bookmarked: bookmarkedIds.size,
  }), [enhancedCampaigns, favoriteIds.size, bookmarkedIds.size])
  
  // Feature 15: Performance Trends
  const performanceTrends = useMemo(() => {
    const trending = enhancedCampaigns.filter(c => c.trend === 'up').length
    const declining = enhancedCampaigns.filter(c => c.trend === 'down').length
    const stable = enhancedCampaigns.filter(c => c.trend === 'stable').length
    return { trending, declining, stable }
  }, [enhancedCampaigns])
  
  // Feature 16: Auto-Optimization Suggestions
  useEffect(() => {
    if (autoOptimize && enhancedCampaigns.length > 0) {
      const poorPerformers = enhancedCampaigns.filter(c => c.aiScore && c.aiScore < 50)
      if (poorPerformers.length > 0) {
        toast({
          title: "اقتراح تحسين تلقائي",
          description: `${poorPerformers.length} حملة تحتاج لتحسين`,
        })
      }
    }
  }, [autoOptimize, enhancedCampaigns, toast])
  
  // Feature 17: Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault()
            handleRefresh()
            break
          case 'f':
            e.preventDefault()
            document.getElementById('search-input')?.focus()
            break
          case 'a':
            e.preventDefault()
            selectAll()
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleRefresh, selectAll])
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 text-white">نشط</Badge>
      case 'PAUSED':
        return <Badge className="bg-yellow-500 text-white">متوقف</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-500 text-white">مكتمل</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">مسودة</Badge>
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'PAUSED': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }
  
  const getPerformanceIndicator = (clicks: number, impressions: number) => {
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
    if (ctr >= 5) return { label: "ممتاز", color: "text-green-500", icon: TrendingUp }
    if (ctr >= 3) return { label: "جيد", color: "text-blue-500", icon: TrendingUp }
    if (ctr >= 1) return { label: "متوسط", color: "text-yellow-500", icon: Activity }
    return { label: "ضعيف", color: "text-red-500", icon: TrendingDown }
  }
  
  // Feature 18: Risk Level Indicator
  const getRiskBadge = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low':
        return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"><Shield className="w-3 h-3 mr-1" />منخفض</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"><AlertCircle className="w-3 h-3 mr-1" />متوسط</Badge>
      case 'high':
        return <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"><Flame className="w-3 h-3 mr-1" />عالي</Badge>
      default:
        return null
    }
  }
  
  // Feature 19: Trend Indicator
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }
  
  // Feature 20: Health Score Color
  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-blue-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  if (isError) {
    return (
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle>خطأ في تحميل الحملات</CardTitle>
          <CardDescription>{error?.message || 'فشل في تحميل الحملات الإعلانية'}</CardDescription>
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
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        {/* Main Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: realtimeEnabled ? 360 : 0 }}
              transition={{ duration: 2, repeat: realtimeEnabled ? Infinity : 0, ease: "linear" }}
            >
              <Rocket className="w-6 h-6 text-purple-500" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2">
                الحملات الذكية
                {realtimeEnabled && (
                  <Badge className="bg-green-500 text-white animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    مباشر
                  </Badge>
                )}
                {showAIAnalysis && (
                  <Badge className="gradient-purple text-white border-0">
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>نظام إدارة حملات ذكي مدعوم بالذكاء الاصطناعي ({sortedCampaigns.length})</CardDescription>
            </div>
          </div>
          
          {/* Top Actions */}
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                    className="glass-morphism border-white/20"
                  >
                    <Brain className={`w-4 h-4 ${showAIAnalysis ? 'text-purple-500' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحليل AI</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportToCSV}
                    className="glass-morphism border-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تصدير CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className={comparisonMode ? 'bg-purple-500/20 border-purple-500' : 'glass-morphism border-white/20'}
                  >
                    <GitCompare className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>وضع المقارنة</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="glass-morphism border-white/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحديث (Ctrl+R)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleRealtime}
                    className={realtimeEnabled ? 'bg-green-500/20 border-green-500' : 'glass-morphism border-white/20'}
                  >
                    {realtimeEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{realtimeEnabled ? 'إيقاف' : 'تفعيل'} التحديث التلقائي</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                    className="glass-morphism border-white/20"
                  >
                    {isConnected ? (
                      <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isConnected ? 'متصل' : 'غير متصل'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Advanced Statistics Dashboard - 8 Cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-purple-600">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">الإجمالي</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-green-600">{stats.active}</p>
            <p className="text-[10px] text-muted-foreground">نشط</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-blue-600">${(stats.totalBudget / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-muted-foreground">الميزانية</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-orange-600">{(stats.totalClicks / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-muted-foreground">النقرات</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-emerald-600">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-muted-foreground">الإيرادات</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-cyan-600">{stats.avgAIScore.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">AI Score</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-red-600">{stats.highRisk}</p>
            <p className="text-[10px] text-muted-foreground">عالي المخاطر</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg glass-morphism border border-white/10 text-center">
            <p className="text-xl font-bold text-yellow-600">{stats.favorites}</p>
            <p className="text-[10px] text-muted-foreground">المفضلة</p>
          </motion.div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-input"
              placeholder="بحث في الحملات... (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-morphism border-white/20"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] glass-morphism border-white/20">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="ACTIVE">نشط</SelectItem>
              <SelectItem value="PAUSED">متوقف</SelectItem>
              <SelectItem value="COMPLETED">مكتمل</SelectItem>
              <SelectItem value="DRAFT">مسودة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px] glass-morphism border-white/20">
              <BarChart3 className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">الأحدث</SelectItem>
              <SelectItem value="budget">الميزانية</SelectItem>
              <SelectItem value="performance">AI Score</SelectItem>
              <SelectItem value="roi">ROI</SelectItem>
              <SelectItem value="health">الصحة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* View Mode and Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg glass-morphism border border-white/10">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 w-7 p-0"
              >
                <Layers className="w-3 h-3" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7 w-7 p-0"
              >
                <BarChart3 className="w-3 h-3" />
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="h-7 w-7 p-0"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
            
            {selectedCampaigns.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 text-white">
                  {selectedCampaigns.size} محدد
                </Badge>
                <Button variant="outline" size="sm" onClick={bulkPause} className="h-7 text-xs">
                  <Pause className="w-3 h-3 mr-1" />
                  إيقاف
                </Button>
                <Button variant="outline" size="sm" onClick={bulkDelete} className="h-7 text-xs text-red-500">
                  <Trash2 className="w-3 h-3 mr-1" />
                  حذف
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll} className="h-7 text-xs">
                  إلغاء
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-optimize" className="text-xs">تحسين تلقائي</Label>
              <Switch
                id="auto-optimize"
                checked={autoOptimize}
                onCheckedChange={setAutoOptimize}
              />
            </div>
            
            {sortedCampaigns.length > 0 && (
              <Button variant="link" size="sm" onClick={selectAll} className="text-xs h-auto p-0">
                تحديد الكل (Ctrl+A)
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد حملات</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => router.push('/create-campaign')}
            >
              إنشاء حملة جديدة
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedCampaigns.map((campaign, index) => {
                const clicks = campaign.analytics?.clicks || 0
                const impressions = campaign.analytics?.impressions || 0
                const conversions = campaign.analytics?.conversions || 0
                const revenue = campaign.analytics?.revenue || 0
                const budget = campaign.budget || 0
                
                const ctr = calculateCTR(clicks, impressions)
                const roi = calculateROI(revenue, budget)
                const conversionRate = calculateConversionRate(conversions, clicks)
                const performance = getPerformanceIndicator(clicks, impressions)
                const PerformanceIcon = performance.icon
                
                const isSelected = selectedCampaigns.has(campaign.id)
                const isExpanded = expandedId === campaign.id
                
                return (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className={`relative p-4 border rounded-xl glass-morphism transition-all group ${
                      isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 hover:border-purple-500/30'
                    } ${campaign.isFavorite ? 'bg-gradient-to-br from-yellow-500/5 to-orange-500/5' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Indicator */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-lg ${getStatusColor(campaign.status)} flex items-center justify-center`}>
                          {campaign.status === 'ACTIVE' ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : campaign.status === 'PAUSED' ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Clock className="w-6 h-6 text-white" />
                          )}
                        </div>
                        {campaign.status === 'ACTIVE' && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                          />
                        )}
                      </div>
                      
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCampaign(campaign.id)}
                          className="w-4 h-4 rounded border-2 cursor-pointer"
                        />
                      </div>
                      
                      {/* Top Right Actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => toggleFavorite(campaign.id)}
                              >
                                <Heart className={`w-3 h-3 ${campaign.isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>المفضلة</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => toggleBookmark(campaign.id)}
                              >
                                <Bookmark className={`w-3 h-3 ${campaign.isBookmarked ? 'text-blue-500 fill-blue-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>حفظ</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 
                                className="font-semibold text-base group-hover:text-purple-500 transition-colors cursor-pointer"
                                onClick={() => handleView(campaign.id)}
                              >
                                {campaign.name}
                              </h3>
                              {getTrendIcon(campaign.trend)}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {getStatusBadge(campaign.status)}
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {campaign._count?.ads || 0} إعلان
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${performance.color}`}>
                                <PerformanceIcon className="w-3 h-3 mr-1" />
                                {performance.label}
                              </Badge>
                              {getRiskBadge(campaign.riskLevel)}
                            </div>
                          </div>
                          
                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(campaign.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(campaign.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyCampaign(campaign)}>
                                <Copy className="w-4 h-4 mr-2" />
                                نسخ
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareCampaign(campaign)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                مشاركة
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {campaign.status === 'ACTIVE' ? (
                                <DropdownMenuItem onClick={() => handlePause(campaign.id)}>
                                  <Pause className="w-4 h-4 mr-2" />
                                  إيقاف مؤقت
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleResume(campaign.id)}>
                                  <Play className="w-4 h-4 mr-2" />
                                  استئناف
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(campaign.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* AI Analysis Section */}
                        {showAIAnalysis && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-500" />
                              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">تحليل AI</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              {/* AI Score */}
                              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <p className={`text-2xl font-bold ${getHealthScoreColor(campaign.aiScore)}`}>
                                  {campaign.aiScore}
                                </p>
                                <p className="text-[10px] text-muted-foreground">AI Score</p>
                              </div>
                              
                              {/* Health Score */}
                              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <p className={`text-2xl font-bold ${getHealthScoreColor(campaign.healthScore)}`}>
                                  {campaign.healthScore}
                                </p>
                                <p className="text-[10px] text-muted-foreground">الصحة</p>
                              </div>
                              
                              {/* Predicted ROI */}
                              <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <p className={`text-2xl font-bold ${
                                  (campaign.predictedROI || 0) > 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {campaign.predictedROI}%
                                </p>
                                <p className="text-[10px] text-muted-foreground">ROI المتوقع</p>
                              </div>
                            </div>
                            
                            {/* Optimization Suggestion */}
                            <div className="mt-2 p-2 rounded-lg bg-white/30 dark:bg-black/10">
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                💡 {campaign.optimization}
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <MousePointerClick className="w-3 h-3" />
                              النقرات
                            </div>
                            <p className="text-lg font-bold">{clicks.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">CTR: {ctr}%</p>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Eye className="w-3 h-3" />
                              الإظهارات
                            </div>
                            <p className="text-lg font-bold">{(impressions / 1000).toFixed(1)}K</p>
                            <p className="text-xs text-muted-foreground">مشاهدة</p>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Target className="w-3 h-3" />
                              التحويلات
                            </div>
                            <p className="text-lg font-bold">{conversions}</p>
                            <p className="text-xs text-muted-foreground">{conversionRate}%</p>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <DollarSign className="w-3 h-3" />
                              الإيرادات
                            </div>
                            <p className="text-lg font-bold">${revenue.toLocaleString()}</p>
                            <p className={`text-xs font-semibold ${
                              parseFloat(roi) > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              ROI: {roi}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Budget Progress */}
                        {budget > 0 && (
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">الميزانية المستخدمة</span>
                              <span className="font-medium">${revenue.toLocaleString()} / ${budget.toLocaleString()}</span>
                            </div>
                            <Progress value={(revenue / budget) * 100} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}