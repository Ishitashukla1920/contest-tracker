const express = require('express');
const { 
  getUserProfile, 
  updateUserPreferences, 
  toggleBookmark 
} = require('../controllers/userController');

const router = express.Router();

// Get user profile
router.get('/:email', getUserProfile);

// Update user preferences
router.put('/:email/preferences', updateUserPreferences);

// Toggle bookmark for a contest
router.post('/:email/bookmarks', toggleBookmark);

module.exports = router;