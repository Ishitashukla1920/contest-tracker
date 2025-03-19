const Contest = require('../models/contest');
const { fetchYoutubeLinks } = require('../services/youtubeService');

// Get all contests with filters
const getContests = async (req, res) => {
  try {
    const { platform, status, limit = 100 } = req.query;
    
    const query = {};
    
    if (platform) {
      // Handle multiple platforms
      const platforms = platform.split(',');
      query.platform = { $in: platforms };
    }
    
    if (status) {
      query.status = status;
    }
    
    const contests = await Contest.find(query)
      .sort({ startTime: status === 'completed' ? -1 : 1 })
      .limit(parseInt(limit));
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single contest by ID
const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    
    res.json(contest);
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update contest solution link
const updateContestSolution = async (req, res) => {
  try {
    const { solutionLink } = req.body;
    
    if (!solutionLink) {
      return res.status(400).json({ message: 'Solution link is required' });
    }
    
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    
    contest.solutionLink = solutionLink;
    await contest.save();
    
    res.json(contest);
  } catch (error) {
    console.error('Error updating contest solution:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Try to fetch YouTube solutions automatically
const fetchSolutions = async (req, res) => {
  try {
    const result = await fetchYoutubeLinks();
    res.json(result);
  } catch (error) {
    console.error('Error fetching YouTube solutions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getContests,
  getContestById,
  updateContestSolution,
  fetchSolutions,
};