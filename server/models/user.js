const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  bookmarkedContests: [{
    type: String,
  }],
  preferences: {
    platforms: {
      codeforces: {
        type: Boolean,
        default: true,
      },
      codechef: {
        type: Boolean,
        default: true,
      },
      leetcode: {
        type: Boolean,
        default: true,
      },
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;