const express = require('express');
const { 
  getContests, 
  getContestById, 
  updateContestSolution, 
  fetchSolutions 
} = require('../controllers/contestController');

const router = express.Router();

// Get all contests with filters
router.get('/', getContests);

// Fetch YouTube solutions automatically (static route)
// Place this route before any dynamic routes that use parameters like "/:id"
router.get('/solutions/fetch', fetchSolutions);

// Get a single contest by ID
router.get('/:id', getContestById);

// Update contest solution link
router.put('/:id/solution', updateContestSolution);

module.exports = router;
