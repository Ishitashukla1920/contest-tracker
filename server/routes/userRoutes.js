const express = require('express');
const { 
  getUserProfile, 
  updateUserPreferences, 
  toggleBookmark 
} = require('../controllers/userController');

const router = express.Router();

router.get('/:email', getUserProfile);

router.put('/:email/preferences', updateUserPreferences);

router.post('/:email/bookmarks', toggleBookmark);

module.exports = router;