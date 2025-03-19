import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ContestAPI } from '../services/apiService';
import { BookmarkIcon } from 'lucide-react';

const ContestFilter = ({ onFilterChange, initialFilters }) => {
  const { user, isBookmarked, toggleBookmark, loading: userLoading } = useContext(UserContext);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract user preferences or initial filters
    const newPlatforms = initialFilters?.platforms ||
      (user?.preferences?.platforms 
        ? Object.keys(user.preferences.platforms).filter((p) => user.preferences.platforms[p]) 
        : []);
    
    const newStatus = initialFilters?.status || 'upcoming';

    setSelectedPlatforms(newPlatforms);
    setSelectedStatus(newStatus);
  }, [user?.preferences?.platforms, initialFilters]);

  useEffect(() => {
    const getContests = async () => {
      try {
        setLoading(true);
        const filters = { platforms: selectedPlatforms, status: selectedStatus };
        const data = await ContestAPI.getContests(filters);
        setContests(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch contests:', error);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getContests();
  }, [selectedPlatforms, selectedStatus]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (onFilterChange) {
      onFilterChange({ platforms: selectedPlatforms, status });
    }
  };

  const handleBookmarkToggle = async (contestId) => {
    if (!user) {
      // Handle not logged in case - could redirect to login or show a message
      alert('Please log in to bookmark contests');
      return;
    }
    
    await toggleBookmark(contestId);
  };

  // Combine loading states
  const isLoading = loading || userLoading;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h3 className="text-2xl font-semibold text-center mb-6 text-gray-100">Contests</h3>
      
      {/* Time Status Filters */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              selectedStatus === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleStatusChange('upcoming')}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              selectedStatus === 'ongoing' // Changed from 'present' to match API
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleStatusChange('ongoing')}
          >
            Ongoing
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              selectedStatus === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleStatusChange('past')}
          >
            Past
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* No Contests State */}
      {!isLoading && !error && contests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-400 text-lg">No {selectedStatus} contests available</p>
        </div>
      )}

      {/* Contests Grid */}
      {!isLoading && !error && contests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const contestId = contest._id || contest.id;
            const bookmarked = isBookmarked(contestId);
            
            return (
              <div 
                key={contestId} 
                className="bg-gray-800 shadow-lg rounded-xl p-5 border border-gray-700 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-gray-100">{contest.name}</h4>
                  <button 
                    onClick={() => handleBookmarkToggle(contestId)}
                    className="p-1 rounded-full hover:bg-gray-700"
                    aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <BookmarkIcon 
                      size={20} 
                      className={bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} 
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Platform:</span> {contest.platform}
                  </p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    contest.status === 'upcoming' ? 'bg-blue-900 text-blue-300' :
                    contest.status === 'ongoing' ? 'bg-green-900 text-green-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {contest.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  {contest.startTime && new Date(contest.startTime).toLocaleString()}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  {contest.url && (
                    <a 
                      href={contest.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      View Contest
                    </a>
                  )}
                  {contest.duration && (
                    <span className="text-gray-400 text-sm">
                      Duration: {contest.duration}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContestFilter;