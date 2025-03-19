export const fetchContests = async (platforms = [], status = 'upcoming') => {
    try {
      const queryParams = new URLSearchParams({
        platforms: platforms.join(','),
        status,
      });
  
      const response = await fetch(`/api/contests?${queryParams.toString()}`);
  
      if (!response.ok) {
        throw new Error(`Error fetching contests: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch contests:", error);
      return [];
    }
  };
  