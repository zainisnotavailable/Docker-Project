const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
recordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
