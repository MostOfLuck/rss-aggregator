export default (elements, state, i18n) => {
  const {
    modalTitle,
    modalBody,
    modalLinkButton,
    modalCloseButton,
  } = elements.modalSelectors;

  modalLinkButton.textContent = i18n.t('modal.linkButton');
  modalCloseButton.textContent = i18n.t('modal.closeButton');

  state.posts.forEach((post) => {
    const {
      title,
      description,
      link,
      id,
    } = post;

    if (id === state.modal.clickedPostId) {
      modalTitle.textContent = title;
      modalBody.textContent = description;
      modalLinkButton.setAttribute('href', link);
    }

    return state;
  });
};
