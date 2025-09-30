import { WebSocketServer } from 'ws'
import { prisma } from './prisma'

export class RealtimeServer {
  private wss: WebSocketServer | null = null
  private clients: Set<WebSocket> = new Set()

  init(server: any) {
    this.wss = new WebSocketServer({ server })
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection')
      this.clients.add(ws)
      
      ws.addEventListener('message', (event: MessageEvent) => {
        this.handleMessage(ws, event.data as string)
      })
      
      ws.addEventListener('close', () => {
        console.log('WebSocket connection closed')
        this.clients.delete(ws)
      })
      
      // Send a welcome message
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'Connected to SmartAdX AI ERP real-time updates' 
      }))
    })
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
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }))
    }
  }
  
  private handleSubscription(ws: WebSocket, data: any) {
    // Handle subscription logic
    ws.send(JSON.stringify({ 
      type: 'subscribed', 
      channel: data.channel,
      message: `Subscribed to ${data.channel}`
    }))
  }
  
  private handleUnsubscription(ws: WebSocket, data: any) {
    // Handle unsubscription logic
    ws.send(JSON.stringify({ 
      type: 'unsubscribed', 
      channel: data.channel,
      message: `Unsubscribed from ${data.channel}`
    }))
  }
  
  // Broadcast message to all connected clients
  broadcast(message: any) {
    const messageString = JSON.stringify(message)
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString)
      }
    })
  }
  
  // Send real-time campaign update
  sendCampaignUpdate(campaignId: string, update: any) {
    this.broadcast({
      type: 'campaign_update',
      campaignId,
      data: update
    })
  }
  
  // Send real-time analytics update
  sendAnalyticsUpdate(campaignId: string, update: any) {
    this.broadcast({
      type: 'analytics_update',
      campaignId,
      data: update
    })
  }
  
  // Send real-time client update
  sendClientUpdate(clientId: string, update: any) {
    this.broadcast({
      type: 'client_update',
      clientId,
      data: update
    })
  }
}