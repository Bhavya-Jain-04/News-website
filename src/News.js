import React, { useEffect, useState } from 'react';
import axios from 'axios';

const News = () => {
    const [headlines, setHeadlines] = useState([]);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        try {
            const response = await axios.get('/api/news');
            setHeadlines(response.data.articles);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error(err);
            setError('Error fetching news headlines');
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Latest News</h2>
            <ul>
                {headlines.slice(0, 5).map((article, index) => (
                    <li key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                        <p>{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;

