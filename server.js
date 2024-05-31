const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const newsCache = new NodeCache({ stdTTL: 600 });

app.get('/api/news', async (req, res) => {
    console.log('Received request for news');
    const cachedNews = newsCache.get('topHeadlines');
    if (cachedNews) {
        console.log('Serving from cache');
        return res.json(cachedNews);
    }

    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                apiKey: process.env.NEWS_API_KEY,
            },
        });
        const newsData = response.data;
        newsCache.set('topHeadlines', newsData);
        console.log('Fetched and cached new data');
        res.json(newsData);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news headlines' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
