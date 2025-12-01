# Frontend Integration Guide

This guide explains how to integrate your frontend (NSGD.acx) with the NSGD backend API.

## Quick Start

After deploying your backend to Railway, you need to update the frontend to call the backend API instead of using demo mode.

## Step 1: Get Your Backend URL

After deploying to Railway, you'll get a backend URL like:
```
https://your-railway-app.railway.app
```

## Step 2: Update index.html Login Function

Open your frontend repository at:
```
https://github.com/sameedbhai123456-svg/nsgd-website/blob/main/index.html
```

Find the `<script>` section (around line 232) and replace the entire `handleLogin` function with this new code:

```javascript
const BACKEND_API = 'https://your-railway-url'; // Replace with your actual Railway URL

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMsg');
  
  if (!username || !password) {
    errorDiv.textContent = 'Please enter both username and password';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Call backend API
  fetch(`${BACKEND_API}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);
      errorDiv.style.display = 'none';
      window.location.href = '/nsgd-website/dashboard.html';
    } else {
      errorDiv.textContent = '❌ Invalid credentials';
      errorDiv.style.display = 'block';
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    errorDiv.textContent = '❌ Connection error. Is backend running?';
    errorDiv.style.display = 'block';
  });
}
```

## Step 3: Update BACKEND_API URL

Replace `https://your-railway-url` with your actual Railway backend URL.

## Step 4: Test Login

1. Go to your frontend: `https://sameedbhai123456-svg.github.io/nsgd-website/`
2. Try logging in with username: `admin` and password: `admin1234`
3. If successful, you'll be redirected to the dashboard

## Step 5: Update Ledger API Calls (Optional)

When you implement the ledger features, update them to call the backend:

```javascript
// Example: Save ledger entry
fetch(`${BACKEND_API}/api/ledger`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    username: localStorage.getItem('user'),
    date: new Date().toISOString(),
    narration: 'Entry description',
    income: 0,
    expense: 100
  })
})
.then(response => response.json())
.then(data => console.log('Ledger entry saved:', data))
.catch(error => console.error('Error:', error));
```

## Troubleshooting

**Error: "Connection error. Is backend running?"**
- Verify your Railway deployment is active
- Check the backend URL is correct
- Check if CORS is enabled (it is by default in our server.js)

**Error: "Invalid credentials"**
- Make sure MongoDB Atlas is set up with user `admin` / `admin1234`
- Check your .env file has the correct MONGODB_URI

**Login works but ledger data not saving**
- Make sure you have the token in localStorage
- Check browser console for API errors
- Verify backend API endpoints exist

## API Endpoints

- `POST /api/login` - Login
- `POST /api/register` - Register new user
- `POST /api/ledger` - Add ledger entry
- `GET /api/ledger/:username` - Get user's ledger
- `GET /api/health` - Check if backend is running
