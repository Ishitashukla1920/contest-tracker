const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const contestRoutes = require('./routes/contestRoutes');
const userRoutes = require('./routes/userRoutes');
const { fetchAllContests, updateContestStatus } = require('./services/contestService');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contests', contestRoutes);
app.use('/api/users', userRoutes);

// Schedule contest fetching (every 6 hours)
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled task to fetch contests');
  await fetchAllContests();
});

// Schedule contest status update (every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled task to update contest status');
  await updateContestStatus();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initial contest fetch
fetchAllContests();