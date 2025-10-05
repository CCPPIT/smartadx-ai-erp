# 👨‍💻 دليل المطور - RealtimeAnalytics

> دليل تقني شامل للمطورين

---

## 📋 نظرة عامة تقنية

### البنية المعمارية

```
┌─────────────────────────────────────────────┐
│           Frontend (React/Next.js)          │
│  ┌─────────────────────────────────────┐   │
│  │  RealtimeAnalytics Component        │   │
│  │  - State Management (useState)      │   │
│  │  - Data Fetching (tRPC)             │   │
│  │  - AI Analysis (useMemo)            │   │
│  │  - Real-time Updates (useEffect)    │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      ↕️ tRPC
┌─────────────────────────────────────────────┐
│           Backend (tRPC/Prisma)             │
│  ┌─────────────────────────────────────┐   │
│  │  Dashboard Router                   │   │
│  │  - getRealtimeAnalytics()           │   │
│  │  - getCampaignComparison()          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      ↕️ Prisma
┌─────────────────────────────────────────────┐
│         Database (PostgreSQL)               │
│  - Analytics Table                          │
│  - Campaign Table                           │
└─────────────────────────────────────────────┘
```

---

## 🔧 التقنيات المستخدمة

### Frontend Stack
```json
{
  "framework": "Next.js 15",
  "language": "TypeScript",
  "ui": "React 18",
  "styling": "TailwindCSS",
  "components": "Shadcn/ui",
  "animations": "Framer Motion",
  "charts": "Recharts 2.15.4",
  "state": "React Hooks",
  "api": "tRPC"
}
```

### Backend Stack
```json
{
  "api": "tRPC 11",
  "orm": "Prisma 6.16.2",
  "validation": "Zod 4.1.11",
  "database": "PostgreSQL",
  "runtime": "Node.js 22.19.0"
}
```

---

## 📊 Data Flow

### 1. Data Fetching
```typescript
// Component
const { data: analyticsData } = trpc.dashboard.getRealtimeAnalytics.useQuery(
  { timeRange, campaignIds },
  { refetchInterval: realtimeEnabled ? 5000 : false }
)

// Router
export const dashboardRouter = router({
  getRealtimeAnalytics: publicProcedure
    .input(z.object({
      timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']),
      campaignIds: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      // Database query
      const analytics = await prisma.analytics.findMany({
        where: { /* filters */ }
      })
      
      // Data processing
      return {
        timeSeriesData: [],
        campaignMetrics: [],
        totals: {},
        stats: {}
      }
    })
})
```

### 2. Data Processing
```typescript
// Group by time intervals
const groupedData = analytics.reduce((acc, item) => {
  const timeKey = item.date.toISOString()
  if (!acc[timeKey]) {
    acc[timeKey] = {
      time: item.date.toLocaleTimeString(),
      clicks: 0,
      impressions: 0,
      conversions: 0,
      revenue: 0
    }
  }
  acc[timeKey].clicks += item.clicks
  acc[timeKey].impressions += item.impressions
  acc[timeKey].conversions += item.conversions
  acc[timeKey].revenue += item.revenue
  return acc
}, {})
```

### 3. AI Analysis
```typescript
const aiInsights = useMemo(() => {
  if (!analyticsData?.stats) return null
  
  const ctr = parseFloat(analyticsData.stats.ctr)
  const convRate = parseFloat(analyticsData.stats.conversionRate)
  
  // Performance evaluation
  let performance = 'ممتاز'
  let color = 'text-green-500'
  let recommendation = 'الأداء ممتاز! استمر على هذا النهج'
  
  if (ctr < 2) {
    performance = 'يحتاج تحسين'
    color = 'text-red-500'
    recommendation = 'معدل النقر منخفض. جرب تحسين الإعلانات'
  } else if (ctr < 4) {
    performance = 'جيد'
    color = 'text-yellow-500'
    recommendation = 'الأداء جيد ولكن يمكن تحسينه'
  }
  
  return { performance, color, recommendation, ctr, convRate }
}, [analyticsData])
```

---

## 🎨 Component Structure

### RealtimeAnalytics.tsx
```typescript
export default function RealtimeAnalytics() {
  // 1. State Management
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  
  // 2. Data Fetching
  const { data: analyticsData, isLoading, refetch } = 
    trpc.dashboard.getRealtimeAnalytics.useQuery(...)
  
  // 3. Real-time Updates
  useEffect(() => {
    if (realtimeEnabled) {
      subscribeToCampaigns()
    } else {
      unsubscribeFromCampaigns()
    }
  }, [realtimeEnabled])
  
  // 4. AI Analysis
  const aiInsights = useMemo(() => { /* ... */ }, [analyticsData])
  
  // 5. Render
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* AI Insights */}
      {/* Stats Cards */}
      {/* Charts */}
      {/* Performance Table */}
    </div>
  )
}
```

---

## 🗄️ Database Schema

### Analytics Table
```prisma
model Analytics {
  id          String   @id @default(cuid())
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  date        DateTime
  impressions Int      @default(0)
  clicks      Int      @default(0)
  conversions Int      @default(0)
  revenue     Float    @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([campaignId])
  @@index([date])
}
```

### Indexes
```sql
-- Performance optimization
CREATE INDEX idx_analytics_campaign ON Analytics(campaignId);
CREATE INDEX idx_analytics_date ON Analytics(date);
CREATE INDEX idx_analytics_campaign_date ON Analytics(campaignId, date);
```

---

## 🔄 Real-time Updates

### Method 1: Polling (Current)
```typescript
const { data } = trpc.dashboard.getRealtimeAnalytics.useQuery(
  { timeRange },
  {
    refetchInterval: realtimeEnabled ? 5000 : false,
    staleTime: 30000,
    cacheTime: 300000
  }
)
```

### Method 2: WebSocket (Optional)
```typescript
// Hook
const { isConnected, subscribeToCampaigns } = useRealtime()

// WebSocket Server
const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString())
    
    if (data.type === 'subscribe') {
      // Send updates
      setInterval(() => {
        ws.send(JSON.stringify({
          type: 'analytics_update',
          data: { /* latest data */ }
        }))
      }, 5000)
    }
  })
})
```

---

## 📈 Performance Optimization

### 1. Memoization
```typescript
// Heavy computations
const aiInsights = useMemo(() => {
  // Complex AI analysis
}, [analyticsData])

const stats = useMemo(() => ({
  totalImpressions: analyticsData?.stats.totalImpressions || 0,
  // ... other stats
}), [analyticsData])
```

### 2. Lazy Loading
```typescript
// Charts
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), {
  loading: () => <Skeleton className="h-80" />
})
```

### 3. Debouncing
```typescript
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    setSearchQuery(value)
  }, 300),
  []
)
```

### 4. Caching
```typescript
// React Query config
{
  staleTime: 30000,      // 30 seconds
  cacheTime: 300000,     // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false
}
```

---

## 🎯 API Endpoints

### getRealtimeAnalytics
```typescript
// Input Schema
const input = z.object({
  timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).optional().default('24h'),
  campaignIds: z.array(z.string()).optional()
})

// Output Schema
type Output = {
  timeSeriesData: AnalyticsDataPoint[]
  campaignMetrics: CampaignMetric[]
  totals: {
    clicks: number
    impressions: number
    conversions: number
    revenue: number
  }
  stats: {
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    totalRevenue: number
    ctr: string
    conversionRate: string
  }
}
```

### getCampaignComparison
```typescript
// Input Schema
const input = z.object({
  campaignIds: z.array(z.string()).min(1).max(5),
  days: z.number().optional().default(7)
})

// Output Schema
type Output = Array<{
  id: string
  name: string
  status: string
  budget: number
  clicks: number
  impressions: number
  conversions: number
  revenue: number
  ctr: string
  roi: string
  timeSeriesData: Array<{
    date: string
    clicks: number
    impressions: number
    conversions: number
    revenue: number
  }>
}>
```

---

## 🧪 Testing

### Unit Tests
```typescript
// Component test
describe('RealtimeAnalytics', () => {
  it('should render stats cards', () => {
    render(<RealtimeAnalytics />)
    expect(screen.getByText('الإظهارات')).toBeInTheDocument()
    expect(screen.getByText('النقرات')).toBeInTheDocument()
  })
  
  it('should calculate AI insights correctly', () => {
    const insights = calculateAIInsights({ ctr: 5 })
    expect(insights.performance).toBe('ممتاز')
  })
})
```

### Integration Tests
```typescript
// API test
describe('getRealtimeAnalytics', () => {
  it('should return analytics data', async () => {
    const result = await caller.dashboard.getRealtimeAnalytics({
      timeRange: '24h'
    })
    
    expect(result).toHaveProperty('timeSeriesData')
    expect(result).toHaveProperty('campaignMetrics')
    expect(result).toHaveProperty('stats')
  })
})
```

---

## 🔐 Security

### 1. Authentication
```typescript
// Protect routes
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } })
})
```

### 2. Input Validation
```typescript
// Zod schemas
const timeRangeSchema = z.enum(['1h', '6h', '24h', '7d', '30d'])
const campaignIdsSchema = z.array(z.string().cuid())

// Validate input
.input(z.object({
  timeRange: timeRangeSchema,
  campaignIds: campaignIdsSchema.optional()
}))
```

### 3. Rate Limiting
```typescript
// Redis-based rate limiting
const rateLimit = new RateLimiter({
  windowMs: 60000,  // 1 minute
  max: 100          // 100 requests
})

// Apply to routes
.use(rateLimit.middleware)
```

---

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# WebSocket (optional)
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:3001"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api/trpc"
```

### Build & Deploy
```bash
# Build
npm run build

# Start production
npm run start

# Docker
docker-compose up -d
```

---

## 📝 Code Style

### TypeScript
```typescript
// Use strict types
type AnalyticsDataPoint = {
  time: string
  clicks: number
  impressions: number
  conversions: number
  revenue: number
}

// Avoid any
const data: AnalyticsDataPoint[] = []  // ✅
const data: any[] = []                 // ❌
```

### React
```typescript
// Use functional components
export default function RealtimeAnalytics() { }  // ✅
export default class RealtimeAnalytics { }       // ❌

// Use hooks
const [state, setState] = useState()             // ✅
this.setState()                                  // ❌
```

### Naming Conventions
```typescript
// Components: PascalCase
RealtimeAnalytics

// Functions: camelCase
getRealtimeAnalytics

// Constants: UPPER_CASE
const COLORS = []

// Types: PascalCase
type CampaignMetric = {}
```

---

## 🐛 Debugging

### Console Logs
```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Analytics data:', analyticsData)
}
```

### Error Handling
```typescript
try {
  const data = await fetchAnalytics()
} catch (error) {
  console.error('Error fetching analytics:', error)
  toast({
    title: 'خطأ',
    description: 'فشل في تحميل البيانات',
    variant: 'destructive'
  })
}
```

### React DevTools
```bash
# Install
npm install -g react-devtools

# Run
react-devtools
```

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Recharts Docs](https://recharts.org/en-US/)

### Tools
- [Prisma Studio](https://www.prisma.io/studio)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

## 🔄 Git Workflow

### Branches
```bash
main          # Production
develop       # Development
feature/*     # New features
bugfix/*      # Bug fixes
hotfix/*      # Urgent fixes
```

### Commits
```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(analytics): add real-time updates
fix(api): handle empty data
docs(readme): update setup guide
```

---

## ✅ Checklist للمطورين

### قبل البدء
- [ ] قرأت التوثيق الكامل
- [ ] فهمت البنية المعمارية
- [ ] أعددت بيئة التطوير

### أثناء التطوير
- [ ] استخدمت TypeScript بشكل صحيح
- [ ] اتبعت Code Style
- [ ] أضفت Error Handling
- [ ] حسّنت الأداء

### قبل الـ Commit
- [ ] اختبرت الكود
- [ ] راجعت التغييرات
- [ ] كتبت commit message واضح
- [ ] حدّثت التوثيق

---

## 🎯 Next Steps

### للمطورين الجدد
1. اقرأ `QUICK_START_REALTIME.md`
2. راجع الكود في `src/components/dashboard/RealtimeAnalytics.tsx`
3. جرب تعديل بسيط
4. اقرأ هذا الدليل بالكامل

### للمطورين المتقدمين
1. راجع البنية المعمارية
2. فهم Data Flow
3. حسّن الأداء
4. أضف ميزات جديدة

---

<div align="center">

**👨‍💻 Happy Coding!**

**صُنع بـ ❤️ بواسطة SmartADX Team**

</div>
