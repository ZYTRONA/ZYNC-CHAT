require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');

/**
 * Migration Script: Remove Old Email Index
 * 
 * This script removes the obsolete 'email_1' index from the users collection
 * that was causing duplicate key errors in production.
 * 
 * Run this script with: node scripts/fix-email-index.js
 */

async function fixEmailIndex() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check existing indexes
    console.log('\nCurrent indexes on users collection:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
    });

    // Check if email_1 index exists
    const hasEmailIndex = indexes.some(index => index.name === 'email_1');
    
    if (hasEmailIndex) {
      console.log('\n⚠️  Found obsolete email_1 index. Dropping it...');
      await usersCollection.dropIndex('email_1');
      console.log('✅ Successfully dropped email_1 index');
    } else {
      console.log('\n✅ No email_1 index found. Database is clean!');
    }

    // Verify final state
    console.log('\nFinal indexes on users collection:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)} (name: ${index.name})`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
fixEmailIndex();
