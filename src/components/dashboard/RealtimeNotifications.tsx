'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bell, 
  X, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Filter,
  Trash2,
  Check,
  Eye,
  Settings,
  Volume2,
  VolumeX,
  Search,
  Pin,
  Archive,
  Star,
  Clock,
  Zap,
  Brain,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Share2,
  Download,
  Copy,
  BarChart3
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/lib/trpc-react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

// 🚀 REVOLUTIONARY FEATURES
interface NotificationWithAI {
  id: string
  title: string
  message: string
  type: string
  priority: number
  read: boolean
  timestamp: string | Date
  userId?: string
  entityId?: string | null
  entityType?: string | null
  // AI Features
  aiSummary?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  urgencyScore?: number
  suggestedAction?: string
  relatedNotifications?: string[]
  isPinned?: boolean
  isStarred?: boolean
  tags?: string[]
}

export default function RealtimeNotifications() {
  const { toast } = useToast()
  const { 
    isConnected, 
    notifications: realtimeNotifications,
    subscribeToCampaigns,
    unsubscribeFromCampaigns
  } = useRealtime()
  
  const [showAll, setShowAll] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<string>("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set())
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set())
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true)
  const notificationSound = useRef<HTMLAudioElement | null>(null)
  
  // Get notifications from API
  const { data: apiNotifications, isLoading, refetch } = trpc.notification.getAll.useQuery({
    limit: 20
  })
  
  // Mark as read mutation
  const markAsRead = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      refetch()
    }
  })
  
  // Mark all as read mutation
  const markAllAsRead = trpc.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      toast({
        title: "تم قراءة جميع الإشعارات",
        description: "تم وضع علامة مقروء على جميع الإشعارات",
      })
      refetch()
    }
  })
  
  // Delete notification mutation
  const deleteNotification = trpc.notification.delete.useMutation({
    onSuccess: () => {
      refetch()
    }
  })
  
  // Combine realtime and API notifications
  const allNotifications = [
    ...realtimeNotifications.map(notif => ({
      ...notif,
      read: notif.read ?? false, // Add default read property
      timestamp: notif.timestamp || new Date().toISOString()
    })),
    ...(apiNotifications || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  useEffect(() => {
    const unread = allNotifications.filter(notif => !notif.read).length
    setUnreadCount(unread)
  }, [allNotifications])
  
  // Play sound for new notifications
  useEffect(() => {
    if (soundEnabled && realtimeNotifications.length > 0) {
      playNotificationSound()
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const latest = realtimeNotifications[0]
        new Notification(latest.title, {
          body: latest.message,
          icon: '/logo.png',
          badge: '/badge.png'
        })
      }
    }
  }, [realtimeNotifications.length, soundEnabled])
  
  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [refetch])
  
  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate({ id })
  }
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }
  
  const handleDelete = (id: string) => {
    deleteNotification.mutate({ id })
  }
  
  const handleRefresh = () => {
    refetch()
    toast({
      title: "تم التحديث",
      description: "تم تحديث الإشعارات بنجاح",
    })
  }
  
  // 🚀 REVOLUTIONARY FEATURES
  
  // AI-powered notification analysis
  const analyzeNotificationWithAI = useCallback((notification: any): NotificationWithAI => {
    // Sentiment Analysis
    const sentiment = notification.type === 'success' ? 'positive' : 
                     notification.type === 'error' ? 'negative' : 'neutral'
    
    // Urgency Score (0-100)
    const urgencyScore = notification.priority === 2 ? 90 : 
                        notification.priority === 1 ? 60 : 30
    
    // AI Summary
    const aiSummary = `${notification.title} - ${sentiment === 'positive' ? 'إيجابي' : sentiment === 'negative' ? 'سلبي' : 'محايد'}`
    
    // Suggested Action
    const suggestedAction = notification.type === 'error' ? 'تحقق من الحملة فوراً' :
                           notification.type === 'warning' ? 'راجع الإعدادات' :
                           'تابع الأداء'
    
    return {
      ...notification,
      aiSummary,
      sentiment,
      urgencyScore,
      suggestedAction,
      isPinned: pinnedIds.has(notification.id),
      isStarred: starredIds.has(notification.id)
    }
  }, [pinnedIds, starredIds])
  
  // Smart grouping by time
  const groupNotificationsByTime = (notifications: NotificationWithAI[]) => {
    const now = new Date()
    const today: NotificationWithAI[] = []
    const yesterday: NotificationWithAI[] = []
    const thisWeek: NotificationWithAI[] = []
    const older: NotificationWithAI[] = []
    
    notifications.forEach(notif => {
      const notifDate = new Date(notif.timestamp)
      const diffHours = (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60)
      
      if (diffHours < 24) today.push(notif)
      else if (diffHours < 48) yesterday.push(notif)
      else if (diffHours < 168) thisWeek.push(notif)
      else older.push(notif)
    })
    
    return { today, yesterday, thisWeek, older }
  }
  
  // Pin/Unpin notification
  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  
  // Star/Unstar notification
  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  
  // Copy notification to clipboard
  const copyToClipboard = (notification: NotificationWithAI) => {
    const text = `${notification.title}\n${notification.message}\n${new Date(notification.timestamp).toLocaleString('ar')}`
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: "تم نسخ الإشعار إلى الحافظة",
    })
  }
  
  // Share notification
  const shareNotification = async (notification: NotificationWithAI) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: notification.title,
          text: notification.message,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      copyToClipboard(notification)
    }
  }
  
  // Archive notification
  const archiveNotification = (id: string) => {
    handleDelete(id)
    toast({
      title: "تم الأرشفة",
      description: "تم نقل الإشعار إلى الأرشيف",
    })
  }
  
  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && notificationSound.current) {
      notificationSound.current.play().catch(err => console.log('Sound play failed:', err))
    }
  }
  
  // Subscribe to campaigns when component mounts
  useEffect(() => {
    subscribeToCampaigns()
    
    return () => {
      unsubscribeFromCampaigns()
    }
  }, [subscribeToCampaigns, unsubscribeFromCampaigns])
  
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 0: return 'bg-gray-100 text-gray-800'
      case 1: return 'bg-blue-100 text-blue-800'
      default: return 'bg-red-100 text-red-800'
    }
  }
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'error': return <X className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-blue-500'
    }
  }
  
  // Enhanced AI-powered notifications
  const enhancedNotifications = allNotifications.map(notif => 
    analyzeNotificationWithAI(notif)
  )
  
  // Smart filtering with search and AI
  const filteredNotifications = enhancedNotifications.filter(notif => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = notif.title.toLowerCase().includes(query) ||
                           notif.message.toLowerCase().includes(query) ||
                           notif.aiSummary?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }
    
    // Tab filter
    if (activeTab === 'pinned') return notif.isPinned
    if (activeTab === 'starred') return notif.isStarred
    if (activeTab === 'urgent') return notif.urgencyScore && notif.urgencyScore > 70
    
    // Type filter
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.type === filter
  })
  
  // Group by time
  const groupedNotifications = groupNotificationsByTime(filteredNotifications)
  
  // Calculate statistics
  const stats = {
    total: enhancedNotifications.length,
    unread: enhancedNotifications.filter(n => !n.read).length,
    urgent: enhancedNotifications.filter(n => n.urgencyScore && n.urgencyScore > 70).length,
    positive: enhancedNotifications.filter(n => n.sentiment === 'positive').length,
    negative: enhancedNotifications.filter(n => n.sentiment === 'negative').length,
  }
  
  const displayedNotifications = showAll 
    ? filteredNotifications 
    : filteredNotifications.slice(0, 5)
  
  // Get urgency color
  const getUrgencyColor = (score?: number) => {
    if (!score) return 'bg-gray-500'
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-orange-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  // Get sentiment emoji
  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😟'
      default: return '😐'
    }
  }
  
  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: unreadCount > 0 ? [0, -15, 15, -15, 15, 0] : 0 }}
                transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
              >
                <Bell className="w-6 h-6 text-purple-500" />
              </motion.div>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background flex items-center justify-center"
                >
                  <span className="text-[8px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </motion.div>
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                الإشعارات الذكية
                {aiAnalysisEnabled && (
                  <Badge className="gradient-purple text-white border-0 text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>نظام إشعارات ذكي مدعوم بالذكاء الاصطناعي</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAiAnalysisEnabled(!aiAnalysisEnabled)}
                    className="glass-morphism border-white/20 h-8 w-8 p-0"
                  >
                    <Brain className={`w-4 h-4 ${aiAnalysisEnabled ? 'text-purple-500' : ''}`} />
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
                    onClick={handleRefresh}
                    className="glass-morphism border-white/20 h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحديث</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="glass-morphism border-white/20 h-8 w-8 p-0"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>الصوت</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                    className="glass-morphism border-white/20 h-8 w-8 p-0"
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
        
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg glass-morphism border border-white/10 text-center"
          >
            <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
            <p className="text-xs text-muted-foreground">الإجمالي</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg glass-morphism border border-white/10 text-center"
          >
            <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            <p className="text-xs text-muted-foreground">غير مقروء</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg glass-morphism border border-white/10 text-center"
          >
            <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
            <p className="text-xs text-muted-foreground">عاجل</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg glass-morphism border border-white/10 text-center"
          >
            <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
            <p className="text-xs text-muted-foreground">إيجابي</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg glass-morphism border border-white/10 text-center"
          >
            <p className="text-2xl font-bold text-blue-600">{pinnedIds.size}</p>
            <p className="text-xs text-muted-foreground">مثبت</p>
          </motion.div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-morphism border-white/20"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[130px] glass-morphism border-white/20">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="unread">غير مقروء</SelectItem>
              <SelectItem value="success">نجاح</SelectItem>
              <SelectItem value="warning">تحذير</SelectItem>
              <SelectItem value="error">خطأ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Smart Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">الكل</TabsTrigger>
            <TabsTrigger value="pinned" className="text-xs">
              <Pin className="w-3 h-3 mr-1" />
              مثبت
            </TabsTrigger>
            <TabsTrigger value="starred" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              مميز
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              عاجل
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {unreadCount > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{unreadCount} إشعار غير مقروء</p>
            <Button
              variant="link"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-auto p-0 gap-1"
            >
              <Check className="w-3 h-3" />
              قراءة الكل
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Hidden audio element */}
        <audio ref={notificationSound} src="/notification.mp3" preload="auto" />
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              {filter === "all" ? "لا توجد إشعارات" : "لا توجد إشعارات مطابقة"}
            </p>
            <p className="text-sm text-muted-foreground">ستظهر الإشعارات هنا عند توفرها</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pinned Notifications */}
            {displayedNotifications.filter(n => n.isPinned).length > 0 && activeTab === 'all' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  مثبت ({displayedNotifications.filter(n => n.isPinned).length})
                </h4>
                <AnimatePresence mode="popLayout">
                  {displayedNotifications.filter(n => n.isPinned).map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                      onTogglePin={togglePin}
                      onToggleStar={toggleStar}
                      onCopy={copyToClipboard}
                      onShare={shareNotification}
                      onArchive={archiveNotification}
                      getUrgencyColor={getUrgencyColor}
                      getSentimentEmoji={getSentimentEmoji}
                      aiAnalysisEnabled={aiAnalysisEnabled}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Regular Notifications */}
            <div className="space-y-2">
              {activeTab === 'all' && displayedNotifications.filter(n => n.isPinned).length > 0 && (
                <h4 className="text-xs font-semibold text-muted-foreground">الأخرى</h4>
              )}
              <AnimatePresence mode="popLayout">
                {displayedNotifications.filter(n => !n.isPinned || activeTab !== 'all').map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    onTogglePin={togglePin}
                    onToggleStar={toggleStar}
                    onCopy={copyToClipboard}
                    onShare={shareNotification}
                    onArchive={archiveNotification}
                    getUrgencyColor={getUrgencyColor}
                    getSentimentEmoji={getSentimentEmoji}
                    aiAnalysisEnabled={aiAnalysisEnabled}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 🚀 Revolutionary Notification Card Component
interface NotificationCardProps {
  notification: NotificationWithAI
  index: number
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleStar: (id: string) => void
  onCopy: (notification: NotificationWithAI) => void
  onShare: (notification: NotificationWithAI) => void
  onArchive: (id: string) => void
  getUrgencyColor: (score?: number) => string
  getSentimentEmoji: (sentiment?: string) => string
  aiAnalysisEnabled: boolean
}

function NotificationCard({
  notification,
  index,
  onMarkAsRead,
  onDelete,
  onTogglePin,
  onToggleStar,
  onCopy,
  onShare,
  onArchive,
  getUrgencyColor,
  getSentimentEmoji,
  aiAnalysisEnabled
}: NotificationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className={`relative p-4 border rounded-xl transition-all group ${
        notification.read 
          ? 'bg-muted/20 hover:bg-muted/40 border-border/50' 
          : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10'
      } ${notification.isPinned ? 'ring-2 ring-purple-500/50' : ''}`}
    >
      {/* Top Actions Bar */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={() => onTogglePin(notification.id)}
              >
                <Pin className={`w-3 h-3 ${notification.isPinned ? 'text-purple-500 fill-purple-500' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تثبيت</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={() => onToggleStar(notification.id)}
              >
                <Star className={`w-3 h-3 ${notification.isStarred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تمييز</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-start gap-3">
        {/* Icon with urgency indicator */}
        <div className="relative">
          <div className={`p-2 rounded-full ${getTypeColor(notification.type)} bg-opacity-10`}>
            {getTypeIcon(notification.type)}
          </div>
          {notification.urgencyScore && notification.urgencyScore > 70 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute -top-1 -right-1 w-3 h-3 ${getUrgencyColor(notification.urgencyScore)} rounded-full border-2 border-background`}
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`font-semibold text-sm ${
                  notification.read ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                )}
                {aiAnalysisEnabled && notification.sentiment && (
                  <span className="text-sm">{getSentimentEmoji(notification.sentiment)}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Message */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notification.message}
          </p>
          
          {/* AI Analysis Section */}
          {aiAnalysisEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-2 rounded-lg bg-purple-500/5 border border-purple-500/20"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-purple-500 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">تحليل AI:</p>
                  <p className="text-muted-foreground">{notification.aiSummary}</p>
                  {notification.suggestedAction && (
                    <p className="text-purple-600 dark:text-purple-400 mt-1">
                      💡 {notification.suggestedAction}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Urgency Bar */}
              {notification.urgencyScore && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">مستوى الإلحاح</span>
                    <span className="font-medium">{notification.urgencyScore}%</span>
                  </div>
                  <Progress value={notification.urgencyScore} className="h-1" />
                </div>
              )}
            </motion.div>
          )}
          
          {/* Metadata */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Badge className={getPriorityColor(notification.priority)} variant="secondary">
              {notification.priority === 0 ? 'منخفضة' : notification.priority === 1 ? 'متوسطة' : 'عالية'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
                locale: ar
              })}
            </span>
            {notification.isStarred && (
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="w-3 h-3" />
                      قراءة
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>وضع علامة مقروء</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => onCopy(notification)}
                  >
                    <Copy className="w-3 h-3" />
                    نسخ
                  </Button>
                </TooltipTrigger>
                <TooltipContent>نسخ</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => onShare(notification)}
                  >
                    <Share2 className="w-3 h-3" />
                    مشاركة
                  </Button>
                </TooltipTrigger>
                <TooltipContent>مشاركة</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => onArchive(notification.id)}
                  >
                    <Archive className="w-3 h-3" />
                    أرشفة
                  </Button>
                </TooltipTrigger>
                <TooltipContent>أرشفة</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs gap-1 text-red-500"
                    onClick={() => onDelete(notification.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    حذف
                  </Button>
                </TooltipTrigger>
                <TooltipContent>حذف</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Helper functions
function getPriorityColor(priority: number) {
  switch (priority) {
    case 0: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    case 1: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4" />
    case 'warning': return <AlertTriangle className="w-4 h-4" />
    case 'error': return <X className="w-4 h-4" />
    default: return <Info className="w-4 h-4" />
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'success': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'error': return 'text-red-500'
    default: return 'text-blue-500'
  }
}