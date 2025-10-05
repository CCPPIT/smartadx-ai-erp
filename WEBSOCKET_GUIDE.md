# 🔌 WebSocket Real-time Features Guide

## Overview

SmartAdX AI ERP includes WebSocket support for real-time updates. This guide explains how to enable and use real-time features.

---

## 🚀 Quick Start

### Option 1: Disable WebSocket (Default)

WebSocket is **disabled by default** in development mode to prevent errors.

The application works perfectly without WebSocket - you'll just miss real-time updates.

### Option 2: Enable WebSocket

If you want real-time features, follow these steps:

#### Step 1: Update Environment
```env
# .env.local
NODE_ENV=production
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

#### Step 2: Start WebSocket Server
```bash
# In a separate terminal
node server.ts
```

#### Step 3: Start Application
```bash
npm run dev
```

---

## 🔧 Configuration

### Environment Variables

```env
# WebSocket Configuration
WEBSOCKET_PORT=3001
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001

# For production
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-domain.com
```

### Code Configuration

The WebSocket hook automatically:
- ✅ Disables in development by default
- ✅ Handles connection errors gracefully
- ✅ Attempts reconnection on disconnect
- ✅ Provides connection status

---

## 📡 Real-time Features

### 1. Real-time Notifications
```typescript
import { useRealtime } from '@/hooks/use-realtime'

function MyComponent() {
  const { isConnected, notifications } = useRealtime()
  
  return (
    <div>
      {isConnected && <Badge>Live</Badge>}
      {notifications.map(n => (
        <Notification key={n.id} {...n} />
      ))}
    </div>
  )
}
```

### 2. Campaign Updates
```typescript
const { subscribeToCampaigns, unsubscribeFromCampaigns } = useRealtime()

// Subscribe to campaign updates
useEffect(() => {
  subscribeToCampaigns()
  return () => unsubscribeFromCampaigns()
}, [])
```

### 3. Custom Messages
```typescript
const { sendMessage } = useRealtime()

// Send custom message
sendMessage({
  type: 'custom_event',
  data: { foo: 'bar' }
})
```

---

## 🛠️ WebSocket Server

### Current Implementation

The WebSocket server is defined in:
- `src/lib/websocket.ts` - WebSocket manager
- `src/lib/websocket-server.ts` - Server implementation
- `src/lib/realtime-server.ts` - Real-time server
- `server.ts` - Server entry point

### Starting the Server

```bash
# Development
node server.ts

# Or with ts-node
npx ts-node server.ts

# Production (with PM2)
pm2 start server.ts --name websocket-server
```

### Server Features

- ✅ Connection management
- ✅ Message broadcasting
- ✅ Channel subscriptions
- ✅ Error handling
- ✅ Reconnection support

---

## 🔄 Message Types

### Client to Server

```typescript
// Subscribe to channel
{
  type: 'subscribe',
  channel: 'campaigns'
}

// Unsubscribe from channel
{
  type: 'unsubscribe',
  channel: 'campaigns'
}
```

### Server to Client

```typescript
// Connection established
{
  type: 'connected',
  message: 'Connected to real-time updates'
}

// Campaign update
{
  type: 'campaign_update',
  campaignId: 'clx123',
  data: { status: 'ACTIVE' }
}

// Analytics update
{
  type: 'analytics_update',
  campaignId: 'clx123',
  data: { clicks: 1500 }
}

// Notification
{
  type: 'notification',
  data: {
    id: 'notif123',
    title: 'New Campaign',
    message: 'Campaign created',
    type: 'success',
    priority: 1
  }
}

// Error
{
  type: 'error',
  message: 'Error description'
}
```

---

## 🐛 Troubleshooting

### Error: "WebSocket error: {}"

**Cause:** WebSocket server is not running

**Solution 1:** Disable WebSocket (works without it)
```typescript
// Already disabled by default in development
```

**Solution 2:** Start WebSocket server
```bash
node server.ts
```

### Connection Refused

**Cause:** Wrong port or server not running

**Check:**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # Linux/Mac
```

**Fix:**
```bash
# Start server
node server.ts

# Or change port in .env
WEBSOCKET_PORT=3002
```

### CORS Errors

**Cause:** WebSocket server doesn't allow origin

**Fix:** Update server CORS settings
```typescript
// In server.ts or websocket-server.ts
// Add origin validation
```

### Connection Drops

**Cause:** Network issues or server restart

**Solution:** The hook automatically reconnects
- Waits 3 seconds after disconnect
- Retries indefinitely
- Shows connection status

---

## 🚀 Production Deployment

### With Docker

WebSocket is automatically configured in Docker:

```yaml
# docker-compose.yml
services:
  app:
    ports:
      - "3000:3000"
      - "3001:3001"  # WebSocket port
    environment:
      - WEBSOCKET_PORT=3001
```

### With Nginx

```nginx
# nginx.conf
location /ws {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

### With Load Balancer

For multiple instances, use Redis for pub/sub:

```typescript
import { Redis } from 'ioredis'

const redis = new Redis()
const subscriber = new Redis()

subscriber.subscribe('updates')
subscriber.on('message', (channel, message) => {
  websocketManager.broadcast(JSON.parse(message))
})

// Publish updates
redis.publish('updates', JSON.stringify(update))
```

---

## 📊 Monitoring

### Connection Status

```typescript
const { isConnected } = useRealtime()

// Show indicator
{isConnected ? (
  <Badge variant="success">Live</Badge>
) : (
  <Badge variant="secondary">Offline</Badge>
)}
```

### Message Log

```typescript
const { messages } = useRealtime()

// Debug messages
console.log('WebSocket messages:', messages)
```

### Server Logs

```bash
# View server logs
tail -f logs/websocket.log

# Or with Docker
docker-compose logs -f app
```

---

## ⚙️ Advanced Configuration

### Custom Hook

Create your own WebSocket hook:

```typescript
import { useRealtime } from '@/hooks/use-realtime'

export function useCampaignUpdates(campaignId: string) {
  const { messages, sendMessage } = useRealtime()
  
  useEffect(() => {
    sendMessage({
      type: 'subscribe',
      channel: `campaign:${campaignId}`
    })
    
    return () => {
      sendMessage({
        type: 'unsubscribe',
        channel: `campaign:${campaignId}`
      })
    }
  }, [campaignId])
  
  const updates = messages.filter(
    m => m.type === 'campaign_update' && m.campaignId === campaignId
  )
  
  return updates
}
```

### Broadcasting from API

```typescript
// In your API route
import { websocketManager } from '@/lib/websocket'

export async function POST(request: Request) {
  // Update campaign
  const campaign = await prisma.campaign.update({ ... })
  
  // Broadcast update
  websocketManager.sendCampaignUpdate(campaign.id, campaign)
  
  return Response.json(campaign)
}
```

---

## 🎯 Best Practices

1. **Graceful Degradation**
   - App should work without WebSocket
   - Show connection status
   - Fall back to polling if needed

2. **Error Handling**
   - Catch all errors
   - Don't crash on disconnect
   - Provide user feedback

3. **Performance**
   - Limit message frequency
   - Batch updates
   - Use compression

4. **Security**
   - Validate messages
   - Authenticate connections
   - Rate limit messages

---

## 📚 Resources

- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws Library](https://github.com/websockets/ws)
- [Socket.io](https://socket.io/) (alternative)

---

## 🆘 Need Help?

- Check server logs
- Verify port is open
- Test with WebSocket client
- Contact support@smartadx.ai

---

**WebSocket is optional - your app works great without it! 🎉**
