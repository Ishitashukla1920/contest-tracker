const express = require('express');
const { 
  getContests, 
  getContestById, 
  updateContestSolution, 
  fetchSolutions 
} = require('../controllers/contestController');

const router = express.Router();

router.get('/', getContests);

router.get('/solutions/fetch', fetchSolutions);

router.get('/:id', getContestById);

router.put('/:id/solution', updateContestSolution);

module.exports = router;
