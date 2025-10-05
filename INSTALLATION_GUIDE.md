# 🚀 SmartAdX AI ERP - Installation Guide

## Prerequisites

### Required Software
- **Node.js**: 22.19.0 or higher
- **npm** or **bun**: Latest version
- **Git**: For version control

### Optional (for production)
- **Docker**: 20.10+ and Docker Compose 2.0+
- **PostgreSQL**: 16+ (if not using SQLite)
- **Redis**: 7+ (for caching and sessions)

---

## 📦 Installation Methods

### Method 1: Local Development (Recommended for Development)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp
```

#### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

#### Step 3: Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values
# Minimum required:
# - JWT_SECRET
# - SESSION_SECRET
```

#### Step 4: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed
```

#### Step 5: Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

### Method 2: Docker (Recommended for Production)

#### Step 1: Clone Repository
```bash
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp
```

#### Step 2: Setup Environment
```bash
cp .env.example .env
# Edit .env with production values
```

#### Step 3: Build and Run with Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

#### Step 4: Run Migrations
```bash
docker exec smartadx-erp-app npx prisma migrate deploy
docker exec smartadx-erp-app npm run seed
```

Visit: http://localhost:3000

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` file with the following:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-change-this"
SESSION_SECRET="your-session-secret-change-this"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI (Optional)
OPENAI_API_KEY="sk-..."

# Email (Optional)
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@smartadx.ai"

# Or use SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Generate Secure Secrets
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

---

## 🗄️ Database Setup

### SQLite (Default - Development)
```bash
# Already configured in .env.local
DATABASE_URL="file:./dev.db"

# Run migrations
npx prisma migrate dev
```

### PostgreSQL (Production)
```bash
# Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/smartadx_erp"

# Run migrations
npx prisma migrate deploy
```

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 📧 Email Service Setup

### Option 1: SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create API key with "Mail Send" permissions
3. Add to `.env.local`:
```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@smartadx.ai"
```

### Option 2: Gmail SMTP

1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
```env
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Test Email Service
```bash
# Create test script
node -e "
const { emailService } = require('./src/lib/email');
emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}).then(console.log);
"
```

---

## 🤖 OpenAI Integration

### Setup

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env.local`:
```env
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4"
```

### Test OpenAI
```bash
# Test in Node.js
node -e "
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
client.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
}).then(r => console.log(r.choices[0].message));
"
```

---

## 🔐 Authentication Setup

### Default Users (After Seeding)

```
Super Admin:
Email: admin@smartadx.ai
Password: admin123

Regular User:
Email: user@smartadx.ai
Password: user123
```

### Create Super Admin Manually
```bash
# Using Prisma Studio
npx prisma studio

# Or via API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@smartadx.ai",
    "password": "SecurePassword123!"
  }'
```

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Manual Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartadx.ai","password":"admin123"}'
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

### Docker Production

```bash
# Build image
docker build -t smartadx-erp:latest .

# Run container
docker run -d -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  smartadx-erp:latest
```

### VPS/Server

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp
npm install
npm run build

# Use PM2 for process management
npm i -g pm2
pm2 start npm --name "smartadx-erp" -- start
pm2 save
pm2 startup
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Regenerate Prisma Client
npx prisma generate

# Check database file
ls -la prisma/dev.db

# Reset database
npx prisma migrate reset
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with bun
rm -rf node_modules bun.lock
bun install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs -f
```

---

## 📚 Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Docker Guide**: See `DOCKER_GUIDE.md`
- **Environment Setup**: See `ENV_SETUP.md`
- **GitHub**: https://github.com/CCPPIT/smartadx-ai-erp
- **Support**: support@smartadx.ai

---

## 🆘 Getting Help

1. Check documentation files
2. Search existing GitHub issues
3. Create new issue with:
   - System information
   - Error messages
   - Steps to reproduce
4. Email support: support@smartadx.ai

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Application runs on http://localhost:3000
- [ ] Database is accessible
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard loads correctly
- [ ] API endpoints respond
- [ ] Email service works (if configured)
- [ ] OpenAI integration works (if configured)

---

**Happy Coding! 🎉**
