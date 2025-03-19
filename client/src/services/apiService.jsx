import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Contest API Service
const ContestAPI = {
  getContests: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching contests:', error);
      throw error;
    }
  },

  getContestById: async (contestId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/${contestId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contest ${contestId}:`, error);
      throw error;
    }
  },

  updateContestSolution: async (contestId, solutionLink) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/contests/${contestId}/solution`, { solutionLink });
      return response.data;
    } catch (error) {
      console.error(`Error updating contest solution for ${contestId}:`, error);
      throw error;
    }
  },

  fetchSolutions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/solutions/fetch`);
      return response.data;
    } catch (error) {
      console.error('Error fetching solutions:', error);
      throw error;
    }
  }
};

// User API Service
const UserAPI = {
  getUserProfile: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user profile for ${email}:`, error);
      throw error;
    }
  },

  updateUserPreferences: async (email, preferences) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${email}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error(`Error updating preferences for ${email}:`, error);
      throw error;
    }
  },

  toggleBookmark: async (email, contestId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${email}/bookmarks`, { contestId });
      return response.data;
    } catch (error) {
      console.error(`Error bookmarking contest ${contestId} for ${email}:`, error);
      throw error;
    }
  }
};

export { ContestAPI, UserAPI };