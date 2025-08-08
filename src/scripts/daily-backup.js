// scripts/daily-backup.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createDailyBackup() {
  const date = new Date().toISOString().split('T')[0];
  const backupDir = `./daily-backups/${date}`;
  
  console.log('🚀 Starting daily backup...');
  
  try {
    // 1. Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 2. Git commit current state
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "📦 Daily backup - ${date}" || echo "No changes to commit"`, { stdio: 'inherit' });
    
    // 3. Push to GitHub
    execSync('git push origin main', { stdio: 'inherit' });
    
    // 4. Backup database
    execSync('node scripts/backup-database.js', { stdio: 'inherit' });
    
    // 5. Copy source files
    execSync(`cp -r ./src ${backupDir}/`, { stdio: 'inherit' });
    execSync(`cp package.json ${backupDir}/`, { stdio: 'inherit' });
    
    console.log('✅ Daily backup completed successfully!');
    
  } catch (error) {
    console.error('❌ Daily backup failed:', error);
  }
}

createDailyBackup();