# 🗄️ Database Optimization Guide

## Overview

This document outlines the database optimization strategies implemented in SmartAdX AI ERP.

---

## 📊 Indexes Added

### User Table
```prisma
@@index([email])      // Fast email lookups for authentication
@@index([role])       // Filter users by role
@@index([createdAt])  // Sort by registration date
```

### Campaign Table
```prisma
@@index([userId])     // Get user's campaigns
@@index([status])     // Filter by campaign status
@@index([startDate])  // Date range queries
@@index([endDate])    // Date range queries
@@index([createdAt])  // Sort by creation date
```

### Ad Table
```prisma
@@index([campaignId]) // Get campaign's ads
@@index([userId])     // Get user's ads
@@index([status])     // Filter by status
@@index([aiGenerated])// Filter AI-generated ads
@@index([createdAt])  // Sort by creation date
```

### Analytics Table
```prisma
@@index([campaignId]) // Get campaign analytics
@@index([date])       // Date-based queries
@@index([createdAt])  // Time-series data
```

### Notification Table
```prisma
@@index([userId])     // Get user notifications
@@index([read])       // Filter unread notifications
@@index([type])       // Filter by notification type
@@index([priority])   // Sort by priority
@@index([createdAt])  // Sort by time
```

### Invoice Table
```prisma
@@index([clientId])   // Get client invoices
@@index([userId])     // Get user invoices
@@index([status])     // Filter by status
@@index([dueDate])    // Overdue invoice queries
@@index([createdAt])  // Sort by date
```

### UserSession Table
```prisma
@@index([userId])     // Get user sessions
@@index([expiresAt])  // Clean expired sessions
@@index([createdAt])  // Session history
@@index([lastAccessed]) // Active session tracking
```

---

## 🚀 Query Optimization Tips

### 1. Use Indexes Effectively

**Good:**
```typescript
// Uses userId index
const campaigns = await prisma.campaign.findMany({
  where: { userId: 'user123', status: 'ACTIVE' }
});
```

**Bad:**
```typescript
// Full table scan - no index on description
const campaigns = await prisma.campaign.findMany({
  where: { description: { contains: 'summer' } }
});
```

### 2. Select Only Needed Fields

**Good:**
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

**Bad:**
```typescript
// Fetches all fields including relations
const users = await prisma.user.findMany();
```

### 3. Use Pagination

**Good:**
```typescript
const campaigns = await prisma.campaign.findMany({
  take: 10,
  skip: (page - 1) * 10,
  orderBy: { createdAt: 'desc' }
});
```

**Bad:**
```typescript
// Fetches all records
const campaigns = await prisma.campaign.findMany();
```

### 4. Batch Operations

**Good:**
```typescript
// Single query
await prisma.notification.updateMany({
  where: { userId: 'user123', read: false },
  data: { read: true }
});
```

**Bad:**
```typescript
// Multiple queries
for (const notification of notifications) {
  await prisma.notification.update({
    where: { id: notification.id },
    data: { read: true }
  });
}
```

### 5. Use Transactions for Related Operations

```typescript
await prisma.$transaction(async (tx) => {
  const invoice = await tx.invoice.create({
    data: { /* ... */ }
  });
  
  await tx.payment.create({
    data: {
      invoiceId: invoice.id,
      /* ... */
    }
  });
});
```

---

## 📈 Performance Monitoring

### 1. Enable Query Logging

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["metrics"]
}
```

```typescript
// Enable logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### 2. Analyze Slow Queries

```typescript
// Log slow queries
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) { // Queries taking more than 1 second
    console.log('Slow query:', e.query);
    console.log('Duration:', e.duration, 'ms');
  }
});
```

### 3. Use Prisma Studio

```bash
npx prisma studio
```

---

## 🔧 Database Maintenance

### 1. Clean Up Expired Sessions

```typescript
// Run daily
async function cleanupExpiredSessions() {
  const result = await prisma.userSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });
  console.log(`Deleted ${result.count} expired sessions`);
}
```

### 2. Archive Old Data

```typescript
// Archive campaigns older than 1 year
async function archiveOldCampaigns() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: 'COMPLETED',
      endDate: { lt: oneYearAgo }
    }
  });
  
  // Move to archive table or export
}
```

### 3. Vacuum Database (SQLite)

```bash
# Optimize database file
sqlite3 prisma/dev.db "VACUUM;"
```

### 4. Analyze Tables (PostgreSQL)

```sql
ANALYZE campaigns;
ANALYZE users;
ANALYZE analytics;
```

---

## 📊 Migration to PostgreSQL (Production)

### Why PostgreSQL?

- Better performance for large datasets
- Advanced indexing (GiST, GIN, BRIN)
- Full-text search
- Better concurrency
- JSON support
- Replication and backup

### Migration Steps

1. **Update schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Update DATABASE_URL:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartadx_erp"
```

3. **Create migration:**
```bash
npx prisma migrate dev --name switch_to_postgresql
```

4. **Migrate data:**
```bash
# Export from SQLite
sqlite3 prisma/dev.db .dump > backup.sql

# Import to PostgreSQL (after converting)
psql -U user -d smartadx_erp < converted.sql
```

---

## 🎯 Advanced Optimizations

### 1. Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 2. Caching with Redis

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getCampaignWithCache(id: string) {
  // Try cache first
  const cached = await redis.get(`campaign:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const campaign = await prisma.campaign.findUnique({
    where: { id }
  });
  
  // Cache for 5 minutes
  await redis.setex(`campaign:${id}`, 300, JSON.stringify(campaign));
  
  return campaign;
}
```

### 3. Read Replicas

```typescript
// For read-heavy operations
const readPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_REPLICA_URL
    }
  }
});

// Use read replica for queries
const campaigns = await readPrisma.campaign.findMany();

// Use primary for writes
await prisma.campaign.create({ data: { /* ... */ } });
```

### 4. Materialized Views (PostgreSQL)

```sql
-- Create materialized view for analytics
CREATE MATERIALIZED VIEW campaign_stats AS
SELECT 
  c.id,
  c.name,
  COUNT(a.id) as total_ads,
  SUM(an.clicks) as total_clicks,
  SUM(an.impressions) as total_impressions,
  SUM(an.revenue) as total_revenue
FROM campaigns c
LEFT JOIN ads a ON a.campaign_id = c.id
LEFT JOIN analytics an ON an.campaign_id = c.id
GROUP BY c.id, c.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW campaign_stats;
```

---

## 📝 Best Practices

1. **Always use indexes for:**
   - Foreign keys
   - Frequently queried fields
   - Fields used in WHERE clauses
   - Fields used in ORDER BY

2. **Avoid:**
   - Over-indexing (slows down writes)
   - Indexes on low-cardinality fields
   - Indexes on frequently updated fields

3. **Monitor:**
   - Query performance
   - Index usage
   - Database size
   - Connection pool

4. **Regular maintenance:**
   - Clean up old data
   - Vacuum/analyze tables
   - Update statistics
   - Review slow queries

---

## 🔍 Troubleshooting

### Slow Queries

1. Check if indexes are being used:
```typescript
// Enable query logging
const result = await prisma.campaign.findMany({
  where: { status: 'ACTIVE' }
});
```

2. Use EXPLAIN (PostgreSQL):
```sql
EXPLAIN ANALYZE
SELECT * FROM campaigns WHERE status = 'ACTIVE';
```

### High Memory Usage

1. Use pagination
2. Select only needed fields
3. Limit relation depth
4. Use streaming for large datasets

### Lock Timeouts

1. Keep transactions short
2. Use optimistic locking
3. Retry failed transactions

---

## 📚 Resources

- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [PostgreSQL Indexing](https://www.postgresql.org/docs/current/indexes.html)
- [Database Optimization Best Practices](https://use-the-index-luke.com/)
