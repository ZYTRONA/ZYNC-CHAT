# Production Deployment Fix Guide

## Problem Summary

The production server on Render.com was experiencing two errors:

1. **Rate Limiter Error**: `ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false`
2. **MongoDB Duplicate Key Error**: `E11000 duplicate key error collection: test.users index: email_1 dup key: { email: null }`

## What Was Fixed

### 1. Trust Proxy Setting ✅
**Fixed in**: `Server/server.js`

Added `app.set('trust proxy', 1)` to allow express-rate-limit to work correctly behind Render.com's proxy.

**Status**: ✅ Automatically fixed after deployment

### 2. MongoDB Email Index ⚠️
**Issue**: The production MongoDB database has an obsolete `email_1` unique index that doesn't exist in the current User model.

**Status**: ⚠️ Requires manual migration

## How to Fix Production Database

You have **two options** to fix the email index issue:

---

### Option 1: Run Migration Script from Local (Recommended)

This is the safest method as you can see the output and control the process.

1. **Update Server/.env with production MongoDB URI**:
   ```env
   MONGODB_URI=mongodb+srv://your-production-connection-string
   ```

2. **Run the migration script**:
   ```bash
   cd Server
   node scripts/fix-email-index.js
   ```

3. **Verify output**:
   ```
   ✅ Connected to MongoDB
   
   Current indexes on users collection:
     - {"_id":1} (name: _id_)
     - {"username":1} (name: username_1)
     - {"email":1} (name: email_1)  ← This will be removed
   
   ⚠️  Found obsolete email_1 index. Dropping it...
   ✅ Successfully dropped email_1 index
   ```

4. **Restore local connection** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/zync-chat
   ```

---

### Option 2: Run from MongoDB Compass or Shell

If you prefer using MongoDB tools directly:

1. **Connect to production database** using MongoDB Compass or mongo shell

2. **Run this command** in the mongo shell:
   ```javascript
   use test
   db.users.dropIndex("email_1")
   ```

   Or in MongoDB Compass:
   - Navigate to `test` database → `users` collection → Indexes tab
   - Find `email_1` index
   - Click the trash icon to delete it

---

### Option 3: Manual SSH to Render.com (Advanced)

If Render.com allows SSH access:

1. SSH into your Render.com instance
2. Run: `node scripts/fix-email-index.js`

---

## After Running Migration

1. **Test registration** on production:
   - Go to https://zync-chat-flax.vercel.app/register
   - Try creating a new account
   - Should work without errors

2. **Monitor Render.com logs**:
   - Check for any new errors
   - Verify registration attempts succeed

3. **Verify both errors are fixed**:
   - ✅ No more "trust proxy" errors
   - ✅ No more "E11000 duplicate key" errors

---

## What If I See Other Errors?

### "Connection timeout" or "Cannot connect to MongoDB"
- Check your MongoDB URI is correct
- Verify MongoDB allows connections from your IP
- Check MongoDB Atlas network access settings

### "Index still exists after dropping"
- Verify you connected to the correct database
- Check if there are multiple MongoDB connections
- Try running the script again

### "Permission denied"
- Ensure your MongoDB user has admin/write permissions
- Check database access roles in MongoDB Atlas

---

## Safety Notes

✅ **Safe to run multiple times** - The script checks if the index exists first  
✅ **Non-destructive** - Only removes an index, doesn't delete user data  
✅ **No downtime required** - Can run while the app is live  
⚠️ **Backup recommended** - Although safe, always good practice  

---

## Quick Status Check

After deployment, you can verify everything is working by:

```bash
# Check if the fix is deployed
curl https://zync-chat-ed7e.onrender.com/health

# Test registration (should not fail with duplicate key error)
curl -X POST https://zync-chat-ed7e.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser_'$(date +%s)'","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": {...}
}
```

---

## Need Help?

If you encounter issues:
1. Check Render.com logs for new errors
2. Verify MongoDB connection string is correct
3. Run the migration script with production credentials
4. Check MongoDB Atlas network access settings

The deployment with `trust proxy` fix is already live. You just need to run the database migration to complete the fix! 🚀
