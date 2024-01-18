import onChange from 'on-change';
import processStateHandler from './stateHandler.js';
import errorsHandler from './errorsHandler.js';
import renderFeeds from './renderModal.js';
import renderPosts from './postsRender.js';
import clickedPostsHandler from './postHandler.js';
import renderModal from './renderFeed.js';

const render = (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(elements, value, state, i18n);
      break;

    case 'form.valid':
      break;

    case 'form.error':
      errorsHandler(elements, value, i18n);
      break;

    case 'form.urls':
      break;

    case 'feeds':
      renderFeeds(elements, state, i18n);
      break;

    case 'posts':
      renderPosts(elements, state, i18n);
      break;

    case 'modal.clickedPost':
      clickedPostsHandler(state);
      break;

    case 'modal.clickedPostId':
      renderModal(elements, state, i18n);
      break;

    default:
      throw new Error(`unknown path ${path}`);
  }
};

export default (state, elements, language) => onChange(state, render(elements, state, language));