import React, { useContext } from 'react';
import { BookmarkIcon, ExternalLinkIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/solid';
import { parseISO, format } from 'date-fns';
import { UserContext } from '../contexts/UserContext';

const ContestCard = ({ contest }) => {
  const { isBookmarked, toggleBookmark } = useContext(UserContext);
  const bookmarked = isBookmarked(contest._id);

  const getPlatformStyles = (platform) => {
    switch (platform) {
      case 'codeforces':
        return {
          bgColor: 'bg-codeforces',
          textColor: 'text-white',
          name: 'Codeforces',
        };
      case 'codechef':
        return {
          bgColor: 'bg-codechef',
          textColor: 'text-white',
          name: 'CodeChef',
        };
      case 'leetcode':
        return {
          bgColor: 'bg-leetcode',
          textColor: 'text-black',
          name: 'LeetCode',
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          name: platform,
        };
    }
  };

  const platformStyle = getPlatformStyles(contest.platform);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    toggleBookmark(contest._id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`${platformStyle.bgColor} ${platformStyle.textColor} p-2 flex justify-between items-center`}>
        <span className="font-medium">{platformStyle.name}</span>
        <div className="flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            contest.status === 'upcoming' ? 'bg-green-100 text-green-800' :
            contest.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {contest.status === 'upcoming' ? 'Upcoming' :
             contest.status === 'ongoing' ? 'Ongoing' : 'Completed'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2 flex-grow">{contest.name}</h3>
          <button
            onClick={handleBookmarkClick}
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            {bookmarked ? (
              <BookmarkSolidIcon className="h-5 w-5 text-primary-500" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <span className="font-medium mr-2">Start:</span>
            <span>{format(parseISO(contest.startTime), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">Duration:</span>
            <span>{Math.floor(contest.duration / 60)} hours {contest.duration % 60} minutes</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">Status:</span>
            <span>{contest.timeRemaining}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <a
            href={contest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center text-sm"
          >
            Go to contest <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
          
          {contest.solutionLink && (
            <a
              href={contest.solutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 flex items-center text-sm"
            >
              Solution <CheckCircleIcon className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;