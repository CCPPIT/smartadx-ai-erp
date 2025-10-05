import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { initializeWebSocketServer, startSimulatedUpdates } from './src/lib/websocket-server'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url ?? '/', true)
    
    handle(req, res, parsedUrl)
  }).on('error', (err) => {
    console.error('HTTP server error:', err)
  })

  try {
    // Initialize WebSocket server
    const realtimeServer = initializeWebSocketServer(server)
    
    // Start simulated updates for demonstration
    startSimulatedUpdates()

    const port = process.env.PORT || 3000
    server.listen(port as number, () => {
      console.log(`> Ready on http://localhost:${port}`)
    }).on('error', (err) => {
      console.error('Server listen error:', err)
    })
  } catch (error) {
    console.error('Failed to initialize WebSocket server:', error)
  }
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err)
  process.exit(1)
})