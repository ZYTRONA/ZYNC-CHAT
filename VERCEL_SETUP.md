# Vercel Environment Variables Setup

## Current Issue

Your frontend is deployed on Vercel, but it needs to connect to your backend on Render.com. The environment variables must be configured in Vercel's dashboard.

## How to Set Vercel Environment Variables

### Option 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project**:
   - Visit: https://vercel.com/dashboard
   - Select your `zync-chat` project

2. **Navigate to Settings**:
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add these variables**:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `REACT_APP_API_URL` | `https://zync-chat-ed7e.onrender.com` | Production, Preview, Development |
   | `REACT_APP_SOCKET_URL` | `https://zync-chat-ed7e.onrender.com` | Production, Preview, Development |
   | `REACT_APP_ENV` | `production` | Production |

4. **Click "Save"** for each variable

5. **Redeploy**:
   - Go to "Deployments" tab
   - Click "..." menu on the latest deployment
   - Select "Redeploy"

### Option 2: Vercel CLI

If you have Vercel CLI installed:

```bash
cd /run/media/aadhiasarana/Storage1/ZYNC-CHAT/Client

# Add environment variables
vercel env add REACT_APP_API_URL
# When prompted, enter: https://zync-chat-ed7e.onrender.com
# Select: Production, Preview, Development

vercel env add REACT_APP_SOCKET_URL
# When prompted, enter: https://zync-chat-ed7e.onrender.com
# Select: Production, Preview, Development

vercel env add REACT_APP_ENV
# When prompted, enter: production
# Select: Production only

# Trigger a new deployment
vercel --prod
```

### Option 3: Using vercel.json

The project already has a `vercel.json` file. You can add environment variables there:

**Note**: This is NOT recommended for sensitive data, but works for public API URLs.

Edit `Client/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "https://zync-chat-ed7e.onrender.com",
    "REACT_APP_SOCKET_URL": "https://zync-chat-ed7e.onrender.com",
    "REACT_APP_ENV": "production"
  }
}
```

Then commit and push to trigger a new deployment.

---

## Verify Setup

After setting environment variables and redeploying:

1. **Check the deployment**:
   - Go to https://zync-chat-flax.vercel.app
   - Open browser DevTools (F12) → Network tab
   - Try to register a new user
   - Check that API calls go to `https://zync-chat-ed7e.onrender.com`

2. **Test registration**:
   - Username: `testuser` + random numbers
   - Password: `password123`
   - Should succeed and redirect to chat

3. **Common issues**:
   - If still calling localhost: Environment variables not set or need redeploy
   - If getting CORS errors: Check Render.com server.js has correct CORS origins
   - If connection timeout: Render.com server might be sleeping (free tier)

---

## Current Environment Setup

### Local Development (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

**When**: Running `npm start` locally  
**Connects to**: Local backend server

### Production (.env.production + Vercel Env Vars)
```env
REACT_APP_API_URL=https://zync-chat-ed7e.onrender.com
REACT_APP_SOCKET_URL=https://zync-chat-ed7e.onrender.com
REACT_APP_ENV=production
```

**When**: Deployed to Vercel  
**Connects to**: Production backend on Render.com

---

## Important Notes

✅ **Local .env files are NOT deployed to Vercel** - They're in `.gitignore`  
✅ **Vercel env vars must be set in dashboard** - This is by design for security  
✅ **Changes require redeployment** - Env vars are baked into the build  
⚠️ **Render.com free tier** - Server may sleep after 15 minutes of inactivity  

---

## Quick Fix Right Now

**Fastest way to fix your current deployment:**

1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. Add `REACT_APP_API_URL` = `https://zync-chat-ed7e.onrender.com` (all environments)
3. Add `REACT_APP_SOCKET_URL` = `https://zync-chat-ed7e.onrender.com` (all environments)
4. Go to Deployments → Click latest → Redeploy

Your frontend will then properly connect to the backend! 🚀

---

## After Database Migration

Remember to also run the database migration to fix the email index error:

```bash
cd /run/media/aadhiasarana/Storage1/ZYNC-CHAT/Server
# Temporarily update .env with production MongoDB URI
node scripts/fix-email-index.js
# Restore local MongoDB URI
```

See [PRODUCTION_FIX.md](../PRODUCTION_FIX.md) for details.
