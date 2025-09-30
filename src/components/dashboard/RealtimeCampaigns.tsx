'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-react'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Play, Pause, Eye, Wifi, WifiOff } from 'lucide-react'

export default function RealtimeCampaigns() {
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  const { data: campaigns, isLoading, refetch } = trpc.campaign.getAll.useQuery()
  const { isConnected, messages, subscribeToCampaigns, unsubscribeFromCampaigns } = useRealtime()
  
  // Simulate real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (realtimeEnabled) {
      interval = setInterval(() => {
        refetch()
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
    refetch()
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>
      case 'PAUSED':
        return <Badge className="bg-yellow-500">Paused</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-500">Completed</Badge>
      default:
        return <Badge className="bg-gray-500">Draft</Badge>
    }
  }
  
  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الحملات الإعلانية</CardTitle>
            <CardDescription>إدارة وتتبع الحملات الإعلانية في الوقت الفعلي</CardDescription>
          </div>
          <div className="flex gap-2">
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns && campaigns.map((campaign: any) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(campaign.status)}
                    <span className="text-sm text-muted-foreground">
                      {campaign.budget ? `${campaign.budget.toFixed(2)} $` : 'غير محددة'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div>النقرات: 0</div>
                    <div>الإظهارات: 0</div>
                    <div>التحويلات: 0</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}