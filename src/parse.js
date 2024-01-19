export default (content) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const feed = {
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
      link: doc.querySelector('link').textContent,
    };

    const feedItems = doc.querySelectorAll('item');
    const posts = [...feedItems].map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }));

    return { feed, posts };
  } catch (error) {
    const err = new Error();
    err.name = 'parsingError';

    throw err;
  }
};
