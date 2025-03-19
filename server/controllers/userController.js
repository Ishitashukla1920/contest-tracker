const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    
    let user = await User.findOne({ email }).populate('bookmarkedContests');
    
    if (!user) {
      user = await User.create({
        email,
        name: email.split('@')[0],
        bookmarkedContests: [],
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserPreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const { platforms, darkMode } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (platforms) {
      user.preferences.platforms = {
        ...user.preferences.platforms,
        ...platforms,
      };
    }
    
    if (darkMode !== undefined) {
      user.preferences.darkMode = darkMode;
    }
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { email } = req.params;
    const { contestId } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const bookmarkIndex = user.bookmarkedContests.indexOf(contestId);
    
    if (bookmarkIndex === -1) {
      user.bookmarkedContests.push(contestId);
    } else {
      user.bookmarkedContests.splice(bookmarkIndex, 1);
    }
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserPreferences,
  toggleBookmark,
};