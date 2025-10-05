# 📚 SmartAdX AI ERP - API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.smartadx.ai
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "clx123abc",
    "email": "ahmed@example.com",
    "name": "أحمد محمد",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors:**
- `400` - Invalid input or weak password
- `409` - Email already registered

---

### Login
Authenticate user and get access tokens.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "clx123abc",
    "email": "ahmed@example.com",
    "name": "أحمد محمد",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors:**
- `400` - Invalid input
- `401` - Invalid email or password

---

### Logout
Invalidate current session.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Refresh Token
Get a new access token using refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "clx123abc",
    "email": "ahmed@example.com",
    "name": "أحمد محمد",
    "role": "USER"
  }
}
```

**Errors:**
- `401` - Invalid or expired refresh token

---

### Get Current User
Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "clx123abc",
    "email": "ahmed@example.com",
    "name": "أحمد محمد",
    "role": "USER",
    "roles": [
      {
        "id": 1,
        "name": "USER",
        "description": "Regular user",
        "level": 1
      }
    ],
    "permissions": [
      {
        "id": 1,
        "name": "campaigns.view",
        "description": "View campaigns",
        "category": "campaigns"
      }
    ],
    "preference": {
      "theme": "dark",
      "language": "ar",
      "notifications": true
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 Campaign Endpoints

### Get All Campaigns
Retrieve all campaigns for the authenticated user.

**Endpoint:** `GET /api/campaigns`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (DRAFT, ACTIVE, PAUSED, COMPLETED)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "campaigns": [
    {
      "id": "clx456def",
      "name": "حملة الصيف 2025",
      "description": "حملة إعلانية للصيف",
      "status": "ACTIVE",
      "budget": 5000.00,
      "startDate": "2025-06-01T00:00:00.000Z",
      "endDate": "2025-08-31T23:59:59.000Z",
      "createdAt": "2025-05-15T10:00:00.000Z",
      "updatedAt": "2025-05-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Create Campaign
Create a new advertising campaign.

**Endpoint:** `POST /api/campaigns`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "حملة الصيف 2025",
  "description": "حملة إعلانية للصيف",
  "budget": 5000.00,
  "startDate": "2025-06-01",
  "endDate": "2025-08-31"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "campaign": {
    "id": "clx456def",
    "name": "حملة الصيف 2025",
    "status": "DRAFT",
    "budget": 5000.00
  }
}
```

---

## 🤖 AI Endpoints

### Generate Ad Content
Use AI to generate ad content.

**Endpoint:** `POST /api/ai/generate-ad`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "prompt": "إنشاء إعلان لمنتج تقني جديد",
  "tone": "professional",
  "length": "medium",
  "language": "ar"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "content": {
    "title": "ثورة في عالم التكنولوجيا",
    "body": "اكتشف المنتج الذي سيغير حياتك...",
    "hashtags": ["#تقنية", "#ابتكار", "#مستقبل"],
    "callToAction": "اطلب الآن"
  }
}
```

---

## 📧 Notification Endpoints

### Get Notifications
Get user's notifications.

**Endpoint:** `GET /api/notifications`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `read` (optional): Filter by read status (true/false)
- `type` (optional): Filter by type (info, warning, success, error)
- `limit` (optional): Number of notifications (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "notifications": [
    {
      "id": "clx789ghi",
      "title": "حملة جديدة",
      "message": "تم إنشاء حملة جديدة بنجاح",
      "type": "success",
      "read": false,
      "priority": 1,
      "createdAt": "2025-01-15T14:30:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

---

### Mark Notification as Read
Mark a notification as read.

**Endpoint:** `PATCH /api/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 💳 Billing Endpoints

### Get Invoices
Get user's invoices.

**Endpoint:** `GET /api/invoices`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (DRAFT, SENT, PAID, OVERDUE, CANCELLED)

**Response:** `200 OK`
```json
{
  "success": true,
  "invoices": [
    {
      "id": "clx012jkl",
      "number": "INV-2025-001",
      "amount": 1500.00,
      "status": "PAID",
      "dueDate": "2025-02-01T00:00:00.000Z",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## 📊 Analytics Endpoints

### Get Campaign Analytics
Get analytics for a specific campaign.

**Endpoint:** `GET /api/analytics/campaign/:campaignId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `startDate` (optional): Start date for analytics
- `endDate` (optional): End date for analytics

**Response:** `200 OK`
```json
{
  "success": true,
  "analytics": {
    "campaignId": "clx456def",
    "metrics": {
      "impressions": 150000,
      "clicks": 7500,
      "conversions": 450,
      "revenue": 22500.00,
      "ctr": 5.0,
      "conversionRate": 6.0,
      "roi": 350.0
    },
    "timeline": [
      {
        "date": "2025-06-01",
        "impressions": 5000,
        "clicks": 250,
        "conversions": 15
      }
    ]
  }
}
```

---

## ⚙️ User Settings Endpoints

### Update User Preferences
Update user preferences.

**Endpoint:** `PATCH /api/user/preferences`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "theme": "dark",
  "language": "ar",
  "notifications": true,
  "emailNotifications": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "preferences": {
    "theme": "dark",
    "language": "ar",
    "notifications": true,
    "emailNotifications": false
  }
}
```

---

## 🔍 Search Endpoints

### Global Search
Search across campaigns, clients, and content.

**Endpoint:** `GET /api/search`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `q`: Search query (required)
- `type` (optional): Filter by type (campaigns, clients, ads, posts)
- `limit` (optional): Number of results (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "results": {
    "campaigns": [
      {
        "id": "clx456def",
        "name": "حملة الصيف 2025",
        "type": "campaign"
      }
    ],
    "clients": [],
    "ads": [],
    "posts": []
  },
  "total": 1
}
```

---

## 🏥 Health Check

### Health Check
Check API health status.

**Endpoint:** `GET /api/health`

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": "NO_TOKEN"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN",
  "required": ["ADMIN"],
  "current": "USER"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API requests are rate limited:
- **Authenticated users**: 1000 requests per 15 minutes
- **Unauthenticated users**: 100 requests per 15 minutes

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
```

---

## Webhooks

Configure webhooks to receive real-time notifications:

### Available Events
- `campaign.created`
- `campaign.updated`
- `campaign.completed`
- `invoice.created`
- `invoice.paid`
- `payment.completed`
- `notification.created`

### Webhook Payload
```json
{
  "event": "campaign.created",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "data": {
    "id": "clx456def",
    "name": "حملة الصيف 2025"
  }
}
```

---

## Support

For API support:
- Email: api@smartadx.ai
- Documentation: https://docs.smartadx.ai
- Status Page: https://status.smartadx.ai
