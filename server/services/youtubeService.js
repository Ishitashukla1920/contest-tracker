const axios = require('axios');

/**
 * @param {string} playlistUrl 
 * @returns {Promise<Array>} 
 */
const fetchPlaylistVideos = async (playlistUrl) => {
  try {
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
 * @returns {Promise<Object>} - 
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
