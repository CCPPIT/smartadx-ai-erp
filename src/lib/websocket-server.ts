import { WebSocketServer } from 'ws'
import { RealtimeServer } from './realtime-server'

// Create a singleton instance of the realtime server
let realtimeServer: RealtimeServer | null = null

export function initializeWebSocketServer(server: import('http').Server) {
  if (!realtimeServer) {
    try {
      realtimeServer = new RealtimeServer()
      realtimeServer.init(server)
      console.log('WebSocket server initialized successfully')
    } catch (error) {
      console.error('Failed to initialize WebSocket server:', error)
      realtimeServer = null
    }
  }
  
  return realtimeServer
}

export function getRealtimeServer(): RealtimeServer | null {
  return realtimeServer
}

// Simulate periodic updates for demonstration
export function startSimulatedUpdates() {
  if (!realtimeServer) {
    console.warn('Realtime server not initialized. Skipping simulated updates.')
    return
  }
  
  try {
    // Simulate campaign updates every 10 seconds
    setInterval(() => {
      const campaignId = `campaign-${Math.floor(Math.random() * 100)}`
      const update = {
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 1000),
        conversions: Math.floor(Math.random() * 20),
        revenue: Math.floor(Math.random() * 500)
      }
      
      realtimeServer?.sendCampaignUpdate(campaignId, update)
    }, 10000)
    
    // Simulate analytics updates every 5 seconds
    setInterval(() => {
      const campaignId = `campaign-${Math.floor(Math.random() * 100)}`
      const update = {
        metric: 'performance',
        value: Math.random() * 100
      }
      
      realtimeServer?.sendAnalyticsUpdate(campaignId, update)
    }, 5000)
    
    // Simulate client updates every 15 seconds
    setInterval(() => {
      const clientId = `client-${Math.floor(Math.random() * 50)}`
      const update = {
        status: Math.random() > 0.5 ? 'active' : 'inactive',
        engagement: Math.random() * 100
      }
      
      realtimeServer?.sendClientUpdate(clientId, update)
    }, 15000)
    
    // Simulate notifications every 20 seconds
    setInterval(() => {
      const notification = {
        id: `notif-${Date.now()}`,
        title: 'تحديث تلقائي',
        message: 'هناك تحديثات جديدة في حملاتك الإعلانية',
        type: 'info',
        priority: Math.floor(Math.random() * 3),
        timestamp: new Date().toISOString()
      }
      
      realtimeServer?.sendNotification(notification)
    }, 20000)
    
    console.log('Simulated updates started successfully')
  } catch (error) {
    console.error('Failed to start simulated updates:', error)
  }
}