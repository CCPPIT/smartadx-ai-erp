import { WebSocketServer } from 'ws'
import { prisma } from './prisma'

export class RealtimeServer {
  private wss: WebSocketServer | null = null
  private clients: Set<WebSocket> = new Set()

  init(server: import('http').Server) {
    try {
      this.wss = new WebSocketServer({ server })
      
      this.wss.on('connection', (ws: WebSocket, request) => {
        console.log('New WebSocket connection from:', request?.socket?.remoteAddress)
        this.clients.add(ws)
        
        ws.addEventListener('message', (event: MessageEvent) => {
          this.handleMessage(ws, event.data as string)
        })
        
        ws.addEventListener('close', () => {
          console.log('WebSocket connection closed')
          this.clients.delete(ws)
        })
        
        ws.addEventListener('error', (error) => {
          console.error('WebSocket error:', error)
          this.clients.delete(ws)
        })
        
        // Send a welcome message
        ws.send(JSON.stringify({ 
          type: 'connected', 
          message: 'Connected to SmartAdX AI ERP real-time updates' 
        }))
      })
      
      this.wss.on('error', (error) => {
        console.error('WebSocket server error:', error)
      })
      
      console.log('WebSocket server initialized successfully')
    } catch (error) {
      console.error('Failed to initialize WebSocket server:', error)
      throw error
    }
  }
  
  private async handleMessage(ws: WebSocket, message: string) {
    try {
      const data = JSON.parse(message)
      
      switch (data.type) {
        case 'subscribe':
          this.handleSubscription(ws, data)
          break
        case 'unsubscribe':
          this.handleUnsubscription(ws, data)
          break
        default:
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Unknown message type' 
          }))
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }))
    }
  }
  
  private handleSubscription(ws: WebSocket, data: { type: string; channel: string }) {
    try {
      // Handle subscription logic
      ws.send(JSON.stringify({ 
        type: 'subscribed', 
        channel: data.channel,
        message: `Subscribed to ${data.channel}`
      }))
    } catch (error) {
      console.error('Error handling subscription:', error)
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Failed to subscribe' 
      }))
    }
  }
  
  private handleUnsubscription(ws: WebSocket, data: { type: string; channel: string }) {
    try {
      // Handle unsubscription logic
      ws.send(JSON.stringify({ 
        type: 'unsubscribed', 
        channel: data.channel,
        message: `Unsubscribed from ${data.channel}`
      }))
    } catch (error) {
      console.error('Error handling unsubscription:', error)
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Failed to unsubscribe' 
      }))
    }
  }
  
  // Broadcast message to all connected clients
  broadcast(message: { type: string; [key: string]: unknown }) {
    try {
      const messageString = JSON.stringify(message)
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(messageString)
          } catch (sendError) {
            console.error('Error sending message to client:', sendError)
            // Remove client if sending failed
            this.clients.delete(client)
          }
        }
      })
    } catch (error) {
      console.error('Error broadcasting message:', error)
    }
  }
  
  // Send real-time campaign update
  sendCampaignUpdate(campaignId: string, update: { clicks: number; impressions: number; conversions: number; revenue: number }) {
    this.broadcast({
      type: 'campaign_update',
      campaignId,
      data: update
    })
  }
  
  // Send real-time analytics update
  sendAnalyticsUpdate(campaignId: string, update: { metric: string; value: number }) {
    this.broadcast({
      type: 'analytics_update',
      campaignId,
      data: update
    })
  }
  
  // Send real-time client update
  sendClientUpdate(clientId: string, update: { status: string; engagement: number }) {
    this.broadcast({
      type: 'client_update',
      clientId,
      data: update
    })
  }
  
  // Send notification
  sendNotification(notification: { id: string; title: string; message: string; type: string; priority: number; timestamp: string }) {
    this.broadcast({
      type: 'notification',
      data: notification
    })
  }
}