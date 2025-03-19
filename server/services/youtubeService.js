const axios = require('axios');

/**
 * Fetches videos from a YouTube playlist page by scraping the embedded JSON data (ytInitialData).
 * @param {string} playlistUrl - The full URL of the YouTube playlist.
 * @returns {Promise<Array>} - Resolves to an array of video objects { title, url }.
 */
const fetchPlaylistVideos = async (playlistUrl) => {
  try {
    // Request the playlist page with headers to mimic a browser.
    const response = await axios.get(playlistUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com'
      },
      timeout: 10000
    });
    const html = response.data;
    
    // Extract the ytInitialData JSON object from the page HTML.
    const initialDataMatch = html.match(/var ytInitialData = (.*?);<\/script>/);
    if (!initialDataMatch || !initialDataMatch[1]) {
      throw new Error('Failed to extract ytInitialData from page');
    }
    
    let initialData;
    try {
      initialData = JSON.parse(initialDataMatch[1]);
    } catch (jsonErr) {
      throw new Error('Failed to parse ytInitialData JSON: ' + jsonErr.message);
    }
    
    // Navigate through the JSON structure to locate playlist items.
    // **WARNING:** The structure below is subject to change.
    let items = [];
    try {
      items = initialData.contents.twoColumnBrowseResultsRenderer.tabs[0]
        .tabRenderer.content.sectionListRenderer.contents[0]
        .itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
    } catch (err) {
      throw new Error('Failed to parse playlist items: ' + err.message);
    }
    
    if (!items || !items.length) return [];
    
    // Map each item to a simpler video object.
    const videos = items.map(item => {
      if (!item.playlistVideoRenderer) return null;
      const renderer = item.playlistVideoRenderer;
      const title = renderer.title.simpleText;
      const videoId = renderer.videoId;
      return {
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    }).filter(video => video !== null);
    
    return videos;
  } catch (error) {
    console.error(`Error fetching playlist videos from ${playlistUrl}:`, error.message);
    return [];
  }
};

/**
 * Fetches YouTube video links from Codeforces and CodeChef playlists.
 * Environment variables should provide the full playlist URLs.
 * @returns {Promise<Object>} - An object mapping platform names to arrays of video objects.
 */
const fetchYoutubeLinks = async () => {
  try {
    const playlistUrls = {
      codeforces: process.env.YOUTUBE_CODEFORCES_PLAYLIST_ID,
      codechef: process.env.YOUTUBE_CODECHEF_PLAYLIST_ID,
    };
    
    const results = {};
    
    for (const [platform, url] of Object.entries(playlistUrls)) {
      if (!url) continue;
      results[platform] = await fetchPlaylistVideos(url);
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching YouTube links:', error.message);
    throw error;
  }
};

module.exports = {
  fetchYoutubeLinks,
};
