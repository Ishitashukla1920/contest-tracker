import React, { createContext, useState, useEffect } from 'react';
import { UserAPI } from '../services/apiService';

export const UserContext = createContext();

export const UserProvider = ({ children, email }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!email) return;
      
      try {
        setLoading(true);
        const userData = await UserAPI.getUserProfile(email);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [email]);

  const handleToggleBookmark = async (contestId) => {
    if (!user) return;
    
    try {
      const updatedUser = await UserAPI.toggleBookmark(user.email, contestId);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleUpdatePreferences = async (preferences) => {
    if (!user) return;
    
    try {
      const updatedUser = await UserAPI.updateUserPreferences(user.email, preferences);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const isBookmarked = (contestId) => {
    if (!user) return false;
    return user.bookmarkedContests.some(bookmark => 
      bookmark._id === contestId || bookmark === contestId
    );
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      toggleBookmark: handleToggleBookmark, 
      updatePreferences: handleUpdatePreferences,
      isBookmarked
    }}>
      {children}
    </UserContext.Provider>
  );
};
