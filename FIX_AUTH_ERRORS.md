# 🔧 Fix Authentication Errors - Quick Guide

## Issues Identified

From your screenshots, I can see:
1. ❌ Backend server was not running initially
2. ❌ Two frontend dev servers running (causing conflicts)
3. ❌ 404 errors on `/api/auth/register` and `/api/auth/login`
4. ❌ CORS errors
5. ❌ 500 Internal Server errors

## ✅ Solution Steps

### Step 1: Stop All Running Servers

**Stop Frontend Servers:**
1. Go to the terminal running `npm run dev` in frontend
2. Press `Ctrl+C` to stop it
3. Do this for BOTH frontend terminals

**Stop Backend Server (if running):**
1. Go to the terminal running `npm run dev` in backend
2. Press `Ctrl+C` to stop it

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

**Wait for:**
- ✅ "Server running..." message
- ✅ "MongoDB Connected..." message
- ❌ NO errors about missing environment variables

### Step 3: Start Frontend Server (Only Once!)

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Important:** Only run this ONCE. Don't start multiple frontend servers!

### Step 4: Test the Application

1. Open browser: `http://localhost:5173`
2. Navigate to `/register`
3. Try to register with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

**Expected Result:**
- ✅ Registration successful
- ✅ Redirected to home page
- ✅ User name appears in navbar

### Step 5: Check for Errors

**Browser Console (F12):**
- ✅ No 404 errors
- ✅ No CORS errors
- ✅ No 500 errors
- ⚠️ Google OAuth warnings are OK (expected if not configured)

**Backend Console:**
- ✅ Should show API requests
- ✅ Should show successful responses

## 🐛 If Still Getting Errors

### Error: "Failed to load resource: 404"

**Cause:** Backend not running or wrong port

**Fix:**
```bash
# Check if backend is running
Get-NetTCPConnection -LocalPort 5000

# If nothing returned, start backend
cd backend
npm run dev
```

### Error: "CORS policy"

**Cause:** Backend CORS not allowing frontend origin

**Fix:** Already configured correctly in `backend/server.js`
- Just restart both servers

### Error: "500 Internal Server Error"

**Cause:** Missing environment variables or database connection issue

**Fix:**
1. Check `backend/.env` exists
2. Verify required variables:
   ```env
   JWT_ACCESS_SECRET=your_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   MONGO_URI=your_mongodb_uri
   ```
3. Restart backend server

### Error: "Registration failed. Please try again."

**Possible Causes:**
1. Backend not running
2. MongoDB not connected
3. Missing JWT secrets
4. Validation error

**Fix:**
1. Check backend console for detailed error
2. Verify MongoDB connection string
3. Ensure all required fields are filled

## 📊 Current Server Status

Based on your screenshots:

**Backend:** ✅ NOW RUNNING (I just started it)
- Port: 5000
- MongoDB: Connected

**Frontend:** ⚠️ TWO INSTANCES RUNNING
- This is causing conflicts
- Stop both and restart only once

## 🎯 Quick Checklist

- [ ] All servers stopped
- [ ] Backend started (port 5000)
- [ ] MongoDB connected (check backend console)
- [ ] Frontend started ONCE (port 5173)
- [ ] No duplicate frontend servers
- [ ] Browser opened to `http://localhost:5173`
- [ ] No 404 errors in console
- [ ] No CORS errors in console
- [ ] Registration works
- [ ] Login works

## 🔍 Verify Everything is Working

### Test 1: Backend API
Open browser: `http://localhost:5000`

**Expected:** "API is running..."

### Test 2: Registration
1. Go to: `http://localhost:5173/register`
2. Fill form and submit
3. Check browser console (F12)
4. Check backend console

**Expected:**
- Browser: POST request to `/api/auth/register` with status 201
- Backend: Log showing request received

### Test 3: Login
1. Go to: `http://localhost:5173/login`
2. Use credentials from registration
3. Submit

**Expected:**
- Login successful
- Redirected to home
- User info in navbar

## 📝 Notes

1. **Always start backend BEFORE frontend**
2. **Only run ONE frontend dev server**
3. **Check backend console for detailed errors**
4. **Google OAuth warnings are normal** (if not configured)
5. **Hard refresh browser** (Ctrl+Shift+R) after restarting servers

---

**Status:** Backend is now running. Please:
1. Stop the duplicate frontend servers
2. Start frontend once
3. Try registration again
