# 🔧 Fix Google Sign-In 403 Error

## Current Issue
Your Google Client ID `503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2.apps.googleusercontent.com` is configured in the `.env` file, but Google Cloud Console is rejecting it with a **403 error**.

This means the **Authorized JavaScript Origins** and **Authorized Redirect URIs** are not properly configured in your Google Cloud Console.

---

## ✅ Step-by-Step Fix

### Step 1: Open Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're logged in with the Google account that created the OAuth client
3. Select your project from the dropdown at the top

### Step 2: Navigate to Credentials

1. Click on the **☰ menu** (hamburger icon) in the top-left
2. Go to **APIs & Services** → **Credentials**
3. You should see your OAuth 2.0 Client ID in the list

### Step 3: Edit OAuth Client

1. Find the client with ID: `503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2`
2. Click the **✏️ edit icon** (pencil) next to it

### Step 4: Configure Authorized JavaScript Origins

In the **Authorized JavaScript origins** section, add:

```
http://localhost:5173
```

**Important Notes:**
- ✅ Use `http://` (not `https://` for localhost)
- ✅ No trailing slash
- ✅ Include the port number `:5173`

### Step 5: Configure Authorized Redirect URIs

In the **Authorized redirect URIs** section, add:

```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/register
```

### Step 6: Save Changes

1. Click the **Save** button at the bottom
2. Wait a few seconds for changes to propagate

### Step 7: Test

1. Go back to your application: `http://localhost:5173/login`
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. The "Continue with Google" button should now work without 403 errors

---

## 🎯 Expected Configuration

Your OAuth client should look like this:

### Application Type
- **Web application**

### Authorized JavaScript origins
```
http://localhost:5173
```

### Authorized redirect URIs
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/register
```

---

## 🔍 Troubleshooting

### Still Getting 403 Errors?

**Check 1: Correct Project**
- Make sure you're editing the OAuth client in the correct Google Cloud project
- The Client ID should match: `503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2`

**Check 2: Wait for Propagation**
- Google's changes can take 5-10 seconds to propagate
- Try clearing your browser cache
- Try in an incognito/private window

**Check 3: OAuth Consent Screen**
- Go to **APIs & Services** → **OAuth consent screen**
- Make sure it's configured (at least in "Testing" mode)
- Add your test email to the "Test users" list if in Testing mode

**Check 4: Verify Origins Format**
- Must be exactly: `http://localhost:5173`
- No trailing slash: ~~`http://localhost:5173/`~~ ❌
- No path: ~~`http://localhost:5173/login`~~ ❌ (this goes in redirect URIs)
- Include port: ~~`http://localhost`~~ ❌

### "Client ID not found" Error?

This means:
1. The Client ID in your `.env` file doesn't match any OAuth client in your project
2. You might be in the wrong Google Cloud project
3. The OAuth client might have been deleted

**Solution:**
- Double-check the Client ID in Google Cloud Console
- Copy it exactly (including the `.apps.googleusercontent.com` part)
- Paste it into your `.env` file
- Restart your dev server

---

## 🚀 For Production Deployment

When you deploy to production, you'll need to add your production domain:

### Authorized JavaScript origins
```
http://localhost:5173              (for development)
https://yourdomain.com             (for production)
```

### Authorized redirect URIs
```
http://localhost:5173              (for development)
http://localhost:5173/login        (for development)
https://yourdomain.com             (for production)
https://yourdomain.com/login       (for production)
```

---

## 📝 Current Environment Variables

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2.apps.googleusercontent.com
```
✅ This is correct

### Backend (.env)
```env
GOOGLE_CLIENT_ID=503765245332-gdi14j2lbpinumt9epnhikot0f8btvq2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
⚠️ You need to get the actual Client Secret from Google Cloud Console

---

## 🔐 Getting the Client Secret

1. In Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. You'll see **Client secret** displayed
4. Click the **copy** icon to copy it
5. Replace `your_google_client_secret` in your backend `.env` file
6. Restart your backend server

---

## ✅ Verification Checklist

After making changes:

- [ ] Authorized JavaScript origins includes `http://localhost:5173`
- [ ] Authorized redirect URIs includes `http://localhost:5173`
- [ ] Changes saved in Google Cloud Console
- [ ] Waited 10 seconds for propagation
- [ ] Hard refreshed the browser (Ctrl+Shift+R)
- [ ] No 403 errors in console
- [ ] "Continue with Google" button appears
- [ ] Clicking the button opens Google sign-in popup

---

## 🆘 Still Need Help?

If you're still having issues:

1. **Screenshot your OAuth client configuration** in Google Cloud Console
2. **Check the exact error message** in the browser console
3. **Verify the Client ID** matches exactly in both places
4. **Try in incognito mode** to rule out cache issues

Remember: **Email/password authentication works perfectly** - Google Sign-In is just an optional convenience feature!
