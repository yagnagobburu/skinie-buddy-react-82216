# MongoDB Atlas Setup Guide

Complete step-by-step guide to create a MongoDB database in Atlas and get your connection string.

---

## 📋 Prerequisites

- A valid email address
- Internet connection

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas website**
   - Open your browser and visit: https://www.mongodb.com/cloud/atlas/register

2. **Sign up for a free account**
   - Click on "Try Free" or "Get Started Free"
   - Choose one of these options:
     - Sign up with Google
     - Sign up with GitHub
     - Sign up with email (fill in email, password, first name, last name)

3. **Complete the registration**
   - Verify your email address (check your inbox)
   - Click the verification link in the email

---

### Step 2: Create Your First Cluster

1. **Welcome Screen**
   - After logging in, you'll see a welcome screen
   - Click on **"Build a Database"** or **"Create"**

2. **Choose Deployment Type**
   - Select **"M0 FREE"** (Shared cluster - perfect for development)
   - This gives you:
     - 512 MB storage
     - Shared RAM
     - No credit card required
     - Perfect for development and testing

3. **Choose Cloud Provider & Region**
   - **Provider**: Choose AWS, Google Cloud, or Azure (AWS recommended)
   - **Region**: Select the region closest to you for better performance
     - Examples: 
       - US East (N. Virginia) - `us-east-1`
       - Europe (Ireland) - `eu-west-1`
       - Asia Pacific (Mumbai) - `ap-south-1`
   - **Cluster Name**: Leave default or change to something like `Cluster0` or `SkinieCluster`

4. **Click "Create"**
   - Wait 1-3 minutes for your cluster to be created
   - You'll see a progress indicator

---

### Step 3: Create Database User

1. **Security Quickstart Screen**
   - After cluster creation, you'll see "Security Quickstart"

2. **Create a Database User**
   - **Authentication Method**: Choose "Password" (default)
   - **Username**: Enter a username (e.g., `skinieadmin` or `dbuser`)
   - **Password**: Click "Autogenerate Secure Password" OR create your own
     - ⚠️ **IMPORTANT**: Copy and save this password somewhere safe!
     - You'll need it for your connection string
   - Example credentials:
     ```
     Username: skinieadmin
     Password: A1b2C3d4E5f6G7h8
     ```

3. **User Privileges**
   - Leave as default: "Read and write to any database"
   - Click **"Create User"**

---

### Step 4: Set Up Network Access

1. **Add IP Address**
   - Still in the Security Quickstart screen
   - Under "Where would you like to connect from?"

2. **Choose Connection Method**
   
   **Option A: Allow Access from Anywhere (Development)**
   - Click **"Add My Current IP Address"**
   - Then click **"Add Entry"** again
   - In the IP Address field, enter: `0.0.0.0/0`
   - Description: `Allow all IPs (development only)`
   - Click **"Add Entry"**
   - ⚠️ **Note**: This allows connections from any IP address. Fine for development, but restrict in production!

   **Option B: Add Specific IP (Recommended for Production)**
   - Click **"Add My Current IP Address"**
   - Your current IP will be auto-filled
   - Add a description: `My Development Machine`
   - Click **"Add Entry"**

3. **Click "Finish and Close"**
   - Then click **"Go to Database"**

---

### Step 5: Get Your Connection String

1. **Navigate to Database Deployments**
   - Click on **"Database"** in the left sidebar (if not already there)
   - You should see your cluster (e.g., `Cluster0`)

2. **Connect to Your Cluster**
   - Click the **"Connect"** button on your cluster

3. **Choose Connection Method**
   - Select **"Connect your application"**

4. **Copy the Connection String**
   - **Driver**: Select "Node.js"
   - **Version**: Select "4.1 or later" (or latest)
   - You'll see a connection string like this:
     ```
     mongodb+srv://skinieadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

5. **Modify the Connection String**
   - Replace `<password>` with the actual password you created/saved
   - Add your database name after `.net/`
   - Final format should look like:
     ```
     mongodb+srv://skinieadmin:A1b2C3d4E5f6G7h8@cluster0.xxxxx.mongodb.net/skinie-buddy?retryWrites=true&w=majority
     ```

   **Example Connection Strings:**
   ```
   # Template
   mongodb+srv://<username>:<password>@<cluster-name>.<random-id>.mongodb.net/<database-name>?retryWrites=true&w=majority

   # Actual Example
   mongodb+srv://skinieadmin:MySecurePass123@cluster0.abc1def.mongodb.net/skinie-buddy?retryWrites=true&w=majority
   ```

6. **Click "Close"**

---

### Step 6: Configure Your Backend

1. **Update your `.env` file**
   ```bash
   cd Backend
   nano .env
   # or use any text editor
   ```

2. **Add your connection string**
   ```env
   PORT=5001
   NODE_ENV=development

   # Replace with your actual MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://skinieadmin:A1b2C3d4E5f6G7h8@cluster0.abc1def.mongodb.net/skinie-buddy?retryWrites=true&w=majority

   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
   JWT_EXPIRE=7d

   FRONTEND_URL=http://localhost:8080

   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Save the file**
   - Press `Ctrl + X`, then `Y`, then `Enter` (if using nano)

---

### Step 7: Test the Connection

1. **Start your backend server**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Check for successful connection**
   - You should see in the terminal:
     ```
     ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
     🚀 Server running in development mode on port 5001
     ```

3. **Test the health endpoint**
   ```bash
   curl http://localhost:5001/api/health
   ```
   
   Should return:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-10-29T..."
   }
   ```

---

## 🔍 Troubleshooting

### Issue 1: "MongoNetworkError: failed to connect"

**Solutions:**
1. Check if your IP address is whitelisted:
   - Go to Atlas → Network Access
   - Verify your current IP is listed or `0.0.0.0/0` is added

2. Verify your connection string:
   - Make sure you replaced `<password>` with actual password
   - Ensure there are no extra spaces
   - Password special characters must be URL-encoded

3. Check your internet connection

### Issue 2: "Authentication failed"

**Solutions:**
1. Verify username and password are correct
2. Check if user has proper permissions
3. Make sure password doesn't have special characters that need encoding
   - If password has special chars, URL-encode them:
     - `@` → `%40`
     - `:` → `%3A`
     - `/` → `%2F`
     - `?` → `%3F`
     - `#` → `%23`

### Issue 3: "Database not found"

**Solution:**
- MongoDB will automatically create the database when you first insert data
- This is normal and not an error

### Issue 4: Can't access Atlas dashboard

**Solution:**
- Clear browser cache
- Try a different browser
- Check if you're logged in

---

## 📊 Viewing Your Data

### Using MongoDB Atlas UI

1. **Navigate to Collections**
   - Click on your cluster name
   - Click **"Browse Collections"**

2. **View/Create Database**
   - Click **"Add My Own Data"** if database doesn't exist
   - Database Name: `skinie-buddy`
   - Collection Name: `users` (or any collection)

3. **Insert Sample Document** (Optional)
   - Click on a collection
   - Click **"Insert Document"**
   - Add some test data

### Using MongoDB Compass (Desktop App)

1. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/products/compass
   - Download and install

2. **Connect to Atlas**
   - Open Compass
   - Paste your connection string
   - Click **"Connect"**

3. **Browse Your Data**
   - Visual interface to view/edit data
   - Much easier than command line!

---

## 🔐 Security Best Practices

1. **Never commit `.env` file to Git**
   ```bash
   # Already in .gitignore, but verify:
   echo ".env" >> .gitignore
   ```

2. **Use strong passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Restrict IP access in production**
   - Don't use `0.0.0.0/0` in production
   - Add only your server's IP address

4. **Rotate credentials regularly**
   - Change database passwords every few months

5. **Use environment variables**
   - Never hardcode credentials in code

---

## 📝 Quick Reference

### Your Important Information

Fill this out and keep it secure:

```
MongoDB Atlas URL: https://cloud.mongodb.com
Account Email: _____________________
Username: _____________________
Password: _____________________

Cluster Name: _____________________
Database Name: skinie-buddy
Connection String: mongodb+srv://...
```

---

## 🎉 Next Steps

Once connected successfully:

1. ✅ Test user registration endpoint
2. ✅ Test user login endpoint
3. ✅ Create some products
4. ✅ View data in Atlas dashboard

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/current/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## 💡 Common Commands

```bash
# Start backend server
npm run dev

# Check MongoDB connection
curl http://localhost:5001/api/health

# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## ⚠️ Important Notes

1. **Free Tier Limitations (M0)**:
   - 512 MB storage
   - Shared RAM
   - No automated backups
   - Cluster pauses after inactivity (but data is safe)

2. **Connection Limits**:
   - M0 Free tier: 500 connections max
   - Usually sufficient for development

3. **Data Retention**:
   - Your data is safe and persistent
   - Not deleted unless you delete the cluster

---

**✨ You're all set! Your MongoDB Atlas database is ready to use with your Skinie Buddy backend!**
