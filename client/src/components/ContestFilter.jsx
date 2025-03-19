import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

const ContestFilter = ({ onFilterChange, initialFilters }) => {
  const { user } = useContext(UserContext);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('upcoming');

  useEffect(() => {
    // Initialize with user preferences if available
    if (user?.preferences?.platforms) {
      const platforms = Object.keys(user.preferences.platforms).filter(
        platform => user.preferences.platforms[platform]
      );
      setSelectedPlatforms(platforms);
    }
    
    // Initialize with initialFilters if provided
    if (initialFilters) {
      if (initialFilters.platforms) {
        setSelectedPlatforms(initialFilters.platforms);
      }
      if (initialFilters.status) {
        setSelectedStatus(initialFilters.status);
      }
    }
  }, [user, initialFilters]);

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    onFilterChange({
      platforms: selectedPlatforms,
      status: selectedStatus,
    });
  }, [selectedPlatforms, selectedStatus, onFilterChange]);

  const platforms = [
    { id: 'codeforces', name: 'Codeforces', color: 'bg-codeforces' },
    { id: 'codechef', name: 'CodeChef', color: 'bg-codechef' },
    { id: 'leetcode', name: 'LeetCode', color: 'bg-leetcode' },
  ];

  const statuses = [
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'ongoing', name: 'Ongoing' },
    { id: 'completed', name: 'Completed' },
  ];

  // Save user preferences when platforms change
  useEffect(() => {
    if (user) {
      const platformPreferences = {};
      platforms.forEach(platform => {
        platformPreferences[platform.id] = selectedPlatforms.includes(platform.id);
      });
      
      user.updatePreferences?.({ platforms: platformPreferences });
    }
  }, [selectedPlatforms, user]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${platform.color} mr-2`}></span>
              {platform.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusChange(status.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedStatus === status.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {status.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestFilter;