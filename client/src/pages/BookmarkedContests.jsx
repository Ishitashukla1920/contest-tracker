import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { UserAPI, ContestAPI } from '../services/apiService';
import { BookmarkIcon } from 'lucide-react';
import { parseISO } from 'date-fns';

// Function to calculate time remaining for a contest
const calculateTimeRemaining = (startTime, status) => {
  if (!startTime) return '';

  const date = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const now = new Date();

  if (status === 'upcoming') {
    const diff = date - now;
    if (diff < 0) return 'Starting soon';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return days > 0 ? `Starts in ${days}d ${hours}h` : `Starts in ${hours}h ${minutes}m`;
  } else if (status === 'ongoing') {
    return 'In progress';
  } else {
    return 'Completed';
  }
};

const BookmarkedContests = () => {
  const { user, loading: userContextLoading, toggleBookmark, refreshUserData } = useContext(UserContext);
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User context data:", user);
    if (user?.bookmarkedContests) {
      console.log("Bookmarked contests in user context:", user.bookmarkedContests);
    }
  }, [user]);

  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching bookmarked contests for:", user.email);

        const userData = await UserAPI.getUserProfile(user.email);
        console.log("API response for bookmarked contests:", userData);

        if (userData?.bookmarkedContests?.length) {
          let contestDetails;

          if (typeof userData.bookmarkedContests[0] === "string") {
            // Fetch contest details if only IDs are stored
            contestDetails = await Promise.all(
              userData.bookmarkedContests.map(async (id) => {
                try {
                  return await ContestAPI.getContestById(id);
                } catch (e) {
                  console.error("Failed to fetch contest:", id, e);
                  return null;
                }
              })
            );
          } else {
            // Contests are already stored as objects
            contestDetails = userData.bookmarkedContests;
          }

          const processedContests = contestDetails
            .filter(Boolean)
            .map(contest => ({
              ...contest,
              timeRemaining: calculateTimeRemaining(contest.startTime, contest.status),
            }))
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === 'upcoming') return -1;
                if (b.status === 'upcoming') return 1;
                if (a.status === 'ongoing') return -1;
                if (b.status === 'ongoing') return 1;
              }
              return new Date(a.startTime || Date.now()) - new Date(b.startTime || Date.now());
            });

          console.log("Processed bookmarked contests:", processedContests);
          setBookmarkedContests(processedContests);
        } else {
          console.warn("No bookmarked contests found in user data");
          setBookmarkedContests([]);
        }
      } catch (err) {
        console.error('Failed to fetch bookmarked contests:', err);
        setError('Failed to load bookmarked contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedContests();
  }, [user]);

  const handleRemoveBookmark = async (contestId) => {
    try {
      await toggleBookmark(contestId);
      setBookmarkedContests(prev => prev.filter(contest => contest._id !== contestId));
      await refreshUserData(); // Refresh user context
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const showLoading = userContextLoading || loading;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-6">My Bookmarked Contests</h1>
      
      {showLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && !showLoading && (
        <div className="text-center py-8">
          <p className="text-lg text-red-400">{error}</p>
        </div>
      )}
      
      {!showLoading && !error && bookmarkedContests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-400">You haven't bookmarked any contests yet.</p>
          <p className="mt-2 text-gray-500">Browse contests and click the bookmark icon to save them here.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedContests.map((contest) => {
          const contestId = contest._id || contest.id;
          
          return (
            <div 
              key={contestId} 
              className="bg-gray-800 shadow-lg rounded-xl p-5 border border-gray-700 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-100">{contest.name}</h2>
                <button 
                  onClick={() => handleRemoveBookmark(contestId)}
                  className="p-1 rounded-full hover:bg-gray-700"
                  aria-label="Remove bookmark"
                >
                  <BookmarkIcon 
                    size={20} 
                    className="fill-yellow-400 text-yellow-400" 
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
                {contest.timeRemaining}
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
    </div>
  );
};

export default BookmarkedContests;
