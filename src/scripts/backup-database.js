// scripts/backup-database.js - Quick backup script for your CRM
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// You'll need to download your serviceAccountKey.json from Firebase Console
// Go to Project Settings > Service Accounts > Generate new private key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backupFirestore() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const timeStr = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
  const backupDir = `./backups/${timestamp}_${timeStr}`;
  
  console.log('🚀 Starting CRM database backup...');
  
  // Create backup directory
  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups');
  }
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    const usersData = {};
    let totalUsers = 0;
    let totalClients = 0;
    let totalLeads = 0;
    let totalTasks = 0;
    let totalDeals = 0;
    let totalCommunications = 0;

    console.log(`📊 Found ${usersSnapshot.docs.length} users to backup...`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      totalUsers++;
      
      usersData[userId] = {
        profile: userData,
        collections: {}
      };

      console.log(`👤 Backing up user: ${userData.name || userId}`);

      // Backup user's subcollections
      const collections = ['clients', 'leads', 'tasks', 'deals', 'communications'];
      
      for (const collectionName of collections) {
        try {
          const collectionSnapshot = await db
            .collection(`users/${userId}/${collectionName}`)
            .get();
          
          usersData[userId].collections[collectionName] = {};
          
          collectionSnapshot.docs.forEach(doc => {
            const data = doc.data();
            // Convert Firebase Timestamps to ISO strings for JSON compatibility
            const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
              if (value && typeof value === 'object' && value._seconds) {
                return new Date(value._seconds * 1000).toISOString();
              }
              return value;
            }));
            
            usersData[userId].collections[collectionName][doc.id] = cleanData;
          });

          const count = collectionSnapshot.docs.length;
          console.log(`  📁 ${collectionName}: ${count} documents`);
          
          // Update counters
          switch(collectionName) {
            case 'clients': totalClients += count; break;
            case 'leads': totalLeads += count; break;
            case 'tasks': totalTasks += count; break;
            case 'deals': totalDeals += count; break;
            case 'communications': totalCommunications += count; break;
          }
          
        } catch (collectionError) {
          console.warn(`⚠️  Could not backup ${collectionName} for user ${userId}:`, collectionError.message);
          usersData[userId].collections[collectionName] = {};
        }
      }
    }

    // Save backup to file
    const backupFile = path.join(backupDir, 'firestore-backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(usersData, null, 2));
    
    // Create backup summary
    const summary = {
      timestamp: new Date().toISOString(),
      version: 'MyImoMate CRM Enhanced v1.0',
      totals: {
        users: totalUsers,
        clients: totalClients,
        leads: totalLeads,
        tasks: totalTasks,
        deals: totalDeals,
        communications: totalCommunications
      },
      backupFile: backupFile,
      size: fs.statSync(backupFile).size
    };
    
    fs.writeFileSync(path.join(backupDir, 'backup-summary.json'), JSON.stringify(summary, null, 2));
    
    console.log('\n✅ Backup completed successfully!');
    console.log(`📁 Location: ${backupFile}`);
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${totalUsers}`);
    console.log(`   🏠 Clients: ${totalClients}`);
    console.log(`   🎯 Leads: ${totalLeads}`);
    console.log(`   📋 Tasks: ${totalTasks}`);
    console.log(`   💼 Deals: ${totalDeals}`);
    console.log(`   💬 Communications: ${totalCommunications}`);
    console.log(`   💾 File size: ${(summary.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

// Create restore function
async function restoreFirestore(backupFile) {
  if (!fs.existsSync(backupFile)) {
    console.error('❌ Backup file not found:', backupFile);
    return;
  }

  console.log('🔄 Starting database restore...');
  console.log('⚠️  WARNING: This will overwrite existing data!');
  
  // In a real scenario, you'd want confirmation here
  // For now, we'll just log what would happen
  console.log('📁 Reading backup file...');
  
  try {
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    for (const [userId, userData] of Object.entries(backupData)) {
      console.log(`👤 Would restore user: ${userData.profile.name || userId}`);
      
      // Restore user profile
      // await db.collection('users').doc(userId).set(userData.profile);
      
      // Restore subcollections
      for (const [collectionName, collectionData] of Object.entries(userData.collections)) {
        const docCount = Object.keys(collectionData).length;
        console.log(`  📁 Would restore ${docCount} ${collectionName} documents`);
        
        // Uncomment to actually restore:
        // for (const [docId, docData] of Object.entries(collectionData)) {
        //   await db
        //     .collection(`users/${userId}/${collectionName}`)
        //     .doc(docId)
        //     .set(docData);
        // }
      }
    }
    
    console.log('✅ Restore simulation completed!');
    console.log('💡 To actually restore, uncomment the restore code in the script');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
  }
}

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'backup') {
  backupFirestore();
} else if (command === 'restore' && arg) {
  restoreFirestore(arg);
} else {
  console.log('🛡️  MyImoMate CRM Backup Tool');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/backup-database.js backup');
  console.log('  node scripts/backup-database.js restore <backup-file>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/backup-database.js backup');
  console.log('  node scripts/backup-database.js restore ./backups/2025-01-08_14-30-00/firestore-backup.json');
}