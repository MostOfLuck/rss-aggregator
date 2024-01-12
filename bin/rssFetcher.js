import axios from 'axios';

const PROXY_URL = 'https://api.allorigins.win/get?url=';

export const fetchRSS = (url) => {
  return axios.get(`${PROXY_URL}${encodeURIComponent(url)}`)
    .then(response => response.data.contents);
};

export const parseRSS = (rssData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, "text/xml");

  const feed = {
    title: xmlDoc.querySelector('channel > title').textContent,
    description: xmlDoc.querySelector('channel > description').textContent,
    items: []
  };

  xmlDoc.querySelectorAll('item').forEach(item => {
    feed.items.push({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
    });
  });

  return feed;
};
