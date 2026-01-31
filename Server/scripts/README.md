# Database Migration Scripts

This directory contains database migration and maintenance scripts.

## fix-email-index.js

**Purpose:** Removes the obsolete `email_1` unique index from the users collection that was causing duplicate key errors.

**When to use:**
- When you see the error: `E11000 duplicate key error collection: test.users index: email_1 dup key: { email: null }`
- After removing the email field from the User model
- Before deploying to production if the database still has the old schema

**How to run:**

### For Production (Render.com):
1. Set up your production MongoDB connection string in the Server/.env file
2. Run from the Server directory:
   ```bash
   cd Server
   node scripts/fix-email-index.js
   ```

### For Local Development:
1. Make sure MongoDB is running locally
2. Update Server/.env with your local MongoDB URI
3. Run the script:
   ```bash
   cd Server
   node scripts/fix-email-index.js
   ```

**What it does:**
1. Connects to your MongoDB database
2. Lists all current indexes on the users collection
3. Checks if the `email_1` index exists
4. Drops the index if found
5. Shows the final index state
6. Disconnects and exits

**Expected output:**
```
Connecting to MongoDB...
✅ Connected to MongoDB

Current indexes on users collection:
  - {"_id":1} (name: _id_)
  - {"username":1} (name: username_1)
  - {"email":1} (name: email_1)
  - {"socketId":1} (name: socketId_1)

⚠️  Found obsolete email_1 index. Dropping it...
✅ Successfully dropped email_1 index

Final indexes on users collection:
  - {"_id":1} (name: _id_)
  - {"username":1} (name: username_1)
  - {"socketId":1} (name: socketId_1)

✅ Migration completed successfully!

Disconnected from MongoDB
```

## Safety Notes

- ✅ Safe to run multiple times (idempotent)
- ✅ Non-destructive (only removes an index, not data)
- ✅ Can be run on production without downtime
- ⚠️ Requires database connection
- ⚠️ Make sure you have the correct MONGODB_URI in your .env file
