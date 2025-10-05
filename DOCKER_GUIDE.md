# 🐳 Docker Deployment Guide

## Quick Start

### Development Environment

```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Build and start production environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
DATABASE_URL=file:./dev.db

# Optional
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
POSTGRES_PASSWORD=your-postgres-password
```

## Building the Image

### Development
```bash
docker build -f Dockerfile.dev -t smartadx-erp:dev .
```

### Production
```bash
docker build -t smartadx-erp:latest .
```

## Running Containers

### Single Container (Development)
```bash
docker run -p 3000:3000 -p 3001:3001 \
  -e NODE_ENV=development \
  -e DATABASE_URL=file:./dev.db \
  -v $(pwd):/app \
  smartadx-erp:dev
```

### Single Container (Production)
```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./dev.db \
  -e JWT_SECRET=your-secret \
  --name smartadx-erp \
  smartadx-erp:latest
```

## Database Migrations

### Inside Container
```bash
# Access container shell
docker exec -it smartadx-erp-app sh

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

### From Host
```bash
docker exec smartadx-erp-app npx prisma migrate deploy
docker exec smartadx-erp-app npm run seed
```

## Health Checks

The application includes health checks:

```bash
# Check application health
curl http://localhost:3000/api/health

# Check container health status
docker ps
```

## Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs app
docker-compose logs redis

# Last 100 lines
docker-compose logs --tail=100 app
```

## Scaling

```bash
# Scale app service to 3 instances
docker-compose up -d --scale app=3

# Use with load balancer (nginx)
```

## Backup & Restore

### Database Backup
```bash
# SQLite
docker exec smartadx-erp-app cp /app/prisma/dev.db /app/backup.db
docker cp smartadx-erp-app:/app/backup.db ./backup.db

# PostgreSQL
docker exec smartadx-erp-postgres pg_dump -U smartadx smartadx_erp > backup.sql
```

### Restore Database
```bash
# SQLite
docker cp ./backup.db smartadx-erp-app:/app/prisma/dev.db

# PostgreSQL
docker exec -i smartadx-erp-postgres psql -U smartadx smartadx_erp < backup.sql
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs smartadx-erp-app

# Check if port is already in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Database connection issues
```bash
# Regenerate Prisma Client
docker exec smartadx-erp-app npx prisma generate

# Check database file permissions
docker exec smartadx-erp-app ls -la /app/prisma/
```

### Out of memory
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or add to docker-compose.yml:
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Clear everything and start fresh
```bash
# Stop all containers
docker-compose down

# Remove all volumes
docker-compose down -v

# Remove images
docker rmi smartadx-erp:latest

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

### Using PostgreSQL

1. Uncomment PostgreSQL service in `docker-compose.yml`
2. Update `DATABASE_URL` in environment:
   ```env
   DATABASE_URL=postgresql://smartadx:password@postgres:5432/smartadx_erp
   ```
3. Run migrations:
   ```bash
   docker-compose up -d postgres
   docker exec smartadx-erp-app npx prisma migrate deploy
   ```

### Using Nginx Reverse Proxy

1. Uncomment nginx service in `docker-compose.yml`
2. Create `nginx.conf` file
3. Add SSL certificates to `./ssl/` directory
4. Start services:
   ```bash
   docker-compose up -d
   ```

### Environment-specific Builds

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Staging
docker-compose -f docker-compose.staging.yml up

# Production
docker-compose -f docker-compose.yml up
```

## Security Best Practices

1. **Never commit `.env` files**
2. **Use secrets management** (Docker Secrets, Kubernetes Secrets)
3. **Run as non-root user** (already configured)
4. **Keep images updated**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
5. **Scan for vulnerabilities**
   ```bash
   docker scan smartadx-erp:latest
   ```

## Monitoring

### Container Stats
```bash
# Real-time stats
docker stats

# Specific container
docker stats smartadx-erp-app
```

### Resource Usage
```bash
# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t smartadx-erp:${{ github.sha }} .
      - name: Push to registry
        run: docker push smartadx-erp:${{ github.sha }}
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- GitHub Issues: https://github.com/CCPPIT/smartadx-ai-erp/issues
- Email: support@smartadx.ai
