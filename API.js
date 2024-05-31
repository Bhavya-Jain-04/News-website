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
        if (error.response) {
            console.error('Error fetching news:', error.response.data);
        } else {
            console.error('Error fetching news:', error.message);
        }
        res.status(500).json({ message: 'Error fetching news headlines' });
    }
});
