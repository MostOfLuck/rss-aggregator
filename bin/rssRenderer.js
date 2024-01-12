export const displayRSS = (feed, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const feedTitle = document.createElement('h3');
  feedTitle.textContent = feed.title;
  container.appendChild(feedTitle);

  const feedDescription = document.createElement('p');
  feedDescription.textContent = feed.description;
  container.appendChild(feedDescription);

  const postsList = document.createElement('ul');
  feed.items.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.setAttribute('href', item.link);
    link.textContent = item.title;
    listItem.appendChild(link);
    postsList.appendChild(listItem);
  });

  container.appendChild(postsList);
};
