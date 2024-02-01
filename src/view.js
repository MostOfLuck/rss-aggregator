/* eslint-disable max-len */
import onChange from 'on-change';

const renderModal = (elements, state, i18n) => {
  if (!elements || !elements.modalSelectors || !elements.modalSelectors.modalTitle || !elements.modalSelectors.modalBody || !elements.modalSelectors.modalLinkButton || !elements.modalSelectors.modalCloseButton) {
    console.error('Modal elements are not properly defined');
    return;
  }

  const {
    modalTitle, modalBody, modalLinkButton, modalCloseButton,
  } = elements.modalSelectors;

  const post = state.posts.find(({ id }) => id === state.modal.clickedPostId);
  if (post) {
    const { title, description, link } = post;
    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLinkButton.setAttribute('href', link);
    modalLinkButton.textContent = i18n.t('modal.linkButton');
    modalCloseButton.textContent = i18n.t('modal.closeButton');
  } else {
    console.error('No post found for the given clickedPostId');
  }
};

export const postHandler = (state) => {
  console.log('postHandler called'); // Логируем вызов функции

  const { clickedPost } = state.modal;
  if (!clickedPost) {
    console.error('Clicked post is not set in state');
    return;
  }

  const closestParent = clickedPost.closest('li');
  if (!closestParent) {
    console.error('Unable to find the closest parent li element');
    return;
  }

  const linkElement = closestParent.querySelector('a');
  if (!linkElement) {
    console.error('Unable to find the link element within the clicked post');
    return;
  }

  console.log('Before changing class:', linkElement.className); // Логируем классы до изменения

  const handlePost = (element) => {
    if (element.classList.contains('fw-bold')) {
      console.log('Removing fw-bold'); // Логируем удаление класса fw-bold
      element.classList.remove('fw-bold');
    }
    element.classList.add('fw-normal', 'link-secondary');
    console.log('After changing class:', element.className); // Логируем классы после изменения
  };

  handlePost(linkElement);
};

const postsRender = (elements, state, i18n) => {
  const { form, input, posts } = elements;
  posts.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('elements.posts');
  h2.classList.add('card-title', 'h4');
  cardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  container.append(cardBody, ul);
  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    ul.append(li);

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', `${post.link}`);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('elements.postButton');

    li.append(a, button);
  });

  posts.append(container);
  form.reset();
  input.focus();
};

const renderFeed = (elements, state, i18n) => {
  const { form, input, feeds } = elements;
  feeds.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.textContent = i18n.t('elements.feeds');
  h2.classList.add('card-title', 'h4');
  cardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  container.append(cardBody, ul);

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    return li.append(h3, p);
  });

  feeds.append(container);
  form.reset();
  input.focus();
};

const renderValidForm = (elements, value, i18n) => {
  const { feedback, input } = elements;

  if (value === 'rssLoaded') {
    feedback.textContent = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('successed.rssLoaded');
  }
};

const stateHandler = (elements, value, state, i18n) => {
  const { form, input, button } = elements;
  const { processState } = state.form;

  switch (processState) {
    case 'formFilling':
      button.disabled = false;
      break;

    case 'dataSending':
      button.disabled = true;
      break;

    case 'dataSent':
      button.disabled = false;
      break;

    case 'rssLoaded':
      renderValidForm(elements, value, i18n);
      button.disabled = false;
      form.reset();
      input.focus();
      break;

    default:
      throw new Error(`unknown process State: ${processState}`);
  }
};

const errorsHandler = (elements, value, i18n) => {
  const {
    form,
    feedback,
    button,
    input,
  } = elements;

  button.disabled = false;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');

  switch (value) {
    case 'url':
      feedback.textContent = i18n.t('errors.urlInvalid');
      break;

    case 'notOneOf':
      feedback.textContent = i18n.t('errors.rssDuplicated');
      break;

    case 'parsingError':
      feedback.textContent = i18n.t('errors.rssInvalid');
      break;

    case 'networkError':
      feedback.textContent = i18n.t('errors.networkError');
      break;

    default:
      throw new Error(`## unknown error: ${value}`);
  }

  form.reset();
  input.focus();
};

const render = (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.processState':
      stateHandler(elements, value, state, i18n);
      break;

    case 'form.valid':
      break;

    case 'form.error':
      errorsHandler(elements, value, i18n);
      break;

    case 'form.urls':
      break;

    case 'feeds':
      renderFeed(elements, state, i18n);
      break;

    case 'posts':
      postsRender(elements, state, i18n);
      break;

    case 'modal.clickedPost':
      renderModal(state);
      break;

    case 'modal.clickedPostId':
      renderModal(elements, state, i18n);
      break;

    default:
      throw new Error(`unknown path ${path}`);
  }
};

export default (state, elements, language) => onChange(state, render(elements, state, language));
