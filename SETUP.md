# NSGD Backend Setup Guide

This guide will help you set up the NSGD backend with MongoDB and deploy it to Railway.

## Step 1: Clone the Repository

```bash
git clone https://github.com/sameedbhai123456-svg/nsgd-backend.git
cd nsgd-backend
npm install
```

## Step 2: Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Create an account" (or login if you already have one)
3. Create a new project called "NSGD"
4. Create a cluster:
   - Select "M0 Sandbox" (free tier)
   - Choose region: Select your closest region
   - Click "Create"
5. Wait for cluster to be created (5-10 minutes)
6. Set up database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: `admin1234` (or your choice)
   - Click "Add User"
7. Add IP Whitelist:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow access from anywhere" (for development)
   - Click "Confirm"
8. Get connection string:
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` with `admin`
   - Replace `<password>` with your password

## Step 3: Create .env File

Create a `.env` file in your project root:

```
MONGODB_URI=mongodb+srv://admin:admin1234@cluster0.xxxxx.mongodb.net/nsgd_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

## Step 4: Deploy to Railway (Free Tier)

1. Go to [Railway](https://railway.app)
2. Click "Start a New Project"
3. Click "Deploy from GitHub"
4. Select your `nsgd-backend` repository
5. Railway will auto-detect Node.js and create deployment
6. Add environment variables:
   - Go to "Variables" tab
   - Add `MONGODB_URI` with your connection string
   - Add `JWT_SECRET` with a strong key
   - Add `NODE_ENV` as `production`
   - Add `PORT` as `5000`
7. Railway will auto-deploy. Wait for build to complete.
8. Get your backend URL from the "Deployments" tab

## Step 5: Test Backend

Try accessing:
```
https://your-railway-url/api/health
```

You should see: `{"status":"Backend server is running"}`

## Step 6: Update Frontend

Update the login function in your frontend's `index.html` to point to your backend URL.

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/ledger` - Add ledger entry
- `GET /api/ledger/:username` - Get user's ledger entries
- `GET /api/health` - Health check

## Troubleshooting

- If MongoDB connection fails: Check your IP whitelist and connection string
- If Railway deployment fails: Check the logs in Railway dashboard
- If API endpoints don't work: Check the backend logs for errors
