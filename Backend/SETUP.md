# Backend Setup & Installation Guide

## ✅ Current Status

✨ **Backend server is running on port 5001!**

⚠️ **MongoDB is not installed/running** - You need to install and start MongoDB for full functionality.

---

## 🚀 Quick Start

### Option 1: Install MongoDB Locally (Recommended for Development)

#### For macOS:
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify MongoDB is running
mongosh --eval "db.version()"
```

#### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh --eval "db.version()"
```

#### For Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service from Services app

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skinie-buddy
```

---

## 📦 Installation Steps

```bash
# 1. Navigate to Backend directory
cd Backend

# 2. Install dependencies (DONE ✅)
npm install

# 3. Copy environment file (DONE ✅)
cp .env.example .env

# 4. Start the server (RUNNING ✅)
npm run dev
```

---

## 🗃️ Database Setup

Once MongoDB is installed and running:

### 1. Seed the database with demo data:
```bash
cd Backend
npm run seed
```

This will create:
- **Demo User** (email: demo@skiniebuddy.com, password: password123)
- **6 Sample Products**
- **2 Routines** (Morning & Night)
- **Streak Data**

### 2. Verify the server is connected:
```bash
# The server log should show:
✅ MongoDB Connected: localhost
```

---

## 🧪 Testing the API

### Test Health Endpoint:
```bash
curl http://localhost:5001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-29T..."
}
```

### Test Registration:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@skiniebuddy.com",
    "password": "password123"
  }'
```

---

## 📁 Project Structure

```
Backend/
├── server.js              # Main entry point
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   └── database.js        # MongoDB connection
├── models/
│   ├── User.js           # User model
│   ├── Product.js        # Product model
│   ├── Routine.js        # Routine model
│   ├── Streak.js         # Streak tracking
│   └── ChatMessage.js    # Chat history
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── routineController.js
│   ├── streakController.js
│   └── chatController.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── routineRoutes.js
│   ├── streakRoutes.js
│   └── chatRoutes.js
├── middleware/
│   ├── auth.js           # JWT authentication
│   ├── errorHandler.js   # Error handling
│   ├── rateLimiter.js    # Rate limiting
│   └── validate.js       # Input validation
├── utils/
│   └── generateToken.js  # JWT token generator
└── scripts/
    └── seedData.js       # Database seeding
```

---

## 🔌 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/password` - Update password (protected)

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Routines
- `GET /api/routines` - Get all routines
- `POST /api/routines` - Create routine
- `POST /api/routines/generate` - AI generate routine
- `GET /api/routines/:id` - Get single routine
- `PUT /api/routines/:id` - Update routine
- `DELETE /api/routines/:id` - Delete routine
- `POST /api/routines/:id/complete` - Mark complete

### Streaks
- `GET /api/streaks` - Get streak data
- `POST /api/streaks/update` - Update streak

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message
- `DELETE /api/chat/history` - Clear history

### Health
- `GET /api/health` - Server health check

---

## 🔧 Environment Variables

Current configuration (`.env`):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skinie-buddy
JWT_SECRET=skinie-buddy-super-secret-key-change-in-production-2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔐 Security Features

✅ Password hashing with bcryptjs
✅ JWT authentication
✅ Helmet for HTTP headers security
✅ CORS protection
✅ Rate limiting (100 requests per 15 minutes)
✅ Input validation with express-validator
✅ MongoDB injection protection

---

## 🐛 Troubleshooting

### Server won't start:
```bash
# Check if port is in use
lsof -i :5001

# Kill process on port
kill -9 <PID>
```

### MongoDB connection error:
```bash
# Check MongoDB status (macOS)
brew services list

# Start MongoDB
brew services start mongodb-community

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Dependencies issues:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Next Steps

1. **Install MongoDB** (if not done)
2. **Seed the database**: `npm run seed`
3. **Test the API** with curl or Postman
4. **Connect the Frontend** (update API URL in Frontend)
5. **Add AI Integration** (OpenAI/Claude for chat)

---

## 🎯 Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database with demo data
npm run seed

# Install new packages
npm install <package-name>
```

---

## 📝 Demo User Credentials

After running `npm run seed`:

**Email:** demo@skiniebuddy.com  
**Password:** password123

---

## 🚀 Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for cloud database
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Add rate limiting per user
- [ ] Implement logging (Winston, Morgan)

---

## 📞 Support

For issues or questions:
- Check the logs: Server terminal output
- MongoDB logs: `/usr/local/var/log/mongodb/mongo.log`
- Review API documentation in README.md

---

**Status**: ✅ Backend is ready! Just needs MongoDB connection for full functionality.
