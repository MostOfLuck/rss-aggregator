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

export default (elements, value, state, i18n) => {
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
