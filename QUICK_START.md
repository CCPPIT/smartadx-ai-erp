# ⚡ Quick Start Guide - SmartAdX AI ERP

Get up and running in 5 minutes!

---

## 🚀 Method 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp

# Run automated setup
npm install
npm run setup

# Start development server
npm run dev
```

Visit: http://localhost:3000

---

## 🐳 Method 2: Docker (Fastest)

```bash
# Clone the repository
git clone https://github.com/CCPPIT/smartadx-ai-erp.git
cd smartadx-ai-erp

# Start with Docker
docker-compose -f docker-compose.dev.yml up
```

Visit: http://localhost:3000

---

## 📝 Method 3: Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
JWT_SECRET="your-secret-key-here"
SESSION_SECRET="your-session-secret-here"
```

### Step 3: Setup Database
```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

### Step 4: Start Server
```bash
npm run dev
```

---

## 🎯 Default Credentials

After seeding the database:

**Super Admin:**
- Email: `admin@smartadx.ai`
- Password: `admin123`

**Regular User:**
- Email: `user@smartadx.ai`
- Password: `user123`

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
npm run seed             # Seed database

# Docker
npm run docker:dev       # Start Docker dev
npm run docker:prod      # Start Docker prod
npm run docker:stop      # Stop Docker
npm run docker:logs      # View logs

# Utilities
npm run lint             # Check code
npm run format           # Format code
npm run test:api         # Test API
npm run dev-tools        # Show dev tools
```

---

## 📚 Next Steps

1. **Explore the Dashboard**
   - Login with default credentials
   - Check out the features
   - Create a test campaign

2. **Read Documentation**
   - [Installation Guide](INSTALLATION_GUIDE.md)
   - [API Documentation](API_DOCUMENTATION.md)
   - [Docker Guide](DOCKER_GUIDE.md)

3. **Configure Services** (Optional)
   - Add OpenAI API key for AI features
   - Setup email service (SendGrid/SMTP)
   - Configure social media APIs

4. **Start Building**
   - Check [CONTRIBUTING.md](CONTRIBUTING.md)
   - Review [SECURITY.md](SECURITY.md)
   - Join our community

---

## ❓ Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database errors
```bash
npm run db:reset
npm run seed
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker issues
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## 🆘 Need Help?

- 📖 **Documentation**: Check docs folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/CCPPIT/smartadx-ai-erp/issues)
- 📧 **Email**: support@smartadx.ai
- 💬 **Discord**: Coming soon

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Application runs on http://localhost:3000
- [ ] Can login with default credentials
- [ ] Dashboard loads correctly
- [ ] Database is accessible
- [ ] No console errors

---

**You're all set! Happy coding! 🎉**

**Made with ❤️ in Palestine 🇵🇸**
