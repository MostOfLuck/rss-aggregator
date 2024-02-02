const makeProxyURL = (url) => {
  const newProxyURL = new URL('https://allorigins.hexlet.app');

  newProxyURL.pathname = '/get';
  newProxyURL.searchParams.append('disableCache', true);
  newProxyURL.searchParams.append('url', url);

  const resultingURL = newProxyURL.href.toString();

  return resultingURL;
};

export default makeProxyURL;
