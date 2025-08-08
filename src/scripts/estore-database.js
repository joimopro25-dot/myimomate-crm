// scripts/restore-database.js
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function restoreFirestore(backupFile) {
  const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  
  for (const [userId, userData] of Object.entries(backupData)) {
    // Restore user profile
    await db.collection('users').doc(userId).set(userData.profile);
    
    // Restore subcollections
    for (const [collectionName, collectionData] of Object.entries(userData.collections)) {
      for (const [docId, docData] of Object.entries(collectionData)) {
        await db
          .collection(`users/${userId}/${collectionName}`)
          .doc(docId)
          .set(docData);
      }
    }
  }
  
  console.log('✅ Database restored successfully!');
}

// Usage: node scripts/restore-database.js backup-file.json
const backupFile = process.argv[2];
if (backupFile) {
  restoreFirestore(backupFile);
} else {
  console.log('Please provide backup file path');
}