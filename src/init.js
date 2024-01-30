import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import view from './view.js';
import resources from '../languages/resources.js';
import { loadRss, reloadSource } from './loadRSS.js';

export default () => {
  const state = {
    form: {
      valid: false,
      error: null,
      urls: [],
      processState: 'formFilling',
    },
    feeds: [],
    posts: [],
    modal: {
      clickedPost: '',
      clickedPostId: '',
    },
  };

  const delayTime = 5000;

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
    selectorsToTranslate: {
      title: document.querySelector('.title'),
      subTitle: document.querySelector('.subTitle'),
      rssLink: document.querySelector('.rssLink'),
      exampleUrl: document.querySelector('.exampleUrl'),
      mainButton: document.querySelector('.mainButton'),
    },
    modalSelectors: {
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalLinkButton: document.querySelector('.modal-footer').querySelector('a'),
      modalCloseButton: document.querySelector('.modal-footer').querySelector('button'),
    },
  };

  const i18n = i18next.createInstance();
  const defaultLanguage = 'ru';

  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    string: {
      url: i18n.t('errors.urlInvalid'),
    },
    mixed: {
      notOneOf: i18n.t('errors.rssDuplicated'),
    },
  });

  const watchedState = view(state, elements, i18n);

  window.addEventListener('DOMContentLoaded', () => {
    const {
      title,
      subTitle,
      rssLink,
      exampleUrl,
      mainButton,
    } = elements.selectorsToTranslate;

    title.textContent = i18n.t('elements.title');
    subTitle.textContent = i18n.t('elements.subTitle');
    rssLink.textContent = i18n.t('elements.rssLink');
    exampleUrl.textContent = i18n.t('elements.exampleUrl');
    mainButton.textContent = i18n.t('elements.mainButton');
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const currentUrl = formData.get('url').trim();

    const schema = yup.string()
      .required()
      .url(i18n.t('errors.urlInvalid'))
      .notOneOf(watchedState.form.urls, i18n.t('errors.rssDuplicated'));

    schema.validate(currentUrl)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.processState = 'dataSending';

        return loadRss(currentUrl);
      })
      .then((response) => {
        watchedState.form.processState = 'dataSent';
        const { feed, posts } = response;

        watchedState.feeds = [...watchedState.feeds, feed];
        watchedState.posts = [...watchedState.posts, ...posts];

        watchedState.form.processState = 'rssLoaded';
        watchedState.form.valid = true;
        watchedState.form.urls.push(currentUrl);

        return response;
      })
      .catch((error) => {
        watchedState.form.error = error.type;
      });
  });

  elements.posts.addEventListener('click', (evt) => {
    const { target } = evt;

    if (target.nodeName === 'BUTTON') {
      watchedState.modal.clickedPost = target;
      watchedState.modal.clickedPostId = target.dataset.id;
    }

    if (target.nodeName === 'A') {
      target.classList.replace('fw-bold', 'fw-normal');
      target.classList.add('link-secondary');
    }
  });

  setTimeout(() => reloadSource(watchedState), delayTime);
};
