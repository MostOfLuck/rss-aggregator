export default (elements, value, i18n) => {
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
