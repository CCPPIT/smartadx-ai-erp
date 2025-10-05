import { WebSocketServer } from 'ws'
import { prisma } from './prisma'
import { Server } from 'http'

// Define interfaces for message types
interface WebSocketMessage {
  type: string
  [key: string]: string | number | boolean | object | null | undefined
}

interface SubscriptionMessage extends WebSocketMessage {
  channel: string
}

interface CampaignUpdateMessage extends WebSocketMessage {
  campaignId: string
  data: Record<string, unknown>
}

interface AnalyticsUpdateMessage extends WebSocketMessage {
  campaignId: string
  data: Record<string, unknown>
}

class WebSocketManager {
  private wss: WebSocketServer | null = null
  private clients: Set<WebSocket> = new Set()

  init(server: Server) {
    this.wss = new WebSocketServer({ server })
    
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws)
      
      ws.addEventListener('message', (event: MessageEvent) => {
        // Handle incoming messages
        this.handleMessage(ws, event.data as string)
      })
      
      ws.addEventListener('close', () => {
        this.clients.delete(ws)
      })
      
      // Send a welcome message
      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to real-time updates' }))
    })
  }
  
  private async handleMessage(ws: WebSocket, message: string) {
    try {
      const data: WebSocketMessage = JSON.parse(message)
      
      switch (data.type) {
        case 'subscribe':
          // Handle subscription requests
          this.handleSubscription(ws, data as SubscriptionMessage)
          break
        case 'unsubscribe':
          // Handle unsubscription requests
          this.handleUnsubscription(ws, data as SubscriptionMessage)
          break
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }))
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
    }
  }
  
  private handleSubscription(ws: WebSocket, data: SubscriptionMessage) {
    // Handle subscription logic
    ws.send(JSON.stringify({ type: 'subscribed', channel: data.channel }))
  }
  
  private handleUnsubscription(ws: WebSocket, data: SubscriptionMessage) {
    // Handle unsubscription logic
    ws.send(JSON.stringify({ type: 'unsubscribed', channel: data.channel }))
  }
  
  // Broadcast message to all connected clients
  broadcast(message: WebSocketMessage) {
    const messageString = JSON.stringify(message)
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString)
      }
    })
  }
  
  // Send message to specific client
  sendToClient(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }
  
  // Send real-time campaign update
  sendCampaignUpdate(campaignId: string, update: Record<string, unknown>) {
    const message: CampaignUpdateMessage = {
      type: 'campaign_update',
      campaignId,
      data: update
    }
    this.broadcast(message)
  }
  
  // Send real-time analytics update
  sendAnalyticsUpdate(campaignId: string, update: Record<string, unknown>) {
    const message: AnalyticsUpdateMessage = {
      type: 'analytics_update',
      campaignId,
      data: update
    }
    this.broadcast(message)
  }
}

export const websocketManager = new WebSocketManager()