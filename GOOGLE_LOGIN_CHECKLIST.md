# ✅ Google Login Configuration Checklist

**Quick reference guide for enabling Google Login**

---

## 📋 Pre-Flight Checklist

### 1. Environment Variables

#### Frontend (.env)
```bash
cd frontend
```

Create/edit `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2.apps.googleusercontent.com
```

- [ ] File created at `frontend/.env`
- [ ] `VITE_GOOGLE_CLIENT_ID` is set
- [ ] No quotes around the value
- [ ] No trailing spaces

---

#### Backend (.env)
```bash
cd backend
```

Create/edit `.env` file:
```env
# Required for all auth
JWT_ACCESS_SECRET=your_long_random_secret_here
JWT_REFRESH_SECRET=your_different_long_random_secret_here
MONGO_URI=your_mongodb_connection_string

# Required for Google Login
GOOGLE_CLIENT_ID=503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:5173

# Optional but recommended
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Required for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- [ ] File created at `backend/.env`
- [ ] `JWT_ACCESS_SECRET` is set (generate random string)
- [ ] `JWT_REFRESH_SECRET` is set (different from access secret)
- [ ] `MONGO_URI` is set
- [ ] `GOOGLE_CLIENT_ID` matches frontend
- [ ] `GOOGLE_CLIENT_SECRET` is obtained from Google Cloud Console
- [ ] `GOOGLE_REDIRECT_URI` is set to `http://localhost:5173`

**Generate Secrets:**
```bash
# In PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

---

### 2. Google Cloud Console Setup

#### Access Console
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Login with your Google account
- [ ] Select your project (or create new one)

#### Navigate to Credentials
- [ ] Click ☰ menu → **APIs & Services** → **Credentials**
- [ ] Find OAuth 2.0 Client ID: `503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2`
- [ ] Click ✏️ (edit icon)

#### Configure Authorized JavaScript Origins
Add this URL:
```
http://localhost:5173
```

**Important:**
- [ ] Use `http://` (not `https://`)
- [ ] No trailing slash
- [ ] Include port `:5173`
- [ ] Exactly as shown above

#### Configure Authorized Redirect URIs
Add these URLs:
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/register
```

- [ ] All three URLs added
- [ ] No trailing slashes
- [ ] Exactly as shown above

#### Get Client Secret
- [ ] Click on the OAuth client name
- [ ] Find **Client secret** field
- [ ] Click copy icon
- [ ] Paste into `backend/.env` as `GOOGLE_CLIENT_SECRET`

#### Save Changes
- [ ] Click **Save** button
- [ ] Wait 10 seconds for changes to propagate

---

### 3. OAuth Consent Screen (if needed)

- [ ] Go to **APIs & Services** → **OAuth consent screen**
- [ ] User Type: **External** (for testing)
- [ ] App name: Your app name
- [ ] User support email: Your email
- [ ] Developer contact: Your email
- [ ] Click **Save and Continue**
- [ ] Scopes: Default is fine (email, profile, openid)
- [ ] Test users: Add your test email addresses
- [ ] Click **Save and Continue**

---

### 4. Dependencies Check

#### Backend
```bash
cd backend
npm install
```

Verify `package.json` includes:
- [ ] `google-auth-library@^10.5.0`
- [ ] `jsonwebtoken@^9.0.3`
- [ ] `bcryptjs@^3.0.3`
- [ ] `mongoose@^9.0.1`
- [ ] `express@^5.2.1`
- [ ] `cookie-parser@^1.4.7`
- [ ] `dotenv@^17.2.3`

#### Frontend
```bash
cd frontend
npm install
```

Verify `package.json` includes:
- [ ] `react@^18.x`
- [ ] `react-redux@^9.x`
- [ ] `@reduxjs/toolkit@^2.x`
- [ ] `react-router-dom@^6.x`

---

### 5. Start Servers

#### Backend
```bash
cd backend
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

- [ ] Server starts without errors
- [ ] No "Missing required environment variables" error
- [ ] MongoDB connection successful
- [ ] Port 5000 is listening

#### Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

- [ ] Server starts without errors
- [ ] Accessible at `http://localhost:5173`
- [ ] No console errors on page load

---

## 🧪 Testing

### Test 1: Visual Check
1. [ ] Navigate to `http://localhost:5173/login`
2. [ ] See "Or continue with" divider
3. [ ] See Google Sign-In button
4. [ ] Button has Google logo and "Continue with Google" text

**If button is missing:**
- Check browser console for warnings
- Verify `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`
- Restart frontend dev server

---

### Test 2: Click Google Button
1. [ ] Click "Continue with Google" button
2. [ ] Google popup/redirect appears
3. [ ] See list of Google accounts

**If 403 error appears:**
- Check Google Cloud Console Authorized JavaScript Origins
- Must include `http://localhost:5173`
- Wait 10 seconds and try again
- Hard refresh browser (Ctrl+Shift+R)

---

### Test 3: Complete Login
1. [ ] Select a Google account
2. [ ] Grant permissions (if first time)
3. [ ] Redirected back to your app
4. [ ] Logged in successfully
5. [ ] User name appears in navbar
6. [ ] User avatar shows Google profile picture

**If login fails:**
- Check backend console for errors
- Verify `GOOGLE_CLIENT_ID` matches in both `.env` files
- Verify `GOOGLE_CLIENT_SECRET` is correct
- Check MongoDB connection

---

### Test 4: Check Database
1. [ ] Open MongoDB (Compass or Atlas)
2. [ ] Find `users` collection
3. [ ] Find the user you just logged in with
4. [ ] Verify fields:
   - `name`: Your Google name
   - `email`: Your Google email
   - `googleId`: Long number (Google's user ID)
   - `avatar`: Google profile picture URL
   - `role`: "user"
   - `password`: Should NOT exist

---

### Test 5: Logout and Re-login
1. [ ] Click logout
2. [ ] Navigate to `/login`
3. [ ] Click "Continue with Google"
4. [ ] Should login immediately (no permission prompt)
5. [ ] Same user data appears

---

### Test 6: Agent Registration
1. [ ] Logout
2. [ ] Navigate to `/register?isSeller=true`
3. [ ] Click "Continue with Google"
4. [ ] Use different Google account
5. [ ] Should redirect to `/seller/dashboard`
6. [ ] Check database: `role` should be "agent"

---

## 🐛 Troubleshooting

### Issue: Google button not showing

**Check:**
```bash
# Frontend .env exists?
ls frontend/.env

# Contains VITE_GOOGLE_CLIENT_ID?
cat frontend/.env | grep VITE_GOOGLE_CLIENT_ID
```

**Fix:**
1. Create `frontend/.env`
2. Add `VITE_GOOGLE_CLIENT_ID=...`
3. Restart frontend dev server

---

### Issue: 403 origin_mismatch

**Check Google Cloud Console:**
1. Authorized JavaScript Origins includes `http://localhost:5173`
2. No typos, no trailing slash
3. Saved changes

**Fix:**
1. Edit OAuth client
2. Add `http://localhost:5173` to Authorized JavaScript Origins
3. Save
4. Wait 10 seconds
5. Hard refresh browser

---

### Issue: "Google authentication failed"

**Check backend console for error details**

**Common causes:**
- `GOOGLE_CLIENT_ID` mismatch
- `GOOGLE_CLIENT_SECRET` incorrect
- `google-auth-library` not installed

**Fix:**
1. Verify both `.env` files have same Client ID
2. Get Client Secret from Google Cloud Console
3. Run `npm install` in backend
4. Restart backend server

---

### Issue: User created but not logged in

**Check browser console for errors**

**Fix:**
1. Verify Redux store is configured
2. Check `GoogleLoginBtn.jsx` dispatch logic
3. Check network tab for API response

---

## 📊 Success Criteria

### ✅ All Systems Go

- [ ] Frontend `.env` configured
- [ ] Backend `.env` configured
- [ ] Google Cloud Console configured
- [ ] Both servers running without errors
- [ ] Google button visible on login/register pages
- [ ] Can click button without 403 error
- [ ] Can complete Google login
- [ ] User created in database with `googleId`
- [ ] User logged in and redirected
- [ ] User info appears in navbar
- [ ] Can logout and re-login
- [ ] Agent registration works with `?isSeller=true`

---

## 🎯 Quick Commands

### Check if .env files exist
```bash
# PowerShell
Test-Path frontend\.env
Test-Path backend\.env
```

### View .env files (be careful with secrets!)
```bash
# PowerShell
Get-Content frontend\.env
Get-Content backend\.env
```

### Restart servers
```bash
# Stop with Ctrl+C, then:
cd backend
npm run dev

# In another terminal:
cd frontend
npm run dev
```

### Check if ports are in use
```bash
# PowerShell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

---

## 📚 Additional Resources

- **Full Review:** `GOOGLE_LOGIN_REVIEW.md`
- **Detailed Setup:** `frontend/GOOGLE_OAUTH_SETUP.md`
- **JWT Setup:** `JWT_SECRET_ERROR_FIX.md`
- **Error Solutions:** `CONSOLE_ERRORS_FIXED.md`
- **General Setup:** `README.md`

---

## 🆘 Still Having Issues?

1. **Check browser console** for detailed errors
2. **Check backend console** for server errors
3. **Review** `GOOGLE_LOGIN_REVIEW.md` for detailed implementation
4. **Review** `frontend/GOOGLE_OAUTH_SETUP.md` for Google Cloud setup
5. **Verify** all checklist items above

**Remember:** Email/password authentication works independently of Google Login. If Google Login is not working, users can still register and login with email/password.

---

**Last Updated:** December 14, 2025
