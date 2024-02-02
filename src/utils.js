import axios from 'axios';
import { uniqueId } from 'lodash';
import parse from './parse.js';

const makeProxyURL = (url) => {
  const newProxyURL = new URL('https://allorigins.hexlet.app');

  newProxyURL.pathname = '/get';
  newProxyURL.searchParams.append('disableCache', true);
  newProxyURL.searchParams.append('url', url);

  const resultingURL = newProxyURL.href.toString();

  return resultingURL;
};

export const loadRss = async (url) => {
  const proxy = makeProxyURL(url);

  try {
    const response = await axios.get(proxy);
    const content = response.data.contents;
    const parsedContent = parse(content);
    const { feed, posts } = parsedContent;

    feed.id = uniqueId();

    posts.forEach((post) => {
      post.id = uniqueId();
      post.feedId = feed.id;
    });

    return parsedContent;
  } catch (error) {
    if (error.name === 'AxiosError') {
      const networkError = new Error();
      networkError.type = 'networkError';
      throw networkError;
    }

    if (error.name === 'parsingError') {
      const parsingError = new Error();
      parsingError.type = 'parsingError';
      throw parsingError;
    }

    return error.message;
  }
};

const updatePosts = (response, posts) => {
  const newPosts = response.posts;
  const loadedPostsTitles = [];

  posts.forEach((post) => loadedPostsTitles.push(post.title));
  const diffPosts = newPosts.filter((post) => !loadedPostsTitles.includes(post.title));

  if (diffPosts.length !== 0) {
    diffPosts.forEach((diffPost) => posts.push(diffPost));
  }
};

export const reloadSource = (watchedState) => {
  const { posts } = watchedState;
  const { urls } = watchedState.form;

  const requests = urls.map((item) => loadRss(item));

  Promise.all(requests)
    .then((responses) => responses.forEach((response) => updatePosts(response, posts)))
    .finally((setTimeout(() => reloadSource(watchedState), 5000)));
};
