const Record = require('./models/Record');
const vaultEvents = require('../events');

// Add a new record
async function addRecord({ name, value }) {
  if (!name || !value) {
    throw new Error('Record must have both name and value.');
  }
  
  const newRecord = new Record({ name, value });
  await newRecord.save();
  
  vaultEvents.emit('recordAdded', {
    id: newRecord._id,
    name: newRecord.name,
    value: newRecord.value,
    createdAt: newRecord.createdAt
  });
  
  return newRecord;
}

// List all records
async function listRecords() {
  const records = await Record.find().sort({ createdAt: -1 });
  return records.map(r => ({
    id: r._id.toString(),
    name: r.name,
    value: r.value,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }));
}

// Update a record by ID
async function updateRecord(id, newName, newValue) {
  try {
    const record = await Record.findByIdAndUpdate(
      id,
      { name: newName, value: newValue, updatedAt: new Date() },
      { new: true }
    );
    
    if (!record) return null;
    
    vaultEvents.emit('recordUpdated', {
      id: record._id,
      name: record.name,
      value: record.value
    });
    
    return record;
  } catch (error) {
    return null;
  }
}

// Delete a record by ID
async function deleteRecord(id) {
  try {
    const record = await Record.findByIdAndDelete(id);
    
    if (!record) return null;
    
    vaultEvents.emit('recordDeleted', {
      id: record._id,
      name: record.name
    });
    
    return record;
  } catch (error) {
    return null;
  }
}

// Search records (case-insensitive)
async function searchRecords(keyword) {
  const searchRegex = new RegExp(keyword, 'i');
  const records = await Record.find({
    $or: [
      { name: searchRegex },
      { value: searchRegex }
    ]
  });
  
  return records.map(r => ({
    id: r._id.toString(),
    name: r.name,
    value: r.value,
    createdAt: r.createdAt
  }));
}

// Get vault statistics
async function getStatistics() {
  const records = await Record.find();
  const count = records.length;
  
  if (count === 0) {
    return {
      totalRecords: 0,
      longestName: 'N/A',
      longestNameLength: 0,
      earliestRecord: 'N/A',
      latestRecord: 'N/A'
    };
  }
  
  // Find longest name
  let longest = records[0];
  records.forEach(r => {
    if (r.name.length > longest.name.length) longest = r;
  });
  
  // Find earliest and latest
  const sorted = [...records].sort((a, b) => a.createdAt - b.createdAt);
  
  return {
    totalRecords: count,
    longestName: longest.name,
    longestNameLength: longest.name.length,
    earliestRecord: sorted[0].createdAt.toISOString().slice(0, 10),
    latestRecord: sorted[sorted.length - 1].createdAt.toISOString().slice(0, 10)
  };
}

module.exports = { 
  addRecord, 
  listRecords, 
  updateRecord, 
  deleteRecord,
  searchRecords,
  getStatistics
};
