require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { connectDB, disconnectDB } = require('./db/mongoose');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Backup directory
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// Function to create automatic backup
async function createBackup() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFileName = `backup_${timestamp}.json`;
  const backupPath = path.join(backupDir, backupFileName);
  
  const records = await db.listRecords();
  fs.writeFileSync(backupPath, JSON.stringify(records, null, 2));
  console.log(`📦 Backup created: ${backupFileName}`);
}

// Function to sort records
function sortRecords(records, field, order) {
  const sorted = [...records];
  
  sorted.sort((a, b) => {
    let valA, valB;
    
    if (field === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    }
    
    if (order === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });
  
  return sorted;
}

// Function to export data to text file
async function exportData() {
  const records = await db.listRecords();
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').slice(0, 19);
  
  let content = `========================================\n`;
  content += `        NODEVAULT DATA EXPORT\n`;
  content += `========================================\n\n`;
  content += `Export Date/Time: ${dateStr}\n`;
  content += `Total Records: ${records.length}\n`;
  content += `File Name: export.txt\n`;
  content += `\n========================================\n`;
  content += `              RECORDS\n`;
  content += `========================================\n\n`;
  
  if (records.length === 0) {
    content += `No records found.\n`;
  } else {
    records.forEach((r, index) => {
      const createdDate = new Date(r.createdAt).toISOString().slice(0, 10);
      content += `${index + 1}. ID: ${r.id}\n`;
      content += `   Name: ${r.name}\n`;
      content += `   Value: ${r.value}\n`;
      content += `   Created: ${createdDate}\n`;
      content += `\n`;
    });
  }
  
  content += `========================================\n`;
  content += `           END OF EXPORT\n`;
  content += `========================================\n`;
  
  const exportPath = path.join(__dirname, 'export.txt');
  fs.writeFileSync(exportPath, content);
  return exportPath;
}

function menu() {
  console.log(`
===== NodeVault (MongoDB) =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
===============================
  `);

  rl.question('Choose option: ', async (ans) => {
    try {
      switch (ans.trim()) {
        case '1':
          rl.question('Enter name: ', (name) => {
            rl.question('Enter value: ', async (value) => {
              try {
                await db.addRecord({ name, value });
                console.log('✅ Record added successfully!');
                await createBackup();
              } catch (err) {
                console.log('❌ Error:', err.message);
              }
              menu();
            });
          });
          break;

        case '2':
          const records = await db.listRecords();
          if (records.length === 0) {
            console.log('No records found.');
          } else {
            console.log('\n--- All Records ---');
            records.forEach((r, index) => {
              const createdDate = new Date(r.createdAt).toISOString().slice(0, 10);
              console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${createdDate}`);
            });
          }
          menu();
          break;

        case '3':
          rl.question('Enter record ID to update: ', (id) => {
            rl.question('New name: ', (name) => {
              rl.question('New value: ', async (value) => {
                const updated = await db.updateRecord(id, name, value);
                console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
                menu();
              });
            });
          });
          break;

        case '4':
          rl.question('Enter record ID to delete: ', async (id) => {
            const deleted = await db.deleteRecord(id);
            if (deleted) {
              console.log('🗑️ Record deleted!');
              await createBackup();
            } else {
              console.log('❌ Record not found.');
            }
            menu();
          });
          break;

        case '5':
          rl.question('Enter search keyword: ', async (keyword) => {
            const results = await db.searchRecords(keyword);
            if (results.length === 0) {
              console.log('❌ No records found.');
            } else {
              console.log(`\nFound ${results.length} matching record(s):`);
              results.forEach((r, index) => {
                const createdDate = new Date(r.createdAt).toISOString().slice(0, 10);
                console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${createdDate}`);
              });
            }
            menu();
          });
          break;

        case '6':
          console.log('\nSort by:');
          console.log('1. Name');
          console.log('2. Creation Date');
          rl.question('Choose field to sort by (1 or 2): ', (fieldChoice) => {
            const field = fieldChoice === '1' ? 'name' : 'date';
            console.log('\nOrder:');
            console.log('1. Ascending');
            console.log('2. Descending');
            rl.question('Choose order (1 or 2): ', async (orderChoice) => {
              const order = orderChoice === '1' ? 'asc' : 'desc';
              const records = await db.listRecords();
              const sorted = sortRecords(records, field, order);
              
              if (sorted.length === 0) {
                console.log('No records to sort.');
              } else {
                console.log(`\nSorted Records (by ${field === 'name' ? 'Name' : 'Creation Date'}, ${order === 'asc' ? 'Ascending' : 'Descending'}):`);
                sorted.forEach((r, index) => {
                  const createdDate = new Date(r.createdAt).toISOString().slice(0, 10);
                  console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${createdDate}`);
                });
              }
              menu();
            });
          });
          break;

        case '7':
          await exportData();
          console.log(`✅ Data exported successfully to export.txt`);
          menu();
          break;

        case '8':
          const stats = await db.getStatistics();
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          console.log(`
Vault Statistics:
--------------------------
Total Records: ${stats.totalRecords}
Last Modified: ${now}
Longest Name: ${stats.longestName} (${stats.longestNameLength} characters)
Earliest Record: ${stats.earliestRecord}
Latest Record: ${stats.latestRecord}
--------------------------
          `);
          menu();
          break;

        case '9':
          console.log('👋 Exiting NodeVault...');
          await disconnectDB();
          rl.close();
          process.exit(0);
          break;

        default:
          console.log('Invalid option.');
          menu();
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
      menu();
    }
  });
}

// Start the application
async function start() {
  console.log('🚀 Starting NodeVault...');
  const connected = await connectDB();
  
  if (!connected) {
    console.log('❌ Failed to connect to MongoDB. Please check your connection string.');
    console.log('💡 Make sure MongoDB is running and .env file is configured correctly.');
    rl.close();
    process.exit(1);
  }
  
  menu();
}

start();
