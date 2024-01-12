import { validateURL } from './urlValidation';
import i18n from './i18n';

export const initRssFormView = (existingUrls) => {
  const form = document.getElementById('rssForm');
  const urlInput = document.getElementById('rssInput');
  const validationError = document.getElementById('validationError');

  form.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = urlInput.value;

      validateURL(url, existingUrls)
          .then((result) => {
              if (result.valid) {
                  validationError.textContent = '';
                  urlInput.classList.remove('is-invalid');
                  // Дополнительные действия для валидного URL
              }
          })
          .catch((error) => {
              validationError.textContent = i18n.t(error.message);
              urlInput.classList.add('is-invalid');
          });
  });
};
