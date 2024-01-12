import { initRssFormView } from './view';
import { fetchRSS, parseRSS } from './rssFetcher';
import { displayRSS } from './rssRenderer';
import './i18n';

document.addEventListener('DOMContentLoaded', () => {
  const existingUrls = [];

  initRssFormView(existingUrls);
});

document.addEventListener('DOMContentLoaded', () => {
  const rssForm = document.getElementById('rssForm');
  const rssInput = document.getElementById('rssInput');
  const feedContainer = document.getElementById('feedContainer'); // Контейнер для отображения фидов

  rssForm.addEventListener('submit', event => {
    event.preventDefault();
    const url = rssInput.value;
    fetchRSS(url)
      .then(parseRSS)
      .then(feed => {
        displayRSS(feed, 'feedContainer');
        rssInput.value = '';
      })
      .catch(error => {
        console.error('Ошибка при загрузке RSS:', error);
      });
  });
});
