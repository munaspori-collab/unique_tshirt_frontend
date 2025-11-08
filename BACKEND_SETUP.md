# Backend Configuration Checklist for Render

## 🚨 CRITICAL: Your Backend Needs These Environment Variables

Your backend at `https://unique-tshirt-backend.onrender.com` needs the following environment variables configured in Render:

### Required Environment Variables

1. **GOOGLE_CLIENT_ID** (NOT NEXT_PUBLIC_GOOGLE_CLIENT_ID)
   ```
   835813120635-rh8gom89kmmcfvgpogb6273k4vh65f8q.apps.googleusercontent.com
   ```

2. **FRONTEND_ORIGIN**
   ```
   https://munaspori-collab.github.io
   ```
   
3. **MONGODB_URI**
   ```
   Your MongoDB connection string
   ```

4. **JWT_SECRET**
   ```
   A secure random string (e.g., generate with: openssl rand -base64 32)
   ```

5. **ADMIN_EMAIL**
   ```
   munaspori@gmail.com
   ```

6. **CLOUDINARY_CLOUD_NAME**
   ```
   Your Cloudinary cloud name
   ```

7. **CLOUDINARY_API_KEY**
   ```
   Your Cloudinary API key
   ```

8. **CLOUDINARY_API_SECRET**
   ```
   Your Cloudinary API secret
   ```

## 🔧 How to Add Environment Variables in Render

1. Go to: https://dashboard.render.com/
2. Click on your backend service: `unique-tshirt-backend`
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable from the list above
6. Click **Save Changes**
7. Render will automatically redeploy your backend

## 🔍 Testing After Configuration

Once deployed, test these URLs:

1. **Health Check**:
   ```
   https://unique-tshirt-backend.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

2. **Products API**:
   ```
   https://unique-tshirt-backend.onrender.com/api/products
   ```
   Should return array of products

## ⚠️ Common Issues

### Issue 1: CORS Errors
**Symptom**: Console shows "CORS policy" errors
**Solution**: Make sure `FRONTEND_ORIGIN` is set to `https://munaspori-collab.github.io` (without trailing slash)

### Issue 2: Google OAuth Fails
**Symptom**: "Login failed. Please try again."
**Solution**: 
1. Check `GOOGLE_CLIENT_ID` is set in backend (NOT the NEXT_PUBLIC_ version)
2. Verify it's the same client ID as frontend: `835813120635-rh8gom89kmmcfvgpogb6273k4vh65f8q.apps.googleusercontent.com`

### Issue 3: Token Verification Fails
**Symptom**: Auth works but user info doesn't load
**Solution**: Check `JWT_SECRET` is set and is a strong random string

### Issue 4: Backend is Sleeping
**Symptom**: First request takes 30+ seconds
**Solution**: Render free tier services sleep after 15 mins of inactivity. First request wakes it up. Consider upgrading to paid tier for always-on.

## 🔐 Google OAuth Setup

Make sure your Google OAuth consent screen has:

1. **Authorized JavaScript origins**:
   - `https://munaspori-collab.github.io`

2. **Authorized redirect URIs**:
   - `https://munaspori-collab.github.io/unique_tshirt_frontend`
   - `https://munaspori-collab.github.io`

Configure at: https://console.cloud.google.com/apis/credentials

## 📊 Debugging Steps

When you try to login again, open browser console (F12) and check for:

1. **Console logs**:
   ```
   Attempting login with API: https://unique-tshirt-backend.onrender.com
   Response status: XXX
   ```

2. **Network tab**:
   - Look for request to `/api/auth/google`
   - Check response status code
   - Check response body for error message

3. **Common Response Codes**:
   - `200` = Success (but might still fail if JWT issue)
   - `401` = Google token invalid or GOOGLE_CLIENT_ID not set
   - `500` = Server error (check Render logs)
   - `0` or `CORS error` = FRONTEND_ORIGIN not set correctly

## 📝 Next Steps

1. ✅ Configure all environment variables in Render
2. ✅ Wait for Render to redeploy (2-3 minutes)
3. ✅ Test the site again
4. ✅ Check browser console for detailed logs
5. ✅ If still failing, check Render logs for backend errors
