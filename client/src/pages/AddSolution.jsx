import React, { useState } from 'react';

const AddSolution = () => {
  const [contestId, setContestId] = useState('');
  const [solutionLink, setSolutionLink] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/contest/${contestId}/solution`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solutionLink, description }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Solution added successfully!');
        setContestId('');
        setSolutionLink('');
        setDescription('');
      } else {
        setMessage(data.message || 'Failed to add solution');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">Add a Solution</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contestId" className="block text-black font-medium mb-1">
            Contest ID
          </label>
          <input
            type="text"
            id="contestId"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            placeholder="Enter contest ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div>
          <label htmlFor="solutionLink" className="block text-black font-medium mb-1">
            Solution Link
          </label>
          <input
            type="url"
            id="solutionLink"
            value={solutionLink}
            onChange={(e) => setSolutionLink(e.target.value)}
            placeholder="Enter solution link"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-black font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-y min-h-[100px] text-black"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Solution
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default AddSolution;
