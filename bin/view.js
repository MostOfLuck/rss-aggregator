import { validateURL } from './urlValidation.js';

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
              validationError.textContent = error.message;
              urlInput.classList.add('is-invalid');
          });
  });
};
