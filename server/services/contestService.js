const axios = require('axios');
const cheerio = require('cheerio');
const Contest = require('../models/contest');

// Fetch contests from Codeforces
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result;
    
    const codeforcesContests = contests.map(contest => ({
      name: contest.name,
      platform: 'codeforces',
      link: `https://codeforces.com/contest/${contest.id}`,
      startTime: new Date(contest.startTimeSeconds * 1000),
      endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
      duration: Math.floor(contest.durationSeconds / 60),
      status: contest.phase === 'BEFORE' ? 'upcoming' : contest.phase === 'CODING' ? 'ongoing' : 'completed'
    }));
    
    return codeforcesContests;
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
};

// Fetch contests from CodeChef
const fetchCodechefContests = async () => {
  try {
    const response = await axios.get('https://www.codechef.com/contests');
    const html = response.data;
    const $ = cheerio.load(html);
    
    const extractContests = (selector, status) => {
      let contests = [];
      $(selector).each((i, element) => {
        const tds = $(element).find('td');
        const contestName = $(tds[0]).text().trim();
        const linkPartial = $(tds[0]).find('a').attr('href') || '';
        const startDate = $(tds[1]).text().trim();
        const endDate = $(tds[2]).text().trim();
        contests.push({
          name: contestName,
          platform: 'codechef',
          link: `https://www.codechef.com${linkPartial}`,
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          duration: Math.floor((new Date(endDate) - new Date(startDate)) / (60 * 1000)),
          status
        });
      });
      return contests;
    };
    
    return [
      ...extractContests('#future-contests table tbody tr', 'upcoming'),
      ...extractContests('#running-contests table tbody tr', 'ongoing'),
      ...extractContests('#past-contests table tbody tr', 'completed')
    ];
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error.message);
    return [];
  }
};



// Fetch all contests from Codeforces, CodeChef, and LeetCode and update the database
const fetchAllContests = async () => {
  try {
    const [codeforces, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests()
    ]);
    
    const allContests = [...codeforces, ...codechef];
    
    for (const contest of allContests) {
      await Contest.findOneAndUpdate(
        { name: contest.name, platform: contest.platform },
        contest,
        { upsert: true, new: true }
      );
    }
    
    console.log(`Fetched ${allContests.length} contests.`);
    return allContests;
  } catch (error) {
    console.error('Error fetching all contests:', error.message);
    return [];
  }
};

module.exports = {
  fetchCodeforcesContests,
  fetchCodechefContests,
  fetchAllContests
};