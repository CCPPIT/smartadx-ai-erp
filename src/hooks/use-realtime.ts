'use client'

import { useState, useEffect, useRef } from 'react'

// Define types
type Notification = {
  id: string
  title: string
  message: string
  type: string
  priority: number
  timestamp: string
}

type Message = {
  type: string
  message?: string
  data?: unknown
}

export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null
    const connect = () => {
      try {
        // Check if WebSocket server is available
        const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || `ws://${window.location.hostname}:3001`
        
        // Try to connect, but don't fail if server is not available
        ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          console.log('Connected to real-time server')
          setIsConnected(true)
          setMessages(prev => [...prev, { type: 'system', message: 'Connected to real-time updates' }])
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setMessages(prev => [...prev, data])
            
            // Handle different message types
            switch (data.type) {
              case 'campaign_update':
                console.log('Campaign update received:', data)
                break
              case 'analytics_update':
                console.log('Analytics update received:', data)
                break
              case 'client_update':
                console.log('Client update received:', data)
                break
              case 'notification':
                console.log('Notification received:', data)
                setNotifications(prev => [...prev, data.data])
                break
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.onclose = () => {
          console.log('Disconnected from real-time server')
          setIsConnected(false)
          setMessages(prev => [...prev, { type: 'system', message: 'Disconnected from real-time updates' }])
          
          // Attempt to reconnect after 3 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(connect, 3000)
        }

        ws.onerror = (error) => {
          console.warn('WebSocket connection failed. Real-time features disabled.')
          // Don't show error in production if WebSocket is optional
          if (process.env.NODE_ENV === 'development') {
            console.log('WebSocket server not available. This is normal if you haven\'t started the WebSocket server.')
          }
          // Don't attempt reconnect on error - let onclose handle it
        }
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error)
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        reconnectTimeoutRef.current = setTimeout(connect, 5000)
      }
    }

    // Initial connection
    connect()

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  const sendMessage = (message: { type: string; [key: string]: unknown }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message)
    }
  }

  const subscribeToCampaigns = () => {
    sendMessage({ type: 'subscribe', channel: 'campaigns' })
  }

  const unsubscribeFromCampaigns = () => {
    sendMessage({ type: 'unsubscribe', channel: 'campaigns' })
  }

  return {
    isConnected,
    messages,
    notifications,
    sendMessage,
    subscribeToCampaigns,
    unsubscribeFromCampaigns
  }
}