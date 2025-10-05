# 🔧 Environment Variables Setup Guide

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`

## Required Variables (Minimum to Run)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"
```

## Optional Variables by Feature

### 🤖 AI Features
```env
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4"
```

### 📧 Email Service
Choose one:

**Option 1: SendGrid (Recommended)**
```env
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@smartadx.ai"
```

**Option 2: SMTP**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### 📱 Social Media Integration
```env
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
INSTAGRAM_CLIENT_ID="..."
TWITTER_API_KEY="..."
LINKEDIN_CLIENT_ID="..."
```

### 💳 Payment Gateways
```env
STRIPE_SECRET_KEY="sk_..."
PAYPAL_CLIENT_ID="..."
```

### 🔐 OAuth Login
```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## How to Get API Keys

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `OPENAI_API_KEY`

### SendGrid
1. Visit https://app.sendgrid.com/settings/api_keys
2. Create API Key with "Mail Send" permissions
3. Copy and paste into `SENDGRID_API_KEY`

### Stripe
1. Visit https://dashboard.stripe.com/apikeys
2. Copy "Secret key" (starts with `sk_`)
3. For webhooks: https://dashboard.stripe.com/webhooks

### Facebook/Instagram
1. Visit https://developers.facebook.com/apps
2. Create new app
3. Get App ID and App Secret

### Google OAuth
1. Visit https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs

## Security Best Practices

1. ⚠️ **Never commit `.env` or `.env.local` to git**
2. 🔒 Use strong, random secrets for JWT and sessions
3. 🔑 Rotate API keys regularly
4. 🚫 Don't share your `.env` file
5. ✅ Use different keys for development and production

## Generate Secure Secrets

```bash
# Generate random secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

## Environment-Specific Files

- `.env.local` - Local development (not committed)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Testing environment

## Troubleshooting

### "Missing environment variable" error
- Make sure you copied `.env.example` to `.env.local`
- Check that all required variables are set

### API key not working
- Verify the key is correct
- Check if the service is enabled in your account
- Ensure billing is set up (for paid services)

### Database connection error
- Check `DATABASE_URL` is correct
- Run `npx prisma generate` and `npx prisma migrate dev`

## Need Help?

- Check documentation: `/docs`
- Contact support: support@smartadx.ai
