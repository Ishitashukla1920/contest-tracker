const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['codeforces', 'codechef'], // removed 'leetcode'
  },
  link: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  solutionLink: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Create indexes for faster queries
contestSchema.index({ platform: 1, startTime: 1 });
contestSchema.index({ status: 1 });

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
