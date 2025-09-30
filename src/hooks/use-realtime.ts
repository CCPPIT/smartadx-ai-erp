'use client'

import { useState, useEffect, useRef } from 'react'

export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:3001') // Adjust port as needed
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
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('Disconnected from real-time server')
      setIsConnected(false)
      setMessages(prev => [...prev, { type: 'system', message: 'Disconnected from real-time updates' }])
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setMessages(prev => [...prev, { type: 'error', message: 'Connection error' }])
    }

    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
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
    sendMessage,
    subscribeToCampaigns,
    unsubscribeFromCampaigns
  }
}