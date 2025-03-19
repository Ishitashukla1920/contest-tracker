import React, { useState, useEffect } from 'react';
import { ContestAPI } from '../services/apiService';
import { PlayIcon, ExternalLinkIcon } from '@heroicons/react/solid';

const SolutionsPage = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        const response = await ContestAPI.fetchSolutions();
        
        // Extracting Codeforces solutions from API response
        const formattedSolutions = response.codeforces.map((item, index) => ({
          id: index, // Unique key
          solutionLink: item.url,
          contestName: `Codeforces Contest #${index + 1}`, // Placeholder name
          description: 'Watch the solution for this Codeforces contest.', // Placeholder description
          thumbnailUrl: `https://img.youtube.com/vi/${extractVideoId(item.url)}/0.jpg`, // Generate YouTube thumbnail
          date: null, // Date is unavailable in the given API response
        }));

        setSolutions(formattedSolutions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load solutions. Please try again later.');
        setLoading(false);
        console.error('Error loading solutions:', err);
      }
    };

    fetchSolutions();
  }, []);

  // Function to extract YouTube Video ID from URL
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const renderVideoCard = (solution) => (
    <div key={solution.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {/* Video thumbnail */}
        <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center">
          {solution.thumbnailUrl ? (
            <img 
              src={solution.thumbnailUrl} 
              alt={`${solution.contestName} solution`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <PlayIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">
          {solution.contestName}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {solution.description}
        </p>
        
        <a 
          href={solution.solutionLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          Watch Solution
          <ExternalLinkIcon className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contest Solutions</h1>
      
      {solutions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">No solutions available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {solutions.map(renderVideoCard)}
        </div>
      )}
    </div>
  );
};

export default SolutionsPage;
